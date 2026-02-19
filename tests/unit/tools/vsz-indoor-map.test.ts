/**
 * Tests for vsz_indoor_map tool.
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

describe('vsz_indoor_map tool', () => {
  it('should create a tool with name vsz_indoor_map', async () => {
    const { createVszIndoorMapTool } = await import('../../../src/tools/vsz-indoor-map.js');
    const mock = createMockHttpClient();
    const tool = createVszIndoorMapTool(mock.client);

    expect(tool.name).toBe('vsz_indoor_map');
  });

  it('should map list_maps to GET /maps', async () => {
    const { createVszIndoorMapTool } = await import('../../../src/tools/vsz-indoor-map.js');
    const mock = createMockHttpClient();
    const tool = createVszIndoorMapTool(mock.client);

    mock.get.mockResolvedValue({ list: [], totalCount: 0 });
    await tool.handler({ action: 'list_maps' });

    expect(mock.get).toHaveBeenCalledWith('/maps', undefined);
  });

  it('should map create_map to POST /maps with body', async () => {
    const { createVszIndoorMapTool } = await import('../../../src/tools/vsz-indoor-map.js');
    const mock = createMockHttpClient();
    const tool = createVszIndoorMapTool(mock.client);

    mock.post.mockResolvedValue({ id: 'map1' });
    const data = { name: 'Floor 1', description: 'First floor map' };
    await tool.handler({ action: 'create_map', data });

    expect(mock.post).toHaveBeenCalledWith('/maps', data);
  });

  it('should map update_map_aps to PUT /maps/{id}/aps', async () => {
    const { createVszIndoorMapTool } = await import('../../../src/tools/vsz-indoor-map.js');
    const mock = createMockHttpClient();
    const tool = createVszIndoorMapTool(mock.client);

    mock.put.mockResolvedValue(undefined);
    const data = { aps: [{ mac: 'AA:BB:CC:DD:EE:FF', x: 100, y: 200 }] };
    await tool.handler({ action: 'update_map_aps', id: 'map1', data });

    expect(mock.put).toHaveBeenCalledWith('/maps/map1/aps', data);
  });

  it('should map delete_map to DELETE /maps/{id}', async () => {
    const { createVszIndoorMapTool } = await import('../../../src/tools/vsz-indoor-map.js');
    const mock = createMockHttpClient();
    const tool = createVszIndoorMapTool(mock.client);

    mock.del.mockResolvedValue(undefined);
    await tool.handler({ action: 'delete_map', id: 'map1' });

    expect(mock.del).toHaveBeenCalledWith('/maps/map1');
  });

  it('should map create_rtls_profile to POST with parentId', async () => {
    const { createVszIndoorMapTool } = await import('../../../src/tools/vsz-indoor-map.js');
    const mock = createMockHttpClient();
    const tool = createVszIndoorMapTool(mock.client);

    mock.post.mockResolvedValue({ id: 'rtls1' });
    const data = { name: 'RTLS Profile', ip: '10.0.0.1' };
    await tool.handler({ action: 'create_rtls_profile', parentId: 'zone1', data });

    expect(mock.post).toHaveBeenCalledWith(
      '/rkszones/zone1/realTimeLocationService',
      data,
    );
  });
});
