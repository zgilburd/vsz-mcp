/**
 * Unit tests for pagination helpers.
 *
 * Tests both GET list (index/listSize) and POST query (page/limit) pagination styles.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { autoPageGet, autoPagePost } from '../../../src/http/pagination.js';
import type { VszHttpClient } from '../../../src/http/client.js';
import type { ListResponse } from '../../../src/types/api-responses.js';

interface TestItem {
  id: string;
  name: string;
}

function createMockClient(): {
  client: VszHttpClient;
  getMock: ReturnType<typeof vi.fn>;
  postMock: ReturnType<typeof vi.fn>;
} {
  const getMock = vi.fn();
  const postMock = vi.fn();

  const client = {
    get: getMock,
    post: postMock,
  } as unknown as VszHttpClient;

  return { client, getMock, postMock };
}

function makeListResponse<T>(items: T[], totalCount: number, firstIndex: number, hasMore: boolean): ListResponse<T> {
  return { totalCount, hasMore, firstIndex, list: items };
}

describe('autoPageGet', () => {
  let client: VszHttpClient;
  let getMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    const mock = createMockClient();
    client = mock.client;
    getMock = mock.getMock;
  });

  it('should return single page when caller provides explicit index', async () => {
    getMock.mockResolvedValueOnce(
      makeListResponse([{ id: '1', name: 'a' }], 1, 5, false),
    );

    const result = await autoPageGet<TestItem>(client, '/zones', { index: 5, listSize: 10 });

    expect(result.list).toHaveLength(1);
    expect(result.truncated).toBeUndefined();
    expect(getMock).toHaveBeenCalledOnce();
    expect(getMock).toHaveBeenCalledWith('/zones', { index: 5, listSize: 10 });
  });

  it('should return single page when caller provides explicit listSize', async () => {
    getMock.mockResolvedValueOnce(
      makeListResponse([{ id: '1', name: 'a' }], 50, 0, true),
    );

    const result = await autoPageGet<TestItem>(client, '/zones', { listSize: 1 });

    expect(result.list).toHaveLength(1);
    expect(result.truncated).toBeUndefined();
    expect(getMock).toHaveBeenCalledOnce();
  });

  it('should auto-paginate through all pages', async () => {
    // Page 1: 100 items, hasMore=true
    const page1Items = Array.from({ length: 100 }, (_, i) => ({ id: String(i), name: `item-${i}` }));
    getMock.mockResolvedValueOnce(makeListResponse(page1Items, 150, 0, true));

    // Page 2: 50 items, hasMore=false
    const page2Items = Array.from({ length: 50 }, (_, i) => ({ id: String(100 + i), name: `item-${100 + i}` }));
    getMock.mockResolvedValueOnce(makeListResponse(page2Items, 150, 100, false));

    const result = await autoPageGet<TestItem>(client, '/zones');

    expect(result.list).toHaveLength(150);
    expect(result.totalCount).toBe(150);
    expect(result.hasMore).toBe(false);
    expect(result.truncated).toBeUndefined();
    expect(getMock).toHaveBeenCalledTimes(2);

    // Verify correct pagination params
    expect(getMock).toHaveBeenNthCalledWith(1, '/zones', { index: 0, listSize: 100 });
    expect(getMock).toHaveBeenNthCalledWith(2, '/zones', { index: 100, listSize: 100 });
  });

  it('should stop at maxAutoPageResults safety cap', async () => {
    const pageItems = Array.from({ length: 100 }, (_, i) => ({ id: String(i), name: `item-${i}` }));

    getMock.mockResolvedValueOnce(makeListResponse(pageItems, 500, 0, true));
    getMock.mockResolvedValueOnce(makeListResponse(pageItems, 500, 100, true));

    const result = await autoPageGet<TestItem>(client, '/zones', undefined, 200);

    expect(result.list).toHaveLength(200);
    expect(result.truncated).toBe(true);
    expect(result.hasMore).toBe(true);
    expect(getMock).toHaveBeenCalledTimes(2);
  });

  it('should handle single-page response (no more data)', async () => {
    getMock.mockResolvedValueOnce(
      makeListResponse([{ id: '1', name: 'only-item' }], 1, 0, false),
    );

    const result = await autoPageGet<TestItem>(client, '/zones');

    expect(result.list).toHaveLength(1);
    expect(result.hasMore).toBe(false);
    expect(result.truncated).toBeUndefined();
    expect(getMock).toHaveBeenCalledOnce();
  });

  it('should handle empty response', async () => {
    getMock.mockResolvedValueOnce(makeListResponse([], 0, 0, false));

    const result = await autoPageGet<TestItem>(client, '/zones');

    expect(result.list).toHaveLength(0);
    expect(result.totalCount).toBe(0);
  });

  it('should forward additional params alongside pagination params', async () => {
    getMock.mockResolvedValueOnce(makeListResponse([], 0, 0, false));

    await autoPageGet<TestItem>(client, '/zones', { domainId: 'dom-1' });

    expect(getMock).toHaveBeenCalledWith('/zones', { domainId: 'dom-1', index: 0, listSize: 100 });
  });
});

describe('autoPagePost', () => {
  let client: VszHttpClient;
  let postMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    const mock = createMockClient();
    client = mock.client;
    postMock = mock.postMock;
  });

  it('should return single page when caller provides explicit page', async () => {
    postMock.mockResolvedValueOnce(
      makeListResponse([{ id: '1', name: 'a' }], 100, 0, true),
    );

    const result = await autoPagePost<TestItem>(client, '/query/ap', { page: 3, limit: 10 });

    expect(result.list).toHaveLength(1);
    expect(result.truncated).toBeUndefined();
    expect(postMock).toHaveBeenCalledOnce();
    expect(postMock).toHaveBeenCalledWith('/query/ap', { page: 3, limit: 10 });
  });

  it('should return single page when caller provides explicit limit', async () => {
    postMock.mockResolvedValueOnce(
      makeListResponse([{ id: '1', name: 'a' }], 50, 0, true),
    );

    const result = await autoPagePost<TestItem>(client, '/query/ap', { limit: 1 });

    expect(result.list).toHaveLength(1);
    expect(result.truncated).toBeUndefined();
    expect(postMock).toHaveBeenCalledOnce();
  });

  it('should auto-paginate through all pages (POST query style)', async () => {
    const page1Items = Array.from({ length: 100 }, (_, i) => ({ id: String(i), name: `item-${i}` }));
    postMock.mockResolvedValueOnce(makeListResponse(page1Items, 250, 0, true));

    const page2Items = Array.from({ length: 100 }, (_, i) => ({ id: String(100 + i), name: `item-${100 + i}` }));
    postMock.mockResolvedValueOnce(makeListResponse(page2Items, 250, 100, true));

    const page3Items = Array.from({ length: 50 }, (_, i) => ({ id: String(200 + i), name: `item-${200 + i}` }));
    postMock.mockResolvedValueOnce(makeListResponse(page3Items, 250, 200, false));

    const result = await autoPagePost<TestItem>(client, '/query/ap', { filters: [] });

    expect(result.list).toHaveLength(250);
    expect(result.totalCount).toBe(250);
    expect(result.hasMore).toBe(false);
    expect(result.truncated).toBeUndefined();
    expect(postMock).toHaveBeenCalledTimes(3);

    // Verify pagination increments page number
    expect(postMock).toHaveBeenNthCalledWith(1, '/query/ap', { filters: [], page: 1, limit: 100 });
    expect(postMock).toHaveBeenNthCalledWith(2, '/query/ap', { filters: [], page: 2, limit: 100 });
    expect(postMock).toHaveBeenNthCalledWith(3, '/query/ap', { filters: [], page: 3, limit: 100 });
  });

  it('should stop at maxAutoPageResults safety cap', async () => {
    const pageItems = Array.from({ length: 100 }, (_, i) => ({ id: String(i), name: `item-${i}` }));

    postMock.mockResolvedValueOnce(makeListResponse(pageItems, 1000, 0, true));

    const result = await autoPagePost<TestItem>(client, '/query/ap', {}, 100);

    expect(result.list).toHaveLength(100);
    expect(result.truncated).toBe(true);
    expect(result.hasMore).toBe(true);
    expect(postMock).toHaveBeenCalledOnce();
  });

  it('should handle empty query results', async () => {
    postMock.mockResolvedValueOnce(makeListResponse([], 0, 0, false));

    const result = await autoPagePost<TestItem>(client, '/query/ap', { filters: [] });

    expect(result.list).toHaveLength(0);
    expect(result.totalCount).toBe(0);
  });

  it('should forward query body alongside pagination params', async () => {
    postMock.mockResolvedValueOnce(makeListResponse([], 0, 0, false));

    await autoPagePost<TestItem>(client, '/query/ap', {
      filters: [{ type: 'DOMAIN', value: 'test' }],
      sortInfo: { sortColumn: 'name', dir: 'ASC' },
    });

    expect(postMock).toHaveBeenCalledWith('/query/ap', {
      filters: [{ type: 'DOMAIN', value: 'test' }],
      sortInfo: { sortColumn: 'name', dir: 'ASC' },
      page: 1,
      limit: 100,
    });
  });
});
