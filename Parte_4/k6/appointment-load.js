import http from 'k6/http';
import { check, fail } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';
import { SharedArray } from 'k6/data';

const configPath = __ENV.LOAD_TEST_CONFIG || './k6/config.json';
const config = JSON.parse(open(configPath));
const baseUrl = config.baseUrl;
const vus = Number(config.vus);

if (
  typeof baseUrl !== 'string' ||
  !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(baseUrl)
) {
  throw new Error('Teste bloqueado: baseUrl deve ser localhost ou 127.0.0.1 via HTTP.');
}

if (!Number.isInteger(vus) || vus < 1 || vus > 100) {
  throw new Error('vus deve ser um inteiro entre 1 e 100.');
}

const requiredConfig = [
  'loginPath',
  'loginBodyTemplate',
  'agendaPathTemplate',
  'appointmentPath',
  'appointmentBodyTemplate',
  'appointmentIdJsonPath',
  'cleanupPathTemplate',
];

for (const key of requiredConfig) {
  if (!config[key] || JSON.stringify(config[key]).includes('REPLACE_WITH')) {
    throw new Error(`Configure ${key} com o contrato HTTP local verificado.`);
  }
}

const usersFile = __ENV.LOAD_TEST_USERS || './k6/users.csv';
const users = new SharedArray('load-test-users', () => {
  const lines = open(usersFile)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const headers = lines.shift().split(',');
  const expectedHeaders = [
    'cpf',
    'password',
    'date',
    'time',
    'patient_name',
    'phone',
  ];

  if (expectedHeaders.some((header) => !headers.includes(header))) {
    throw new Error(`CSV deve conter as colunas: ${expectedHeaders.join(', ')}.`);
  }

  return lines.map((line, index) => {
    const values = line.split(',');
    if (values.length !== headers.length) {
      throw new Error(`Numero de colunas invalido na linha ${index + 2} do CSV.`);
    }

    return Object.fromEntries(headers.map((header, i) => [header, values[i]]));
  });
});

if (users.length < vus) {
  throw new Error(`Sao necessarias ao menos ${vus} contas/massas no CSV; encontradas ${users.length}.`);
}

const runUsers = users.slice(0, vus);
for (const key of ['cpf', 'patient_name', 'phone']) {
  if (new Set(runUsers.map((user) => user[key])).size !== vus) {
    throw new Error(`Os valores de ${key} precisam ser unicos para cada VU.`);
  }
}

if (new Set(runUsers.map((user) => `${user.date}|${user.time}`)).size !== vus) {
  throw new Error('Cada VU precisa de uma data/horario disponivel e exclusivo.');
}

if (
  runUsers.some((user) =>
    Object.values(user).some((value) =>
      /^(EXAMPLE_|REPLACE_ME)/i.test(value),
    ),
  )
) {
  throw new Error('Substitua todos os valores de exemplo no CSV antes do teste local.');
}

const loginDuration = new Trend('login_duration_ms', true);
const agendaDuration = new Trend('agenda_duration_ms', true);
const appointmentDuration = new Trend('appointment_duration_ms', true);
const cleanupDuration = new Trend('cleanup_duration_ms', true);
const journeyFailed = new Rate('appointment_journey_failed');
const journeyCompleted = new Counter('appointment_journey_completed');

export const options = {
  scenarios: {
    appointment_peak: {
      executor: 'per-vu-iterations',
      vus,
      iterations: 1,
      maxDuration: '5m',
    },
  },
};

function interpolate(template, values) {
  if (typeof template === 'string') {
    const exactToken = /^{{(\w+)}}$/.exec(template);
    if (exactToken) {
      if (!(exactToken[1] in values)) {
        throw new Error(`Placeholder desconhecido: ${exactToken[1]}.`);
      }
      return values[exactToken[1]];
    }

    return template.replace(/{{(\w+)}}/g, (match, key) => {
      if (!(key in values)) {
        throw new Error(`Placeholder desconhecido: ${key}.`);
      }
      return encodeURIComponent(String(values[key]));
    });
  }

  if (Array.isArray(template)) {
    return template.map((item) => interpolate(item, values));
  }

  if (template && typeof template === 'object') {
    return Object.fromEntries(
      Object.entries(template).map(([key, value]) => [
        key,
        interpolate(value, values),
      ]),
    );
  }

  return template;
}

function valueAtPath(object, path) {
  return path.split('.').reduce((value, key) => {
    if (value === undefined || value === null) {
      return undefined;
    }
    return value[key];
  }, object);
}

function assert2xx(response, label) {
  const passed = check(response, {
    [`${label} returned 2xx`]: (result) =>
      result.status >= 200 && result.status < 300,
  });

  if (!passed) {
    journeyFailed.add(true, { step: label });
    fail(`${label} falhou com HTTP ${response.status}.`);
  }
}

function requestParams(step, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `${config.authScheme || 'Bearer'} ${token}`;
  }

  return { headers, tags: { step } };
}

export default function () {
  const user = users[__VU - 1];
  const userData = {
    cpf: user.cpf,
    password: user.password,
    date: user.date,
    time: user.time,
    patient_name: user.patient_name,
    phone: user.phone,
  };

  const loginResponse = http.post(
    `${baseUrl}${config.loginPath}`,
    JSON.stringify(interpolate(config.loginBodyTemplate, userData)),
    requestParams('login'),
  );
  loginDuration.add(loginResponse.timings.duration);
  assert2xx(loginResponse, 'login');

  let token;
  if (config.loginTokenJsonPath) {
    token = valueAtPath(loginResponse.json(), config.loginTokenJsonPath);
    if (!token) {
      journeyFailed.add(true, { step: 'login-token' });
      fail('A resposta de login nao contem o token configurado.');
    }
  }

  const agendaPath = interpolate(config.agendaPathTemplate, userData);
  const agendaResponse = http.get(
    `${baseUrl}${agendaPath}`,
    requestParams('agenda', token),
  );
  agendaDuration.add(agendaResponse.timings.duration);
  assert2xx(agendaResponse, 'agenda');

  const appointmentResponse = http.post(
    `${baseUrl}${config.appointmentPath}`,
    JSON.stringify(interpolate(config.appointmentBodyTemplate, userData)),
    requestParams('appointment-create', token),
  );
  appointmentDuration.add(appointmentResponse.timings.duration);
  assert2xx(appointmentResponse, 'appointment-create');

  const appointmentId = valueAtPath(
    appointmentResponse.json(),
    config.appointmentIdJsonPath,
  );
  if (appointmentId === undefined || appointmentId === null || appointmentId === '') {
    journeyFailed.add(true, { step: 'appointment-id' });
    fail('A resposta de criacao nao contem o identificador para limpeza.');
  }

  const cleanupPath = interpolate(config.cleanupPathTemplate, {
    ...userData,
    id: appointmentId,
  });
  const cleanupResponse = http.del(
    `${baseUrl}${cleanupPath}`,
    null,
    requestParams('appointment-cleanup', token),
  );
  cleanupDuration.add(cleanupResponse.timings.duration);
  assert2xx(cleanupResponse, 'appointment-cleanup');

  journeyFailed.add(false);
  journeyCompleted.add(1);
}
