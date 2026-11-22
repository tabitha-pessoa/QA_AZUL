const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.cpfInput = page.getByRole('textbox', { name: 'CPF' });
    this.passwordInput = page.getByRole('textbox', { name: 'Senha' });
    this.submitButton = page.getByRole('button', { name: 'Entrar' });
  }

  async goto() {
    await this.page.goto('/#/login');
  }

  async expectFormVisible() {
    await expect(this.cpfInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async login(cpf, password) {
    await this.cpfInput.fill(cpf);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

module.exports = { LoginPage };
