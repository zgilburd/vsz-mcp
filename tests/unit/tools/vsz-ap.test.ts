/**
 * Tests for vsz_ap domain tool.
 *
 * Covers tool metadata, representative actions across all HTTP methods,
 * {resource} placeholder resolution, and AP group nested paths.
 */

import { describe, it, expect, vi } from 'vitest';
import type { VszHttpClient } from '../../../src/http/client.js';

function createMockHttpClient(): {
  client: VszHttpClient;
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
  del: ReturnType<typeof vi.fn>;
} {
  const get = vi.fn();
  const post = vi.fn();
  const put = vi.fn();
  const patch = vi.fn();
  const del = vi.fn();
  return {
    client: { get, post, put, patch, delete: del } as unknown as VszHttpClient,
    get, post, put, patch, del,
  };
}

describe('vsz_ap tool', () => {
  it('should have name vsz_ap', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    expect(tool.name).toBe('vsz_ap');
  });

  it('should include action descriptions in the description', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    expect(tool.description).toContain('List APs');
    expect(tool.description).toContain('List AP groups');
    expect(tool.description).toContain('List AP SNMP Agent Profiles');
  });

  it('should generate input schema with action enum', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    const schema = tool.inputSchema as Record<string, unknown>;
    const props = schema.properties as Record<string, Record<string, unknown>>;
    expect(props.action.enum).toContain('list_aps');
    expect(props.action.enum).toContain('list_ap_groups');
    expect(schema.required).toEqual(['action']);
  });

  // ── GET list ───────────────────────────────────────────────
  it('should map list_aps to GET /aps', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    mock.get.mockResolvedValue({ list: [], totalCount: 0 });
    const result = await tool.handler({ action: 'list_aps' });
    expect(mock.get).toHaveBeenCalledWith('/aps', undefined);
    expect(result.isError).toBeUndefined();
  });

  it('should support pagination for list_aps', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    mock.get.mockResolvedValue({ list: [], totalCount: 100 });
    await tool.handler({ action: 'list_aps', page: 0, limit: 25 });
    expect(mock.get).toHaveBeenCalledWith('/aps', { index: 0, listSize: 25 });
  });

  // ── GET by ID ──────────────────────────────────────────────
  it('should map get_ap to GET /aps/{id}', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    mock.get.mockResolvedValue({ apMac: 'AA:BB:CC:DD:EE:FF' });
    const result = await tool.handler({ action: 'get_ap', id: 'AA:BB:CC:DD:EE:FF' });
    expect(mock.get).toHaveBeenCalledWith('/aps/AA%3ABB%3ACC%3ADD%3AEE%3AFF', undefined);
    expect(result.isError).toBeUndefined();
  });

  // ── POST create ────────────────────────────────────────────
  it('should map create_ap to POST /aps', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    mock.post.mockResolvedValue({ id: 'new-ap' });
    const data = { mac: 'AA:BB:CC:DD:EE:FF', zoneId: 'zone1' };
    const result = await tool.handler({ action: 'create_ap', data });
    expect(mock.post).toHaveBeenCalledWith('/aps', data);
    expect(result.isError).toBeUndefined();
  });

  // ── DELETE by ID ───────────────────────────────────────────
  it('should map delete_ap to DELETE /aps/{id}', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    mock.del.mockResolvedValue(undefined);
    await tool.handler({ action: 'delete_ap', id: 'AA:BB:CC:DD:EE:FF' });
    expect(mock.del).toHaveBeenCalledWith('/aps/AA%3ABB%3ACC%3ADD%3AEE%3AFF');
  });

  // ── {resource} pattern (AP override) ───────────────────────
  it('should map clear_ap_override to DELETE /aps/{id}/{resource}', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    mock.del.mockResolvedValue(undefined);
    await tool.handler({ action: 'clear_ap_override', id: 'AA:BB:CC:DD:EE:FF', resource: 'altitude' });
    expect(mock.del).toHaveBeenCalledWith('/aps/AA%3ABB%3ACC%3ADD%3AEE%3AFF/altitude');
  });

  // ── {resource} pattern (radio band) ────────────────────────
  it('should map clear_ap_radio_band to DELETE /aps/{id}/radioConfig/{resource}', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    mock.del.mockResolvedValue(undefined);
    await tool.handler({ action: 'clear_ap_radio_band', id: 'AA:BB:CC:DD:EE:FF', resource: 'radio5g' });
    expect(mock.del).toHaveBeenCalledWith('/aps/AA%3ABB%3ACC%3ADD%3AEE%3AFF/radioConfig/radio5g');
  });

  // ── AP Group nested path ───────────────────────────────────
  it('should map list_ap_groups to GET /rkszones/{parentId}/apgroups', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    mock.get.mockResolvedValue({ list: [], totalCount: 0 });
    await tool.handler({ action: 'list_ap_groups', parentId: 'zone1' });
    expect(mock.get).toHaveBeenCalledWith('/rkszones/zone1/apgroups', undefined);
  });

  it('should map get_ap_group to GET /rkszones/{parentId}/apgroups/{id}', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    mock.get.mockResolvedValue({ id: 'grp1', name: 'Default' });
    await tool.handler({ action: 'get_ap_group', parentId: 'zone1', id: 'grp1' });
    expect(mock.get).toHaveBeenCalledWith('/rkszones/zone1/apgroups/grp1', undefined);
  });

  it('should map delete_ap_group to DELETE /rkszones/{parentId}/apgroups/{id}', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    mock.del.mockResolvedValue(undefined);
    await tool.handler({ action: 'delete_ap_group', parentId: 'zone1', id: 'grp1' });
    expect(mock.del).toHaveBeenCalledWith('/rkszones/zone1/apgroups/grp1');
  });

  // ── AP Group override with {resource} ─────────────────────
  it('should map clear_ap_group_override with parentId, id, and resource', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    mock.del.mockResolvedValue(undefined);
    await tool.handler({
      action: 'clear_ap_group_override', parentId: 'zone1', id: 'grp1', resource: 'altitude',
    });
    expect(mock.del).toHaveBeenCalledWith('/rkszones/zone1/apgroups/grp1/altitude');
  });

  // ── PATCH update ───────────────────────────────────────────
  it('should map update_ap to PATCH /aps/{id} with body', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    mock.patch.mockResolvedValue(undefined);
    const data = { name: 'Updated AP' };
    await tool.handler({ action: 'update_ap', id: 'AA:BB:CC:DD:EE:FF', data });
    expect(mock.patch).toHaveBeenCalledWith('/aps/AA%3ABB%3ACC%3ADD%3AEE%3AFF', data);
  });

  // ── AP Registration Rules ─────────────────────────────────
  it('should map list_ap_rules to GET /apRules', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    mock.get.mockResolvedValue({ list: [] });
    await tool.handler({ action: 'list_ap_rules' });
    expect(mock.get).toHaveBeenCalledWith('/apRules', undefined);
  });

  // ── AP SNMP Agent Profiles ─────────────────────────────────
  it('should map list_ap_snmp_profiles to GET /apSnmpAgentProfiles', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    mock.get.mockResolvedValue({ list: [] });
    await tool.handler({ action: 'list_ap_snmp_profiles' });
    expect(mock.get).toHaveBeenCalledWith('/apSnmpAgentProfiles', undefined);
  });

  // ── Operational query ──────────────────────────────────────
  it('should map query_aps to POST /query/ap', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    mock.post.mockResolvedValue({ list: [], totalCount: 0 });
    const data = { filters: [{ type: 'ZONE', value: 'zone1' }] };
    await tool.handler({ action: 'query_aps', data });
    expect(mock.post).toHaveBeenCalledWith('/query/ap', data);
  });

  // ── Error handling ─────────────────────────────────────────
  it('should return error for unknown action', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    const result = await tool.handler({ action: 'nonexistent' });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Unknown action');
  });

  it('should return error when id is required but missing', async () => {
    const { createVszApTool } = await import('../../../src/tools/vsz-ap.js');
    const mock = createMockHttpClient();
    const tool = createVszApTool(mock.client);
    const result = await tool.handler({ action: 'get_ap' });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('id');
  });
});
