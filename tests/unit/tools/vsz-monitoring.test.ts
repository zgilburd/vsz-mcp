/**
 * Tests for vsz_monitoring tool.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VszHttpClient } from '../../../src/http/client.js';
import type { ToolDefinition } from '../../../src/tools/base-tool.js';

function createMockHttpClient() {
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

describe('vsz_monitoring tool', () => {
  let mock: ReturnType<typeof createMockHttpClient>;
  let tool: ToolDefinition;

  beforeEach(async () => {
    mock = createMockHttpClient();
    const { createVszMonitoringTool } = await import('../../../src/tools/vsz-monitoring.js');
    tool = createVszMonitoringTool(mock.client);
  });

  it('should have correct name', () => {
    expect(tool.name).toBe('vsz_monitoring');
  });

  it('should map ping to GET /tool/ping', async () => {
    mock.get.mockResolvedValue({ status: 'ok' });
    const result = await tool.handler({ action: 'ping' });

    expect(mock.get).toHaveBeenCalledWith('/tool/ping', undefined);
    expect(result.isError).toBeUndefined();
  });

  it('should map list_alarms to POST /alert/alarm/list', async () => {
    mock.post.mockResolvedValue({ list: [], totalCount: 0 });
    const data = { filters: [{ type: 'SEVERITY', value: 'Critical' }] };
    const result = await tool.handler({ action: 'list_alarms', data });

    expect(mock.post).toHaveBeenCalledWith('/alert/alarm/list', data);
    expect(result.isError).toBeUndefined();
  });

  it('should map ack_alarm to PUT /alert/alarm/{id}/ack', async () => {
    mock.put.mockResolvedValue(undefined);
    await tool.handler({ action: 'ack_alarm', id: 'alarm-123' });

    expect(mock.put).toHaveBeenCalledWith('/alert/alarm/alarm-123/ack', undefined);
  });

  it('should map get_zone_event_email to GET /rkszones/{parentId}/eventEmailSettings', async () => {
    mock.get.mockResolvedValue({ enabled: true });
    await tool.handler({ action: 'get_zone_event_email', parentId: 'zone-1' });

    expect(mock.get).toHaveBeenCalledWith('/rkszones/zone-1/eventEmailSettings', undefined);
  });

  it('should map create_traffic_class_profile to POST /rkszones/{parentId}/trafficClassProfile', async () => {
    mock.post.mockResolvedValue({ id: 'tcp-1' });
    const data = { name: 'Premium', description: 'Premium traffic' };
    await tool.handler({ action: 'create_traffic_class_profile', parentId: 'zone-1', data });

    expect(mock.post).toHaveBeenCalledWith('/rkszones/zone-1/trafficClassProfile', data);
  });

  it('should map list_user_traffic_profiles to GET /profiles/utp', async () => {
    mock.get.mockResolvedValue({ list: [], totalCount: 0 });
    await tool.handler({ action: 'list_user_traffic_profiles' });

    expect(mock.get).toHaveBeenCalledWith('/profiles/utp', undefined);
  });
});
