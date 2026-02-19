#!/usr/bin/env node
/**
 * vSZ MCP Server Entry Point
 *
 * Loads configuration from environment variables, creates the MCP server,
 * connects via stdio transport, and handles graceful shutdown.
 *
 * Source: docs/mcp-architecture.md, Section 11
 */

import 'dotenv/config';

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfigFromEnv, resolveConfig } from './types/config.js';
import { createServer } from './server.js';

async function main(): Promise<void> {
  const rawConfig = loadConfigFromEnv();
  const config = resolveConfig(rawConfig);

  const { server, cleanup } = await createServer(config);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Graceful shutdown handler
  const shutdown = async (signal: string): Promise<void> => {
    process.stderr.write(`\nReceived ${signal}, shutting down...\n`);
    await cleanup();
    await server.close();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

main().catch((error: unknown) => {
  process.stderr.write(
    `Fatal error: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
});
