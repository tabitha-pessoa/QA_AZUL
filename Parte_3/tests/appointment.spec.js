const { test } = require('@playwright/test');
const { createAppointment } = require('./helpers/appointmentFlow');

test('agenda consulta na data parametrizada', async ({ page }) => {
  const data = {
    cpf: process.env.APPHEALTH_CPF,
    password: process.env.APPHEALTH_PASSWORD,
    date: process.env.APPOINTMENT_DATE,
    time: process.env.APPOINTMENT_TIME || '08:15',
    name: process.env.APPOINTMENT_NAME,
    phone: process.env.APPOINTMENT_PHONE,
  };

  test.skip(
    !data.cpf || !data.password || !data.date || !data.name || !data.phone,
    'Preencha as variáveis de login e agendamento no arquivo .env.',
  );

  data.name = `${data.name} QA ${Date.now()}`;
  const agendaPage = await createAppointment(page, data);
  const appointmentDetails = await agendaPage.selectAppointment(data.name);
  await appointmentDetails.delete();
  await agendaPage.expectAppointmentDeleted(data.name);
});
