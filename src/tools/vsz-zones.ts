/**
 * vsz_zones Tool
 *
 * Manages AP zones, domains, zone sub-resources (AAA, mesh, radio,
 * firmware), zone schedule upgrades, and zone switch group links.
 *
 * Source: docs/mcp-architecture.md, Section 4 (Tool Group 2) and Section 6
 * Source: docs/openapi-parsed-endpoints.md (Ruckus Wireless AP Zone, Domain,
 *   Zone AAA, Zone Schedule Upgrade, Zone Switch Group Link)
 */

import type { VszHttpClient } from '../http/client.js';
import type { ToolDefinition, ActionDefinition } from './base-tool.js';
import { createDomainTool } from './base-tool.js';

const actions: Record<string, ActionDefinition> = {
  // ── Zone CRUD ────────────────────────────────────────────────
  list: {
    method: 'GET',
    path: '/rkszones',
    description: 'List all AP zones.',
    paginatable: true,
  },
  get: {
    method: 'GET',
    path: '/rkszones/{id}',
    description: 'Get a specific zone by ID.',
  },
  create: {
    method: 'POST',
    path: '/rkszones',
    description: 'Create a new zone (standard IPv4).',
  },
  create_ipv6: {
    method: 'POST',
    path: '/rkszones/ipv6',
    description: 'Create a new zone (IPv6 only).',
  },
  create_dual: {
    method: 'POST',
    path: '/rkszones/dual',
    description: 'Create a new zone (IPv4/IPv6 dual-stack).',
  },
  update: {
    method: 'PATCH',
    path: '/rkszones/{id}',
    description: 'Modify zone configuration (partial update).',
  },
  replace: {
    method: 'PUT',
    path: '/rkszones/{id}',
    description: 'Replace entire zone configuration.',
  },
  delete: {
    method: 'DELETE',
    path: '/rkszones/{id}',
    description: 'Delete a zone.',
  },

  // ── Zone sub-resources (GET/DELETE) ──────────────────────────
  get_mesh: {
    method: 'GET',
    path: '/rkszones/{id}/mesh',
    description: 'Retrieve mesh configuration for a zone.',
  },
  delete_mesh: {
    method: 'DELETE',
    path: '/rkszones/{id}/mesh',
    description: 'Disable mesh networking for a zone.',
  },
  delete_altitude: {
    method: 'DELETE',
    path: '/rkszones/{id}/altitude',
    description: 'Disable altitude configuration for a zone.',
  },
  delete_syslog: {
    method: 'DELETE',
    path: '/rkszones/{id}/syslog',
    description: 'Disable syslog for APs in this zone.',
  },
  delete_snmp: {
    method: 'DELETE',
    path: '/rkszones/{id}/snmpAgent',
    description: 'Clear SNMP agent for a zone.',
  },
  delete_rogue: {
    method: 'DELETE',
    path: '/rkszones/{id}/rogue',
    description: 'Disable rogue AP detection for a zone.',
  },
  delete_smart_monitor: {
    method: 'DELETE',
    path: '/rkszones/{id}/smartMonitor',
    description: 'Disable smart monitor for a zone.',
  },
  delete_location_service: {
    method: 'DELETE',
    path: '/rkszones/{id}/locationBasedService',
    description: 'Disable location based service for a zone.',
  },
  delete_load_balancing: {
    method: 'DELETE',
    path: '/rkszones/{id}/loadBalancing',
    description: 'Disable overall load balancing for a zone.',
  },
  delete_timezone: {
    method: 'DELETE',
    path: '/rkszones/{id}/timezone',
    description: 'Reset zone timezone to system default.',
  },
  delete_venue_profile: {
    method: 'DELETE',
    path: '/rkszones/{id}/venueProfile',
    description: 'Clear Hotspot 2.0 venue profile for a zone.',
  },
  delete_recovery_ssid: {
    method: 'DELETE',
    path: '/rkszones/{id}/recoverySsid',
    description: 'Clear recovery SSID setting for a zone.',
  },
  delete_ipsec_profiles: {
    method: 'DELETE',
    path: '/rkszones/{id}/ipsecProfiles',
    description: 'Delete IPsec profiles for a zone.',
  },

  // ── AP firmware ──────────────────────────────────────────────
  get_firmware: {
    method: 'GET',
    path: '/rkszones/{id}/apFirmware',
    description: 'Get AP firmware list for a zone. Uses parentId as zoneId.',
  },
  update_firmware: {
    method: 'PUT',
    path: '/rkszones/{id}/apFirmware',
    description: 'Change AP firmware for a zone. Uses parentId as zoneId.',
  },

  // ── AP model config ──────────────────────────────────────────
  get_ap_model: {
    method: 'GET',
    path: '/rkszones/{parentId}/apmodel/{resource}',
    description: 'Get AP model-specific config. parentId=zoneId, resource=model name.',
  },
  update_ap_model: {
    method: 'PUT',
    path: '/rkszones/{parentId}/apmodel/{resource}',
    description: 'Modify AP model-specific config. parentId=zoneId, resource=model name.',
  },

  // ── Available profiles ───────────────────────────────────────
  list_available_ipsec: {
    method: 'GET',
    path: '/rkszones/{id}/availableIpsecProfiles',
    description: 'List available IPSec tunnel profiles for a zone.',
  },
  list_available_tunnels: {
    method: 'GET',
    path: '/rkszones/{id}/availableTunnelProfiles',
    description: 'List available GRE tunnel profiles for a zone.',
  },

  // ── Zone AAA ─────────────────────────────────────────────────
  list_aaa_radius: {
    method: 'GET',
    path: '/rkszones/{parentId}/aaa/radius',
    description: 'List RADIUS servers for a zone. parentId=zoneId.',
  },
  create_aaa_radius: {
    method: 'POST',
    path: '/rkszones/{parentId}/aaa/radius',
    description: 'Create a RADIUS server for a zone. parentId=zoneId.',
  },
  get_aaa_radius: {
    method: 'GET',
    path: '/rkszones/{parentId}/aaa/radius/{id}',
    description: 'Get a specific RADIUS server. parentId=zoneId.',
  },
  update_aaa_radius: {
    method: 'PATCH',
    path: '/rkszones/{parentId}/aaa/radius/{id}',
    description: 'Modify a RADIUS server. parentId=zoneId.',
  },
  delete_aaa_radius: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/aaa/radius/{id}',
    description: 'Delete a RADIUS server. parentId=zoneId.',
  },

  list_aaa_ad: {
    method: 'GET',
    path: '/rkszones/{parentId}/aaa/ad',
    description: 'List Active Directory servers for a zone. parentId=zoneId.',
  },
  create_aaa_ad: {
    method: 'POST',
    path: '/rkszones/{parentId}/aaa/ad',
    description: 'Create an Active Directory server for a zone. parentId=zoneId.',
  },
  get_aaa_ad: {
    method: 'GET',
    path: '/rkszones/{parentId}/aaa/ad/{id}',
    description: 'Get a specific Active Directory server. parentId=zoneId.',
  },
  update_aaa_ad: {
    method: 'PATCH',
    path: '/rkszones/{parentId}/aaa/ad/{id}',
    description: 'Modify an Active Directory server. parentId=zoneId.',
  },
  delete_aaa_ad: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/aaa/ad/{id}',
    description: 'Delete an Active Directory server. parentId=zoneId.',
  },

  list_aaa_ldap: {
    method: 'GET',
    path: '/rkszones/{parentId}/aaa/ldap',
    description: 'List LDAP servers for a zone. parentId=zoneId.',
  },
  create_aaa_ldap: {
    method: 'POST',
    path: '/rkszones/{parentId}/aaa/ldap',
    description: 'Create an LDAP server for a zone. parentId=zoneId.',
  },
  get_aaa_ldap: {
    method: 'GET',
    path: '/rkszones/{parentId}/aaa/ldap/{id}',
    description: 'Get a specific LDAP server. parentId=zoneId.',
  },
  update_aaa_ldap: {
    method: 'PATCH',
    path: '/rkszones/{parentId}/aaa/ldap/{id}',
    description: 'Modify an LDAP server. parentId=zoneId.',
  },
  delete_aaa_ldap: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/aaa/ldap/{id}',
    description: 'Delete an LDAP server. parentId=zoneId.',
  },

  delete_aaa_bulk: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/aaa',
    description: 'Delete a list of AAA servers for a zone. parentId=zoneId.',
  },

  // ── Zone WLANs (read-only from zone perspective) ─────────────
  list_wlans: {
    method: 'GET',
    path: '/rkszones/{parentId}/wlans',
    description: 'List WLANs within a zone. parentId=zoneId.',
    paginatable: true,
  },

  // ── Domains ──────────────────────────────────────────────────
  list_domains: {
    method: 'GET',
    path: '/domains',
    description: 'List domains under the Administration Domain.',
    paginatable: true,
  },
  get_domain: {
    method: 'GET',
    path: '/domains/{id}',
    description: 'Get a specific domain by ID.',
  },
  update_domain: {
    method: 'PATCH',
    path: '/domains/{id}',
    description: 'Modify domain configuration.',
  },
  get_domain_by_name: {
    method: 'GET',
    path: '/domains/byName/{resource}',
    description: 'Get a domain by name. resource=domain name.',
  },

  // ── Zone Schedule Upgrade ────────────────────────────────────
  list_schedule_upgrades: {
    method: 'GET',
    path: '/zoneScheduleUpgrade',
    description: 'List zone firmware schedule upgrade tasks.',
    paginatable: true,
  },
  create_schedule_upgrade: {
    method: 'POST',
    path: '/zoneScheduleUpgrade',
    description: 'Create a zone firmware schedule upgrade task.',
  },
  get_schedule_upgrade: {
    method: 'GET',
    path: '/zoneScheduleUpgrade/{id}',
    description: 'Get a specific schedule upgrade task.',
  },
  update_schedule_upgrade: {
    method: 'PUT',
    path: '/zoneScheduleUpgrade/{id}',
    description: 'Modify a schedule upgrade task.',
  },
  delete_schedule_upgrade: {
    method: 'DELETE',
    path: '/zoneScheduleUpgrade/{id}',
    description: 'Delete a schedule upgrade task.',
  },
  list_schedule_upgrade_history: {
    method: 'GET',
    path: '/zoneScheduleUpgrade/history',
    description: 'Get zone firmware schedule upgrade history.',
  },

  // ── Zone Switch Group Link ───────────────────────────────────
  list_switch_group_links: {
    method: 'GET',
    path: '/zoneSwitchGroupLinks',
    description: 'List zone switch group link relations.',
    paginatable: true,
  },
  create_switch_group_link: {
    method: 'POST',
    path: '/zoneSwitchGroupLinks',
    description: 'Create a zone switch group link relation.',
  },
  get_switch_group_link: {
    method: 'GET',
    path: '/zoneSwitchGroupLinks/{id}',
    description: 'Get a specific zone switch group link relation.',
  },
  update_switch_group_link: {
    method: 'PUT',
    path: '/zoneSwitchGroupLinks/{id}',
    description: 'Update a zone switch group link relation.',
  },
  delete_switch_group_link: {
    method: 'DELETE',
    path: '/zoneSwitchGroupLinks/{id}',
    description: 'Delete a zone switch group link relation.',
  },
};

export function createVszZonesTool(httpClient: VszHttpClient): ToolDefinition {
  return createDomainTool(
    {
      name: 'vsz_zones',
      description:
        'Ruckus vSZ zone management. Manage AP zones, domains, zone AAA ' +
        '(RADIUS/AD/LDAP), zone sub-resources (mesh, radio, firmware), ' +
        'schedule upgrades, and switch group links.',
      actions,
    },
    httpClient,
  );
}
