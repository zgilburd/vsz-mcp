/**
 * Base Tool Infrastructure
 *
 * Provides shared types and helpers for building MCP tools that map
 * to vSZ API endpoints. Each tool groups related endpoints behind
 * an {action} parameter.
 *
 * Source: docs/mcp-architecture.md, Sections 4-6, 10
 */

import { z } from 'zod';
import type { VszHttpClient } from '../http/client.js';

/**
 * MCP tool result returned by all tool handlers.
 *
 * Source: docs/mcp-architecture.md, Section 10
 */
export interface ToolResult {
  [key: string]: unknown;
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

/**
 * MCP tool definition registered with the server.
 *
 * Source: docs/mcp-architecture.md, Section 10
 */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  /** Zod raw shape for MCP SDK registration. */
  zodShape: Record<string, z.ZodTypeAny>;
  handler(input: Record<string, unknown>): Promise<ToolResult>;
}

/**
 * Common tool input shape shared by all domain tools.
 *
 * Source: docs/mcp-architecture.md, Section 6 (Common Action Pattern)
 */
export interface ToolInput {
  action: string;
  resource?: string;
  id?: string;
  parentId?: string;
  data?: Record<string, unknown>;
  page?: number;
  limit?: number;
}

/**
 * Defines a single action within a tool.
 */
export interface ActionDefinition {
  /** HTTP method */
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Path template. Supports {id}, {parentId}, {resource} placeholders. */
  path: string;
  /** Human-readable description for documentation */
  description: string;
  /** Whether the action accepts a request body (default: inferred from method) */
  hasBody?: boolean;
  /** Whether GET list pagination params (index/listSize) apply */
  paginatable?: boolean;
}

/**
 * Configuration for creating a domain tool.
 */
export interface DomainToolConfig {
  /** MCP tool name (e.g., 'vsz_system') */
  name: string;
  /** Tool description shown to the LLM */
  description: string;
  /** Map of action name -> action definition */
  actions: Record<string, ActionDefinition>;
}

/**
 * Build a JSON Schema for the tool's input based on its action definitions.
 */
function buildInputSchema(actions: Record<string, ActionDefinition>): Record<string, unknown> {
  const actionNames = Object.keys(actions);

  return {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: actionNames,
        description: 'The operation to perform.',
      },
      resource: {
        type: 'string',
        description: 'Sub-resource type within the domain (e.g., "radius", "ldap" for AAA).',
      },
      id: {
        type: 'string',
        description: 'Resource ID for get/update/delete operations.',
      },
      parentId: {
        type: 'string',
        description: 'Parent resource ID (e.g., zoneId for zone sub-resources).',
      },
      data: {
        type: 'object',
        description: 'Request body for create/update/query operations.',
        additionalProperties: true,
      },
      page: {
        type: 'integer',
        description: 'Page number for manual pagination (disables auto-pagination).',
        minimum: 0,
      },
      limit: {
        type: 'integer',
        description: 'Page size for manual pagination.',
        minimum: 1,
        maximum: 1000,
      },
    },
    required: ['action'],
    additionalProperties: false,
  };
}

/**
 * Build a Zod raw shape for MCP SDK tool registration.
 *
 * The MCP SDK's server.tool() accepts ZodRawShapeCompat (Record<string, ZodType>)
 * which enables parameter validation and schema exposure to MCP clients.
 */
function buildZodShape(actions: Record<string, ActionDefinition>): Record<string, z.ZodTypeAny> {
  const actionNames = Object.keys(actions) as [string, ...string[]];

  return {
    action: z.enum(actionNames).describe('The operation to perform.'),
    resource: z.string().optional().describe('Sub-resource type within the domain.'),
    id: z.string().optional().describe('Resource ID for get/update/delete operations.'),
    parentId: z.string().optional().describe('Parent resource ID (e.g., zoneId).'),
    data: z.record(z.string(), z.unknown()).optional().describe('Request body for create/update/query operations.'),
    page: z.number().int().min(0).optional().describe('Page number for manual pagination.'),
    limit: z.number().int().min(1).max(1000).optional().describe('Page size for manual pagination.'),
  };
}

/**
 * Resolve path template placeholders from tool input.
 *
 * Supports: {id}, {parentId}, {resource}
 */
