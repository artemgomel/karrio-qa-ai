export interface Address {
  person_name: string;
  address_line1: string;
  city: string;
  postal_code: string;
  country_code: string;
  state_code?: string;
  phone_number?: string;
}

export interface Parcel {
  weight: number;
  weight_unit: 'KG' | 'LB';
  length?: number;
  width?: number;
  height?: number;
  dimension_unit?: 'CM' | 'IN';
}

export interface Rate {
  id: string;
  carrier_id: string;
  service: string;
  total_charge: number;
  currency: string;
  transit_days: number | null;
}

export interface Message {
  carrier_id?: string;
  code?: string;
  message: string;
}

export interface RatesResponse {
  rates: Rate[];
  messages: Message[];
}

export interface Shipment {
  id: string;
  status: string;
  tracking_number: string | null;
  service: string | null;
  label_type: string | null;
  docs?: { label?: string | null };
  selected_rate?: Rate | null;
}
