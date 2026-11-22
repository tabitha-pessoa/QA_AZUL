const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByText('Dashboard', { exact: true });
    this.agendaLink = page.getByRole('link', { name: 'Agenda' });
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/#\/$/);
    await expect(this.title).toBeVisible();
    await expect(this.agendaLink).toBeVisible();
  }
}

module.exports = { DashboardPage };