function resolvePath(template: string, input: ToolInput): string {
  let resolved = template;

  if (resolved.includes('{id}')) {
    if (!input.id) {
      throw new Error('This action requires an "id" parameter.');
    }
    resolved = resolved.replace('{id}', encodeURIComponent(input.id));
  }

  if (resolved.includes('{parentId}')) {
    if (!input.parentId) {
      throw new Error('This action requires a "parentId" parameter.');
    }
    resolved = resolved.replace('{parentId}', encodeURIComponent(input.parentId));
  }

  if (resolved.includes('{resource}')) {
    if (!input.resource) {
      throw new Error('This action requires a "resource" parameter.');
    }
    resolved = resolved.replace('{resource}', encodeURIComponent(input.resource));
  }

  return resolved;
}

/**
 * Wrap a successful response as an MCP ToolResult.
 */
function successResult(data: unknown): ToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}

/**
 * Wrap an error as an MCP ToolResult.
 */
function errorResult(message: string): ToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
    isError: true,
  };
}

/**
 * Create an MCP tool from a domain tool configuration.
 *
 * The returned ToolDefinition routes the {action} parameter to the
 * appropriate HTTP method and path, resolving path placeholders and
 * forwarding request bodies.
 */
export function createDomainTool(
  config: DomainToolConfig,
  httpClient: VszHttpClient,
): ToolDefinition {
  const actionDescriptions = Object.entries(config.actions)
    .map(([name, def]) => `  - ${name}: ${def.description}`)
    .join('\n');

  const fullDescription = `${config.description}\n\nAvailable actions:\n${actionDescriptions}`;

  return {
    name: config.name,
    description: fullDescription,
    inputSchema: buildInputSchema(config.actions),
    zodShape: buildZodShape(config.actions),
    handler: async (rawInput: Record<string, unknown>): Promise<ToolResult> => {
      const input = rawInput as unknown as ToolInput;
      const actionName = input.action;

      if (!actionName || typeof actionName !== 'string') {
        return errorResult('Missing required "action" parameter.');
      }

      const actionDef = config.actions[actionName];
      if (!actionDef) {
        const available = Object.keys(config.actions).join(', ');
        return errorResult(
          `Unknown action "${actionName}". Available actions: ${available}`,
        );
      }

      try {
        const path = resolvePath(actionDef.path, input);
        const method = actionDef.method;

        // Determine if this request sends a body
        const sendsBody =
          actionDef.hasBody ?? (method === 'POST' || method === 'PUT' || method === 'PATCH');

        // Build query params for GET requests (pagination + data fields as query params)
        const params: Record<string, string | number> | undefined =
          method === 'GET' ? buildGetParams(input, actionDef.paginatable ?? false) : undefined;

        // POST always needs a JSON body (vSZ rejects bodyless POST with 400).
        // PUT/PATCH forward data as-is (some actions like ack_alarm send no body).
        const body = sendsBody
          ? (method === 'POST' ? (input.data ?? {}) : input.data)
          : undefined;

        let result: unknown;

        switch (method) {
          case 'GET':
            result = await httpClient.get(path, params);
            break;
          case 'POST':
            result = await httpClient.post(path, body);
            break;
          case 'PUT':
            result = await httpClient.put(path, body);
            break;
          case 'PATCH':
            result = await httpClient.patch(path, body);
            break;
          case 'DELETE':
            result = await httpClient.delete(path);
            break;
        }

        return successResult(result);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return errorResult(message);
      }
    },
  };
}

/**
 * Build GET query params from tool input.
 *
 * Merges three sources:
 * 1. Pagination params (index/listSize) when paginatable is true
 * 2. Any `data` fields forwarded as query params (for endpoints needing groupId, etc.)
 *
 * vSZ GET lists use 0-based index and listSize.
 * Source: docs/api-patterns-analysis.md, Section 4
 */
function buildGetParams(
  input: ToolInput,
  paginatable: boolean,
): Record<string, string | number> | undefined {
  const params: Record<string, string | number> = {};

  // Pagination
  if (paginatable) {
    if (input.page !== undefined) {
      params.index = input.page;
    }
    if (input.limit !== undefined) {
      params.listSize = input.limit;
    }
  }

  // Forward data fields as query params for GET requests
  if (input.data) {
    for (const [key, value] of Object.entries(input.data)) {
      if (typeof value === 'string' || typeof value === 'number') {
        params[key] = value;
      }
    }
  }

  return Object.keys(params).length > 0 ? params : undefined;
}
