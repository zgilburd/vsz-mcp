/**
 * Tests for vsz_client tool.
 */

import { describe, it, expect, vi } from 'vitest';
import type { VszHttpClient } from '../../../src/http/client.js';
import { createVszClientTool } from '../../../src/tools/vsz-client.js';

function createMockHttpClient() {
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

describe('vsz_client tool', () => {
  it('should have name vsz_client', () => {
    const mock = createMockHttpClient();
    const tool = createVszClientTool(mock.client);
    expect(tool.name).toBe('vsz_client');
  });

  it('should map get_block_client to GET /blockClient/{id}', async () => {
    const mock = createMockHttpClient();
    const tool = createVszClientTool(mock.client);
    mock.get.mockResolvedValue({ id: 'bc1', mac: 'AA:BB:CC:DD:EE:FF' });

    const result = await tool.handler({ action: 'get_block_client', id: 'bc1' });

    expect(mock.get).toHaveBeenCalledWith('/blockClient/bc1', undefined);
    expect(result.isError).toBeUndefined();
  });

  it('should map create_block_clients to POST /blockClient', async () => {
    const mock = createMockHttpClient();
    const tool = createVszClientTool(mock.client);
    mock.post.mockResolvedValue({ id: 'new-bc' });

    const data = { mac: 'AA:BB:CC:DD:EE:FF', description: 'Blocked' };
    const result = await tool.handler({ action: 'create_block_clients', data });

    expect(mock.post).toHaveBeenCalledWith('/blockClient', data);
    expect(result.isError).toBeUndefined();
  });

  it('should map delete_block_client to DELETE /blockClient/{id}', async () => {
    const mock = createMockHttpClient();
    const tool = createVszClientTool(mock.client);
    mock.del.mockResolvedValue(undefined);

    await tool.handler({ action: 'delete_block_client', id: 'bc1' });

    expect(mock.del).toHaveBeenCalledWith('/blockClient/bc1');
  });

  it('should map list_isolation_whitelist to GET /rkszones/{parentId}/clientIsolationWhitelist', async () => {
    const mock = createMockHttpClient();
    const tool = createVszClientTool(mock.client);
    mock.get.mockResolvedValue({ list: [] });

    await tool.handler({ action: 'list_isolation_whitelist', parentId: 'zone1' });

    expect(mock.get).toHaveBeenCalledWith(
      '/rkszones/zone1/clientIsolationWhitelist',
      undefined,
    );
  });

  it('should map query_rogue_clients to POST /rogueclients/query', async () => {
    const mock = createMockHttpClient();
    const tool = createVszClientTool(mock.client);
    mock.post.mockResolvedValue({ list: [], totalCount: 0 });

    const data = { filters: [] };
    await tool.handler({ action: 'query_rogue_clients', data });

    expect(mock.post).toHaveBeenCalledWith('/rogueclients/query', data);
  });

  it('should map deauth_wireless to POST /clients/deauth', async () => {
    const mock = createMockHttpClient();
    const tool = createVszClientTool(mock.client);
    mock.post.mockResolvedValue({ success: true });

    const data = { mac: 'AA:BB:CC:DD:EE:FF' };
    await tool.handler({ action: 'deauth_wireless', data });

    expect(mock.post).toHaveBeenCalledWith('/clients/deauth', data);
  });

  it('should map query_wireless_clients to POST /query/client', async () => {
    const mock = createMockHttpClient();
    const tool = createVszClientTool(mock.client);
    mock.post.mockResolvedValue({ list: [], totalCount: 0 });

    const data = { filters: [{ type: 'ZONE', value: 'zone1' }] };
    await tool.handler({ action: 'query_wireless_clients', data });

    expect(mock.post).toHaveBeenCalledWith('/query/client', data);
  });

  it('should map get_ap_client_count to GET /aps/{id}/operational/client/totalCount', async () => {
    const mock = createMockHttpClient();
    const tool = createVszClientTool(mock.client);
    mock.get.mockResolvedValue({ totalCount: 42 });

    await tool.handler({ action: 'get_ap_client_count', id: 'AA:BB:CC:DD:EE:FF' });

    expect(mock.get).toHaveBeenCalledWith(
      '/aps/AA%3ABB%3ACC%3ADD%3AEE%3AFF/operational/client/totalCount',
      undefined,
    );
  });

  it('should return error for unknown action', async () => {
    const mock = createMockHttpClient();
    const tool = createVszClientTool(mock.client);

    const result = await tool.handler({ action: 'nonexistent' });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Unknown action');
  });
});
