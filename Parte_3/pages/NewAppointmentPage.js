const { expect } = require('@playwright/test');

class NewAppointmentPage {
  constructor(page) {
    this.page = page;
    this.dialog = page.getByRole('dialog');
    this.nameInput = page.locator('#agd-atm-inp-nom');
    this.phoneInput = page.locator('#agd-atm-inp-tel');
    this.dateInput = page.locator('#agd-atm-inp-dat');
    this.startTimeInput = page.locator('#agd-atm-inp-ini');
    this.scheduleButton = page.getByRole('button', {
      name: 'Agendar',
      exact: true,
    });
  }

  async expectOpen() {
    await expect(this.dialog).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.phoneInput).toBeVisible();
    await expect(this.scheduleButton).toBeVisible();
  }

  async fill({ date, name, phone, time }) {
    const [, year, month, day] = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    await expect(this.dateInput).toHaveValue(`${day}/${month}/${year}`);
    await this.startTimeInput.fill(time);
    await this.startTimeInput.press('Tab');
    await expect(this.startTimeInput).toHaveValue(time);
    await this.nameInput.fill(name);
    await this.phoneInput.fill(phone);
  }

  async schedule(data) {
    await this.fill(data);
    await this.scheduleButton.click();
  }

  async scheduleAndConfirmConflict(data) {
    await this.fill(data);

    let browserPromptMessage;
    this.page.once('dialog', async (dialog) => {
      browserPromptMessage = dialog.message();
      if (/conflito|conflict|horário|confirm/i.test(browserPromptMessage)) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });

    await this.scheduleButton.click();

    if (browserPromptMessage) {
      expect(browserPromptMessage).toMatch(/conflito|conflict|horário|confirm/i);
    } else {
      const promptPattern = /conflito|conflict|deseja|horário|agendamento/i;
      const alertDialog = this.page.getByRole('alertdialog');
      const confirmation = (await alertDialog.count())
        ? alertDialog.last()
        : this.page.getByRole('dialog').filter({ hasText: promptPattern }).last();

      await expect(confirmation).toBeVisible();
      await expect(confirmation).toContainText(promptPattern);
      await confirmation
        .getByRole('button', { name: /sim|yes|confirmar|confirm|prosseguir|continuar/i })
        .click();
    }

    await expect(this.page.getByRole('dialog')).toHaveCount(0, {
      timeout: 15_000,
    });
  }
}

module.exports = { NewAppointmentPage };
