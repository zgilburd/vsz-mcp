/**
 * Zone MCP Resources
 *
 * Read-only resources for zone-level vSZ data:
 * - vsz://zones
 * - vsz://zones/{zoneId}
 * - vsz://zones/{zoneId}/wlans
 *
 * Source: docs/mcp-architecture.md, Section 7
 */

import type { ResourceDefinition } from './resource-registry.js';
import type { VszHttpClient } from '../http/client.js';
import type { ListResponse, Zone, Wlan } from '../types/index.js';

export function getZoneResourceDefinitions(httpClient: VszHttpClient): ResourceDefinition[] {
  return [
    {
      name: 'vsz-zones',
      type: 'static',
      uri: 'vsz://zones',
      metadata: {
        description: 'List of all AP zones configured on the vSZ controller',
        mimeType: 'application/json',
      },
      readHandler: async (uri) => {
        const data = await httpClient.get<ListResponse<Zone>>('/rkszones');
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
      name: 'vsz-zone-by-id',
      type: 'template',
      uriTemplate: 'vsz://zones/{zoneId}',
      metadata: {
        description: 'Single AP zone configuration by ID',
        mimeType: 'application/json',
      },
      listHandler: async () => {
        const data = await httpClient.get<ListResponse<Zone>>('/rkszones');
        return {
          resources: data.list.map((zone) => ({
            uri: `vsz://zones/${zone.id}`,
            name: zone.name,
            description: zone.description ?? `Zone: ${zone.name}`,
            mimeType: 'application/json',
          })),
        };
      },
      readTemplateHandler: async (uri, variables) => {
        const zoneId = variables.zoneId as string;
        const data = await httpClient.get(`/rkszones/${encodeURIComponent(zoneId)}`);
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
      name: 'vsz-zone-wlans',
      type: 'template',
      uriTemplate: 'vsz://zones/{zoneId}/wlans',
      metadata: {
        description: 'WLANs configured within a specific AP zone',
        mimeType: 'application/json',
      },
      listHandler: undefined,
      readTemplateHandler: async (uri, variables) => {
        const zoneId = variables.zoneId as string;
        const data = await httpClient.get<ListResponse<Wlan>>(
          `/rkszones/${encodeURIComponent(zoneId)}/wlans`,
        );
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
