/**
 * vsz_auth_services Tool
 *
 * Authentication and accounting services: RADIUS accounting,
 * authentication services (RADIUS/AD/LDAP/local DB), AAA test,
 * VSA profiles, and web authentication.
 *
 * Source: docs/openapi-parsed-endpoints.md (Accounting Service,
 *   Authentication Profile, Authentication Service, Test AAA Server,
 *   Vendor Specific Attribute Profile, Web Authentication)
 */

import type { VszHttpClient } from '../http/client.js';
import type { ToolDefinition, ActionDefinition } from './base-tool.js';
import { createDomainTool } from './base-tool.js';

const actions: Record<string, ActionDefinition> = {
  // ── Accounting Service ─────────────────────────────────────
  query_acct_aaa: {
    method: 'POST',
    path: '/query/services/aaaServer/acct',
    description: 'Query non-proxy accounting AAA servers with specified filters.',
  },
  delete_acct_bulk: {
    method: 'DELETE',
    path: '/services/acct',
    description: 'Delete a list of accounting services.',
  },
  delete_acct: {
    method: 'DELETE',
    path: '/services/acct/{id}',
    description: 'Delete an accounting service.',
  },
  query_acct: {
    method: 'POST',
    path: '/services/acct/query',
    description: 'Retrieve a list of accounting services by query criteria.',
  },
  list_acct_radius: {
    method: 'GET',
    path: '/services/acct/radius',
    description: 'Retrieve a list of RADIUS accounting services.',
  },
  create_acct_radius: {
    method: 'POST',
    path: '/services/acct/radius',
    description: 'Create a new RADIUS accounting service.',
  },
  get_acct_radius: {
    method: 'GET',
    path: '/services/acct/radius/{id}',
    description: 'Retrieve a RADIUS accounting service.',
  },
  replace_acct_radius: {
    method: 'PUT',
    path: '/services/acct/radius/{id}',
    description: 'Modify entire RADIUS accounting service.',
  },
  delete_acct_radius: {
    method: 'DELETE',
    path: '/services/acct/radius/{id}',
    description: 'Delete a RADIUS accounting service.',
  },
  update_acct_radius: {
    method: 'PATCH',
    path: '/services/acct/radius/{id}',
    description: 'Modify the configuration of a RADIUS accounting service.',
  },
  delete_acct_radius_secondary: {
    method: 'DELETE',
    path: '/services/acct/radius/{id}/secondary',
    description: 'Disable secondary RADIUS server of a RADIUS accounting service.',
  },
  query_acct_radius: {
    method: 'POST',
    path: '/services/acct/radius/query',
    description: 'Retrieve a list of RADIUS accounting services by query criteria.',
  },
  test_acct: {
    method: 'POST',
    path: '/services/acct/test/{id}',
    description: 'Test an accounting service.',
  },

  // ── Authentication Profile ─────────────────────────────────
  query_auth_profiles: {
    method: 'POST',
    path: '/profiles/auth/authServiceList/query',
    description: 'Retrieve a list of authentication service profiles.',
  },

  // ── Authentication Service ─────────────────────────────────
  query_auth_aaa: {
    method: 'POST',
    path: '/query/services/aaaServer/auth',
    description: 'Query non-proxy authentication AAA servers with specified filters.',
  },
  delete_auth_bulk: {
    method: 'DELETE',
    path: '/services/auth',
    description: 'Delete a list of authentication services.',
  },
  delete_auth: {
    method: 'DELETE',
    path: '/services/auth/{id}',
    description: 'Delete an authentication service.',
  },
  list_auth_ad: {
    method: 'GET',
    path: '/services/auth/ad',
    description: 'Retrieve a list of Active Directory authentication services.',
  },
  create_auth_ad: {
    method: 'POST',
    path: '/services/auth/ad',
    description: 'Create a new Active Directory authentication service.',
  },
  get_auth_ad: {
    method: 'GET',
    path: '/services/auth/ad/{id}',
    description: 'Retrieve an Active Directory authentication service.',
  },
  delete_auth_ad: {
    method: 'DELETE',
    path: '/services/auth/ad/{id}',
    description: 'Delete an Active Directory authentication service.',
  },
  update_auth_ad: {
    method: 'PATCH',
    path: '/services/auth/ad/{id}',
    description: 'Modify an Active Directory authentication service.',
  },
  query_auth_ad: {
    method: 'POST',
    path: '/services/auth/ad/query',
    description: 'Retrieve a list of AD authentication services by query criteria.',
  },
  get_auth_guest: {
    method: 'GET',
    path: '/services/auth/guest/{id}',
    description: 'Retrieve a Guest authentication service.',
  },
  list_auth_ldap: {
    method: 'GET',
    path: '/services/auth/ldap',
    description: 'Retrieve a list of LDAP authentication services.',
  },
  create_auth_ldap: {
    method: 'POST',
    path: '/services/auth/ldap',
    description: 'Create a new LDAP authentication service.',
  },
  get_auth_ldap: {
    method: 'GET',
    path: '/services/auth/ldap/{id}',
    description: 'Retrieve a LDAP authentication service.',
  },
  delete_auth_ldap: {
    method: 'DELETE',
    path: '/services/auth/ldap/{id}',
    description: 'Delete a LDAP authentication service.',
  },
  update_auth_ldap: {
    method: 'PATCH',
    path: '/services/auth/ldap/{id}',
    description: 'Modify a LDAP authentication service.',
  },
  query_auth_ldap: {
    method: 'POST',
    path: '/services/auth/ldap/query',
    description: 'Retrieve a list of LDAP authentication services by query criteria.',
  },
  get_auth_local_db: {
    method: 'GET',
    path: '/services/auth/local_db/{id}',
    description: 'Retrieve a LocalDB authentication service.',
  },
  update_auth_local_db: {
    method: 'PATCH',
    path: '/services/auth/local_db/{id}',
    description: 'Update a LocalDB authentication service.',
  },
  query_auth: {
    method: 'POST',
    path: '/services/auth/query',
    description: 'Retrieve a list of authentication services by query criteria.',
  },
  list_auth_radius: {
    method: 'GET',
    path: '/services/auth/radius',
    description: 'Retrieve a list of RADIUS authentication services.',
  },
  create_auth_radius: {
    method: 'POST',
    path: '/services/auth/radius',
    description: 'Create a new RADIUS authentication service.',
  },
  get_auth_radius: {
    method: 'GET',
    path: '/services/auth/radius/{id}',
    description: 'Retrieve a RADIUS authentication service.',
  },
  replace_auth_radius: {
    method: 'PUT',
    path: '/services/auth/radius/{id}',
    description: 'Modify entire RADIUS authentication service.',
  },
  delete_auth_radius: {
    method: 'DELETE',
    path: '/services/auth/radius/{id}',
    description: 'Delete a RADIUS authentication service.',
  },
  update_auth_radius: {
    method: 'PATCH',
    path: '/services/auth/radius/{id}',
    description: 'Modify a RADIUS authentication service.',
  },
  delete_auth_radius_secondary: {
    method: 'DELETE',
    path: '/services/auth/radius/{id}/secondary',
    description: 'Disable secondary RADIUS server of a RADIUS authentication service.',
  },
  query_auth_radius: {
    method: 'POST',
    path: '/services/auth/radius/query',
    description: 'Retrieve a list of RADIUS authentication services by query criteria.',
  },
  test_auth: {
    method: 'POST',
    path: '/services/auth/test/{id}',
    description: 'Test an authentication service.',
  },

  // ── Test AAA Server ────────────────────────────────────────
  test_aaa: {
    method: 'POST',
    path: '/system/aaa/test',
    description: 'Test an AAA server.',
  },

  // ── Vendor Specific Attribute Profile ──────────────────────
  list_vsa_profiles: {
    method: 'GET',
    path: '/rkszones/{parentId}/vendorSpecificAttributeProfiles',
    description: 'List vendor specific attribute profiles in a zone (parentId=zoneId).',
  },
  create_vsa_profile: {
    method: 'POST',
    path: '/rkszones/{parentId}/vendorSpecificAttributeProfiles',
    description: 'Create a vendor specific attribute profile (parentId=zoneId).',
  },
  delete_vsa_profiles_bulk: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/vendorSpecificAttributeProfiles',
    description: 'Delete a list of vendor specific attribute profiles (parentId=zoneId).',
  },
  get_vsa_profile: {
    method: 'GET',
    path: '/rkszones/{parentId}/vendorSpecificAttributeProfiles/{id}',
    description: 'Retrieve a vendor specific attribute profile (parentId=zoneId).',
  },
  replace_vsa_profile: {
    method: 'PUT',
    path: '/rkszones/{parentId}/vendorSpecificAttributeProfiles/{id}',
    description: 'Modify entire vendor specific attribute profile (parentId=zoneId).',
  },
  delete_vsa_profile: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/vendorSpecificAttributeProfiles/{id}',
    description: 'Delete a vendor specific attribute profile (parentId=zoneId).',
  },
  query_vsa_profiles: {
    method: 'POST',
    path: '/rkszones/vendorSpecificAttributeProfiles/query',
    description: 'Retrieve a list of vendor specific attribute profiles by query criteria.',
  },

  // ── Web Authentication ────────────────────────────────────
  query_web_auth: {
    method: 'POST',
    path: '/query/services/webAuthentication',
    description: 'Query web authentications with specified filters.',
  },
  list_web_auth: {
    method: 'GET',
    path: '/rkszones/{parentId}/portals/webauth',
    description: 'Retrieve a list of web authentication of a zone (parentId=zoneId).',
  },
  create_web_auth: {
    method: 'POST',
    path: '/rkszones/{parentId}/portals/webauth',
    description: 'Create a new web authentication (parentId=zoneId).',
  },
  get_web_auth: {
    method: 'GET',
    path: '/rkszones/{parentId}/portals/webauth/{id}',
    description: 'Retrieve a web authentication (parentId=zoneId).',
  },
  delete_web_auth: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/portals/webauth/{id}',
    description: 'Delete a web authentication (parentId=zoneId).',
  },
  update_web_auth: {
    method: 'PATCH',
    path: '/rkszones/{parentId}/portals/webauth/{id}',
    description: 'Modify web authentication configuration (parentId=zoneId).',
  },
  delete_web_auth_redirect: {
    method: 'DELETE',
    path: '/rkszones/{parentId}/portals/webauth/{id}/redirect',
    description: 'Reset redirect URL on web authentication to default (parentId=zoneId).',
  },
};

export function createVszAuthServicesTool(httpClient: VszHttpClient): ToolDefinition {
  return createDomainTool(
    {
      name: 'vsz_auth_services',
      description:
        'Ruckus vSZ authentication and accounting services. Manage RADIUS accounting, ' +
        'authentication services (RADIUS/AD/LDAP/local DB/Guest), AAA test, ' +
        'vendor specific attribute profiles, and web authentication.',
      actions,
    },
    httpClient,
  );
}
