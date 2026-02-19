/**
 * vSZ Pagination Helpers
 *
 * Auto-pagination for GET list and POST query endpoints.
 * Respects maxAutoPageResults safety cap to prevent runaway queries.
 *
 * Source: docs/mcp-architecture.md, Section 8
 * Source: docs/api-patterns-analysis.md, Sections 4, 6
 */

import type { PaginatedResponse, ListResponse } from '../types/api-responses.js';
import type { VszHttpClient } from './client.js';

const DEFAULT_PAGE_SIZE = 100;

/**
 * Auto-paginate a GET list endpoint (index/listSize style).
 *
 * If the caller provides explicit index or listSize params, returns a single page
 * without auto-pagination.
 *
 * @param client - HTTP client instance
 * @param path - API path (e.g., '/rkszones')
 * @param params - Optional query params (may include index/listSize)
 * @param maxResults - Safety cap for auto-pagination
 */
export async function autoPageGet<T>(
  client: VszHttpClient,
  path: string,
  params?: Record<string, string | number>,
  maxResults = 10000,
): Promise<PaginatedResponse<T>> {
  // If caller provided explicit pagination, return single page
  if (params && ('index' in params || 'listSize' in params)) {
    const response = await client.get<ListResponse<T>>(path, params);
    return {
      totalCount: response.totalCount,
      hasMore: response.hasMore,
      firstIndex: response.firstIndex,
      list: response.list,
    };
  }

  const allItems: T[] = [];
  let index = 0;
  let totalCount = 0;
  let truncated = false;

  while (true) {
    const response = await client.get<ListResponse<T>>(path, {
      ...params,
      index,
      listSize: DEFAULT_PAGE_SIZE,
    });

    totalCount = response.totalCount;
    allItems.push(...response.list);

    // Safety cap reached
    if (allItems.length >= maxResults) {
      truncated = true;
      break;
    }

    // No more pages
    if (!response.hasMore) {
      break;
    }

    index += response.list.length;
  }

  return {
    totalCount,
    hasMore: truncated,
    firstIndex: 0,
    list: allItems,
    ...(truncated ? { truncated: true } : {}),
  };
}

/**
 * Auto-paginate a POST query endpoint (page/limit style).
 *
 * If the caller provides explicit page or limit in the body, returns a single page
 * without auto-pagination.
 *
 * @param client - HTTP client instance
 * @param path - API path (e.g., '/query/ap')
 * @param body - Query request body (may include page/limit)
 * @param maxResults - Safety cap for auto-pagination
 */
export async function autoPagePost<T>(
  client: VszHttpClient,
  path: string,
  body: Record<string, unknown>,
  maxResults = 10000,
): Promise<PaginatedResponse<T>> {
  // If caller provided explicit pagination, return single page
  if ('page' in body || 'limit' in body) {
    const response = await client.post<ListResponse<T>>(path, body);
    return {
      totalCount: response.totalCount,
      hasMore: response.hasMore,
      firstIndex: response.firstIndex,
      list: response.list,
    };
  }

  const allItems: T[] = [];
  let page = 1;
  let totalCount = 0;
  let truncated = false;

  while (true) {
    const response = await client.post<ListResponse<T>>(path, {
      ...body,
      page,
      limit: DEFAULT_PAGE_SIZE,
    });

    totalCount = response.totalCount;
    allItems.push(...response.list);

    // Safety cap reached
    if (allItems.length >= maxResults) {
      truncated = true;
      break;
    }

    // No more pages
    if (!response.hasMore) {
      break;
    }

    page++;
  }

  return {
    totalCount,
    hasMore: truncated,
    firstIndex: 0,
    list: allItems,
    ...(truncated ? { truncated: true } : {}),
  };
}
