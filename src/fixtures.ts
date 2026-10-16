import { test as base } from '@playwright/test';
import { KarrioClient } from './api/karrio-client';
import { ShipmentsPage } from './pages/shipments.page';
import { ShipmentDetailsPage } from './pages/shipment-details.page';
import { SignInPage } from './pages/sign-in.page';
import { addresses, parcel } from './data/test-data';
import { DEMO_CARRIER } from './config';
import type { Shipment } from './api/types';

type TestFixtures = {
  signInPage: SignInPage;
  shipmentsPage: ShipmentsPage;
  shipmentDetailsPage: ShipmentDetailsPage;
  /** A fresh shipment created through the API (fast, no UI clicks). */
  shipment: Shipment;
};

type WorkerFixtures = {
  api: KarrioClient;
};

/**
 * Fixtures as composition: every test asks only for what it needs.
 * The API client is created once per worker; page objects per test.
 */
export const test = base.extend<TestFixtures, WorkerFixtures>({
  api: [
    async ({}, use) => {
      const client = await KarrioClient.create();
      await use(client);
      await client.dispose();
    },
    { scope: 'worker' },
  ],

  signInPage: async ({ page }, use) => use(new SignInPage(page)),
  shipmentsPage: async ({ page }, use) => use(new ShipmentsPage(page)),
  shipmentDetailsPage: async ({ page }, use) => use(new ShipmentDetailsPage(page)),

  shipment: async ({ api }, use) => {
    const shipment = await api.createShipment({
      shipper: addresses.warehouseNY(),
      recipient: addresses.customerSF(),
      parcels: [parcel(2)],
      service: DEMO_CARRIER.service.code,
      carrierIds: [DEMO_CARRIER.carrierId],
    });
    await use(shipment);
  },
});

export { expect } from '@playwright/test';
