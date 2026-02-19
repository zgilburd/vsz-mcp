/**
 * vsz_security Tool
 *
 * Security policies: account security, allowed device profiles,
 * AVC, device policies, firewall profiles, geofence profiles,
 * L2/L3 access control, mark rogue, restricted AP access,
 * rogue classification, and signature-based profiles.
 *
 * Source: docs/openapi-parsed-endpoints.md (14 tags, 118 endpoints)
 */

import type { VszHttpClient } from '../http/client.js';
import type { ToolDefinition, ActionDefinition } from './base-tool.js';
import { createDomainTool } from './base-tool.js';

const actions: Record<string, ActionDefinition> = {
  // ── Account Security (7) ───────────────────────────────
  list_account_security:
    { method: 'GET', path: '/accountSecurity', description: 'List account security profiles.' },
  create_account_security:
    { method: 'POST', path: '/accountSecurity', description: 'Create an account security profile.' },
  delete_account_security_bulk:
    { method: 'DELETE', path: '/accountSecurity', description: 'Delete account security profiles (bulk).' },
  get_account_security:
    { method: 'GET', path: '/accountSecurity/{id}', description: 'Retrieve an account security profile.' },
  replace_account_security:
    { method: 'PUT', path: '/accountSecurity/{id}', description: 'Replace an account security profile.' },
  delete_account_security:
    { method: 'DELETE', path: '/accountSecurity/{id}', description: 'Delete an account security profile.' },
  update_account_security:
    { method: 'PATCH', path: '/accountSecurity/{id}', description: 'Modify an account security profile.' },

  // ── Allowed Device Profile (6) ─────────────────────────
  create_allowed_device:
    { method: 'POST', path: '/allowedDeviceProfiles', description: 'Create an allowed device profile.' },
  delete_allowed_device_bulk:
    { method: 'DELETE', path: '/allowedDeviceProfiles', description: 'Delete allowed device profiles (bulk).' },
  get_allowed_device:
    { method: 'GET', path: '/allowedDeviceProfiles/{id}', description: 'Retrieve an allowed device profile.' },
  replace_allowed_device:
    { method: 'PUT', path: '/allowedDeviceProfiles/{id}', description: 'Replace an allowed device profile.' },
  delete_allowed_device:
    { method: 'DELETE', path: '/allowedDeviceProfiles/{id}', description: 'Delete an allowed device profile.' },
  query_allowed_device:
    { method: 'POST', path: '/allowedDeviceProfiles/query', description: 'Query allowed device profiles.' },

  // ── AVC — Application Policy (5, firmware <= 5.0) ──────
  create_avc_policy:
    { method: 'POST', path: '/avc/applicationPolicy', description: 'Create AVC app policy (fw <= 5.0).' },
  delete_avc_policy_bulk:
    { method: 'DELETE', path: '/avc/applicationPolicy', description: 'Delete AVC app policies bulk (fw <= 5.0).' },
  get_avc_policy:
    { method: 'GET', path: '/avc/applicationPolicy/{id}', description: 'Get AVC app policy (fw <= 5.0).' },
  delete_avc_policy:
    { method: 'DELETE', path: '/avc/applicationPolicy/{id}', description: 'Delete AVC app policy (fw <= 5.0).' },
  update_avc_policy:
    { method: 'PATCH', path: '/avc/applicationPolicy/{id}', description: 'Modify AVC app policy (fw <= 5.0).' },

  // ── AVC — Application Policy V2 (5) ───────────────────
  create_avc_policy_v2:
    { method: 'POST', path: '/avc/applicationPolicyV2', description: 'Create AVC application policy.' },
  delete_avc_policy_v2_bulk:
    { method: 'DELETE', path: '/avc/applicationPolicyV2', description: 'Delete AVC application policies (bulk).' },
  get_avc_policy_v2:
    { method: 'GET', path: '/avc/applicationPolicyV2/{id}', description: 'Retrieve AVC application policy.' },
  delete_avc_policy_v2:
    { method: 'DELETE', path: '/avc/applicationPolicyV2/{id}', description: 'Delete AVC application policy.' },
  update_avc_policy_v2:
    { method: 'PATCH', path: '/avc/applicationPolicyV2/{id}', description: 'Modify AVC application policy.' },

  // ── AVC — Signature Package (6, firmware <= 5.0) ───────
  get_avc_sig_package:
    { method: 'GET', path: '/avc/signaturePackage', description: 'Get AVC signature package (fw <= 5.0).' },
  get_avc_sig_app: {
    method: 'GET', path: '/avc/signaturePackage/application/{resource}',
    description: 'Get app info by name (fw <= 5.0). Pass name as resource.',
  },
  list_avc_sig_apps:
    { method: 'GET', path: '/avc/signaturePackage/applications', description: 'List apps in sig package (fw <= 5.0).' },
  list_avc_sig_categories:
    { method: 'GET', path: '/avc/signaturePackage/categories', description: 'List categories in sig package (fw <= 5.0).' },
  get_avc_sig_category: {
    method: 'GET', path: '/avc/signaturePackage/category/{resource}',
    description: 'Get category by name (fw <= 5.0). Pass name as resource.',
  },
  upload_avc_sig_package:
    { method: 'POST', path: '/avc/signaturePackage/upload', description: 'Upload AVC sig package (fw <= 5.0).' },

  // ── AVC — Signature Package V2 (8) ────────────────────
  get_avc_sig_v2:
    { method: 'GET', path: '/avc/signaturePackageV2', description: 'Get current AVC signature package info.' },
  update_avc_sig_v2:
    { method: 'PATCH', path: '/avc/signaturePackageV2', description: 'Update AVC signature package settings.' },
  list_avc_sig_v2_apps:
    { method: 'GET', path: '/avc/signaturePackageV2/applications', description: 'List apps in current sig package.' },
  list_avc_sig_v2_categories:
    { method: 'GET', path: '/avc/signaturePackageV2/categories', description: 'List categories in current sig package.' },
  check_avc_sig_v2_latest: {
    method: 'POST', path: '/avc/signaturePackageV2/checkLatest',
    description: 'Check latest sig package from Ruckus support.', hasBody: false,
  },
  install_avc_sig_v2: {
    method: 'POST', path: '/avc/signaturePackageV2/downloadAndInstallLastChecked',
    description: 'Download and install latest sig package.', hasBody: false,
  },
  get_avc_sig_v2_progress: {
    method: 'GET', path: '/avc/signaturePackageV2/downloadAndInstallLastChecked/progress',
    description: 'Get sig package download/install progress.',
  },
  upload_avc_sig_v2:
    { method: 'POST', path: '/avc/signaturePackageV2/upload', description: 'Upload AVC signature package file.' },

  // ── AVC — User Defined (5) ────────────────────────────
  create_avc_user_defined:
    { method: 'POST', path: '/avc/userDefined', description: 'Create AVC user-defined profile.' },
  delete_avc_user_defined_bulk:
    { method: 'DELETE', path: '/avc/userDefined', description: 'Delete AVC user-defined profiles (bulk).' },
  get_avc_user_defined:
    { method: 'GET', path: '/avc/userDefined/{id}', description: 'Retrieve AVC user-defined profile.' },
  delete_avc_user_defined:
    { method: 'DELETE', path: '/avc/userDefined/{id}', description: 'Delete AVC user-defined profile.' },
  update_avc_user_defined:
    { method: 'PATCH', path: '/avc/userDefined/{id}', description: 'Modify AVC user-defined profile.' },

  // ── AVC — Query (3) ───────────────────────────────────
  query_avc_policy:
    { method: 'POST', path: '/query/applicationPolicy', description: 'Query AVC app policies (fw <= 5.0).' },
  query_avc_policy_v2:
    { method: 'POST', path: '/query/applicationPolicyV2', description: 'Query AVC application policies.' },
  query_avc_user_defined:
    { method: 'POST', path: '/query/userDefined', description: 'Query AVC user-defined profiles.' },

  // ── Device Policy — Zone Level (6, firmware < 5.2) ─────
  query_device_policy_zone:
    { method: 'POST', path: '/query/services/devicePolicy', description: 'Query device policies (zone).' },
  list_device_policy_zone: {
    method: 'GET', path: '/rkszones/{parentId}/devicePolicy',
    description: 'List device policies in a zone (fw < 5.2).',
  },
  create_device_policy_zone: {
    method: 'POST', path: '/rkszones/{parentId}/devicePolicy',
    description: 'Create device policy in a zone (fw < 5.2).',
  },
  get_device_policy_zone: {
    method: 'GET', path: '/rkszones/{parentId}/devicePolicy/{id}',
    description: 'Get device policy in a zone (fw < 5.2).',
  },
  delete_device_policy_zone: {
    method: 'DELETE', path: '/rkszones/{parentId}/devicePolicy/{id}',
    description: 'Delete device policy in a zone (fw < 5.2).',
  },
  update_device_policy_zone: {
    method: 'PATCH', path: '/rkszones/{parentId}/devicePolicy/{id}',
    description: 'Modify device policy in a zone (fw < 5.2).',
  },

  // ── Device Policy — Domain Level (7) ──────────────────
  list_device_policy:
    { method: 'GET', path: '/devicePolicy', description: 'List device policies (domain level).' },
  create_device_policy:
    { method: 'POST', path: '/devicePolicy', description: 'Create device policy (domain level).' },
  delete_device_policy_bulk:
    { method: 'DELETE', path: '/devicePolicy', description: 'Delete device policies bulk (domain level).' },
  get_device_policy:
    { method: 'GET', path: '/devicePolicy/{id}', description: 'Retrieve device policy (domain level).' },
  replace_device_policy:
    { method: 'PUT', path: '/devicePolicy/{id}', description: 'Update device policy (domain level).' },
  delete_device_policy:
    { method: 'DELETE', path: '/devicePolicy/{id}', description: 'Delete device policy (domain level).' },
  query_device_policy:
    { method: 'POST', path: '/devicePolicy/query', description: 'Query device policies (domain level).' },

  // ── Firewall Profile (9) ──────────────────────────────
  list_firewall:
    { method: 'GET', path: '/firewallProfiles', description: 'List firewall profiles.' },
  create_firewall:
    { method: 'POST', path: '/firewallProfiles', description: 'Create a firewall profile.' },
  delete_firewall_bulk:
    { method: 'DELETE', path: '/firewallProfiles', description: 'Delete firewall profiles (bulk).' },
  get_firewall:
    { method: 'GET', path: '/firewallProfiles/{id}', description: 'Retrieve a firewall profile.' },
  replace_firewall:
    { method: 'PUT', path: '/firewallProfiles/{id}', description: 'Replace a firewall profile.' },
  delete_firewall:
    { method: 'DELETE', path: '/firewallProfiles/{id}', description: 'Delete a firewall profile.' },
  list_firewall_ethernet_ports: {
    method: 'GET', path: '/firewallProfiles/{id}/ethernetPortProfiles',
    description: 'List ethernet port profiles using this firewall.',
  },
  list_firewall_wlans:
    { method: 'GET', path: '/firewallProfiles/{id}/wlans', description: 'List WLANs using this firewall.' },
  query_firewall:
    { method: 'POST', path: '/firewallProfiles/query', description: 'Query firewall profiles.' },

  // ── Geofence Profile (6) ──────────────────────────────
  list_geofence: {
    method: 'GET', path: '/rkszones/{parentId}/geofenceProfiles',
    description: 'List geofence profiles in a zone.',
  },
  create_geofence: {
    method: 'POST', path: '/rkszones/{parentId}/geofenceProfiles',
    description: 'Create geofence profile in a zone.',
  },
  delete_geofence_bulk: {
    method: 'DELETE', path: '/rkszones/{parentId}/geofenceProfiles',
    description: 'Delete geofence profiles (bulk).',
  },
  get_geofence: {
    method: 'GET', path: '/rkszones/{parentId}/geofenceProfiles/{id}',
    description: 'Retrieve a geofence profile.',
  },
  replace_geofence: {
    method: 'PUT', path: '/rkszones/{parentId}/geofenceProfiles/{id}',
    description: 'Update a geofence profile.',
  },
  delete_geofence: {
    method: 'DELETE', path: '/rkszones/{parentId}/geofenceProfiles/{id}',
    description: 'Delete a geofence profile.',
  },

  // ── L2 Access Control — Zone Level (6, firmware < 5.2) ─
  query_l2acl_zone:
    { method: 'POST', path: '/query/services/l2AccessControl', description: 'Query L2 ACLs (zone-level).' },
  list_l2acl_zone: {
    method: 'GET', path: '/rkszones/{parentId}/l2ACL',
    description: 'List L2 ACLs in a zone (fw < 5.2).',
  },
  create_l2acl_zone: {
    method: 'POST', path: '/rkszones/{parentId}/l2ACL',
    description: 'Create L2 ACL in a zone (fw < 5.2).',
  },
  get_l2acl_zone: {
    method: 'GET', path: '/rkszones/{parentId}/l2ACL/{id}',
    description: 'Retrieve L2 ACL in a zone (fw < 5.2).',
  },
  delete_l2acl_zone: {
    method: 'DELETE', path: '/rkszones/{parentId}/l2ACL/{id}',
    description: 'Delete L2 ACL in a zone (fw < 5.2).',
  },
  update_l2acl_zone: {
    method: 'PATCH', path: '/rkszones/{parentId}/l2ACL/{id}',
    description: 'Modify L2 ACL in a zone (fw < 5.2).',
  },

  // ── L2 Access Control — Domain Level (7) ──────────────
  list_l2acl:
    { method: 'GET', path: '/l2AccessControls', description: 'List L2 access controls (domain).' },
  create_l2acl:
    { method: 'POST', path: '/l2AccessControls', description: 'Create L2 access control (domain).' },
  delete_l2acl_bulk:
    { method: 'DELETE', path: '/l2AccessControls', description: 'Delete L2 access controls bulk (domain).' },
  get_l2acl:
    { method: 'GET', path: '/l2AccessControls/{id}', description: 'Retrieve L2 access control (domain).' },
  replace_l2acl:
    { method: 'PUT', path: '/l2AccessControls/{id}', description: 'Modify L2 access control (domain).' },
  delete_l2acl:
    { method: 'DELETE', path: '/l2AccessControls/{id}', description: 'Delete L2 access control (domain).' },
  query_l2acl:
    { method: 'POST', path: '/l2AccessControls/query', description: 'Query L2 access controls (domain).' },

  // ── L3 Access Control Policy (7) ──────────────────────
  list_l3acl:
    { method: 'GET', path: '/l3AccessControlPolicies', description: 'List L3 access control policies.' },
  create_l3acl:
    { method: 'POST', path: '/l3AccessControlPolicies', description: 'Create L3 access control policy.' },
  delete_l3acl_bulk:
    { method: 'DELETE', path: '/l3AccessControlPolicies', description: 'Delete L3 access control policies (bulk).' },
  get_l3acl:
    { method: 'GET', path: '/l3AccessControlPolicies/{id}', description: 'Retrieve L3 access control policy.' },
  replace_l3acl:
    { method: 'PUT', path: '/l3AccessControlPolicies/{id}', description: 'Modify L3 access control policy.' },
  delete_l3acl:
    { method: 'DELETE', path: '/l3AccessControlPolicies/{id}', description: 'Delete L3 access control policy.' },
  query_l3acl:
    { method: 'POST', path: '/l3AccessControlPolicies/query', description: 'Query L3 access control policies.' },

  // ── Mark Rogue (6) ────────────────────────────────────
  mark_rogue_ignore:
    { method: 'POST', path: '/rogue/markIgnore', description: 'Mark a rogue AP as ignored.' },
  list_rogue_known:
    { method: 'GET', path: '/rogue/markKnown', description: 'Get known rogue AP list.' },
  mark_rogue_known:
    { method: 'POST', path: '/rogue/markKnown', description: 'Mark a rogue AP as known.' },
  mark_rogue_malicious:
    { method: 'POST', path: '/rogue/markMalicious', description: 'Mark a rogue AP as malicious.' },
  mark_rogue:
    { method: 'POST', path: '/rogue/markRogue', description: 'Mark a rogue AP as rogue.' },
  unmark_rogue:
    { method: 'POST', path: '/rogue/unMark', description: 'Remove rogue AP classification marking.' },

  // ── Restricted AP Access Profile (7) ──────────────────
  list_restricted_ap: {
    method: 'GET', path: '/rkszones/{parentId}/restrictedApAccessProfiles',
    description: 'List restricted AP access profiles in a zone.',
  },
  create_restricted_ap: {
    method: 'POST', path: '/rkszones/{parentId}/restrictedApAccessProfiles',
    description: 'Create restricted AP access profile in a zone.',
  },
  get_restricted_ap: {
    method: 'GET', path: '/rkszones/{parentId}/restrictedApAccessProfiles/{id}',
    description: 'Retrieve restricted AP access profile.',
  },
  replace_restricted_ap: {
    method: 'PUT', path: '/rkszones/{parentId}/restrictedApAccessProfiles/{id}',
    description: 'Replace restricted AP access profile.',
  },
  delete_restricted_ap: {
    method: 'DELETE', path: '/rkszones/{parentId}/restrictedApAccessProfiles/{id}',
    description: 'Delete restricted AP access profile.',
  },
  delete_restricted_ap_bulk: {
    method: 'DELETE', path: '/rkszones/restrictedApAccessProfiles',
    description: 'Delete restricted AP access profiles (bulk).',
  },
  query_restricted_ap: {
    method: 'POST', path: '/rkszones/restrictedApAccessProfiles/query',
    description: 'Query restricted AP access profiles.',
  },

  // ── Rogue Classification Policy (6) ───────────────────
  list_rogue_policy: {
    method: 'GET', path: '/rkszones/{parentId}/rogueApPolicies',
    description: 'List rogue AP policies in a zone.',
  },
  create_rogue_policy: {
    method: 'POST', path: '/rkszones/{parentId}/rogueApPolicies',
    description: 'Create rogue AP policy in a zone.',
  },
  delete_rogue_policy_bulk: {
    method: 'DELETE', path: '/rkszones/{parentId}/rogueApPolicies',
    description: 'Delete rogue AP policies (bulk).',
  },
  get_rogue_policy: {
    method: 'GET', path: '/rkszones/{parentId}/rogueApPolicies/{id}',
    description: 'Retrieve a rogue AP policy.',
  },
  delete_rogue_policy: {
    method: 'DELETE', path: '/rkszones/{parentId}/rogueApPolicies/{id}',
    description: 'Delete a rogue AP policy.',
  },
  update_rogue_policy: {
    method: 'PATCH', path: '/rkszones/{parentId}/rogueApPolicies/{id}',
    description: 'Modify a rogue AP policy.',
  },

  // ── Signature Based Profile (6) ───────────────────────
  list_sig_profile:
    { method: 'GET', path: '/signatureBasedProfiles', description: 'List signature-based profiles.' },
  create_sig_profile:
    { method: 'POST', path: '/signatureBasedProfiles', description: 'Create signature-based profile.' },
  delete_sig_profile_bulk:
    { method: 'DELETE', path: '/signatureBasedProfiles', description: 'Delete signature-based profiles (bulk).' },
  get_sig_profile:
    { method: 'GET', path: '/signatureBasedProfiles/{id}', description: 'Retrieve signature-based profile.' },
  replace_sig_profile:
    { method: 'PUT', path: '/signatureBasedProfiles/{id}', description: 'Replace signature-based profile.' },
  delete_sig_profile:
    { method: 'DELETE', path: '/signatureBasedProfiles/{id}', description: 'Delete signature-based profile.' },
};

export function createVszSecurityTool(httpClient: VszHttpClient): ToolDefinition {
  return createDomainTool(
    {
      name: 'vsz_security',
      description:
        'Ruckus vSZ security policies. Manage account security, device policies, ' +
        'firewall profiles, L2/L3 access control, AVC application policies, ' +
        'geofencing, rogue AP classification, and more.',
      actions,
    },
    httpClient,
  );
}
