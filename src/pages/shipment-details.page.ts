import { Page, Locator } from '@playwright/test';

export class ShipmentDetailsPage {
  constructor(private readonly page: Page) {}

  async open(shipmentId: string): Promise<void> {
    await this.page.goto(`/shipments/${shipmentId}`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Status badge renders the status in lower case, e.g. "created", "cancelled". */
  status(status: string): Locator {
    return this.page.getByText(status, { exact: true }).first();
  }

  /** Charge is rendered as "15.00" next to the currency. */
  charge(amount: number): Locator {
    return this.page.getByText(amount.toFixed(2), { exact: true }).first();
  }

  text(value: string): Locator {
    return this.page.getByText(value, { exact: true }).first();
  }
}
