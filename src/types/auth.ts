/**
 * vSZ Authentication Types
 *
 * Source: docs/mcp-architecture.md, Section 10 (Authentication interfaces)
 * Source: docs/api-patterns-analysis.md, Section 2
 */

/**
 * Service ticket auth state (port 8443, /wsg/api/public/ base path).
 *
 * Login: POST /{version}/serviceTicket
 * Token passed as: ?serviceTicket={token} query parameter
 *
 * VERIFIED against live vSZ 7.1.1.0.872 (branded "vSZ-E" but uses vsz-h API paths).
 * Note: The edition name (vSZ-E vs vSZ-H) does NOT predict the API path/auth method.
 * The controller's web UI path (/wsg) determines which API pattern to use.
 *
 * Source: docs/api-patterns-analysis.md, Section 2
 * Source: Live controller verification, 2026-02-19
 * Citation status: VERIFIED (live controller + Postman Collection + SZ100 3.0 guide)
 */
export interface ServiceTicketAuth {
  type: 'service-ticket';
  serviceTicket: string;
  controllerVersion: string;
  expiresAt: number;
}

/**
 * Session/cookie auth state (vSZ-E — port 7443).
 *
 * Login: POST /{version}/session
 * Token passed as: Cookie: JSESSIONID={token} header
 *
 * Source: docs/api-patterns-analysis.md, Section 2
 * Citation status: VERIFIED (SZ100 3.0 guide)
 */
export interface SessionAuth {
  type: 'session';
  jsessionId: string;
  sessionInfo: SessionInfo;
}

/**
 * Session info returned by POST /session.
 *
 * Source: docs/api-patterns-analysis.md, Section 2
 * Citation status: PARTIALLY VERIFIED (field set may differ in 7.1.1)
 */
export interface SessionInfo {
  cpId: string;
  domainId: string;
  adminRoleId: string;
  adminId: string;
}

/**
 * Union of all auth states.
 */
export type AuthState = ServiceTicketAuth | SessionAuth;

/**
 * Auth manager interface — implemented by service-ticket-auth and session-auth.
 *
 * Source: docs/mcp-architecture.md, Section 10
 */
export interface AuthManager {
  /** Authenticate and store credentials */
  login(): Promise<void>;

  /** Invalidate the current session/ticket */
  logout(): Promise<void>;

  /** Apply auth to a request (mutates URL or headers) */
  applyAuth(config: RequestConfig): void;

  /** Whether a valid token currently exists */
  isAuthenticated(): boolean;
}

/**
 * HTTP request config that auth managers can mutate.
 */
export interface RequestConfig {
  url: string;
  headers: Record<string, string>;
}
