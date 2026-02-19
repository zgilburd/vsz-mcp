/**
 * vsz_hotspot Tool
 *
 * Hotspot and guest access management: guest access profiles,
 * hotspot services, Hotspot 2.0 Wi-Fi operator profiles,
 * venue services, portal detection, SMS gateways,
 * social media login, and WeChat portals.
 *
 * Source: docs/openapi-parsed-endpoints.md (Guest Access, Hotspot 2.0 Wi-Fi
 *   Operator Profile, Hotspot Service, Hotspot20 Venue Service,
 *   Portal Detection and Suppression Profile, SMS Gateway,
 *   Social Media Login Profile, Wechat)
 */

import type { VszHttpClient } from '../http/client.js';
import type { ToolDefinition, ActionDefinition } from './base-tool.js';
import { createDomainTool } from './base-tool.js';

const actions: Record<string, ActionDefinition> = {
  // ── Guest Access ───────────────────────────────────────────
  query_guest_access: {
    method: 'POST',
    path: '/query/services/guestAccess',
    description: 'Query guest access profiles with filters.',
  },
  list_guest_access: {
    method: 'GET',
    path: '/rkszones/{parentId}/portals/guest',
    description: 'List guest access profiles for a zone.',
  },
  create_guest_access: {
    method: 'POST',
    path: '/rkszones/{parentId}/portals/guest',
    description: 'Create a guest access profile in a zone.',
  },
  get_guest_access: {
    method: 'GET',
    path: '/rkszones/{parentId}/portals/guest/{id}',
    description: 'Retrieve a guest access profile.',
  },
  delete_guest_access: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/portals/guest/{id}',
    description: 'Delete a guest access profile.',
  },
  update_guest_access: {
    method: 'PATCH',
    path: '/rkszones/{parentId}/portals/guest/{id}',
    description: 'Modify a guest access profile.',
  },
  delete_guest_access_redirect: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/portals/guest/{id}/redirect',
    description: 'Reset guest access redirect URL to default.',
  },
  delete_guest_access_sms_gateway: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/portals/guest/{id}/smsGateway',
    description: 'Disable SMS gateway on a guest access profile.',
  },

  // ── Hotspot 2.0 Wi-Fi Operator Profile ────────────────────
  list_hs20_operators: {
    method: 'GET',
    path: '/profiles/hs20/operators',
    description: 'List Hotspot 2.0 Wi-Fi operator profiles.',
  },
  create_hs20_operator: {
    method: 'POST',
    path: '/profiles/hs20/operators',
    description: 'Create a Hotspot 2.0 Wi-Fi operator profile.',
  },
  delete_hs20_operators_bulk: {
    method: 'DELETE',
    path: '/profiles/hs20/operators',
    description: 'Delete multiple Hotspot 2.0 Wi-Fi operator profiles.',
  },
  get_hs20_operator: {
    method: 'GET',
    path: '/profiles/hs20/operators/{id}',
    description: 'Retrieve a Hotspot 2.0 Wi-Fi operator profile.',
  },
  replace_hs20_operator: {
    method: 'PUT',
    path: '/profiles/hs20/operators/{id}',
    description: 'Replace entire Hotspot 2.0 Wi-Fi operator profile.',
  },
  delete_hs20_operator: {
    method: 'DELETE',
    path: '/profiles/hs20/operators/{id}',
    description: 'Delete a Hotspot 2.0 Wi-Fi operator profile.',
  },
  update_hs20_operator: {
    method: 'PATCH',
    path: '/profiles/hs20/operators/{id}',
    description: 'Modify a Hotspot 2.0 Wi-Fi operator profile.',
  },
  delete_hs20_operator_cert: {
    method: 'DELETE',
    path: '/profiles/hs20/operators/{id}/certificate',
    description: 'Disable certificate of a Hotspot 2.0 Wi-Fi operator.',
  },
  query_hs20_operators: {
    method: 'POST',
    path: '/profiles/hs20/operators/query',
    description: 'Query Hotspot 2.0 Wi-Fi operator profiles.',
  },

  // ── Hotspot Service (WISPr) ────────────────────────────────
  query_hotspot: {
    method: 'POST',
    path: '/query/services/hotspot',
    description: 'Query hotspot profiles with filters.',
  },
  list_hotspot: {
    method: 'GET',
    path: '/rkszones/{parentId}/portals/hotspot',
    description: 'List hotspot (WISPr) profiles for a zone.',
  },
  get_hotspot: {
    method: 'GET',
    path: '/rkszones/{parentId}/portals/hotspot/{id}',
    description: 'Retrieve a hotspot (WISPr) profile.',
  },
  delete_hotspot: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/portals/hotspot/{id}',
    description: 'Delete a hotspot (WISPr) profile.',
  },
  update_hotspot: {
    method: 'PATCH',
    path: '/rkszones/{parentId}/portals/hotspot/{id}',
    description: 'Modify a hotspot (WISPr) profile.',
  },
  create_hotspot_external: {
    method: 'POST',
    path: '/rkszones/{parentId}/portals/hotspot/external',
    description: 'Create a hotspot with external logon URL.',
  },
  replace_hotspot_external: {
    method: 'PUT',
    path: '/rkszones/{parentId}/portals/hotspot/external/{id}',
    description: 'Replace a hotspot with external logon URL.',
  },
  create_hotspot_internal: {
    method: 'POST',
    path: '/rkszones/{parentId}/portals/hotspot/internal',
    description: 'Create a hotspot with internal logon URL.',
  },
  replace_hotspot_internal: {
    method: 'PUT',
    path: '/rkszones/{parentId}/portals/hotspot/internal/{id}',
    description: 'Replace a hotspot with internal logon URL.',
  },
  create_hotspot_smart_client: {
    method: 'POST',
    path: '/rkszones/{parentId}/portals/hotspot/smartClientOnly',
    description: 'Create a hotspot with smart client only.',
  },
  replace_hotspot_smart_client: {
    method: 'PUT',
    path: '/rkszones/{parentId}/portals/hotspot/smartClientOnly/{id}',
    description: 'Replace a hotspot with smart client only.',
  },

  // ── Hotspot20 Venue Service ────────────────────────────────
  query_venues: {
    method: 'POST',
    path: '/query/services/venueProfile',
    description: 'Query Hotspot 2.0 venue profiles with filters.',
  },
  list_venues: {
    method: 'GET',
    path: '/rkszones/{parentId}/hs20/venues',
    description: 'List Hotspot 2.0 venue profiles for a zone.',
  },
  create_venue: {
    method: 'POST',
    path: '/rkszones/{parentId}/hs20/venues',
    description: 'Create a Hotspot 2.0 venue profile.',
  },
  get_venue: {
    method: 'GET',
    path: '/rkszones/{parentId}/hs20/venues/{id}',
    description: 'Retrieve a Hotspot 2.0 venue profile.',
  },
  delete_venue: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/hs20/venues/{id}',
    description: 'Delete a Hotspot 2.0 venue profile.',
  },
  update_venue: {
    method: 'PATCH',
    path: '/rkszones/{parentId}/hs20/venues/{id}',
    description: 'Modify a Hotspot 2.0 venue profile.',
  },

  // ── Portal Detection and Suppression ───────────────────────
  list_portal_detection: {
    method: 'GET',
    path: '/rkszones/{parentId}/portalDetectionProfiles',
    description: 'List portal detection and suppression profiles.',
  },
  create_portal_detection: {
    method: 'POST',
    path: '/rkszones/{parentId}/portalDetectionProfiles',
    description: 'Create a portal detection and suppression profile.',
  },
  delete_portal_detection_bulk: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/portalDetectionProfiles',
    description: 'Delete multiple portal detection profiles.',
  },
  get_portal_detection: {
    method: 'GET',
    path: '/rkszones/{parentId}/portalDetectionProfiles/{id}',
    description: 'Retrieve a portal detection profile.',
  },
  replace_portal_detection: {
    method: 'PUT',
    path: '/rkszones/{parentId}/portalDetectionProfiles/{id}',
    description: 'Replace a portal detection profile.',
  },
  delete_portal_detection: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/portalDetectionProfiles/{id}',
    description: 'Delete a portal detection profile.',
  },
  update_portal_detection: {
    method: 'PATCH',
    path: '/rkszones/{parentId}/portalDetectionProfiles/{id}',
    description: 'Modify a portal detection profile.',
  },
  query_portal_detection: {
    method: 'POST',
    path: '/rkszones/portalDetectionProfiles/query',
    description: 'Query portal detection profiles with filters.',
  },

  // ── SMS Gateway ────────────────────────────────────────────
  get_sms_gateway: {
    method: 'GET',
    path: '/smsGateway',
    description: 'Retrieve SMS gateway settings.',
  },
  update_sms_gateway: {
    method: 'PATCH',
    path: '/smsGateway',
    description: 'Update SMS gateway settings.',
  },
  query_sms_gateway: {
    method: 'POST',
    path: '/smsGateway/query',
    description: 'Query SMS gateway.',
  },

  // ── Social Media Login Profile ─────────────────────────────
  list_social_media_login: {
    method: 'GET',
    path: '/rkszones/{parentId}/socialMediaLoginProfiles',
    description: 'List social media login profiles for a zone.',
  },
  create_social_media_login: {
    method: 'POST',
    path: '/rkszones/{parentId}/socialMediaLoginProfiles',
    description: 'Create a social media login profile.',
  },
  get_social_media_login: {
    method: 'GET',
    path: '/rkszones/{parentId}/socialMediaLoginProfiles/{id}',
    description: 'Retrieve a social media login profile.',
  },
  replace_social_media_login: {
    method: 'PUT',
    path: '/rkszones/{parentId}/socialMediaLoginProfiles/{id}',
    description: 'Replace a social media login profile.',
  },
  delete_social_media_login: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/socialMediaLoginProfiles/{id}',
    description: 'Delete a social media login profile.',
  },
  delete_social_media_login_bulk: {
    method: 'DELETE',
    path: '/rkszones/socialMediaLoginProfiles',
    description: 'Delete multiple social media login profiles.',
  },

  // ── Wechat ─────────────────────────────────────────────────
  query_wechat: {
    method: 'POST',
    path: '/query/services/wechatProfile',
    description: 'Query WeChat portal profiles with filters.',
  },
  list_wechat: {
    method: 'GET',
    path: '/rkszones/{parentId}/portals/wechat',
    description: 'List WeChat portal profiles for a zone.',
  },
  create_wechat: {
    method: 'POST',
    path: '/rkszones/{parentId}/portals/wechat',
    description: 'Create a WeChat portal profile.',
  },
  get_wechat: {
    method: 'GET',
    path: '/rkszones/{parentId}/portals/wechat/{id}',
    description: 'Retrieve a WeChat portal profile.',
  },
  delete_wechat: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/portals/wechat/{id}',
    description: 'Delete a WeChat portal profile.',
  },
  update_wechat: {
    method: 'PATCH',
    path: '/rkszones/{parentId}/portals/wechat/{id}',
    description: 'Modify a WeChat portal profile.',
  },
};

export function createVszHotspotTool(httpClient: VszHttpClient): ToolDefinition {
  return createDomainTool(
    {
      name: 'vsz_hotspot',
      description:
        'Ruckus vSZ hotspot and guest access. Manage guest access profiles, ' +
        'hotspot services, Hotspot 2.0 Wi-Fi operator profiles, venue services, ' +
        'portal detection, SMS gateways, social media login, and WeChat.',
      actions,
    },
    httpClient,
  );
}
