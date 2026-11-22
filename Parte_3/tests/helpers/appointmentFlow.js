const { expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { DashboardPage } = require('../../pages/DashboardPage');
const { AgendaPage } = require('../../pages/AgendaPage');

async function createAppointment(page, data) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.expectFormVisible();
  await loginPage.login(data.cpf, data.password);
  await expect(loginPage.cpfInput).toBeHidden({ timeout: 15_000 });

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.expectLoaded();

  const agendaPage = new AgendaPage(page);
  await agendaPage.goto();
  await agendaPage.selectDate(data.date);

  const appointmentForm = await agendaPage.openNewAppointment();
  await appointmentForm.schedule(data);
  await agendaPage.expectAppointmentCreated(data.name);

  return agendaPage;
}

module.exports = { createAppointment };
