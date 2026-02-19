/**
 * vsz_query Tool
 *
 * Query and filtering: execute filtered queries across resources
 * and manage URL filtering policies.
 *
 * Source: docs/mcp-architecture.md, Section 4
 * Source: docs/openapi-parsed-endpoints.md (Query With Filter,
 *   URL Filtering Policy)
 */

import type { VszHttpClient } from '../http/client.js';
import type { ToolDefinition, ActionDefinition } from './base-tool.js';
import { createDomainTool } from './base-tool.js';

const actions: Record<string, ActionDefinition> = {
  // ── Query With Filter (1) ─────────────────────────────────
  query_radius_proxy_stats: {
    method: 'POST',
    path: '/query/radiusProxy/stats',
    description: 'Query RADIUS proxy statistics with filters.',
  },

  // ── URL Filtering Policy (9) ──────────────────────────────
  get_url_block_categories: {
    method: 'GET',
    path: '/urlFiltering/blockCategories',
    description: 'Retrieve block categories for URL filtering.',
  },
  query_url_filtering: {
    method: 'POST',
    path: '/urlFiltering/query',
    description: 'Query URL filtering policies with filters.',
  },
  list_url_filtering: {
    method: 'GET',
    path: '/urlFiltering/urlFilteringPolicy',
    description: 'List URL filtering policies.',
  },
  create_url_filtering: {
    method: 'POST',
    path: '/urlFiltering/urlFilteringPolicy',
    description: 'Create a URL filtering policy.',
  },
  delete_url_filtering_bulk: {
    method: 'DELETE',
    path: '/urlFiltering/urlFilteringPolicy',
    description: 'Delete URL filtering policies (bulk).',
  },
  get_url_filtering: {
    method: 'GET',
    path: '/urlFiltering/urlFilteringPolicy/{id}',
    description: 'Retrieve a URL filtering policy.',
  },
  replace_url_filtering: {
    method: 'PUT',
    path: '/urlFiltering/urlFilteringPolicy/{id}',
    description: 'Replace a URL filtering policy.',
  },
  delete_url_filtering: {
    method: 'DELETE',
    path: '/urlFiltering/urlFilteringPolicy/{id}',
    description: 'Delete a URL filtering policy.',
  },
  update_url_filtering: {
    method: 'PATCH',
    path: '/urlFiltering/urlFilteringPolicy/{id}',
    description: 'Patch a URL filtering policy.',
  },
};

export function createVszQueryTool(httpClient: VszHttpClient): ToolDefinition {
  return createDomainTool(
    {
      name: 'vsz_query',
      description:
        'Ruckus vSZ query and filtering. Execute filtered queries across ' +
        'resources and manage URL filtering policies.',
      actions,
    },
    httpClient,
  );
}
