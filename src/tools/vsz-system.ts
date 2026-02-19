/**
 * vsz_system Tool
 *
 * System administration: controller info, system settings, syslog,
 * SNMP, FTP, SCI, LWAPP, licensing, application logs, and more.
 *
 * Source: docs/mcp-architecture.md, Section 4 (Tool Group 11)
 * Source: docs/openapi-parsed-endpoints.md (System, Syslog Server, SNMP Agent,
 *   FtpServerSettings, Application Log And Status, SCI, LWAPP TO SCG,
 *   Administration, Global reference, Northbound Data Streaming, GDPR, ZDImport)
 */

import type { VszHttpClient } from '../http/client.js';
import type { ToolDefinition, ActionDefinition } from './base-tool.js';
import { createDomainTool } from './base-tool.js';

const actions: Record<string, ActionDefinition> = {
  // ── System core ──────────────────────────────────────────────
  get_controller: {
    method: 'GET',
    path: '/controller',
    description: 'Retrieve system summary (controller info).',
  },
  get_controller_stats: {
    method: 'GET',
    path: '/controller/{id}/statistics',
    description: 'Retrieve system statistics for a controller node.',
  },
  get_system: {
    method: 'GET',
    path: '/system',
    description: 'Retrieve system settings.',
  },
  update_system: {
    method: 'PATCH',
    path: '/system',
    description: 'Modify system settings.',
  },
  get_inventory: {
    method: 'GET',
    path: '/system/inventory',
    description: 'Retrieve the system inventory for current domain.',
  },
  get_devices_summary: {
    method: 'GET',
    path: '/system/devicesSummary',
    description: 'Retrieve devices summary.',
  },

  // ── System time ──────────────────────────────────────────────
  get_system_time: {
    method: 'GET',
    path: '/system/systemTime',
    description: 'Retrieve system time settings.',
  },
  update_system_time: {
    method: 'PATCH',
    path: '/system/systemTime',
    description: 'Modify system time settings.',
  },
  validate_ntp: {
    method: 'POST',
    path: '/globalSettings/systemTime/validate',
    description: 'Validate an NTP server.',
  },

  // ── Security settings ────────────────────────────────────────
  get_security_setting: {
    method: 'GET',
    path: '/system/securitySetting',
    description: 'Retrieve system security settings.',
  },
  update_security_setting: {
    method: 'PUT',
    path: '/system/securitySetting',
    description: 'Modify system security settings.',
  },

  // ── AP settings ──────────────────────────────────────────────
  get_ap_approval: {
    method: 'GET',
    path: '/system/apSettings/approval',
    description: 'Retrieve AP auto-approve policy.',
  },
  update_ap_approval: {
    method: 'PATCH',
    path: '/system/apSettings/approval',
    description: 'Modify AP auto-approve policy.',
  },
  list_ap_models: {
    method: 'GET',
    path: '/system/apmodels',
    description: 'List supported AP models for the current firmware.',
  },
  list_ap_mac_ouis: {
    method: 'GET',
    path: '/system/apMacOUIs',
    description: 'List AP MAC OUI entries.',
  },

  // ── Cloud options ────────────────────────────────────────────
  get_cloud_options: {
    method: 'GET',
    path: '/system/cloudOptions',
    description: 'Retrieve SZ Cloud Options settings.',
  },
  update_cloud_options: {
    method: 'PUT',
    path: '/system/cloudOptions',
    description: 'Modify SZ Cloud Options settings.',
  },

  // ── Common Access Card ───────────────────────────────────────
  get_cac_settings: {
    method: 'GET',
    path: '/system/commonAccessCardSettings',
    description: 'Retrieve common access card (CAC) settings.',
  },
  update_cac_settings: {
    method: 'PUT',
    path: '/system/commonAccessCardSettings',
    description: 'Modify common access card (CAC) settings.',
  },

  // ── NBI (Northbound Portal Interface) ────────────────────────
  get_nbi: {
    method: 'GET',
    path: '/system/nbi',
    description: 'Retrieve Northbound Portal Interface user info.',
  },
  update_nbi: {
    method: 'PATCH',
    path: '/system/nbi',
    description: 'Modify Northbound Portal Interface settings.',
  },
  delete_nbi: {
    method: 'DELETE',
    path: '/system/nbi',
    description: 'Disable Northbound Portal Interface.',
  },

  // ── AP balance ───────────────────────────────────────────────
  ap_balance: {
    method: 'POST',
    path: '/system/ap_balance',
    description: 'Execute AP balance across cluster.',
  },

  // ── Syslog ───────────────────────────────────────────────────
  get_syslog: {
    method: 'GET',
    path: '/system/syslog',
    description: 'Retrieve syslog server settings.',
  },
  update_syslog: {
    method: 'PATCH',
    path: '/system/syslog',
    description: 'Modify syslog server settings.',
  },
  update_syslog_primary: {
    method: 'PATCH',
    path: '/system/syslog/primaryServer',
    description: 'Modify syslog primary server.',
  },
  update_syslog_priority: {
    method: 'PATCH',
    path: '/system/syslog/priority',
    description: 'Modify syslog priority settings.',
  },

  // ── SNMP ─────────────────────────────────────────────────────
  get_snmp: {
    method: 'GET',
    path: '/system/snmpAgent',
    description: 'Retrieve SNMP agent settings.',
  },
  update_snmp: {
    method: 'PUT',
    path: '/system/snmpAgent',
    description: 'Modify SNMP agent settings.',
  },

  // ── FTP ──────────────────────────────────────────────────────
  create_ftp: {
    method: 'POST',
    path: '/ftps',
    description: 'Add an FTP server.',
  },
  get_ftp: {
    method: 'GET',
    path: '/ftps/{id}',
    description: 'Retrieve a specific FTP server.',
  },
  update_ftp: {
    method: 'PATCH',
    path: '/ftps/{id}',
    description: 'Update FTP server settings.',
  },
  delete_ftp: {
    method: 'DELETE',
    path: '/ftps/{id}',
    description: 'Remove an FTP server.',
  },
  query_ftp: {
    method: 'POST',
    path: '/ftps/query',
    description: 'Query FTP servers.',
  },

  // ── SCI ──────────────────────────────────────────────────────
  update_sci_enabled: {
    method: 'PATCH',
    path: '/sci/sciEnabled',
    description: 'Enable or disable SCI.',
  },
  list_sci_profiles: {
    method: 'GET',
    path: '/sci/sciProfile',
    description: 'List SCI profiles.',
  },
  create_sci_profile: {
    method: 'POST',
    path: '/sci/sciProfile',
    description: 'Create an SCI profile.',
  },
  get_sci_profile: {
    method: 'GET',
    path: '/sci/sciProfile/{id}',
    description: 'Retrieve an SCI profile.',
  },
  update_sci_profile: {
    method: 'PATCH',
    path: '/sci/sciProfile/{id}',
    description: 'Modify an SCI profile.',
  },
  delete_sci_profile: {
    method: 'DELETE',
    path: '/sci/sciProfile/{id}',
    description: 'Delete an SCI profile.',
  },
  get_sci_event_codes: {
    method: 'GET',
    path: '/sci/sciEventCode',
    description: 'Retrieve SCI accepted event codes.',
  },
  update_sci_event_codes: {
    method: 'POST',
    path: '/sci/sciEventCode',
    description: 'Modify SCI accepted event codes.',
  },

  // ── LWAPP ────────────────────────────────────────────────────
  get_lwapp: {
    method: 'GET',
    path: '/lwapp2scg',
    description: 'Retrieve LWAPP-to-SCG config.',
  },
  update_lwapp: {
    method: 'PATCH',
    path: '/lwapp2scg',
    description: 'Modify LWAPP-to-SCG basic info.',
  },
  update_lwapp_ap_list: {
    method: 'PATCH',
    path: '/lwapp2scg/apList',
    description: 'Modify LWAPP-to-SCG AP list.',
  },

  // ── Application logs ────────────────────────────────────────
  update_app_log_level: {
    method: 'PATCH',
    path: '/applications',
    description: 'Modify log level of an application.',
  },
  list_app_logs: {
    method: 'GET',
    path: '/applications/{id}',
    description: 'List application log and status for a blade.',
  },

  // ── Licensing ────────────────────────────────────────────────
  list_licenses: {
    method: 'GET',
    path: '/licenses',
    description: 'List all licenses assigned to this controller.',
  },
  sync_licenses: {
    method: 'PUT',
    path: '/licenses/sync',
    description: 'Sync licenses from the license server.',
  },
  get_license_server: {
    method: 'GET',
    path: '/licenseServer',
    description: 'Retrieve license server configuration.',
  },
  update_license_server: {
    method: 'PUT',
    path: '/licenseServer',
    description: 'Update license server configuration.',
  },
  get_licenses_summary: {
    method: 'GET',
    path: '/licensesSummary',
    description: 'Retrieve licenses summary.',
  },
  list_license_sync_logs: {
    method: 'GET',
    path: '/licensesSyncLogs',
    description: 'Retrieve license sync logs.',
  },

  // ── Admin AAA ────────────────────────────────────────────────
  list_admin_aaa: {
    method: 'GET',
    path: '/adminaaa',
    description: 'List Admin AAA servers.',
    paginatable: true,
  },
  create_admin_aaa: {
    method: 'POST',
    path: '/adminaaa',
    description: 'Create an Admin AAA server.',
  },
  get_admin_aaa: {
    method: 'GET',
    path: '/adminaaa/{id}',
    description: 'Retrieve an Admin AAA server.',
  },
  update_admin_aaa: {
    method: 'PUT',
    path: '/adminaaa/{id}',
    description: 'Modify an Admin AAA server.',
  },
  delete_admin_aaa: {
    method: 'DELETE',
    path: '/adminaaa/{id}',
    description: 'Delete an Admin AAA server.',
  },

  // ── Northbound Data Streaming ────────────────────────────────
  list_nds_profiles: {
    method: 'GET',
    path: '/northboundDataStreamingProfileList',
    description: 'List Northbound Data Streaming profiles.',
  },
  create_nds_profile: {
    method: 'POST',
    path: '/northboundDataStreamingProfile',
    description: 'Create a Northbound Data Streaming profile.',
  },
  get_nds_profile: {
    method: 'GET',
    path: '/northboundDataStreamingProfile/{id}',
    description: 'Retrieve a Northbound Data Streaming profile.',
  },
  update_nds_profile: {
    method: 'PUT',
    path: '/northboundDataStreamingProfile/{id}',
    description: 'Update a Northbound Data Streaming profile.',
  },
  delete_nds_profile: {
    method: 'DELETE',
    path: '/northboundDataStreamingProfile/{id}',
    description: 'Delete a Northbound Data Streaming profile.',
  },
  get_nds_event_codes: {
    method: 'GET',
    path: '/northboundDataStreamingEventCodes',
    description: 'Retrieve Northbound Data Streaming event codes.',
  },
  update_nds_event_codes: {
    method: 'PUT',
    path: '/northboundDataStreamingEventCodes',
    description: 'Modify Northbound Data Streaming event codes.',
  },
  update_nds_settings: {
    method: 'PUT',
    path: '/northboundDataStreamingSettings',
    description: 'Modify Northbound Data Streaming settings.',
  },

  // ── Global reference ─────────────────────────────────────────
  get_friendly_name_langs: {
    method: 'GET',
    path: '/globalSettings/friendlyNameLang',
    description: 'Get friendly name languages (Hotspot profiles).',
  },
  get_portal_langs: {
    method: 'GET',
    path: '/globalSettings/portalLang',
    description: 'Get portal languages (Guest Access profiles).',
  },

  // ── GDPR ─────────────────────────────────────────────────────
  gdpr_report: {
    method: 'POST',
    path: '/gdpr/report',
    description: 'Execute a client-related GDPR data search or delete task.',
  },

  // ── Controller lifecycle ─────────────────────────────────────
  restart_controller: {
    method: 'POST',
    path: '/restart',
    description: 'Restart the controller.',
  },
  shutdown_controller: {
    method: 'POST',
    path: '/shutdown',
    description: 'Shut down the controller.',
  },

  // ── Session management ───────────────────────────────────────
  list_sessions: {
    method: 'GET',
    path: '/sessionManagement',
    description: 'Retrieve current logon sessions.',
  },

  // ── AAA test ─────────────────────────────────────────────────
  test_aaa: {
    method: 'POST',
    path: '/system/aaa/test',
    description: 'Test an AAA server.',
  },
};

export function createVszSystemTool(httpClient: VszHttpClient): ToolDefinition {
  return createDomainTool(
    {
      name: 'vsz_system',
      description:
        'Ruckus vSZ system administration. Manage controller settings, ' +
        'syslog, SNMP, FTP, SCI, LWAPP, licensing, application logs, ' +
        'Northbound Data Streaming, Admin AAA, and more.',
      actions,
    },
    httpClient,
  );
}
