/**
 * System MCP Resources
 *
 * Read-only resources for system-level vSZ data:
 * - vsz://system/summary
 * - vsz://controller
 * - vsz://domains
 * - vsz://domains/{domainId}
 *
 * Source: docs/mcp-architecture.md, Section 7
 */

import type { ResourceDefinition } from './resource-registry.js';
import type { VszHttpClient } from '../http/client.js';
import type { ListResponse, Domain } from '../types/index.js';

export function getSystemResourceDefinitions(httpClient: VszHttpClient): ResourceDefinition[] {
  return [
    {
      name: 'vsz-system-summary',
      type: 'static',
      uri: 'vsz://system/summary',
      metadata: {
        description: 'vSZ system summary including cluster status and version info',
        mimeType: 'application/json',
      },
      readHandler: async (uri) => ({
        contents: [{
          uri: uri.toString(),
          mimeType: 'application/json',
          text: JSON.stringify(await httpClient.get('/system/summary'), null, 2),
        }],
      }),
    },
    {
      name: 'vsz-controller',
      type: 'static',
      uri: 'vsz://controller',
      metadata: {
        description: 'vSZ controller information including version, hostname, and cluster role',
        mimeType: 'application/json',
      },
      readHandler: async (uri) => ({
        contents: [{
          uri: uri.toString(),
          mimeType: 'application/json',
          text: JSON.stringify(await httpClient.get('/controller'), null, 2),
        }],
      }),
    },
    {
      name: 'vsz-domains',
      type: 'static',
      uri: 'vsz://domains',
      metadata: {
        description: 'List of all vSZ administration domains',
        mimeType: 'application/json',
      },
      readHandler: async (uri) => {
        const data = await httpClient.get<ListResponse<Domain>>('/domains');
        return {
          contents: [{
            uri: uri.toString(),
            mimeType: 'application/json',
            text: JSON.stringify(data, null, 2),
          }],
        };
      },
    },
    {
      name: 'vsz-domain-by-id',
      type: 'template',
      uriTemplate: 'vsz://domains/{domainId}',
      metadata: {
        description: 'Single vSZ administration domain by ID',
        mimeType: 'application/json',
      },
      listHandler: async () => {
        const data = await httpClient.get<ListResponse<Domain>>('/domains');
        return {
          resources: data.list.map((domain) => ({
            uri: `vsz://domains/${domain.id}`,
            name: domain.name,
            description: `Domain: ${domain.name}`,
            mimeType: 'application/json',
          })),
        };
      },
      readTemplateHandler: async (uri, variables) => {
        const domainId = variables.domainId as string;
        const data = await httpClient.get(`/domains/${encodeURIComponent(domainId)}`);
        return {
          contents: [{
            uri: uri.toString(),
            mimeType: 'application/json',
            text: JSON.stringify(data, null, 2),
          }],
        };
      },
    },
  ];
}
