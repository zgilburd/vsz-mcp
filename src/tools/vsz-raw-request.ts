/**
 * vsz_raw_request Tool
 *
 * Escape hatch for making arbitrary API requests to the vSZ controller.
 * Does NOT use createDomainTool — implements ToolDefinition directly.
 *
 * Source: docs/mcp-architecture.md, Section 4
 */

import { z } from 'zod';
import type { VszHttpClient } from '../http/client.js';
import type { ToolResult, ToolDefinition } from './base-tool.js';

export function createVszRawRequestTool(httpClient: VszHttpClient): ToolDefinition {
  return {
    name: 'vsz_raw_request',
    description:
      'Execute a raw API request against the vSZ controller. ' +
      'Use this as an escape hatch when no dedicated tool covers the needed endpoint.',
    inputSchema: {
      type: 'object',
      properties: {
        method: {
          type: 'string',
          enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
          description: 'HTTP method.',
        },
        path: {
          type: 'string',
          description:
            'API path (e.g., "/aps" or "/rkszones/{id}/wlans"). ' +
            'The base URL is prepended automatically.',
        },
        data: {
          type: 'object',
          description: 'Request body for POST/PUT/PATCH.',
          additionalProperties: true,
        },
        params: {
          type: 'object',
          description: 'Query parameters as key-value pairs.',
          additionalProperties: true,
        },
      },
      required: ['method', 'path'],
      additionalProperties: false,
    },
    zodShape: {
      method: z
        .enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
        .describe('HTTP method.'),
      path: z.string().describe('API path relative to base URL.'),
      data: z
        .record(z.string(), z.unknown())
        .optional()
        .describe('Request body.'),
      params: z
        .record(z.string(), z.unknown())
        .optional()
        .describe('Query parameters.'),
    },
    handler: async (input: Record<string, unknown>): Promise<ToolResult> => {
      const method = input.method as string;
      const path = input.path as string;
      const data = input.data as Record<string, unknown> | undefined;
      const params = input.params as
        | Record<string, string | number>
        | undefined;

      if (!method || !path) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: 'Missing required "method" and "path" parameters.',
              }),
            },
          ],
          isError: true,
        };
      }

      try {
        let result: unknown;

        switch (method) {
          case 'GET':
            result = await httpClient.get(path, params);
            break;
          case 'POST':
            result = await httpClient.post(path, data);
            break;
          case 'PUT':
            result = await httpClient.put(path, data);
            break;
          case 'PATCH':
            result = await httpClient.patch(path, data);
            break;
          case 'DELETE':
            result = await httpClient.delete(path);
            break;
          default:
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    error: `Unsupported method: ${method}`,
                  }),
                },
              ],
              isError: true,
            };
        }

        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
          isError: true,
        };
      }
    },
  };
}
