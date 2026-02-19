/**
 * vsz_monitoring Tool
 *
 * Monitoring and event management: connectivity tools, events/alarms,
 * event settings, traffic class profiles, and user traffic profiles.
 *
 * Source: docs/mcp-architecture.md, Section 4
 * Source: docs/openapi-parsed-endpoints.md (Connectivity Tools, Event and Alarm,
 *   Event Management Setting, Switch Event Management Setting,
 *   Traffic Class Profile, User Traffic Profile)
 */

import type { VszHttpClient } from '../http/client.js';
import type { ToolDefinition, ActionDefinition } from './base-tool.js';
import { createDomainTool } from './base-tool.js';

const actions: Record<string, ActionDefinition> = {
  // ── Connectivity Tools ─────────────────────────────────────
  ping: {
    method: 'GET',
    path: '/tool/ping',
    description: 'Run a PING test on an AP.',
  },
  start_speedflex: {
    method: 'POST',
    path: '/tool/speedflex',
    description: 'Start a SpeedFlex test.',
  },
  get_speedflex: {
    method: 'GET',
    path: '/tool/speedflex/{id}',
    description: 'Retrieve existing SpeedFlex test results by wcid.',
  },
  start_speed_test: {
    method: 'POST',
    path: '/tool/speedTestC',
    description: 'Start an AP SpeedTestC test.',
  },
  get_speed_test: {
    method: 'GET',
    path: '/tool/speedTestC/{id}',
    description: 'Retrieve existing SpeedTestC test results by AP MAC.',
  },
  trace_route: {
    method: 'GET',
    path: '/tool/traceRoute',
    description: 'Run a traceroute test on an AP.',
  },

  // ── Event and Alarm ────────────────────────────────────────
  ack_alarm: {
    method: 'PUT',
    path: '/alert/alarm/{id}/ack',
    description: 'Acknowledge a single alarm by alarm ID.',
  },
  clear_alarm: {
    method: 'PUT',
    path: '/alert/alarm/{id}/clear',
    description: 'Clear a single alarm by alarm ID.',
  },
  ack_alarms: {
    method: 'PUT',
    path: '/alert/alarm/ack',
    description: 'Acknowledge multiple alarms with provided alarm IDs.',
  },
  clear_alarms: {
    method: 'PUT',
    path: '/alert/alarm/clear',
    description: 'Clear multiple alarms with provided alarm IDs.',
  },
  list_alarms: {
    method: 'POST',
    path: '/alert/alarm/list',
    description: 'Query alarms with specified filters.',
  },
  get_alarm_summary: {
    method: 'POST',
    path: '/alert/alarmSummary',
    description: 'Retrieve the alarm summary with specified filters.',
  },
  list_events: {
    method: 'POST',
    path: '/alert/event/list',
    description: 'Query events with specified filters.',
  },
  get_event_summary: {
    method: 'POST',
    path: '/alert/eventSummary',
    description: 'Retrieve the event summary with specified filters.',
  },

  // ── Event Management Setting (Zone) ────────────────────────
  get_zone_event_email: {
    method: 'GET',
    path: '/rkszones/{parentId}/eventEmailSettings',
    description: 'Get Event E-mail Setting of Zone Override.',
  },
  update_zone_event_email: {
    method: 'PUT',
    path: '/rkszones/{parentId}/eventEmailSettings',
    description: 'Modify Event E-mail Setting of Zone Override.',
  },
  get_zone_event_notification: {
    method: 'GET',
    path: '/rkszones/{parentId}/eventNotificationSettings',
    description: 'Get Event Notification Setting of Zone Override.',
  },
  update_zone_event_notification: {
    method: 'PUT',
    path: '/rkszones/{parentId}/eventNotificationSettings',
    description: 'Modify Event Notification Setting of Zone Override.',
  },

  // ── Switch Event Management Setting (Domain) ───────────────
  get_domain_event_email: {
    method: 'GET',
    path: '/domains/{parentId}/eventEmailSettings',
    description: 'Get Switch Event E-mail Setting of Domain Override.',
  },
  update_domain_event_email: {
    method: 'PUT',
    path: '/domains/{parentId}/eventEmailSettings',
    description: 'Modify Switch Event E-mail Setting of Domain Override.',
  },
  get_domain_event_notification: {
    method: 'GET',
    path: '/domains/{parentId}/eventNotificationSettings',
    description: 'Get Switch Event Notification Setting of Domain Override.',
  },
  update_domain_event_notification: {
    method: 'PUT',
    path: '/domains/{parentId}/eventNotificationSettings',
    description: 'Modify Switch Event Notification Setting of Domain Override.',
  },

  // ── Traffic Class Profile ──────────────────────────────────
  query_traffic_class_profiles: {
    method: 'POST',
    path: '/query/services/trafficClassProfile',
    description: 'Retrieve a list of Traffic Class Profiles.',
  },
  list_traffic_class_profiles: {
    method: 'GET',
    path: '/rkszones/{parentId}/trafficClassProfile',
    description: 'List Traffic Class Profiles of a zone.',
  },
  create_traffic_class_profile: {
    method: 'POST',
    path: '/rkszones/{parentId}/trafficClassProfile',
    description: 'Create a new Traffic Class Profile in a zone.',
  },
  bulk_delete_traffic_class_profiles: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/trafficClassProfile',
    description: 'Bulk delete Traffic Class Profiles of a zone.',
    hasBody: false,
  },
  get_traffic_class_profile: {
    method: 'GET',
    path: '/rkszones/{parentId}/trafficClassProfile/{id}',
    description: 'Retrieve a Traffic Class Profile of a zone.',
  },
  delete_traffic_class_profile: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/trafficClassProfile/{id}',
    description: 'Delete a Traffic Class Profile of a zone.',
  },
  update_traffic_class_profile: {
    method: 'PATCH',
    path: '/rkszones/{parentId}/trafficClassProfile/{id}',
    description: 'Modify a Traffic Class Profile of a zone.',
  },

  // ── User Traffic Profile ───────────────────────────────────
  list_user_traffic_profiles: {
    method: 'GET',
    path: '/profiles/utp',
    description: 'List user traffic profiles.',
    paginatable: true,
  },
  create_user_traffic_profile: {
    method: 'POST',
    path: '/profiles/utp',
    description: 'Create a new user traffic profile.',
  },
  bulk_delete_user_traffic_profiles: {
    method: 'DELETE',
    path: '/profiles/utp',
    description: 'Bulk delete user traffic profiles.',
    hasBody: false,
  },
  get_user_traffic_profile: {
    method: 'GET',
    path: '/profiles/utp/{id}',
    description: 'Retrieve a user traffic profile.',
  },
  delete_user_traffic_profile: {
    method: 'DELETE',
    path: '/profiles/utp/{id}',
    description: 'Delete a user traffic profile.',
  },
  update_user_traffic_profile: {
    method: 'PATCH',
    path: '/profiles/utp/{id}',
    description: 'Modify a user traffic profile.',
  },
  delete_utp_downlink_rate: {
    method: 'DELETE',
    path: '/profiles/utp/{id}/downlinkRateLimiting',
    description: 'Disable downlink rate limiting of a user traffic profile.',
  },
  delete_utp_uplink_rate: {
    method: 'DELETE',
    path: '/profiles/utp/{id}/uplinkRateLimiting',
    description: 'Disable uplink rate limiting of a user traffic profile.',
  },
  clone_user_traffic_profile: {
    method: 'POST',
    path: '/profiles/utp/clone/{id}',
    description: 'Copy (clone) a user traffic profile.',
    hasBody: false,
  },
  query_user_traffic_profiles: {
    method: 'POST',
    path: '/profiles/utp/query',
    description: 'Query user traffic profiles with specified filters.',
  },
};

export function createVszMonitoringTool(httpClient: VszHttpClient): ToolDefinition {
  return createDomainTool(
    {
      name: 'vsz_monitoring',
      description:
        'Ruckus vSZ monitoring and event management. Manage connectivity tools, ' +
        'events/alarms, event settings, traffic class profiles, and user traffic profiles.',
      actions,
    },
    httpClient,
  );
}
