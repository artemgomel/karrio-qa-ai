import { Page, Locator } from '@playwright/test';

export class ShipmentsPage {
  readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Shipments', level: 1 });
  }

  async open(): Promise<void> {
    await this.page.goto('/shipments');
    await this.heading.waitFor();
  }

  /** A shipment is identified in the list by its tracking number. */
  row(trackingNumber: string): Locator {
    return this.page.getByText(trackingNumber, { exact: true }).first();
  }
}
