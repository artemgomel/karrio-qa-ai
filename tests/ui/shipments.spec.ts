import { test, expect } from '../../src/fixtures';
import { DEMO_CARRIER } from '../../src/config';

/**
 * UI layer checks only what the user sees.
 * Data is prepared through the API (fixture `shipment`), then UI is compared with the backend.
 */
test.describe('Shipments in the dashboard', () => {
  test('new shipment appears in the list @smoke @mobile', async ({ shipment, shipmentsPage }) => {
    await shipmentsPage.open();
    await expect(shipmentsPage.row(shipment.tracking_number!)).toBeVisible();
  });

  test('shipment details match the API', async ({ api, shipment, shipmentDetailsPage }) => {
    const fromApi = await api.getShipment(shipment.id);

    await shipmentDetailsPage.open(shipment.id);

    await expect(shipmentDetailsPage.text(fromApi.tracking_number!)).toBeVisible();
    await expect(shipmentDetailsPage.status(fromApi.status)).toBeVisible();
    await expect(shipmentDetailsPage.charge(fromApi.selected_rate!.total_charge)).toBeVisible();
    await expect(shipmentDetailsPage.text(DEMO_CARRIER.service.currency)).toBeVisible();
  });

  test('cancelled shipment shows cancelled status', async ({ api, shipment, shipmentDetailsPage }) => {
    await api.cancelShipment(shipment.id);

    await shipmentDetailsPage.open(shipment.id);
    await expect(shipmentDetailsPage.status('cancelled')).toBeVisible();
  });
});
