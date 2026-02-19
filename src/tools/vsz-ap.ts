/**
 * vsz_ap Tool
 *
 * Access point management: AP CRUD, AP overrides, radio config,
 * AP groups, AP operational data, AP registration rules,
 * AP syslog profiles, and AP SNMP agent profiles.
 *
 * Source: docs/openapi-parsed-endpoints.md (Access Point APP,
 *   Access Point Configuration, Access Point Operational,
 *   AP External Syslog Server Profile, AP Group,
 *   AP Registration Rules, AP SNMP Agent Profile)
 */

import type { VszHttpClient } from '../http/client.js';
import type { ToolDefinition, ActionDefinition } from './base-tool.js';
import { createDomainTool } from './base-tool.js';

const actions: Record<string, ActionDefinition> = {
  // ── AP CRUD ────────────────────────────────────────────────
  list_aps: {
    method: 'GET', path: '/aps',
    description: 'List APs in a zone or domain.', paginatable: true,
  },
  create_ap: {
    method: 'POST', path: '/aps',
    description: 'Create a new access point.',
  },
  get_ap: {
    method: 'GET', path: '/aps/{id}',
    description: 'Retrieve AP configuration. id=apMac.',
  },
  replace_ap: {
    method: 'PUT', path: '/aps/{id}',
    description: 'Replace entire AP configuration. id=apMac.',
  },
  delete_ap: {
    method: 'DELETE', path: '/aps/{id}',
    description: 'Delete an access point. id=apMac.',
  },
  update_ap: {
    method: 'PATCH', path: '/aps/{id}',
    description: 'Modify AP configuration (partial). id=apMac.',
  },
  // ── AP overrides (grouped DELETE) ──────────────────────────
  clear_ap_override: {
    method: 'DELETE', path: '/aps/{id}/{resource}',
    description: 'Clear an AP-level override. id=apMac. resource=altitude|apMgmtVlan|bonjourGateway|channelEvaluationInterval|clientAdmissionControl24|clientAdmissionControl50|directedMulticastFromNetworkEnabled|directedMulticastFromWiredClientEnabled|directedMulticastFromWirelessClientEnabled|gpsCoordinates|location|locationAdditionalInfo|login|lteBandLockChannels|meshOptions|picture|recoverySsid|rksGreForwardBroadcast|rogueApAggressivenessMode|rogueApJammingThreshold|rogueApReportThreshold|smartMonitor|specific|syslog|venueProfile',
  },
  // ── AP picture ─────────────────────────────────────────────
  get_ap_picture: {
    method: 'GET', path: '/aps/{id}/picture',
    description: 'Retrieve the current AP picture. id=apMac.',
  },
  upload_ap_picture: {
    method: 'POST', path: '/aps/{id}/picture',
    description: 'Upload a new AP picture. id=apMac.',
  },
  // ── AP specific config ─────────────────────────────────────
  update_ap_specific: {
    method: 'PUT', path: '/aps/{id}/specific',
    description: 'Modify AP-specific configuration. id=apMac.',
  },
  // ── AP radio config (all bands via resource) ───────────────
  clear_ap_radio_band: {
    method: 'DELETE', path: '/aps/{id}/radioConfig/{resource}',
    description: 'Clear entire radio band override. id=apMac. resource=radio24g|radio5g|radio5gLower|radio5gUpper|radio6g',
  },
  clear_ap_radio24g_setting: {
    method: 'DELETE', path: '/aps/{id}/radioConfig/radio24g/{resource}',
    description: 'Clear 2.4GHz radio setting. id=apMac. resource=autoChannelSelection|channel|channelRange|channelWidth|protectionMode|txPower|wlanGroupId',
  },
  clear_ap_radio5g_setting: {
    method: 'DELETE', path: '/aps/{id}/radioConfig/radio5g/{resource}',
    description: 'Clear 5GHz radio setting. id=apMac. resource=autoChannelSelection|channel|channelRange|channelWidth|txPower|wlanGroupId',
  },
  clear_ap_radio5g_lower_setting: {
    method: 'DELETE', path: '/aps/{id}/radioConfig/radio5gLower/{resource}',
    description: 'Clear lower 5GHz radio setting. id=apMac. resource=autoChannelSelection|channel|channelRange|channelWidth|txPower|wlanGroupId',
  },
  clear_ap_radio5g_upper_setting: {
    method: 'DELETE', path: '/aps/{id}/radioConfig/radio5gUpper/{resource}',
    description: 'Clear upper 5GHz radio setting. id=apMac. resource=autoChannelSelection|channel|channelRange|channelWidth|txPower|wlanGroupId',
  },
  clear_ap_radio6g_setting: {
    method: 'DELETE', path: '/aps/{id}/radioConfig/radio6g/{resource}',
    description: 'Clear 6GHz radio setting. id=apMac. resource=autoChannelSelection|bssMinRate|channel|channelRange|channelWidth|mgmtTxRate|multicastDownlinkRateLimit|multicastUplinkRateLimit|txPower|wlanGroupId',
  },
  // ── AP actions ─────────────────────────────────────────────
  reboot_ap: {
    method: 'PUT', path: '/aps/{id}/reboot',
    description: 'Reboot an access point. id=apMac.', hasBody: false,
  },
  reboot_cable_modem: {
    method: 'PUT', path: '/aps/{id}/rebootCableModem',
    description: 'Reboot the cable modem on an AP. id=apMac.', hasBody: false,
  },
  reset_cable_modem: {
    method: 'POST', path: '/aps/{id}/resetCableModem',
    description: 'Reset the cable modem on an AP. id=apMac.', hasBody: false,
  },
  get_ap_support_log: {
    method: 'GET', path: '/aps/{id}/supportLog',
    description: 'Download AP support log. id=apMac.',
  },
  move_aps: {
    method: 'POST', path: '/aps/move',
    description: 'Move multiple APs to another Zone/AP Group.',
  },
  sync_aps_to_cloud: {
    method: 'POST', path: '/aps/syncProvisionApsToCloudService',
    description: 'Sync provision APs to Cloud Service.', hasBody: false,
  },
  swap_aps: {
    method: 'POST', path: '/swapAps',
    description: 'Swap in a specific AP.',
  },
  // ── AP APP (lineman/workflow) ──────────────────────────────
  get_ap_lineman: {
    method: 'GET', path: '/aps/lineman',
    description: 'Retrieve AP summary information (lineman).',
  },
  get_ap_total_count: {
    method: 'GET', path: '/aps/totalCount',
    description: 'Retrieve total AP count within a zone or domain.',
  },
  get_lineman_workflow: {
    method: 'GET', path: '/lineman/workflow',
    description: 'Download the AP lineman workflow file.',
  },
  update_lineman_workflow: {
    method: 'PUT', path: '/lineman/workflow',
    description: 'Upload an AP lineman workflow file.',
  },
  // ── Mesh zero-touch ────────────────────────────────────────
  list_mesh_zero_touch: {
    method: 'GET', path: '/mesh/zeroTouch',
    description: 'Retrieve a list of unapproved mesh APs.',
  },
  update_mesh_zero_touch: {
    method: 'PUT', path: '/mesh/zeroTouch',
    description: 'Approve or reject unapproved mesh APs.',
  },
  // ── AP Operational ─────────────────────────────────────────
  get_ap_packet_capture: {
    method: 'GET', path: '/aps/{id}/apPacketCapture',
    description: 'Get AP packet capture status. id=apMac.',
  },
  download_ap_packet_capture: {
    method: 'POST', path: '/aps/{id}/apPacketCapture/download',
    description: 'Download AP packet capture file. id=apMac.', hasBody: false,
  },
  start_ap_file_capture: {
    method: 'POST', path: '/aps/{id}/apPacketCapture/startFileCapture',
    description: 'Start AP packet file capture. id=apMac.',
  },
  start_ap_streaming: {
    method: 'POST', path: '/aps/{id}/apPacketCapture/startStreaming',
    description: 'Start AP packet streaming. id=apMac.',
  },
  stop_ap_packet_capture: {
    method: 'POST', path: '/aps/{id}/apPacketCapture/stop',
    description: 'Stop AP packet capture or streaming. id=apMac.', hasBody: false,
  },
  blink_ap_led: {
    method: 'POST', path: '/aps/{id}/operational/blinkLed',
    description: 'Blink an AP LED to show its position. id=apMac.', hasBody: false,
  },
  get_ap_neighbor: {
    method: 'GET', path: '/aps/{id}/operational/neighbor',
    description: 'Retrieve neighbor APs on a mesh AP. id=apMac.',
  },
  get_ap_operational_summary: {
    method: 'GET', path: '/aps/{id}/operational/summary',
    description: 'Retrieve detailed AP status and configuration. id=apMac.',
  },
  switchover_aps_cluster: {
    method: 'POST', path: '/aps/switchoverCluster',
    description: 'Switchover APs to another cluster.',
  },
  query_aps: {
    method: 'POST', path: '/query/ap',
    description: 'Query APs with specified filters.',
  },
  query_ap_wlan: {
    method: 'POST', path: '/query/ap/wlan',
    description: 'Retrieve AP WLAN list with BSSID information.',
  },
  query_indoor_map: {
    method: 'POST', path: '/query/indoorMap',
    description: 'Query indoor maps with specified filters.',
  },
  query_mesh_neighbor: {
    method: 'POST', path: '/query/mesh/{id}/neighbor',
    description: 'Query neighbor APs on a mesh AP. id=apMac.',
  },
  query_mesh_ap_topology: {
    method: 'POST', path: '/query/mesh/{id}/topology',
    description: 'Query topology on a mesh AP. id=apMac.',
  },
  query_mesh_zone_topology: {
    method: 'POST', path: '/query/mesh/topology',
    description: 'Query mesh topology on a zone.',
  },
  query_rogues: {
    method: 'POST', path: '/query/roguesInfoList',
    description: 'Retrieve a list of rogue access points.',
  },
  // ── AP Group CRUD ──────────────────────────────────────────
  list_ap_groups: {
    method: 'GET', path: '/rkszones/{parentId}/apgroups',
    description: 'List AP groups in a zone. parentId=zoneId.', paginatable: true,
  },
  create_ap_group: {
    method: 'POST', path: '/rkszones/{parentId}/apgroups',
    description: 'Create a new AP group in a zone. parentId=zoneId.',
  },
  get_ap_group: {
    method: 'GET', path: '/rkszones/{parentId}/apgroups/{id}',
    description: 'Retrieve AP group info. parentId=zoneId.',
  },
  replace_ap_group: {
    method: 'PUT', path: '/rkszones/{parentId}/apgroups/{id}',
    description: 'Replace entire AP group config. parentId=zoneId.',
  },
  delete_ap_group: {
    method: 'DELETE', path: '/rkszones/{parentId}/apgroups/{id}',
    description: 'Delete an AP group. parentId=zoneId.',
  },
  update_ap_group: {
    method: 'PATCH', path: '/rkszones/{parentId}/apgroups/{id}',
    description: 'Modify AP group configuration (partial). parentId=zoneId.',
  },
  get_default_ap_group: {
    method: 'GET', path: '/rkszones/{parentId}/apgroups/default',
    description: 'Retrieve the default AP group for a zone. parentId=zoneId.',
  },
  // ── AP Group overrides (grouped DELETE) ────────────────────
  clear_ap_group_override: {
    method: 'DELETE', path: '/rkszones/{parentId}/apgroups/{id}/{resource}',
    description: 'Clear an AP group-level override. parentId=zoneId. resource=altitude|apMgmtVlan|awsVenue|channelEvaluationInterval|clientAdmissionControl24|clientAdmissionControl50|directedMulticastFromNetworkEnabled|directedMulticastFromWiredClientEnabled|directedMulticastFromWirelessClientEnabled|location|locationAdditionalInfo|locationBasedService|lteBandLockChannels|protectionMode24|recoverySsid|rksGreForwardBroadcast|rogueApAggressivenessMode|rogueApJammingThreshold|rogueApReportThreshold|venueProfile',
  },
  // ── AP Group AP model config ───────────────────────────────
  get_ap_group_model: {
    method: 'GET', path: '/rkszones/{parentId}/apgroups/{id}/apmodel/{resource}',
    description: 'Get AP model config for an AP group. parentId=zoneId, resource=model name.',
  },
  update_ap_group_model: {
    method: 'PUT', path: '/rkszones/{parentId}/apgroups/{id}/apmodel/{resource}',
    description: 'Modify AP model config for an AP group. parentId=zoneId, resource=model name.',
  },
  delete_ap_group_model: {
    method: 'DELETE', path: '/rkszones/{parentId}/apgroups/{id}/apmodel/{resource}',
    description: 'Disable AP model config for an AP group. parentId=zoneId, resource=model name.',
  },
  // ── AP Group members ───────────────────────────────────────
  add_ap_group_members: {
    method: 'POST', path: '/rkszones/{parentId}/apgroups/{id}/members',
    description: 'Add multiple member APs to an AP group. parentId=zoneId.',
  },
  add_ap_group_member: {
    method: 'POST', path: '/rkszones/{parentId}/apgroups/{id}/members/{resource}',
    description: 'Add a single member AP to an AP group. parentId=zoneId, resource=apMac.',
  },
  remove_ap_group_member: {
    method: 'DELETE', path: '/rkszones/{parentId}/apgroups/{id}/members/{resource}',
    description: 'Remove a member AP from an AP group. parentId=zoneId, resource=apMac.',
  },
  // ── AP Group radio config (all bands via resource) ─────────
  clear_ap_group_radio_band: {
    method: 'DELETE', path: '/rkszones/{parentId}/apgroups/{id}/radioConfig/{resource}',
    description: 'Clear entire radio band override for an AP group. parentId=zoneId. resource=radio24g|radio5g|radio5gLower|radio5gUpper|radio6g',
  },
  clear_ap_group_radio24g_setting: {
    method: 'DELETE', path: '/rkszones/{parentId}/apgroups/{id}/radioConfig/radio24g/{resource}',
    description: 'Clear 2.4GHz radio setting for AP group. parentId=zoneId. resource=autoChannelSelection|channel|channelRange|channelWidth|protectionMode|txPower|wlanGroupId',
  },
  clear_ap_group_radio5g_setting: {
    method: 'DELETE', path: '/rkszones/{parentId}/apgroups/{id}/radioConfig/radio5g/{resource}',
    description: 'Clear 5GHz radio setting for AP group. parentId=zoneId. resource=autoChannelSelection|channel|channelIndoor|channelRange|channelRangeIndoor|channelWidth|txPower|wlanGroupId',
  },
  clear_ap_group_radio5g_lower_setting: {
    method: 'DELETE', path: '/rkszones/{parentId}/apgroups/{id}/radioConfig/radio5gLower/{resource}',
    description: 'Clear lower 5GHz radio setting for AP group. parentId=zoneId. resource=autoChannelSelection|channel|channelIndoor|channelRange|channelRangeIndoor|channelWidth|txPower|wlanGroupId',
  },
  clear_ap_group_radio5g_upper_setting: {
    method: 'DELETE', path: '/rkszones/{parentId}/apgroups/{id}/radioConfig/radio5gUpper/{resource}',
    description: 'Clear upper 5GHz radio setting for AP group. parentId=zoneId. resource=autoChannelSelection|channel|channelIndoor|channelRange|channelRangeIndoor|channelWidth|txPower|wlanGroupId',
  },
  clear_ap_group_radio6g_setting: {
    method: 'DELETE', path: '/rkszones/{parentId}/apgroups/{id}/radioConfig/radio6g/{resource}',
    description: 'Clear 6GHz radio setting for AP group. parentId=zoneId. resource=autoChannelSelection|bssMinRate|channel|channelRange|channelWidth|mgmtTxRate|multicastDownlinkRateLimit|multicastUplinkRateLimit|txPower|wlanGroupId',
  },
  // ── AP Syslog Server Profiles ──────────────────────────────
  list_ap_syslog_profiles: {
    method: 'GET', path: '/apSyslogServerProfiles',
    description: 'List AP Syslog Server Profiles.', paginatable: true,
  },
  create_ap_syslog_profile: {
    method: 'POST', path: '/apSyslogServerProfiles',
    description: 'Create an AP Syslog Server Profile.',
  },
  bulk_delete_ap_syslog_profiles: {
    method: 'DELETE', path: '/apSyslogServerProfiles',
    description: 'Bulk delete AP Syslog Server Profiles.',
  },
  get_ap_syslog_profile: {
    method: 'GET', path: '/apSyslogServerProfiles/{id}',
    description: 'Retrieve an AP Syslog Server Profile by ID.',
  },
  update_ap_syslog_profile: {
    method: 'PUT', path: '/apSyslogServerProfiles/{id}',
    description: 'Update an AP Syslog Server Profile.',
  },
  delete_ap_syslog_profile: {
    method: 'DELETE', path: '/apSyslogServerProfiles/{id}',
    description: 'Delete an AP Syslog Server Profile.',
  },
  // ── AP Registration Rules ─────────────────────────────────
  list_ap_rules: {
    method: 'GET', path: '/apRules',
    description: 'List AP Registration Rules profiles.', paginatable: true,
  },
  create_ap_rule: {
    method: 'POST', path: '/apRules',
    description: 'Create an AP Registration Rules profile.',
  },
  get_ap_rule: {
    method: 'GET', path: '/apRules/{id}',
    description: 'Retrieve an AP Registration Rules profile by ID.',
  },
  delete_ap_rule: {
    method: 'DELETE', path: '/apRules/{id}',
    description: 'Delete an AP Registration Rules profile.',
  },
  update_ap_rule: {
    method: 'PATCH', path: '/apRules/{id}',
    description: 'Modify an AP Registration Rules profile.',
  },
  ap_rule_priority_down: {
    method: 'GET', path: '/apRules/priorityDown/{id}',
    description: 'Move AP Registration Rule priority down.',
  },
  ap_rule_priority_up: {
    method: 'GET', path: '/apRules/priorityUp/{id}',
    description: 'Move AP Registration Rule priority up.',
  },
  // ── AP SNMP Agent Profiles ─────────────────────────────────
  list_ap_snmp_profiles: {
    method: 'GET', path: '/apSnmpAgentProfiles',
    description: 'List AP SNMP Agent Profiles.', paginatable: true,
  },
  create_ap_snmp_profile: {
    method: 'POST', path: '/apSnmpAgentProfiles',
    description: 'Create a new AP SNMP Agent Profile.',
  },
  bulk_delete_ap_snmp_profiles: {
    method: 'DELETE', path: '/apSnmpAgentProfiles',
    description: 'Bulk delete AP SNMP Agent Profiles.',
  },
  get_ap_snmp_profile: {
    method: 'GET', path: '/apSnmpAgentProfiles/{id}',
    description: 'Retrieve an AP SNMP Agent Profile by ID.',
  },
  update_ap_snmp_profile: {
    method: 'PUT', path: '/apSnmpAgentProfiles/{id}',
    description: 'Modify an AP SNMP Agent Profile.',
  },
  delete_ap_snmp_profile: {
    method: 'DELETE', path: '/apSnmpAgentProfiles/{id}',
    description: 'Delete an AP SNMP Agent Profile.',
  },
};

export function createVszApTool(httpClient: VszHttpClient): ToolDefinition {
  return createDomainTool(
    {
      name: 'vsz_ap',
      description:
        'Ruckus vSZ access point management. Manage APs, AP overrides, ' +
        'radio config, AP groups, AP operational data, packet capture, ' +
        'mesh topology, AP registration rules, AP syslog profiles, ' +
        'and AP SNMP agent profiles.',
      actions,
    },
    httpClient,
  );
}
