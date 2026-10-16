import { test, expect } from '../../src/fixtures';
import { DEMO_CARRIER } from '../../src/config';

test.describe('Shipments lifecycle', () => {
  test('created shipment has tracking number, label and the selected rate @smoke', async ({ shipment }) => {
    expect(shipment.status).toBe('created');
    expect(shipment.tracking_number).toBeTruthy();
    expect(shipment.service).toBe(DEMO_CARRIER.service.code);
    expect(shipment.label_type).toBe('PDF');
    expect(shipment.selected_rate?.total_charge).toBe(DEMO_CARRIER.service.rate);
  });

  test('created shipment can be cancelled', async ({ api, shipment }) => {
    const { status, body } = await api.cancelShipment(shipment.id);
    expect(status).toBe(200);
    expect(body.status).toBe('cancelled');

    const reloaded = await api.getShipment(shipment.id);
    expect(reloaded.status).toBe('cancelled');
  });

  test('repeated cancel is idempotent', async ({ api, shipment }) => {
    // Not described in requirements (question to analyst, see REQ-SHIP-02).
    // Current behaviour: second cancel returns 202 and the shipment stays cancelled.
    await api.cancelShipment(shipment.id);
    const second = await api.cancelShipment(shipment.id);
    expect(second.status).toBe(202);
    expect(second.body.status).toBe('cancelled');
  });
});
