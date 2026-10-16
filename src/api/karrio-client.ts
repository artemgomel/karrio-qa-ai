import { APIRequestContext, APIResponse, expect, request } from '@playwright/test';
import { config } from '../config';
import type { Address, Parcel, RatesResponse, Shipment } from './types';

/**
 * Thin client over the Karrio REST + GraphQL API.
 * Used to prepare test data and to compare UI values with the backend.
 */
export class KarrioClient {
  private constructor(private readonly ctx: APIRequestContext) {}

  static async create(): Promise<KarrioClient> {
    const anon = await request.newContext({ baseURL: config.apiUrl });
    const res = await anon.post('/api/token', {
      data: { email: config.email, password: config.password },
    });
    await expectOk(res, 'POST /api/token');
    const { access } = await res.json();
    await anon.dispose();

    const ctx = await request.newContext({
      baseURL: config.apiUrl,
      extraHTTPHeaders: { Authorization: `Bearer ${access}` },
    });
    return new KarrioClient(ctx);
  }

  async dispose(): Promise<void> {
    await this.ctx.dispose();
  }

  // ---------- Carrier connections ----------

  async findConnection(carrierId: string): Promise<{ id: string; carrier_id: string } | undefined> {
    const res = await this.ctx.get('/v1/connections', { params: { carrier_name: 'generic' } });
    await expectOk(res, 'GET /v1/connections');
    const body = await res.json();
    return body.results.find((c: { carrier_id: string }) => c.carrier_id === carrierId);
  }

  async createGenericConnection(carrierId: string, displayName: string): Promise<{ id: string }> {
    const res = await this.ctx.post('/v1/connections', {
      data: {
        carrier_name: 'generic',
        carrier_id: carrierId,
        credentials: { display_name: displayName, custom_carrier_name: carrierId },
        active: true,
      },
    });
    await expectOk(res, 'POST /v1/connections');
    return res.json();
  }

  // ---------- Rate sheets (GraphQL) ----------

  async graphql<T = any>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    const res = await this.ctx.post('/graphql', { data: { query, variables } });
    await expectOk(res, 'POST /graphql');
    const body = await res.json();
    expect(body.errors, `GraphQL errors: ${JSON.stringify(body.errors)}`).toBeFalsy();
    return body.data;
  }

  async findRateSheet(name: string): Promise<{ id: string } | undefined> {
    const data = await this.graphql(`{ rate_sheets { edges { node { id name } } } }`);
    return data.rate_sheets.edges
      .map((e: { node: { id: string; name: string } }) => e.node)
      .find((n: { name: string }) => n.name === name);
  }

  // ---------- Rates & shipments ----------

  async getRates(args: { shipper: Address; recipient: Address; parcels: Parcel[]; carrierIds?: string[] }) {
    const res = await this.ctx.post('/v1/proxy/rates', {
      data: {
        shipper: args.shipper,
        recipient: args.recipient,
        parcels: args.parcels,
        carrier_ids: args.carrierIds,
      },
    });
    return { status: res.status(), body: (await res.json()) as RatesResponse };
  }

  async createShipment(args: {
    shipper: Address;
    recipient: Address;
    parcels: Parcel[];
    service: string;
    carrierIds?: string[];
  }): Promise<Shipment> {
    const res = await this.ctx.post('/v1/shipments', {
      data: {
        shipper: args.shipper,
        recipient: args.recipient,
        parcels: args.parcels,
        service: args.service,
        carrier_ids: args.carrierIds,
      },
    });
    await expectOk(res, 'POST /v1/shipments');
    return res.json();
  }

  async getShipment(id: string): Promise<Shipment> {
    const res = await this.ctx.get(`/v1/shipments/${id}`);
    await expectOk(res, `GET /v1/shipments/${id}`);
    return res.json();
  }

  async cancelShipment(id: string): Promise<{ status: number; body: Shipment }> {
    const res = await this.ctx.post(`/v1/shipments/${id}/cancel`);
    return { status: res.status(), body: await res.json() };
  }
}

async function expectOk(res: APIResponse, label: string): Promise<void> {
  if (!res.ok()) {
    throw new Error(`${label} failed: ${res.status()} ${await res.text()}`);
  }
}
