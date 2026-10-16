import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  dashboardUrl: process.env.KARRIO_DASHBOARD_URL ?? 'http://localhost:3002',
  apiUrl: process.env.KARRIO_API_URL ?? 'http://localhost:5002',
  email: process.env.KARRIO_EMAIL ?? 'admin@example.com',
  password: process.env.KARRIO_PASSWORD ?? 'demo',
};

export const AUTH_STATE = path.join(__dirname, '..', 'playwright', '.auth', 'user.json');

/**
 * Test carrier set up by tests/setup/data.setup.ts.
 * Generic carrier = custom carrier with our own rate sheet, no real carrier account needed.
 */
export const DEMO_CARRIER = {
  carrierId: 'demo_logistics',
  displayName: 'Demo Logistics',
  rateSheetName: 'Demo Logistics US',
  zoneId: 'zone_us',
  service: {
    code: 'demo_standard',
    name: 'Demo Standard',
    rate: 15,
    currency: 'USD',
    transitDays: 3,
    maxWeightKg: 30,
  },
} as const;
