const { expect } = require('@playwright/test');

class AppointmentDetailsPage {
  constructor(page) {
    this.page = page;
    this.dialog = page.getByRole('dialog').first();
    this.nameInput = page.locator('#agd-atm-inp-nom');
    this.auditTab = page.getByRole('button', { name: 'Auditoria' });
    this.deleteAction = page.locator('#agd-atm-btn-exc');
  }

  async expectLoaded(name) {
    await expect(this.page).toHaveTitle(/Editar agendamento/);
    await expect(this.dialog).toBeVisible();
    await expect(this.nameInput).toHaveValue(name);
  }

  async delete() {
    await this.auditTab.click();
    await expect(this.deleteAction).toBeVisible();

    this.page.once('dialog', (dialog) => dialog.accept());
    await this.deleteAction.click();

    const confirmation = this.page.getByRole('dialog').last();
    if (await confirmation.count()) {
      const confirmButton = confirmation.getByRole('button', {
        name: 'Sim',
        exact: true,
      });
      if (await confirmButton.count()) {
        await confirmButton.click();
      }
    }

    await expect(this.page.getByRole('dialog')).toHaveCount(0, {
      timeout: 15_000,
    });
  }
}

module.exports = { AppointmentDetailsPage };
