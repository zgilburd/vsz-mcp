/**
 * Tests for vsz_wlan tool.
 */

import { describe, it, expect, vi } from 'vitest';
import type { VszHttpClient } from '../../../src/http/client.js';
import { createVszWlanTool } from '../../../src/tools/vsz-wlan.js';

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

describe('vsz_wlan tool', () => {
  it('should have name vsz_wlan', () => {
    const mock = createMockHttpClient();
    const tool = createVszWlanTool(mock.client);
    expect(tool.name).toBe('vsz_wlan');
  });

  it('should map list_wlans to GET /rkszones/{parentId}/wlans', async () => {
    const mock = createMockHttpClient();
    const tool = createVszWlanTool(mock.client);
    mock.get.mockResolvedValue({ list: [], totalCount: 0 });

    const result = await tool.handler({ action: 'list_wlans', parentId: 'zone1' });

    expect(mock.get).toHaveBeenCalledWith('/rkszones/zone1/wlans', undefined);
    expect(result.isError).toBeUndefined();
  });

  it('should map get_wlan to GET /rkszones/{parentId}/wlans/{id}', async () => {
    const mock = createMockHttpClient();
    const tool = createVszWlanTool(mock.client);
    mock.get.mockResolvedValue({ id: 'wlan1', name: 'Corp WiFi' });

    const result = await tool.handler({ action: 'get_wlan', parentId: 'zone1', id: 'wlan1' });

    expect(mock.get).toHaveBeenCalledWith('/rkszones/zone1/wlans/wlan1', undefined);
    expect(result.isError).toBeUndefined();
  });

  it('should map create_wlan to POST /rkszones/{parentId}/wlans', async () => {
    const mock = createMockHttpClient();
    const tool = createVszWlanTool(mock.client);
    mock.post.mockResolvedValue({ id: 'new-wlan' });

    const data = { name: 'Guest WiFi', ssid: 'GUEST' };
    const result = await tool.handler({ action: 'create_wlan', parentId: 'zone1', data });

    expect(mock.post).toHaveBeenCalledWith('/rkszones/zone1/wlans', data);
    expect(result.isError).toBeUndefined();
  });

  it('should map delete_wlan to DELETE /rkszones/{parentId}/wlans/{id}', async () => {
    const mock = createMockHttpClient();
    const tool = createVszWlanTool(mock.client);
    mock.del.mockResolvedValue(undefined);

    await tool.handler({ action: 'delete_wlan', parentId: 'zone1', id: 'wlan1' });

    expect(mock.del).toHaveBeenCalledWith('/rkszones/zone1/wlans/wlan1');
  });

  it('should map update_wlan to PATCH /rkszones/{parentId}/wlans/{id}', async () => {
    const mock = createMockHttpClient();
    const tool = createVszWlanTool(mock.client);
    mock.patch.mockResolvedValue(undefined);

    const data = { name: 'Updated' };
    await tool.handler({ action: 'update_wlan', parentId: 'zone1', id: 'wlan1', data });

    expect(mock.patch).toHaveBeenCalledWith('/rkszones/zone1/wlans/wlan1', data);
  });

  it('should map list_wlan_groups to GET /rkszones/{parentId}/wlangroups', async () => {
    const mock = createMockHttpClient();
    const tool = createVszWlanTool(mock.client);
    mock.get.mockResolvedValue({ list: [] });

    await tool.handler({ action: 'list_wlan_groups', parentId: 'zone1' });

    expect(mock.get).toHaveBeenCalledWith('/rkszones/zone1/wlangroups', undefined);
  });

  it('should map get_wifi_calling to GET /wifiCalling/wifiCallingPolicy/{id}', async () => {
    const mock = createMockHttpClient();
    const tool = createVszWlanTool(mock.client);
    mock.get.mockResolvedValue({ id: 'pol1', name: 'Default' });

    await tool.handler({ action: 'get_wifi_calling', id: 'pol1' });

    expect(mock.get).toHaveBeenCalledWith('/wifiCalling/wifiCallingPolicy/pol1', undefined);
  });

  it('should map query_wlans to POST /query/wlan', async () => {
    const mock = createMockHttpClient();
    const tool = createVszWlanTool(mock.client);
    mock.post.mockResolvedValue({ list: [], totalCount: 0 });

    const data = { filters: [{ type: 'ZONE', value: 'zone1' }] };
    await tool.handler({ action: 'query_wlans', data });

    expect(mock.post).toHaveBeenCalledWith('/query/wlan', data);
  });

  it('should return error for unknown action', async () => {
    const mock = createMockHttpClient();
    const tool = createVszWlanTool(mock.client);

    const result = await tool.handler({ action: 'nonexistent' });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Unknown action');
  });
});
