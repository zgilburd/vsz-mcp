/**
 * Tests for vsz_hotspot tool.
 */

import { describe, it, expect, vi } from 'vitest';
import type { VszHttpClient } from '../../../src/http/client.js';

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

describe('vsz_hotspot tool', () => {
  it('should create a tool with name vsz_hotspot', async () => {
    const { createVszHotspotTool } = await import('../../../src/tools/vsz-hotspot.js');
    const mock = createMockHttpClient();
    const tool = createVszHotspotTool(mock.client);

    expect(tool.name).toBe('vsz_hotspot');
  });

  it('should map list_guest_access to GET /rkszones/{parentId}/portals/guest', async () => {
    const { createVszHotspotTool } = await import('../../../src/tools/vsz-hotspot.js');
    const mock = createMockHttpClient();
    const tool = createVszHotspotTool(mock.client);

    mock.get.mockResolvedValue({ list: [] });
    await tool.handler({ action: 'list_guest_access', parentId: 'zone1' });

    expect(mock.get).toHaveBeenCalledWith('/rkszones/zone1/portals/guest', undefined);
  });

  it('should map create_hotspot_external to POST with body', async () => {
    const { createVszHotspotTool } = await import('../../../src/tools/vsz-hotspot.js');
    const mock = createMockHttpClient();
    const tool = createVszHotspotTool(mock.client);

    mock.post.mockResolvedValue({ id: 'hs1' });
    const data = { name: 'External Portal', redirectUrl: 'https://login.example.com' };
    await tool.handler({ action: 'create_hotspot_external', parentId: 'zone1', data });

    expect(mock.post).toHaveBeenCalledWith('/rkszones/zone1/portals/hotspot/external', data);
  });

  it('should map delete_hotspot to DELETE /rkszones/{parentId}/portals/hotspot/{id}', async () => {
    const { createVszHotspotTool } = await import('../../../src/tools/vsz-hotspot.js');
    const mock = createMockHttpClient();
    const tool = createVszHotspotTool(mock.client);

    mock.del.mockResolvedValue(undefined);
    await tool.handler({ action: 'delete_hotspot', parentId: 'zone1', id: 'hs1' });

    expect(mock.del).toHaveBeenCalledWith('/rkszones/zone1/portals/hotspot/hs1');
  });

  it('should map get_sms_gateway to GET /smsGateway', async () => {
    const { createVszHotspotTool } = await import('../../../src/tools/vsz-hotspot.js');
    const mock = createMockHttpClient();
    const tool = createVszHotspotTool(mock.client);

    mock.get.mockResolvedValue({ enabled: true, provider: 'twilio' });
    const result = await tool.handler({ action: 'get_sms_gateway' });

    expect(mock.get).toHaveBeenCalledWith('/smsGateway', undefined);
    expect(result.isError).toBeUndefined();
  });

  it('should map update_wechat to PATCH with body', async () => {
    const { createVszHotspotTool } = await import('../../../src/tools/vsz-hotspot.js');
    const mock = createMockHttpClient();
    const tool = createVszHotspotTool(mock.client);

    mock.patch.mockResolvedValue(undefined);
    const data = { name: 'Updated WeChat' };
    await tool.handler({ action: 'update_wechat', parentId: 'zone1', id: 'wc1', data });

    expect(mock.patch).toHaveBeenCalledWith('/rkszones/zone1/portals/wechat/wc1', data);
  });
});
