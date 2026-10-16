import { test, expect } from '../../src/fixtures';
import { addresses, parcel } from '../../src/data/test-data';
import { DEMO_CARRIER } from '../../src/config';

const { service } = DEMO_CARRIER;

test.describe('Rates: Demo Logistics rate sheet', () => {
  test('domestic parcel gets the configured rate @smoke', async ({ api }) => {
    const { status, body } = await api.getRates({
      shipper: addresses.warehouseNY(),
      recipient: addresses.customerSF(),
      parcels: [parcel(2)],
      carrierIds: [DEMO_CARRIER.carrierId],
    });

    expect(status).toBe(200);
    expect(body.rates).toHaveLength(1);
    expect(body.rates[0]).toMatchObject({
      service: service.code,
      total_charge: service.rate,
      currency: service.currency,
      transit_days: service.transitDays,
    });
  });

  // Boundary values around max_weight = 30 kg
  for (const weight of [0.1, 29.9, 30]) {
    test(`parcel of ${weight} kg (within limit) is rated`, async ({ api }) => {
      const { body } = await api.getRates({
        shipper: addresses.warehouseNY(),
        recipient: addresses.customerSF(),
        parcels: [parcel(weight)],
        carrierIds: [DEMO_CARRIER.carrierId],
      });
      expect(body.rates.map((r) => r.service)).toContain(service.code);
    });
  }

  test('parcel over the weight limit is not rated', async ({ api }) => {
    const { body } = await api.getRates({
      shipper: addresses.warehouseNY(),
      recipient: addresses.customerSF(),
      parcels: [parcel(30.1)],
      carrierIds: [DEMO_CARRIER.carrierId],
    });
    expect(body.rates).toHaveLength(0);
  });

  test('destination outside the rate zone is not rated', async ({ api }) => {
    const { body } = await api.getRates({
      shipper: addresses.warehouseNY(),
      recipient: addresses.customerToronto(),
      parcels: [parcel(2)],
      carrierIds: [DEMO_CARRIER.carrierId],
    });
    expect(body.rates).toHaveLength(0);
  });

  test('empty result explains why no rate is available', async ({ api }) => {
    // Requirement REQ-RATE-05 (docs/requirements/shipment-rating.md):
    // the user must see WHY there is no shipping option.
    // Found during AI-assisted requirements review: Karrio returns
    // an empty list with no message. Marked as a known issue.
    test.info().annotations.push({ type: 'issue', description: 'KQA-1: no reason for empty rates' });
    test.fail();

    const { body } = await api.getRates({
      shipper: addresses.warehouseNY(),
      recipient: addresses.customerSF(),
      parcels: [parcel(31)],
      carrierIds: [DEMO_CARRIER.carrierId],
    });
    expect(body.rates).toHaveLength(0);
    expect(body.messages.length, 'expected an explanation message').toBeGreaterThan(0);
  });
});
