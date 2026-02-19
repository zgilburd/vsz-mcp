/**
 * Tests for vsz_query tool actions.
 */

import { describe, it, expect, vi } from 'vitest';

function createMockHttpClient() {
  const get = vi.fn();
  const post = vi.fn();
  const put = vi.fn();
  const patch = vi.fn();
  const del = vi.fn();
  return {
    client: { get, post, put, patch, delete: del } as any,
    get, post, put, patch, del,
  };
}

describe('vsz_query tool', () => {
  it('should have name vsz_query', async () => {
    const { createVszQueryTool } = await import('../../../src/tools/vsz-query.js');
    const mock = createMockHttpClient();
    const tool = createVszQueryTool(mock.client);
    expect(tool.name).toBe('vsz_query');
  });

  it('should have action enum in input schema', async () => {
    const { createVszQueryTool } = await import('../../../src/tools/vsz-query.js');
    const mock = createMockHttpClient();
    const tool = createVszQueryTool(mock.client);
    const schema = tool.inputSchema as Record<string, any>;
    const props = schema.properties;
    expect(props.action.enum).toContain('query_radius_proxy_stats');
    expect(props.action.enum).toContain('list_url_filtering');
    expect(props.action.enum).toContain('create_url_filtering');
    expect(schema.required).toEqual(['action']);
  });

  // ── Query With Filter ───────────────────────────────────
  it('should map query_radius_proxy_stats to POST /query/radiusProxy/stats', async () => {
    const { createVszQueryTool } = await import('../../../src/tools/vsz-query.js');
    const mock = createMockHttpClient();
    const tool = createVszQueryTool(mock.client);

    mock.post.mockResolvedValue({ list: [], totalCount: 0 });
    const data = { filters: [{ type: 'DOMAIN', value: 'default' }] };
    const result = await tool.handler({ action: 'query_radius_proxy_stats', data });

    expect(mock.post).toHaveBeenCalledWith('/query/radiusProxy/stats', data);
    expect(result.isError).toBeUndefined();
  });

  // ── URL Filtering Policy ────────────────────────────────
  it('should map get_url_block_categories to GET /urlFiltering/blockCategories', async () => {
    const { createVszQueryTool } = await import('../../../src/tools/vsz-query.js');
    const mock = createMockHttpClient();
    const tool = createVszQueryTool(mock.client);

    mock.get.mockResolvedValue({ categories: ['Adult', 'Gambling'] });
    const result = await tool.handler({ action: 'get_url_block_categories' });

    expect(mock.get).toHaveBeenCalledWith('/urlFiltering/blockCategories', undefined);
    expect(result.isError).toBeUndefined();
  });

  it('should map list_url_filtering to GET /urlFiltering/urlFilteringPolicy', async () => {
    const { createVszQueryTool } = await import('../../../src/tools/vsz-query.js');
    const mock = createMockHttpClient();
    const tool = createVszQueryTool(mock.client);

    mock.get.mockResolvedValue({ list: [], totalCount: 0 });
    await tool.handler({ action: 'list_url_filtering' });

    expect(mock.get).toHaveBeenCalledWith('/urlFiltering/urlFilteringPolicy', undefined);
  });

  it('should map create_url_filtering to POST /urlFiltering/urlFilteringPolicy', async () => {
    const { createVszQueryTool } = await import('../../../src/tools/vsz-query.js');
    const mock = createMockHttpClient();
    const tool = createVszQueryTool(mock.client);

    mock.post.mockResolvedValue({ id: 'uf1' });
    const data = { name: 'Corporate Filter', filteringLevel: 'HIGH' };
    await tool.handler({ action: 'create_url_filtering', data });

    expect(mock.post).toHaveBeenCalledWith('/urlFiltering/urlFilteringPolicy', data);
  });

  it('should map get_url_filtering to GET /urlFiltering/urlFilteringPolicy/{id}', async () => {
    const { createVszQueryTool } = await import('../../../src/tools/vsz-query.js');
    const mock = createMockHttpClient();
    const tool = createVszQueryTool(mock.client);

    mock.get.mockResolvedValue({ id: 'uf1', name: 'Corporate Filter' });
    await tool.handler({ action: 'get_url_filtering', id: 'uf1' });

    expect(mock.get).toHaveBeenCalledWith('/urlFiltering/urlFilteringPolicy/uf1', undefined);
  });

  it('should map delete_url_filtering to DELETE /urlFiltering/urlFilteringPolicy/{id}', async () => {
    const { createVszQueryTool } = await import('../../../src/tools/vsz-query.js');
    const mock = createMockHttpClient();
    const tool = createVszQueryTool(mock.client);

    mock.del.mockResolvedValue(undefined);
    await tool.handler({ action: 'delete_url_filtering', id: 'uf1' });

    expect(mock.del).toHaveBeenCalledWith('/urlFiltering/urlFilteringPolicy/uf1');
  });

  it('should map update_url_filtering to PATCH /urlFiltering/urlFilteringPolicy/{id}', async () => {
    const { createVszQueryTool } = await import('../../../src/tools/vsz-query.js');
    const mock = createMockHttpClient();
    const tool = createVszQueryTool(mock.client);

    mock.patch.mockResolvedValue(undefined);
    const data = { filteringLevel: 'LOW' };
    await tool.handler({ action: 'update_url_filtering', id: 'uf1', data });

    expect(mock.patch).toHaveBeenCalledWith('/urlFiltering/urlFilteringPolicy/uf1', data);
  });

  // ── Error handling ──────────────────────────────────────
  it('should return error for unknown action', async () => {
    const { createVszQueryTool } = await import('../../../src/tools/vsz-query.js');
    const mock = createMockHttpClient();
    const tool = createVszQueryTool(mock.client);

    const result = await tool.handler({ action: 'nonexistent' });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('Unknown action');
  });

  it('should return error when id is required but missing', async () => {
    const { createVszQueryTool } = await import('../../../src/tools/vsz-query.js');
    const mock = createMockHttpClient();
    const tool = createVszQueryTool(mock.client);

    const result = await tool.handler({ action: 'get_url_filtering' });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('id');
  });
});
