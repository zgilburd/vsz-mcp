/**
 * vSZ MCP Server Configuration
 *
 * Source: docs/mcp-architecture.md, Section 2
 * Source: docs/api-patterns-analysis.md, Sections 1-2
 */

export type VszEdition = 'vsz-h' | 'vsz-e';

export interface VszMcpConfig {
  /** vSZ controller hostname or IP */
  host: string;

  /** Controller port. Defaults: 8443 (vsz-h), 7443 (vsz-e) */
  port?: number;

  /** Controller edition. Determines base URL prefix and auth method. */
  edition: VszEdition;

  /**
   * API version string.
   * VERIFIED: vSZ 7.1.1.0.872 uses v13_1 exclusively (no backward compat).
   * Default: 'v13_1'
   *
   * Source: Live controller verification, 2026-02-19
   */
  apiVersion?: string;

  /** Admin username */
  username: string;

  /** Admin password */
  password: string;

  /**
   * Accept self-signed TLS certificates.
   * vSZ controllers use self-signed certs by default.
   * Default: true
   *
   * Source: docs/api-patterns-analysis.md, Section 3
   */
  tlsRejectUnauthorized?: boolean;

  /**
   * Maximum results to auto-paginate before stopping.
   * Prevents runaway queries.
   * Default: 10000
   *
   * Source: docs/mcp-architecture.md, Section 8
   */
  maxAutoPageResults?: number;

  /**
   * Service ticket refresh interval in milliseconds.
   * Default: 82800000 (23 hours). Tickets last ~24h.
   *
   * Source: docs/api-patterns-analysis.md, Section 2
   * Citation status: EXTRAPOLATED (community forum, not official docs)
   */
  tokenRefreshIntervalMs?: number;
}

/** Derived settings by edition */
export const EDITION_DEFAULTS: Record<VszEdition, {
  port: number;
  basePath: string;
  authMethod: 'service-ticket' | 'session';
  loginPath: string;
  logoutPath: string;
}> = {
  'vsz-h': {
    port: 8443,
    basePath: '/wsg/api/public',
    authMethod: 'service-ticket',
    loginPath: '/serviceTicket',
    logoutPath: '/serviceTicket',
  },
  'vsz-e': {
    port: 7443,
    basePath: '/api/public',
    authMethod: 'session',
    loginPath: '/session',
    logoutPath: '/session',
  },
};

/** Default configuration values */
export const CONFIG_DEFAULTS = {
  /** VERIFIED: 7.1.1.0.872 only supports v13_1 */
  apiVersion: 'v13_1',
  tlsRejectUnauthorized: true,
  maxAutoPageResults: 10000,
  tokenRefreshIntervalMs: 23 * 60 * 60 * 1000, // 23 hours
} as const;

/**
 * Resolve full config with defaults applied.
 */
export function resolveConfig(config: VszMcpConfig): Required<VszMcpConfig> {
  const editionDefaults = EDITION_DEFAULTS[config.edition];
  return {
    host: config.host,
    port: config.port ?? editionDefaults.port,
    edition: config.edition,
    apiVersion: config.apiVersion ?? CONFIG_DEFAULTS.apiVersion,
    username: config.username,
    password: config.password,
    tlsRejectUnauthorized: config.tlsRejectUnauthorized ?? CONFIG_DEFAULTS.tlsRejectUnauthorized,
    maxAutoPageResults: config.maxAutoPageResults ?? CONFIG_DEFAULTS.maxAutoPageResults,
    tokenRefreshIntervalMs: config.tokenRefreshIntervalMs ?? CONFIG_DEFAULTS.tokenRefreshIntervalMs,
  };
}

/**
 * Load config from environment variables.
 *
 * Source: docs/mcp-architecture.md, Section 2 (Environment Variable Mapping)
 */
export function loadConfigFromEnv(): VszMcpConfig {
  const host = process.env.VSZ_HOST;
  const edition = process.env.VSZ_EDITION as VszEdition | undefined;
  const apiVersion = process.env.VSZ_API_VERSION;
  const username = process.env.VSZ_USERNAME ?? process.env.VSZ_USER;
  const password = process.env.VSZ_PASSWORD ?? process.env.VSZ_PASS;

  if (!host) throw new Error('VSZ_HOST environment variable is required');
  if (!edition) throw new Error('VSZ_EDITION environment variable is required (vsz-h or vsz-e)');
  // apiVersion is optional — defaults to v13_1 (verified for 7.1.1)
  if (!username) throw new Error('VSZ_USERNAME (or VSZ_USER) environment variable is required');
  if (!password) throw new Error('VSZ_PASSWORD (or VSZ_PASS) environment variable is required');

  if (edition !== 'vsz-h' && edition !== 'vsz-e') {
    throw new Error(`VSZ_EDITION must be "vsz-h" or "vsz-e", got "${edition}"`);
  }

  return {
    host,
    edition,
    apiVersion: apiVersion ?? undefined,
    username,
    password,
    port: process.env.VSZ_PORT ? parseInt(process.env.VSZ_PORT, 10) : undefined,
    tlsRejectUnauthorized: process.env.VSZ_TLS_REJECT_UNAUTHORIZED
      ? process.env.VSZ_TLS_REJECT_UNAUTHORIZED !== 'false'
      : undefined,
  };
}
