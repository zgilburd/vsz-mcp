/**
 * Auth Manager Factory
 *
 * Creates the appropriate AuthManager implementation based on the vSZ edition.
 *
 * Source: docs/mcp-architecture.md, Section 10
 */

import type { AuthManager } from '../types/auth.js';
import type { VszMcpConfig } from '../types/config.js';
import { ServiceTicketAuthManager } from './service-ticket-auth.js';
import { SessionAuthManager } from './session-auth.js';

/**
 * Create an AuthManager for the given config.
 *
 * Supports:
 * - vsz-h: ServiceTicketAuthManager (port 8443, /wsg/api/public/)
 * - vsz-e: SessionAuthManager (port 7443, /api/public/)
 *
 * @throws {Error} if the edition is not supported
 */
export function createAuthManager(config: Required<VszMcpConfig>): AuthManager {
  switch (config.edition) {
    case 'vsz-h':
      return new ServiceTicketAuthManager(config);
    case 'vsz-e':
      return new SessionAuthManager(config);
    default:
      throw new Error(`Unknown edition: ${config.edition as string}`);
  }
}
