/**
 * vsz_indoor_map Tool
 *
 * Indoor mapping and location services: indoor maps,
 * LBS profiles, and RTLS profiles.
 *
 * Source: docs/openapi-parsed-endpoints.md (IndoorMap, LBS profile,
 *   Real Time Location Service Profile)
 */

import type { VszHttpClient } from '../http/client.js';
import type { ToolDefinition, ActionDefinition } from './base-tool.js';
import { createDomainTool } from './base-tool.js';

const actions: Record<string, ActionDefinition> = {
  // ── IndoorMap ──────────────────────────────────────────────
  list_maps: {
    method: 'GET',
    path: '/maps',
    description: 'List indoor maps. Requires data: {groupId: "<zoneId>", groupType: "ZONE"}.',
  },
  create_map: {
    method: 'POST',
    path: '/maps',
    description: 'Create an indoor map.',
  },
  get_map: {
    method: 'GET',
    path: '/maps/{id}',
    description: 'Retrieve an indoor map.',
  },
  delete_map: {
    method: 'DELETE',
    path: '/maps/{id}',
    description: 'Delete an indoor map.',
  },
  update_map: {
    method: 'PATCH',
    path: '/maps/{id}',
    description: 'Update an indoor map.',
  },
  update_map_aps: {
    method: 'PUT',
    path: '/maps/{id}/aps',
    description: 'Place APs on an indoor map.',
  },
  query_maps: {
    method: 'POST',
    path: '/maps/query',
    description: 'Query indoor maps with filters.',
  },

  // ── LBS Profile ────────────────────────────────────────────
  create_lbs_profile: {
    method: 'POST',
    path: '/profiles/lbs',
    description: 'Create an LBS (Location Based Service) profile.',
  },
  delete_lbs_profiles_bulk: {
    method: 'DELETE',
    path: '/profiles/lbs',
    description: 'Delete multiple LBS profiles.',
  },
  get_lbs_profile: {
    method: 'GET',
    path: '/profiles/lbs/{id}',
    description: 'Retrieve an LBS profile.',
  },
  delete_lbs_profile: {
    method: 'DELETE',
    path: '/profiles/lbs/{id}',
    description: 'Delete an LBS profile.',
  },
  update_lbs_profile: {
    method: 'PATCH',
    path: '/profiles/lbs/{id}',
    description: 'Update an LBS profile.',
  },
  query_lbs_profiles: {
    method: 'POST',
    path: '/profiles/lbs/query',
    description: 'Query LBS profiles.',
  },

  // ── Real Time Location Service (RTLS) Profile ─────────────
  list_rtls_profiles: {
    method: 'GET',
    path: '/rkszones/{parentId}/realTimeLocationService',
    description: 'List RTLS profiles for a zone.',
  },
  create_rtls_profile: {
    method: 'POST',
    path: '/rkszones/{parentId}/realTimeLocationService',
    description: 'Create an RTLS profile.',
  },
  get_rtls_profile: {
    method: 'GET',
    path: '/rkszones/{parentId}/realTimeLocationService/{id}',
    description: 'Retrieve an RTLS profile.',
  },
  replace_rtls_profile: {
    method: 'PUT',
    path: '/rkszones/{parentId}/realTimeLocationService/{id}',
    description: 'Replace an RTLS profile.',
  },
  delete_rtls_profile: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/realTimeLocationService/{id}',
    description: 'Delete an RTLS profile.',
  },
};

export function createVszIndoorMapTool(httpClient: VszHttpClient): ToolDefinition {
  return createDomainTool(
    {
      name: 'vsz_indoor_map',
      description:
        'Ruckus vSZ indoor mapping and location services. Manage indoor maps, ' +
        'LBS profiles, and RTLS profiles.',
      actions,
    },
    httpClient,
  );
}
