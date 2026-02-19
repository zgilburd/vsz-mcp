/**
 * vSZ API Response Types
 *
 * Source: docs/mcp-architecture.md, Section 10
 * Source: docs/api-patterns-analysis.md, Sections 4, 6, 7
 */

/**
 * Standard list response envelope for GET list endpoints.
 *
 * Source: docs/api-patterns-analysis.md, Section 4
 * Citation status: VERIFIED (SZ100 3.0 guide, vSZ-E 3.5.1 guide)
 */
export interface ListResponse<T> {
  totalCount: number;
  hasMore: boolean;
  firstIndex: number;
  list: T[];
}

/**
 * Create response — returned by POST create endpoints (HTTP 201).
 *
 * Source: docs/api-patterns-analysis.md, Section 7
 * Citation status: VERIFIED (SZ100 3.0 guide)
 */
export interface CreateResponse {
  id: string;
}

/**
 * Paginated response returned by MCP tools (wraps ListResponse with truncation info).
 *
 * Source: docs/mcp-architecture.md, Section 8
 */
export interface PaginatedResponse<T> {
  totalCount: number;
  hasMore: boolean;
  firstIndex: number;
  list: T[];
  /** Present if auto-pagination was truncated at maxAutoPageResults */
  truncated?: boolean;
}

/**
 * Query request body for POST /query/{resource} endpoints.
 *
 * Source: docs/api-patterns-analysis.md, Section 6
 * Citation status: VERIFIED (Postman Collection, SZ100 3.0 guide)
 */
export interface QueryRequest {
  filters?: QueryFilter[];
  extraFilters?: QueryFilter[];
  extraNotFilters?: QueryFilter[];
  fullTextSearch?: FullTextSearch;
  attributes?: string[];
  sortInfo?: SortInfo;
  page?: number;
  limit?: number;
}

/**
 * Filter condition for query endpoints.
 *
 * Source: docs/api-patterns-analysis.md, Section 6
 */
export interface QueryFilter {
  type: string;
  value: string;
}

/**
 * Full-text search parameter for query endpoints.
 *
 * Source: docs/api-patterns-analysis.md, Section 6
 */
export interface FullTextSearch {
  type: 'AND' | 'OR';
  value: string;
}

/**
 * Sort specification for query endpoints.
 *
 * Source: docs/api-patterns-analysis.md, Section 6
 */
export interface SortInfo {
  sortColumn: string;
  dir: 'ASC' | 'DESC';
}

/**
 * GET list pagination parameters.
 *
 * Source: docs/api-patterns-analysis.md, Section 4
 * Citation status: VERIFIED (SZ100 3.0 guide, vSZ-E 3.5.1 guide)
 */
export interface GetListPaginationParams {
  /** 0-based offset. Default: 0 */
  index?: number;
  /** Page size. Default: 100 */
  listSize?: number;
}

/**
 * POST query pagination parameters (1-based).
 *
 * Source: docs/api-patterns-analysis.md, Section 4
 * Citation status: VERIFIED (Postman Collection)
 */
export interface PostQueryPaginationParams {
  /** 1-based page number */
  page?: number;
  /** Items per page. Default: 100 */
  limit?: number;
}
