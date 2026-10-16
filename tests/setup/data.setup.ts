import { test as setup } from '@playwright/test';
import { KarrioClient } from '../../src/api/karrio-client';
import { DEMO_CARRIER } from '../../src/config';

/**
 * Idempotent test data: a Generic (custom) carrier + a rate sheet.
 * Lets the whole flow (rates -> shipment -> label) run without real carrier accounts,
 * so the suite works the same locally and in CI.
 */
setup('demo carrier and rate sheet exist', async () => {
  const api = await KarrioClient.create();
  try {
    const connection =
      (await api.findConnection(DEMO_CARRIER.carrierId)) ??
      (await api.createGenericConnection(DEMO_CARRIER.carrierId, DEMO_CARRIER.displayName));

    if (await api.findRateSheet(DEMO_CARRIER.rateSheetName)) return;

    const { service } = DEMO_CARRIER;
    const created = await api.graphql(
      `mutation ($data: CreateRateSheetMutationInput!) {
        create_rate_sheet(input: $data) {
          errors { field messages }
          rate_sheet { id services { id service_code } }
        }
      }`,
      {
        data: {
          name: DEMO_CARRIER.rateSheetName,
          carrier_name: 'generic',
          carriers: [connection.id],
          zones: [{ id: DEMO_CARRIER.zoneId, label: 'US domestic', country_codes: ['US'] }],
          services: [
            {
              service_name: service.name,
              service_code: service.code,
              currency: service.currency,
              transit_days: service.transitDays,
              max_weight: service.maxWeightKg,
              weight_unit: 'KG',
              domicile: true,
              international: false,
              active: true,
              zone_ids: [DEMO_CARRIER.zoneId],
            },
          ],
        },
      },
    );

    const sheet = created.create_rate_sheet.rate_sheet;
    await api.graphql(
      `mutation ($data: UpdateRateSheetMutationInput!) {
        update_rate_sheet(input: $data) { errors { field messages } rate_sheet { id } }
      }`,
      {
        data: {
          id: sheet.id,
          service_rates: [
            {
              service_id: sheet.services[0].id,
              zone_id: DEMO_CARRIER.zoneId,
              rate: service.rate,
              transit_days: service.transitDays,
            },
          ],
        },
      },
    );
  } finally {
    await api.dispose();
  }
});
