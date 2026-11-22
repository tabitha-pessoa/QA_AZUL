const { test } = require('@playwright/test');
const { AgendaPage } = require('../pages/AgendaPage');
const { createAppointment } = require('./helpers/appointmentFlow');

test('exclui o agendamento criado como pré-condição', async ({ page }) => {
  const baseName = process.env.DELETE_APPOINTMENT_NAME || process.env.APPOINTMENT_NAME;
  const data = {
    cpf: process.env.APPHEALTH_CPF,
    password: process.env.APPHEALTH_PASSWORD,
    date: process.env.DELETE_APPOINTMENT_DATE || process.env.APPOINTMENT_DATE,
    time: process.env.DELETE_APPOINTMENT_TIME || '08:30',
    name: `${baseName} QA ${Date.now()}`,
    phone: process.env.DELETE_APPOINTMENT_PHONE || process.env.APPOINTMENT_PHONE,
  };

  test.skip(
    !data.cpf || !data.password || !data.date || !data.name || !data.phone,
    'Preencha as variáveis de login e agendamento no arquivo de dados.',
  );

  const agendaPage = await createAppointment(page, data);
  const appointmentDetails = await agendaPage.selectAppointment(data.name);
  await appointmentDetails.delete();
  await agendaPage.expectAppointmentDeleted(data.name);
});
