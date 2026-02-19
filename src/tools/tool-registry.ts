/**
 * Tool Registry
 *
 * Central registration point for all MCP tools.
 * Registers each ToolDefinition on the McpServer instance.
 *
 * Source: docs/mcp-architecture.md, Section 11 (Directory Structure)
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { VszHttpClient } from '../http/client.js';
import { createVszSystemTool } from './vsz-system.js';
import { createVszZonesTool } from './vsz-zones.js';
import { createVszApTool } from './vsz-ap.js';
import { createVszWlanTool } from './vsz-wlan.js';
import { createVszClientTool } from './vsz-client.js';
import { createVszAuthServicesTool } from './vsz-auth-services.js';
import { createVszHotspotTool } from './vsz-hotspot.js';
import { createVszSecurityTool } from './vsz-security.js';
import { createVszNetworkTool } from './vsz-network.js';
import { createVszMonitoringTool } from './vsz-monitoring.js';
import { createVszBackupTool } from './vsz-backup.js';
import { createVszCertificateTool } from './vsz-certificate.js';
import { createVszIdentityTool } from './vsz-identity.js';
import { createVszQueryTool } from './vsz-query.js';
import { createVszIndoorMapTool } from './vsz-indoor-map.js';
import { createVszRawRequestTool } from './vsz-raw-request.js';

/**
 * Register all MCP tools on the server.
 *
 * Called by server.ts during startup via tryRegister().
 * Signature must match: (server, httpClient) => void.
 */
export function registerTools(server: McpServer, httpClient: VszHttpClient): void {
  const tools = [
    createVszSystemTool(httpClient),
    createVszZonesTool(httpClient),
    createVszApTool(httpClient),
    createVszWlanTool(httpClient),
    createVszClientTool(httpClient),
    createVszAuthServicesTool(httpClient),
    createVszHotspotTool(httpClient),
    createVszSecurityTool(httpClient),
    createVszNetworkTool(httpClient),
    createVszMonitoringTool(httpClient),
    createVszBackupTool(httpClient),
    createVszCertificateTool(httpClient),
    createVszIdentityTool(httpClient),
    createVszQueryTool(httpClient),
    createVszIndoorMapTool(httpClient),
    createVszRawRequestTool(httpClient),
  ];

  for (const tool of tools) {
    server.tool(
      tool.name,
      tool.description,
      tool.zodShape,
      async (input: Record<string, unknown>) => tool.handler(input),
    );
  }
}
