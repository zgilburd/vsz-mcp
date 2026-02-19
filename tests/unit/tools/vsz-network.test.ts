/**
 * Tests for vsz_network domain tool.
 *
 * Verifies action-to-endpoint mapping for representative actions
 * across the 29 network-related API tags.
 */

import { describe, it, expect, vi } from 'vitest';
import type { VszHttpClient } from '../../../src/http/client.js';

/** Minimal mock of VszHttpClient for testing. */
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
    get,
    post,
    put,
    patch,
    del,
  };
}

describe('vsz_network tool actions', () => {
  it('should create a tool with name vsz_network', async () => {
    const { createVszNetworkTool } = await import('../../../src/tools/vsz-network.js');
    const mock = createMockHttpClient();
    const tool = createVszNetworkTool(mock.client);

    expect(tool.name).toBe('vsz_network');
  });

  it('should have a valid input schema with action enum', async () => {
    const { createVszNetworkTool } = await import('../../../src/tools/vsz-network.js');
    const mock = createMockHttpClient();
    const tool = createVszNetworkTool(mock.client);

    const schema = tool.inputSchema as Record<string, unknown>;
    expect(schema.type).toBe('object');
    expect(schema.required).toEqual(['action']);
    const props = schema.properties as Record<string, Record<string, unknown>>;
    expect(props.action).toBeDefined();
    expect(Array.isArray(props.action.enum)).toBe(true);
    expect((props.action.enum as string[]).length).toBeGreaterThan(50);
  });

  it('should map list_dhcp_pools to GET /rkszones/{parentId}/dhcpSite/dhcpProfile', async () => {
    const { createVszNetworkTool } = await import('../../../src/tools/vsz-network.js');
    const mock = createMockHttpClient();
    const tool = createVszNetworkTool(mock.client);

    mock.get.mockResolvedValue({ list: [], totalCount: 0 });
    const result = await tool.handler({ action: 'list_dhcp_pools', parentId: 'zone1' });

    expect(mock.get).toHaveBeenCalledWith('/rkszones/zone1/dhcpSite/dhcpProfile', undefined);
    expect(result.isError).toBeUndefined();
  });

  it('should map get_ipsec_profile to GET /profiles/tunnel/ipsec/{id}', async () => {
    const { createVszNetworkTool } = await import('../../../src/tools/vsz-network.js');
    const mock = createMockHttpClient();
    const tool = createVszNetworkTool(mock.client);

    mock.get.mockResolvedValue({ id: 'ipsec1', name: 'Corp IPsec' });
    const result = await tool.handler({ action: 'get_ipsec_profile', id: 'ipsec1' });

    expect(mock.get).toHaveBeenCalledWith('/profiles/tunnel/ipsec/ipsec1', undefined);
    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.id).toBe('ipsec1');
  });

  it('should map create_vlan_pool to POST /vlanpoolings with body', async () => {
    const { createVszNetworkTool } = await import('../../../src/tools/vsz-network.js');
    const mock = createMockHttpClient();
    const tool = createVszNetworkTool(mock.client);

    mock.post.mockResolvedValue({ id: 'vlan-pool-1' });
    const data = { name: 'Pool A', pool: '100-200' };
    const result = await tool.handler({ action: 'create_vlan_pool', data });

    expect(mock.post).toHaveBeenCalledWith('/vlanpoolings', data);
    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.id).toBe('vlan-pool-1');
  });

  it('should map delete_bond_port_profile to DELETE /rkszones/{parentId}/profile/bondPort/{id}', async () => {
    const { createVszNetworkTool } = await import('../../../src/tools/vsz-network.js');
    const mock = createMockHttpClient();
    const tool = createVszNetworkTool(mock.client);

    mock.del.mockResolvedValue(undefined);
    await tool.handler({ action: 'delete_bond_port_profile', parentId: 'zone1', id: 'bp1' });

    expect(mock.del).toHaveBeenCalledWith('/rkszones/zone1/profile/bondPort/bp1');
  });

  it('should map update_dns_server to PATCH /profiles/dnsserver/{id} with body', async () => {
    const { createVszNetworkTool } = await import('../../../src/tools/vsz-network.js');
    const mock = createMockHttpClient();
    const tool = createVszNetworkTool(mock.client);

    mock.patch.mockResolvedValue(undefined);
    const data = { primaryIp: '8.8.8.8' };
    await tool.handler({ action: 'update_dns_server', id: 'dns1', data });

    expect(mock.patch).toHaveBeenCalledWith('/profiles/dnsserver/dns1', data);
  });

  it('should map get_data_plane to GET /planes/{id}', async () => {
    const { createVszNetworkTool } = await import('../../../src/tools/vsz-network.js');
    const mock = createMockHttpClient();
    const tool = createVszNetworkTool(mock.client);

    mock.get.mockResolvedValue({ id: 'blade-uuid-1', name: 'DP-1' });
    await tool.handler({ action: 'get_data_plane', id: 'blade-uuid-1' });

    expect(mock.get).toHaveBeenCalledWith('/planes/blade-uuid-1', undefined);
  });

  it('should map update_system_ipsec to PUT /systemIpsec with body', async () => {
    const { createVszNetworkTool } = await import('../../../src/tools/vsz-network.js');
    const mock = createMockHttpClient();
    const tool = createVszNetworkTool(mock.client);

    mock.put.mockResolvedValue(undefined);
    const data = { enabled: true };
    await tool.handler({ action: 'update_system_ipsec', data });

    expect(mock.put).toHaveBeenCalledWith('/systemIpsec', data);
  });

  it('should return error for unknown action', async () => {
    const { createVszNetworkTool } = await import('../../../src/tools/vsz-network.js');
    const mock = createMockHttpClient();
    const tool = createVszNetworkTool(mock.client);

    const result = await tool.handler({ action: 'nonexistent' });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('Unknown action');
    expect(parsed.error).toContain('nonexistent');
  });

  it('should return error when parentId is required but missing', async () => {
    const { createVszNetworkTool } = await import('../../../src/tools/vsz-network.js');
    const mock = createMockHttpClient();
    const tool = createVszNetworkTool(mock.client);

    const result = await tool.handler({ action: 'list_dhcp_pools' });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('parentId');
  });
});
