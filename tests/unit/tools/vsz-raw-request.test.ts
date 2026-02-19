/**
 * Tests for vsz_raw_request tool.
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

describe('vsz_raw_request tool', () => {
  let mock: ReturnType<typeof createMockHttpClient>;
  let tool: ToolDefinition;

  beforeEach(async () => {
    mock = createMockHttpClient();
    const { createVszRawRequestTool } = await import('../../../src/tools/vsz-raw-request.js');
    tool = createVszRawRequestTool(mock.client);
  });

  it('should have correct name', () => {
    expect(tool.name).toBe('vsz_raw_request');
  });

  it('should handle GET requests', async () => {
    mock.get.mockResolvedValue({ list: [], totalCount: 0 });
    const result = await tool.handler({ method: 'GET', path: '/aps' });

    expect(mock.get).toHaveBeenCalledWith('/aps', undefined);
    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.totalCount).toBe(0);
  });

  it('should handle POST requests with body', async () => {
    mock.post.mockResolvedValue({ id: 'new-1' });
    const data = { name: 'Test' };
    const result = await tool.handler({ method: 'POST', path: '/rkszones', data });

    expect(mock.post).toHaveBeenCalledWith('/rkszones', data);
    expect(result.isError).toBeUndefined();
  });

  it('should handle PUT requests with body', async () => {
    mock.put.mockResolvedValue(undefined);
    const data = { name: 'Updated' };
    const result = await tool.handler({ method: 'PUT', path: '/rkszones/zone-1', data });

    expect(mock.put).toHaveBeenCalledWith('/rkszones/zone-1', data);
    expect(result.isError).toBeUndefined();
  });

  it('should handle PATCH requests with body', async () => {
    mock.patch.mockResolvedValue(undefined);
    const data = { name: 'Patched' };
    const result = await tool.handler({ method: 'PATCH', path: '/system', data });

    expect(mock.patch).toHaveBeenCalledWith('/system', data);
    expect(result.isError).toBeUndefined();
  });

  it('should handle DELETE requests', async () => {
    mock.del.mockResolvedValue(undefined);
    const result = await tool.handler({ method: 'DELETE', path: '/rkszones/zone-1' });

    expect(mock.del).toHaveBeenCalledWith('/rkszones/zone-1');
    expect(result.isError).toBeUndefined();
  });

  it('should pass query params for GET', async () => {
    mock.get.mockResolvedValue({ list: [] });
    const params = { index: 0, listSize: 25 };
    await tool.handler({ method: 'GET', path: '/aps', params });

    expect(mock.get).toHaveBeenCalledWith('/aps', params);
  });

  it('should return error for missing method', async () => {
    const result = await tool.handler({ path: '/aps' });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('Missing required');
  });

  it('should return error for missing path', async () => {
    const result = await tool.handler({ method: 'GET' });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('Missing required');
  });

  it('should wrap HTTP client errors', async () => {
    mock.get.mockRejectedValue(new Error('Connection refused'));
    const result = await tool.handler({ method: 'GET', path: '/aps' });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('Connection refused');
  });
});
