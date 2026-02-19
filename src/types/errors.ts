/**
 * vSZ Error Types and Mapping
 *
 * Source: docs/mcp-architecture.md, Section 9
 * Source: docs/api-patterns-analysis.md, Section 5
 * Source: docs/citation-verification-report.md, Section 4.1 E4
 *
 * VERIFIED against live controller 7.1.1.0.872:
 * - 404 errors return: { "success": false }
 * - Other error formats (errorCode/message, code/description) may appear
 *   for auth failures, validation errors, etc.
 * - Parser handles all known formats gracefully.
 */

/**
 * Error response format C: verified against live vSZ 7.1.1.0.872.
 * 404 responses return only { success: false }.
 *
 * Citation status: VERIFIED (live controller verification, 2026-02-19)
 */
export interface VszErrorFormatSimple {
  success: false;
}

/**
 * Error response format A: documented in endpoint catalog.
 * Fields: errorCode, message, errorType
 *
 * Citation status: EXTRAPOLATED (inferred from error code table, not yet seen on live 7.1.1)
 */
export interface VszErrorFormatA {
  errorCode: number;
  message: string;
  errorType: string;
}

/**
 * Error response format B: documented in SZ100 3.0 guide.
 * Fields: id, time, code, category, type, severity, description, status
 *
 * Citation status: VERIFIED (SZ100 3.0 Public API Reference Guide)
 */
export interface VszErrorFormatB {
  id?: string;
  time?: string;
  code: number;
  category?: string;
  type?: string;
  severity?: string;
  description: string;
  status?: string;
}

/**
 * Normalized error after parsing either format.
 */
export interface VszError {
  /** Ruckus error code (0-302) */
  code: number;
  /** Human-readable message */
  message: string;
  /** Error category/type if available */
  type?: string;
  /** Raw response for debugging */
  raw: unknown;
}

/**
 * Parse a vSZ error response body into a normalized VszError.
 * Handles both known formats and unknown shapes gracefully.
 */
export function parseVszError(body: unknown): VszError {
  if (!body || typeof body !== 'object') {
    return { code: -1, message: 'Unknown error (empty response)', raw: body };
  }

  const obj = body as Record<string, unknown>;

  // Format C (VERIFIED 7.1.1): { success: false }
  if ('success' in obj && obj.success === false && Object.keys(obj).length === 1) {
    return {
      code: -1,
      message: 'Request failed (controller returned success: false)',
      raw: body,
    };
  }

  // Format A: { errorCode, message, errorType }
  if ('errorCode' in obj && typeof obj.errorCode === 'number') {
    return {
      code: obj.errorCode,
      message: String(obj.message ?? 'Unknown error'),
      type: obj.errorType ? String(obj.errorType) : undefined,
      raw: body,
    };
  }

  // Format B: { code, description, ... }
  if ('code' in obj && typeof obj.code === 'number') {
    return {
      code: obj.code,
      message: String(obj.description ?? obj.message ?? 'Unknown error'),
      type: obj.type ? String(obj.type) : obj.category ? String(obj.category) : undefined,
      raw: body,
    };
  }

  // Fallback: try to extract any recognizable fields
  const code = typeof obj.error_code === 'number' ? obj.error_code : -1;
  const message = String(obj.message ?? obj.error ?? obj.detail ?? 'Unknown error format');

  return { code, message, raw: body };
}

/**
 * MCP error code type.
 */
export type McpErrorCode = 'InvalidParams' | 'InvalidRequest' | 'InternalError';

/**
 * Ruckus error code to MCP error mapping.
 *
 * Source: docs/mcp-architecture.md, Section 9
 * Source: docs/api-patterns-analysis.md, Section 5
 * Citation status: VERIFIED for error codes (SZ100 3.0 guide)
 */
export const RUCKUS_ERROR_MAP: Record<number, { mcpCode: McpErrorCode; message: string; retry: boolean }> = {
  0:   { mcpCode: 'InternalError',  message: 'Controller internal error',                retry: false },
  101: { mcpCode: 'InvalidParams',  message: 'Malformed request',                        retry: false },
  102: { mcpCode: 'InternalError',  message: 'Controller response error',                retry: false },
  103: { mcpCode: 'InvalidParams',  message: 'Invalid request body',                     retry: false },
  104: { mcpCode: 'InternalError',  message: 'Response generation failure',              retry: false },
  105: { mcpCode: 'InvalidParams',  message: 'API version not supported on controller',  retry: false },
  150: { mcpCode: 'InternalError',  message: 'Controller cluster unavailable',           retry: true },
  151: { mcpCode: 'InternalError',  message: 'Controller node unavailable',              retry: true },
  201: { mcpCode: 'InvalidRequest', message: 'Session expired',                          retry: true },
  202: { mcpCode: 'InvalidRequest', message: 'Authentication failed - check credentials', retry: false },
  211: { mcpCode: 'InvalidRequest', message: 'Insufficient permissions',                 retry: false },
  212: { mcpCode: 'InvalidRequest', message: 'Resource access denied',                   retry: false },
  301: { mcpCode: 'InvalidParams',  message: 'Resource not found',                       retry: false },
  302: { mcpCode: 'InvalidParams',  message: 'Validation error',                         retry: false },
};

/**
 * Map a Ruckus error code to its MCP error info.
 */
export function mapRuckusError(code: number): { mcpCode: McpErrorCode; message: string; retry: boolean } {
  return RUCKUS_ERROR_MAP[code] ?? { mcpCode: 'InternalError', message: `Unknown Ruckus error code: ${code}`, retry: false };
}

/**
 * Whether a Ruckus error code indicates the session has expired (triggers re-auth).
 */
export function isSessionExpiredError(code: number): boolean {
  return code === 201;
}

/**
 * Whether a Ruckus error code indicates a transient failure (triggers retry).
 */
export function isRetryableError(code: number): boolean {
  return RUCKUS_ERROR_MAP[code]?.retry ?? false;
}
