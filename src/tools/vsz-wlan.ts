/**
 * vsz_wlan Tool
 *
 * WLAN management: WLANs, WLAN groups, WLAN schedulers,
 * Hotspot 2.0 WLAN services, and Wi-Fi calling policies.
 *
 * Source: docs/openapi-parsed-endpoints.md (WLAN, WLAN Group,
 *   WLAN Scheduler, Hotspot20 WLAN Service, Wi-Fi Calling Policy)
 */

import type { VszHttpClient } from '../http/client.js';
import type { ToolDefinition, ActionDefinition } from './base-tool.js';
import { createDomainTool } from './base-tool.js';

const actions: Record<string, ActionDefinition> = {
  // ── WLAN ───────────────────────────────────────────────────
  query_wlans: {
    method: 'POST',
    path: '/query/wlan',
    description: 'Query WLANs with specified filters.',
  },
  list_wlans: {
    method: 'GET',
    path: '/rkszones/{parentId}/wlans',
    description: 'Retrieve a list of WLANs within a zone (parentId=zoneId).',
  },
  create_wlan: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlans',
    description: 'Create a new standard, open and non-tunneled basic WLAN (parentId=zoneId).',
  },
  get_wlan: {
    method: 'GET',
    path: '/rkszones/{parentId}/wlans/{id}',
    description: 'Retrieve a WLAN (parentId=zoneId).',
  },
  replace_wlan: {
    method: 'PUT',
    path: '/rkszones/{parentId}/wlans/{id}',
    description: 'Modify entire information of a WLAN (parentId=zoneId).',
  },
  delete_wlan: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/wlans/{id}',
    description: 'Delete a WLAN (parentId=zoneId).',
  },
  update_wlan: {
    method: 'PATCH',
    path: '/rkszones/{parentId}/wlans/{id}',
    description: 'Modify the configuration of a WLAN (parentId=zoneId).',
  },
  delete_wlan_accounting: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/wlans/{id}/accountingServiceOrProfile',
    description: 'Disable accounting of a WLAN (parentId=zoneId).',
  },
  delete_wlan_device_policy: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/wlans/{id}/devicePolicy',
    description: 'Disable device policy of a WLAN (parentId=zoneId).',
  },
  delete_wlan_diffserv: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/wlans/{id}/diffServProfile',
    description: 'Disable DiffServ profile of a WLAN (parentId=zoneId).',
  },
  delete_wlan_dns_profile: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/wlans/{id}/dnsServerProfile',
    description: 'Disable DNS server profile of a WLAN (parentId=zoneId).',
  },
  delete_wlan_l2acl: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/wlans/{id}/l2ACL',
    description: 'Disable L2 access control list of a WLAN (parentId=zoneId).',
  },
  enable_wlan_qos_maps: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlans/{id}/qosMaps',
    description: 'Enable QoS Map Set of a WLAN (parentId=zoneId).',
  },
  delete_wlan_qos_maps: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/wlans/{id}/qosMaps',
    description: 'Disable QoS Map Set of a WLAN (parentId=zoneId).',
  },
  create_wlan_guest: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlans/guest',
    description: 'Create a new guest access WLAN (parentId=zoneId).',
  },
  create_wlan_hotspot20: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlans/hotspot20',
    description: 'Create a new Hotspot 2.0 access WLAN (parentId=zoneId).',
  },
  create_wlan_hotspot20open: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlans/hotspot20open',
    description: 'Create a new Hotspot 2.0 onboarding WLAN with open auth (parentId=zoneId).',
  },
  create_wlan_hotspot20osen: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlans/hotspot20osen',
    description: 'Create a new Hotspot 2.0 onboarding WLAN with OSEN auth (parentId=zoneId).',
  },
  create_wlan_8021x: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlans/standard8021X',
    description: 'Create a new standard 802.1X and non-tunneled WLAN (parentId=zoneId).',
  },
  create_wlan_8021x_mac: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlans/standard8021Xmac',
    description: 'Create a new standard 802.1X with MAC address WLAN (parentId=zoneId).',
  },
  create_wlan_mac: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlans/standardmac',
    description: 'Create a new standard MAC auth and non-tunneled WLAN (parentId=zoneId).',
  },
  create_wlan_webauth: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlans/webauth',
    description: 'Create a new web authentication WLAN (parentId=zoneId).',
  },
  create_wlan_wechat: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlans/wechat',
    description: 'Create a new WeChat WLAN (parentId=zoneId).',
  },
  create_wlan_wispr: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlans/wispr',
    description: 'Create a new hotspot (WISPr) WLAN (parentId=zoneId).',
  },
  create_wlan_wispr_8021x: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlans/wispr8021X',
    description: 'Create a new hotspot (WISPr) with 802.1X WLAN (parentId=zoneId).',
  },
  create_wlan_wispr_mac: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlans/wisprmac',
    description: 'Create a new hotspot (WISPr) with MAC bypass WLAN (parentId=zoneId).',
  },

  // ── WLAN Group ─────────────────────────────────────────────
  list_wlan_groups: {
    method: 'GET',
    path: '/rkszones/{parentId}/wlangroups',
    description: 'Retrieve the list of WLAN groups within a zone (parentId=zoneId).',
  },
  create_wlan_group: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlangroups',
    description: 'Create a new WLAN group (parentId=zoneId).',
  },
  get_wlan_group: {
    method: 'GET',
    path: '/rkszones/{parentId}/wlangroups/{id}',
    description: 'Retrieve a WLAN group (parentId=zoneId).',
  },
  delete_wlan_group: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/wlangroups/{id}',
    description: 'Delete a WLAN group (parentId=zoneId).',
  },
  update_wlan_group: {
    method: 'PATCH',
    path: '/rkszones/{parentId}/wlangroups/{id}',
    description: 'Modify the configuration of a WLAN group (parentId=zoneId).',
  },
  add_wlan_group_member: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlangroups/{id}/members',
    description: 'Add a member to a WLAN group (parentId=zoneId).',
  },
  replace_wlan_group_member: {
    method: 'PUT',
    path: '/rkszones/{parentId}/wlangroups/{id}/members/{resource}',
    description: 'Replace entire member info of a WLAN group (parentId=zoneId, resource=memberId).',
  },
  delete_wlan_group_member: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/wlangroups/{id}/members/{resource}',
    description: 'Remove a member from a WLAN group (parentId=zoneId, resource=memberId).',
  },
  update_wlan_group_member: {
    method: 'PATCH',
    path: '/rkszones/{parentId}/wlangroups/{id}/members/{resource}',
    description: 'Modify a member of a WLAN group (parentId=zoneId, resource=memberId).',
  },
  delete_wlan_group_member_nasid: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/wlangroups/{id}/members/{resource}/nasId',
    description: 'Disable NAS-ID override of a WLAN group member (parentId=zoneId, resource=memberId).',
  },
  delete_wlan_group_member_vlan: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/wlangroups/{id}/members/{resource}/vlanOverride',
    description: 'Disable VLAN override of a WLAN group member (parentId=zoneId, resource=memberId).',
  },

  // ── WLAN Scheduler ────────────────────────────────────────
  query_wlan_schedulers: {
    method: 'POST',
    path: '/query/services/wlanScheduler',
    description: 'Query WLAN schedulers with specified filters.',
  },
  list_wlan_schedulers: {
    method: 'GET',
    path: '/rkszones/{parentId}/wlanSchedulers',
    description: 'Retrieve the list of WLAN schedules from a zone (parentId=zoneId).',
  },
  create_wlan_scheduler: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlanSchedulers',
    description: 'Create a new WLAN schedule (parentId=zoneId).',
  },
  get_wlan_scheduler: {
    method: 'GET',
    path: '/rkszones/{parentId}/wlanSchedulers/{id}',
    description: 'Retrieve a WLAN schedule (parentId=zoneId).',
  },
  delete_wlan_scheduler: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/wlanSchedulers/{id}',
    description: 'Delete a WLAN schedule (parentId=zoneId).',
  },
  update_wlan_scheduler: {
    method: 'PATCH',
    path: '/rkszones/{parentId}/wlanSchedulers/{id}',
    description: 'Modify the configuration of a WLAN schedule (parentId=zoneId).',
  },

  // ── Hotspot20 WLAN Service ────────────────────────────────
  query_hs20_wlan_services: {
    method: 'POST',
    path: '/query/services/hotspot20Profile',
    description: 'Query Hotspot 2.0 profiles with specified filters.',
  },
  list_hs20_wlan_services: {
    method: 'GET',
    path: '/rkszones/{parentId}/hs20s',
    description: 'Retrieve a list of Hotspot 2.0 WLAN profiles of a zone (parentId=zoneId).',
  },
  create_hs20_wlan_service: {
    method: 'POST',
    path: '/rkszones/{parentId}/hs20s',
    description: 'Create a new Hotspot 2.0 WLAN profile (parentId=zoneId).',
  },
  get_hs20_wlan_service: {
    method: 'GET',
    path: '/rkszones/{parentId}/hs20s/{id}',
    description: 'Retrieve a Hotspot 2.0 WLAN profile (parentId=zoneId).',
  },
  delete_hs20_wlan_service: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/hs20s/{id}',
    description: 'Delete a Hotspot 2.0 WLAN profile (parentId=zoneId).',
  },
  update_hs20_wlan_service: {
    method: 'PATCH',
    path: '/rkszones/{parentId}/hs20s/{id}',
    description: 'Modify the configuration of a Hotspot 2.0 WLAN profile (parentId=zoneId).',
  },

  // ── Wi-Fi Calling Policy ──────────────────────────────────
  query_wifi_calling: {
    method: 'POST',
    path: '/wifiCalling/query',
    description: 'Query Wi-Fi Calling policy list.',
  },
  list_wifi_calling: {
    method: 'GET',
    path: '/wifiCalling/wifiCallingPolicy',
    description: 'Retrieve list of Wi-Fi Calling policies.',
  },
  create_wifi_calling: {
    method: 'POST',
    path: '/wifiCalling/wifiCallingPolicy',
    description: 'Create a Wi-Fi Calling policy.',
  },
  delete_wifi_calling_bulk: {
    method: 'DELETE',
    path: '/wifiCalling/wifiCallingPolicy',
    description: 'Delete bulk Wi-Fi Calling policies.',
  },
  get_wifi_calling: {
    method: 'GET',
    path: '/wifiCalling/wifiCallingPolicy/{id}',
    description: 'Retrieve a Wi-Fi Calling policy.',
  },
  replace_wifi_calling: {
    method: 'PUT',
    path: '/wifiCalling/wifiCallingPolicy/{id}',
    description: 'Modify entire Wi-Fi Calling policy.',
  },
  delete_wifi_calling: {
    method: 'DELETE',
    path: '/wifiCalling/wifiCallingPolicy/{id}',
    description: 'Delete a Wi-Fi Calling policy by ID.',
  },
  update_wifi_calling: {
    method: 'PATCH',
    path: '/wifiCalling/wifiCallingPolicy/{id}',
    description: 'Modify a Wi-Fi Calling policy.',
  },
};

export function createVszWlanTool(httpClient: VszHttpClient): ToolDefinition {
  return createDomainTool(
    {
      name: 'vsz_wlan',
      description:
        'Ruckus vSZ WLAN management. Manage WLANs, WLAN groups, WLAN schedulers, ' +
        'Hotspot 2.0 WLAN services, and Wi-Fi calling policies.',
      actions,
    },
    httpClient,
  );
}
