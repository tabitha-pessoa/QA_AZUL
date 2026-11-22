const { test } = require('@playwright/test');
const { createAppointment } = require('./helpers/appointmentFlow');

test('confirma dois agendamentos de pacientes diferentes no mesmo horário', async ({
  page,
}) => {
  const data = {
    cpf: process.env.APPHEALTH_CPF,
    password: process.env.APPHEALTH_PASSWORD,
    date: process.env.DOUBLE_APPOINTMENT_DATE,
    time: process.env.DOUBLE_APPOINTMENT_TIME,
    firstName: process.env.DOUBLE_APPOINTMENT_PATIENT_1_NAME,
    firstPhone: process.env.DOUBLE_APPOINTMENT_PATIENT_1_PHONE,
    secondName: process.env.DOUBLE_APPOINTMENT_PATIENT_2_NAME,
    secondPhone: process.env.DOUBLE_APPOINTMENT_PATIENT_2_PHONE,
  };

  test.skip(
    !data.cpf ||
      !data.password ||
      !data.date ||
      !data.time ||
      !data.firstName ||
      !data.firstPhone ||
      !data.secondName ||
      !data.secondPhone,
    'Preencha as variáveis DOUBLE_APPOINTMENT no arquivo .env.example.',
  );

  if (
    data.firstName.trim().toLocaleLowerCase() ===
      data.secondName.trim().toLocaleLowerCase() ||
    data.firstPhone.replace(/\D/g, '') === data.secondPhone.replace(/\D/g, '')
  ) {
    throw new Error('Os dois pacientes precisam ter nomes e telefones diferentes.');
  }

  const runId = Date.now();
  const firstAppointment = {
    date: data.date,
    time: data.time,
    name: `${data.firstName.trim()} QA ${runId}-1`,
    phone: data.firstPhone,
  };
  const secondAppointment = {
    date: data.date,
    time: data.time,
    name: `${data.secondName.trim()} QA ${runId}-2`,
    phone: data.secondPhone,
  };

  const agendaPage = await createAppointment(page, {
    cpf: data.cpf,
    password: data.password,
    ...firstAppointment,
  });

  try {
    const secondForm = await agendaPage.openNewAppointment();
    await secondForm.scheduleAndConfirmConflict(secondAppointment);

    await agendaPage.expectAppointmentCreated(firstAppointment.name);
    await agendaPage.expectAppointmentCreated(secondAppointment.name);
  } finally {
    await agendaPage.dismissOpenAppointmentDialogs();
    await agendaPage.deleteAppointmentIfPresent(secondAppointment.name);
    await agendaPage.deleteAppointmentIfPresent(firstAppointment.name);
  }
});
