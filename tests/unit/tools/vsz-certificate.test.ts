/**
 * Tests for vsz_certificate tool.
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

describe('vsz_certificate tool', () => {
  let mock: ReturnType<typeof createMockHttpClient>;
  let tool: ToolDefinition;

  beforeEach(async () => {
    mock = createMockHttpClient();
    const { createVszCertificateTool } = await import('../../../src/tools/vsz-certificate.js');
    tool = createVszCertificateTool(mock.client);
  });

  it('should have correct name', () => {
    expect(tool.name).toBe('vsz_certificate');
  });

  it('should map list_certificates to GET /certstore/certificate', async () => {
    mock.get.mockResolvedValue({ list: [] });
    const result = await tool.handler({ action: 'list_certificates' });

    expect(mock.get).toHaveBeenCalledWith('/certstore/certificate', undefined);
    expect(result.isError).toBeUndefined();
  });

  it('should map create_csr to POST /certstore/csr', async () => {
    mock.post.mockResolvedValue({ id: 'csr-1' });
    const data = { commonName: 'test.example.com' };
    await tool.handler({ action: 'create_csr', data });

    expect(mock.post).toHaveBeenCalledWith('/certstore/csr', data);
  });

  it('should map delete_certificate to DELETE /certstore/certificate/{id}', async () => {
    mock.del.mockResolvedValue(undefined);
    await tool.handler({ action: 'delete_certificate', id: 'cert-1' });

    expect(mock.del).toHaveBeenCalledWith('/certstore/certificate/cert-1');
  });

  it('should map query_dpsk to POST /query/dpsk', async () => {
    mock.post.mockResolvedValue({ list: [], totalCount: 0 });
    const data = { filters: [] };
    await tool.handler({ action: 'query_dpsk', data });

    expect(mock.post).toHaveBeenCalledWith('/query/dpsk', data);
  });

  it('should map get_zone_dpsk to GET /rkszones/{parentId}/dpsk', async () => {
    mock.get.mockResolvedValue({ totalCount: 5 });
    await tool.handler({ action: 'get_zone_dpsk', parentId: 'zone-1' });

    expect(mock.get).toHaveBeenCalledWith('/rkszones/zone-1/dpsk', undefined);
  });
});
