/**
 * MCP Resource Registry
 *
 * Aggregates all resource definitions and provides a registration function
 * for the McpServer. Resources are read-only GET operations that expose
 * vSZ objects via URI templates.
 *
 * Source: docs/mcp-architecture.md, Section 7
 */

import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ReadResourceResult, ListResourcesResult } from '@modelcontextprotocol/sdk/types.js';
import type { Variables } from '@modelcontextprotocol/sdk/shared/uriTemplate.js';
import type { VszHttpClient } from '../http/client.js';
import { getSystemResourceDefinitions } from './system-resources.js';
import { getZoneResourceDefinitions } from './zone-resources.js';

/**
 * Metadata for a resource (description, mimeType, etc.).
 * Mirrors the MCP SDK ResourceMetadata type.
 */
export interface ResourceMetadata {
  description?: string;
  mimeType?: string;
}

/** A static resource at a fixed URI. */
export interface StaticResourceDefinition {
  type: 'static';
  name: string;
  uri: string;
  metadata: ResourceMetadata;
  readHandler: (uri: URL) => Promise<ReadResourceResult>;
}

/** A template resource with URI variables. */
export interface TemplateResourceDefinition {
  type: 'template';
  name: string;
  uriTemplate: string;
  metadata: ResourceMetadata;
  /** Optional: list all concrete instances of this template. */
  listHandler: (() => Promise<ListResourcesResult>) | undefined;
  readTemplateHandler: (uri: URL, variables: Variables) => Promise<ReadResourceResult>;
}

export type ResourceDefinition = StaticResourceDefinition | TemplateResourceDefinition;

/**
 * Returns all resource definitions for the vSZ MCP server.
 */
export function getResourceDefinitions(httpClient: VszHttpClient): ResourceDefinition[] {
  return [
    ...getSystemResourceDefinitions(httpClient),
    ...getZoneResourceDefinitions(httpClient),
  ];
}

/**
 * Registers all resource definitions on the given McpServer instance.
 */
export function registerResources(server: McpServer, httpClient: VszHttpClient): void {
  const definitions = getResourceDefinitions(httpClient);

  for (const def of definitions) {
    if (def.type === 'static') {
      server.resource(
        def.name,
        def.uri,
        { description: def.metadata.description, mimeType: def.metadata.mimeType },
        async (uri) => {
          try {
            return await def.readHandler(uri);
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            return { contents: [{ uri: uri.toString(), mimeType: 'application/json', text: JSON.stringify({ error: msg }) }] };
          }
        },
      );
    } else {
      const template = new ResourceTemplate(
        def.uriTemplate,
        { list: def.listHandler },
      );
      server.resource(
        def.name,
        template,
        { description: def.metadata.description, mimeType: def.metadata.mimeType },
        async (uri, variables) => {
          try {
            return await def.readTemplateHandler(uri, variables);
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            return { contents: [{ uri: uri.toString(), mimeType: 'application/json', text: JSON.stringify({ error: msg }) }] };
          }
        },
      );
    }
  }
}
