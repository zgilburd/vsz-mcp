/**
 * MCP Server Factory
 *
 * Creates and configures the McpServer instance with tool and resource
 * registration. Handles graceful degradation when optional modules
 * (tools, resources) are not yet available.
 *
 * Source: docs/mcp-architecture.md, Sections 2-3, 11
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AuthManager } from './types/auth.js';
import type { VszMcpConfig } from './types/config.js';
import { createAuthManager } from './auth/auth-manager.js';
import { VszHttpClient } from './http/client.js';

const SERVER_NAME = 'vsz-mcp';

/**
 * Attempt to read the version from package.json.
 * Falls back to '0.0.0' if the import fails (e.g. in test environments).
 */
async function getVersion(): Promise<string> {
  try {
    const pkg = await import('../package.json', { with: { type: 'json' } });
    return (pkg.default as { version: string }).version;
  } catch {
    return '0.0.0';
  }
}

export interface ServerContext {
  server: McpServer;
  cleanup: () => Promise<void>;
}

/**
 * Safely attempt to import an optional module and call a registration function.
 * Used for tool and resource registries that may not exist yet.
 */
async function tryRegister(
  modulePath: string,
  fnName: string,
  ...args: unknown[]
): Promise<void> {
  try {
    const mod: Record<string, unknown> = await import(modulePath);
    const fn = mod[fnName];
    if (typeof fn === 'function') {
      (fn as (...a: unknown[]) => void)(...args);
    }
  } catch {
    // Module not available yet — server starts without this capability
  }
}

/**
 * Create and configure the MCP server.
 *
 * - Creates AuthManager via the factory in auth/auth-manager.ts
 * - Creates VszHttpClient for API communication
 * - Authenticates with the vSZ controller
 * - Registers tools and resources (gracefully skips if modules don't exist yet)
 * - Returns a cleanup function for graceful shutdown
 */
export async function createServer(
  config: Required<VszMcpConfig>,
): Promise<ServerContext> {
  const version = await getVersion();

  const server = new McpServer(
    { name: SERVER_NAME, version },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    },
  );

  // --- Auth ---
  // Skip login at startup — the HTTP client triggers lazy login on first request.
  // This avoids stderr output that can confuse MCP hosts into thinking the server failed.
  const authManager: AuthManager = createAuthManager(config);

  // --- HTTP Client ---
  const httpClient = new VszHttpClient(config, authManager);

  // --- Tool Registration ---
  // Module may not exist yet (built in parallel by another coder).
  await tryRegister('./tools/tool-registry.js', 'registerTools', server, httpClient);

  // --- Resource Registration ---
  // Module may not exist yet (built in parallel by another coder).
  await tryRegister('./resources/resource-registry.js', 'registerResources', server, httpClient);

  // --- Cleanup ---
  const cleanup = async (): Promise<void> => {
    try {
      await authManager.logout();
    } catch {
      // Best-effort logout on shutdown
    }
  };

  return { server, cleanup };
}
