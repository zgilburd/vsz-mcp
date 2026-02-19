/**
 * vsz_client Tool
 *
 * Client management: blocked clients, client isolation whitelists,
 * wired clients, wireless clients, and rogue client detection.
 *
 * Source: docs/openapi-parsed-endpoints.md (Block Client,
 *   Client Isolation Whitelist, Rogue Client, Wired Client, Wireless Client)
 */

import type { VszHttpClient } from '../http/client.js';
import type { ToolDefinition, ActionDefinition } from './base-tool.js';
import { createDomainTool } from './base-tool.js';

const actions: Record<string, ActionDefinition> = {
  // ── Block Client ───────────────────────────────────────────
  create_block_clients: {
    method: 'POST',
    path: '/blockClient',
    description: 'Create new block clients by list.',
  },
  delete_block_clients_bulk: {
    method: 'DELETE',
    path: '/blockClient',
    description: 'Delete block client list.',
  },
  get_block_client: {
    method: 'GET',
    path: '/blockClient/{id}',
    description: 'Retrieve a block client.',
  },
  replace_block_client: {
    method: 'PUT',
    path: '/blockClient/{id}',
    description: 'Modify a specific block client (full replace).',
  },
  delete_block_client: {
    method: 'DELETE',
    path: '/blockClient/{id}',
    description: 'Delete a block client.',
  },
  update_block_client: {
    method: 'PATCH',
    path: '/blockClient/{id}',
    description: 'Modify a specific block client (partial update).',
  },
  create_block_client_by_ap: {
    method: 'POST',
    path: '/blockClient/byApMac/{id}',
    description: 'Create a new block client by AP MAC (id=apMac).',
  },
  list_block_clients_by_zone: {
    method: 'GET',
    path: '/blockClient/byZone/{id}',
    description: 'Retrieve a list of block clients by zone (id=zoneId).',
  },
  create_block_client_by_zone: {
    method: 'POST',
    path: '/blockClient/byZoneId/{id}',
    description: 'Create a new block client by zone ID (id=zoneId).',
  },
  query_block_clients: {
    method: 'POST',
    path: '/blockClient/query',
    description: 'Retrieve a list of block clients by query criteria.',
  },

  // ── Client Isolation Whitelist ─────────────────────────────
  query_isolation_whitelist: {
    method: 'POST',
    path: '/query/services/clientIsolationWhitelist',
    description: 'Retrieve a list of client isolation whitelists by query.',
  },
  list_isolation_whitelist: {
    method: 'GET',
    path: '/rkszones/{parentId}/clientIsolationWhitelist',
    description: 'Retrieve a list of client isolation whitelists (parentId=zoneId).',
  },
  create_isolation_whitelist: {
    method: 'POST',
    path: '/rkszones/{parentId}/clientIsolationWhitelist',
    description: 'Create a new client isolation whitelist (parentId=zoneId).',
  },
  get_isolation_whitelist: {
    method: 'GET',
    path: '/rkszones/{parentId}/clientIsolationWhitelist/{id}',
    description: 'Retrieve a client isolation whitelist (parentId=zoneId).',
  },
  update_isolation_whitelist: {
    method: 'PATCH',
    path: '/rkszones/{parentId}/clientIsolationWhitelist/{id}',
    description: 'Modify a client isolation whitelist (parentId=zoneId).',
  },
  delete_isolation_whitelist_bulk: {
    method: 'DELETE',
    path: '/rkszones/clientIsolationWhitelist',
    description: 'Delete bulk client isolation whitelists.',
  },
  delete_isolation_whitelist: {
    method: 'DELETE',
    path: '/rkszones/clientIsolationWhitelist/{id}',
    description: 'Delete a client isolation whitelist.',
  },

  // ── Rogue Client ───────────────────────────────────────────
  query_rogue_clients: {
    method: 'POST',
    path: '/rogueclients/query',
    description: 'Retrieve a list of rogue clients.',
  },

  // ── Wired Client ───────────────────────────────────────────
  query_wired_clients: {
    method: 'POST',
    path: '/query/wiredclient',
    description: 'Query wired clients with specified filters.',
  },
  bulk_deauth_wired: {
    method: 'POST',
    path: '/wiredClients/bulkDeauth',
    description: 'Bulk deauthenticate wired clients.',
  },
  deauth_wired: {
    method: 'POST',
    path: '/wiredClients/deauth',
    description: 'Deauthenticate a wired client.',
  },

  // ── Wireless Client ────────────────────────────────────────
  get_ap_client_count: {
    method: 'GET',
    path: '/aps/{id}/operational/client/totalCount',
    description: 'Retrieve total client count per AP (id=apMac).',
  },
  bulk_deauth_wireless: {
    method: 'POST',
    path: '/clients/bulkDeauth',
    description: 'Bulk deauthenticate wireless clients.',
  },
  bulk_disconnect_wireless: {
    method: 'POST',
    path: '/clients/bulkDisconnect',
    description: 'Bulk disconnect wireless clients.',
  },
  query_clients_by_wlan: {
    method: 'POST',
    path: '/clients/byWlanName/{id}',
    description: 'Query clients by WLAN name (id=wlanName).',
  },
  deauth_wireless: {
    method: 'POST',
    path: '/clients/deauth',
    description: 'Deauthenticate a wireless client.',
  },
  disconnect_wireless: {
    method: 'POST',
    path: '/clients/disconnect',
    description: 'Disconnect a wireless client.',
  },
  query_wireless_clients: {
    method: 'POST',
    path: '/query/client',
    description: 'Query wireless clients with specified filters.',
  },
  query_historical_clients: {
    method: 'POST',
    path: '/query/historicalclient',
    description: 'Retrieve historical wireless clients.',
  },
};

export function createVszClientTool(httpClient: VszHttpClient): ToolDefinition {
  return createDomainTool(
    {
      name: 'vsz_client',
      description:
        'Ruckus vSZ client management. Manage blocked clients, client isolation whitelists, ' +
        'wireless/wired clients, and rogue client detection.',
      actions,
    },
    httpClient,
  );
}
