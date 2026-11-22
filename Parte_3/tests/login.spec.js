const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');

test('valida o formulário e autentica o usuário', async ({ page }) => {
  const cpf = process.env.APPHEALTH_CPF;
  const password = process.env.APPHEALTH_PASSWORD;

  test.skip(
    !cpf || !password,
    'Preencha APPHEALTH_CPF e APPHEALTH_PASSWORD no arquivo .env.',
  );

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.expectFormVisible();
  await loginPage.login(cpf, password);

  await expect(loginPage.cpfInput).toBeHidden({ timeout: 15_000 });

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.expectLoaded();
});
