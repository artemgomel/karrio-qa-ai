import type { Address, Parcel } from '../api/types';

/** Builders keep test data in one place: tests describe intent, not JSON. */

export const addresses = {
  warehouseNY: (): Address => ({
    person_name: 'Main Warehouse',
    address_line1: '1 Main St',
    city: 'New York',
    state_code: 'NY',
    postal_code: '10001',
    country_code: 'US',
    phone_number: '+12125550100',
  }),
  customerSF: (): Address => ({
    person_name: 'John Doe',
    address_line1: '500 Market St',
    city: 'San Francisco',
    state_code: 'CA',
    postal_code: '94105',
    country_code: 'US',
    phone_number: '+14155550100',
  }),
  customerToronto: (): Address => ({
    person_name: 'Jane Roe',
    address_line1: '100 King St W',
    city: 'Toronto',
    state_code: 'ON',
    postal_code: 'M5V2T6',
    country_code: 'CA',
    phone_number: '+14165550100',
  }),
};

export const parcel = (weightKg: number): Parcel => ({
  weight: weightKg,
  weight_unit: 'KG',
  length: 20,
  width: 15,
  height: 10,
  dimension_unit: 'CM',
});
