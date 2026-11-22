const { expect } = require('@playwright/test');
const { AppointmentDetailsPage } = require('./AppointmentDetailsPage');
const { NewAppointmentPage } = require('./NewAppointmentPage');

const monthNames = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

function parseIsoDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    throw new Error('APPOINTMENT_DATE deve estar no formato AAAA-MM-DD.');
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText) - 1;
  const day = Number(dayText);
  const date = new Date(year, month, day, 12);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    throw new Error(`Data de agendamento inválida: ${value}.`);
  }

  return date;
}

function parseCalendarMonth(value) {
  const parts = value.trim().toLowerCase().split(/\s+/);
  const monthName = parts.find((part) => part !== 'de');
  const year = Number(parts[parts.length - 1]);
  const month = monthNames.indexOf(monthName);

  if (month === -1 || !Number.isInteger(year)) {
    throw new Error(`Não foi possível interpretar o mês exibido: ${value}.`);
  }

  return { month, year };
}

class AgendaPage {
  constructor(page) {
    this.page = page;
    this.agendaLink = page.getByRole('link', { name: 'Agenda' });
    this.title = page.getByRole('heading', { name: 'Horário de Atendimento' });
    this.calendarMonth = page.locator('.react-calendar__navigation__label');
    this.previousMonth = page.locator('.react-calendar__navigation__prev-button');
    this.nextMonth = page.locator('.react-calendar__navigation__next-button');
    this.addAppointmentButton = page.locator(
      'button:has(svg path[d^="M19 13h-6v6h-2v-6H5"])',
    );
  }

  async goto() {
    await this.agendaLink.click();
    await expect(this.title).toBeVisible();
  }

  async selectDate(isoDate) {
    const targetDate = parseIsoDate(isoDate);
    let displayedMonth = parseCalendarMonth(await this.calendarMonth.innerText());

    for (let attempt = 0; attempt < 24; attempt += 1) {
      const monthDifference =
        (targetDate.getFullYear() - displayedMonth.year) * 12 +
        (targetDate.getMonth() - displayedMonth.month);

      if (monthDifference === 0) {
        break;
      }

      const direction = Math.sign(monthDifference);
      const nextMonthIndex = displayedMonth.month + direction;
      displayedMonth = {
        month: (nextMonthIndex + 12) % 12,
        year: displayedMonth.year + (nextMonthIndex < 0 ? -1 : nextMonthIndex > 11 ? 1 : 0),
      };

      await (direction > 0 ? this.nextMonth : this.previousMonth).click();
      await expect(this.calendarMonth).toHaveText(
        `${monthNames[displayedMonth.month]} ${displayedMonth.year}`,
      );
    }

    const selectedMonth = parseCalendarMonth(await this.calendarMonth.innerText());
    if (
      selectedMonth.month !== targetDate.getMonth() ||
      selectedMonth.year !== targetDate.getFullYear()
    ) {
      throw new Error(`Não foi possível navegar até a data ${isoDate}.`);
    }

    const dateLabel = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(targetDate);
    const dateButton = this.page.getByRole('button', {
      name: dateLabel,
      exact: true,
    });
    await dateButton.click();
    await expect(dateButton).toHaveClass(/react-calendar__tile--active/);
  }

  async openNewAppointment() {
    await this.addAppointmentButton.click();
    const appointmentForm = new NewAppointmentPage(this.page);
    await appointmentForm.expectOpen();
    return appointmentForm;
  }

  async expectAppointmentCreated(name) {
    await expect(this.page.getByRole('dialog')).toBeHidden();
    const appointment = this.page.locator('.evento').filter({ hasText: name });
    await expect(appointment).toHaveCount(1, { timeout: 15_000 });
  }

  async selectAppointment(name) {
    const appointment = this.page.locator('.evento').filter({ hasText: name });
    await expect(appointment).toHaveCount(1, { timeout: 15_000 });
    await appointment.getByText(name, { exact: true }).click();

    const appointmentDetails = new AppointmentDetailsPage(this.page);
    await appointmentDetails.expectLoaded(name);
    return appointmentDetails;
  }

  async expectAppointmentDeleted(name) {
    const appointment = this.page.locator('.evento').filter({ hasText: name });
    await expect(appointment).toHaveCount(0, { timeout: 15_000 });
  }

  async dismissOpenAppointmentDialogs() {
    const rejectButton = this.page.getByRole('button', {
      name: 'Não',
      exact: true,
    });
    if (await rejectButton.count()) {
      await rejectButton.last().click();
    }

    const dialogs = this.page.getByRole('dialog');
    if (await dialogs.count()) {
      const closeButton = dialogs
        .last()
        .getByRole('button', { name: 'close', exact: true });
      if (await closeButton.count()) {
        await closeButton.click();
      }
    }
  }

  async deleteAppointmentIfPresent(name) {
    const appointment = this.page.locator('.evento').filter({ hasText: name });
    if (!(await appointment.count())) {
      return;
    }

    const appointmentDetails = await this.selectAppointment(name);
    await appointmentDetails.delete();
    await this.expectAppointmentDeleted(name);
  }
}

module.exports = { AgendaPage };
