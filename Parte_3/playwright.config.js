const path = require('path');
const { defineConfig } = require('@playwright/test');

require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '.env.example') });

module.exports = defineConfig({
  testDir: './tests',
  workers: 1,
  use: {
    baseURL: 'https://sistema.homologacao.apphealth.com.br',
    browserName: 'chromium',
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  reporter: 'list',
});
