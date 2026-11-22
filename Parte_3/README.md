# Parte 3 — Automação com Playwright

Os fluxos de login e agendamento estão organizados com Page Object Model:

- `pages/LoginPage.js`: seletores e ações da tela de login.
- `pages/DashboardPage.js`: indicadores de que o login foi concluído e o dashboard carregou.
- `pages/AgendaPage.js`: navegação na agenda e escolha da data.
- `pages/NewAppointmentPage.js`: preenchimento e envio do formulário de agendamento.
- `pages/AppointmentDetailsPage.js`: seleção e exclusão de um agendamento.
- `tests/login.spec.js`: valida a tela e executa o login.
- `tests/appointment.spec.js`: cria o agendamento, confirma sua presença e o exclui ao final.
- `tests/appointment-deletion.spec.js`: cria um agendamento como pré-condição, seleciona-o, exclui e confirma que não aparece mais.
- `tests/appointment-conflict.spec.js`: agenda dois pacientes diferentes no mesmo horário, confirma o aviso de conflito, verifica ambos e os exclui.
- `playwright.config.js`: URL base e configuração do Chromium.

## Requisitos

- Node.js e npm
- Acesso à aplicação de homologação

## Instalação

No PowerShell, dentro de `Parte_3`:

```powershell
npm install
npx playwright install chromium
```

## Massa de dados

Preencha uma vez os valores nos arquivos de dados da pasta `Parte_3`. O `.env` guarda as credenciais e a massa padrão do agendamento. O `.env.example` guarda horários e massas específicas dos cenários. Ambos estão ignorados pelo Git para evitar versionar credenciais e dados pessoais.

```dotenv
APPHEALTH_CPF=
APPHEALTH_PASSWORD=
APPOINTMENT_DATE=2026-11-30
APPOINTMENT_NAME=
APPOINTMENT_PHONE=
APPOINTMENT_TIME=08:15
```

No `.env.example`, os parâmetros de exclusão podem substituir a data, horário, nome e telefone padrão:

```dotenv
DELETE_APPOINTMENT_DATE=2026-11-30
DELETE_APPOINTMENT_TIME=08:30
DELETE_APPOINTMENT_NAME=
DELETE_APPOINTMENT_PHONE=
```

O cenário de conflito usa estas variáveis:

```dotenv
DOUBLE_APPOINTMENT_DATE=2026-11-30
DOUBLE_APPOINTMENT_TIME=09:00
DOUBLE_APPOINTMENT_PATIENT_1_NAME=
DOUBLE_APPOINTMENT_PATIENT_1_PHONE=
DOUBLE_APPOINTMENT_PATIENT_2_NAME=
DOUBLE_APPOINTMENT_PATIENT_2_PHONE=
```

`APPOINTMENT_DATE` e `DELETE_APPOINTMENT_DATE` usam `AAAA-MM-DD`; os horários usam `HH:mm`. O primeiro horário do teste de conflito deve estar livre na agenda; o segundo paciente será agendado nesse mesmo horário após a confirmação do sistema. Os testes acrescentam um sufixo único aos nomes e removem os agendamentos criados ao final. Se nome ou telefone de exclusão ficarem vazios, o teste usa a massa padrão. Sem os valores necessários, os testes correspondentes são ignorados.

## Executar

Depois de preencher o `.env`, os valores serão carregados automaticamente:

```powershell
npm test
```

Os testes de agendamento criam registros reais na base de homologação e os excluem ao final. Use dados de teste autorizados.

Para abrir o navegador durante os testes:

```powershell
npm run test:headed
```
