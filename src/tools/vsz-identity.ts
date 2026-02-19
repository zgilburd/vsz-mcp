/**
 * vsz_identity Tool
 *
 * Identity and user management: Hotspot 2.0 identity providers,
 * guest passes, subscription packages, identity users and roles,
 * SCG users and groups.
 *
 * Source: docs/openapi-parsed-endpoints.md (Hotspot 2.0 Identity Provider
 *   Profile, Identity Guest Pass, Identity Subscription Package,
 *   Identity User, Identity User Role, SCG User, SCG User Group)
 */

import type { VszHttpClient } from '../http/client.js';
import type { ToolDefinition, ActionDefinition } from './base-tool.js';
import { createDomainTool } from './base-tool.js';

const actions: Record<string, ActionDefinition> = {
  // ── Hotspot 2.0 Identity Provider Profile ──────────────────
  list_hs20_identity_providers: {
    method: 'GET',
    path: '/profiles/hs20/identityproviders',
    description: 'List Hotspot 2.0 identity provider profiles.',
  },
  create_hs20_identity_provider: {
    method: 'POST',
    path: '/profiles/hs20/identityproviders',
    description: 'Create a Hotspot 2.0 identity provider profile.',
  },
  delete_hs20_identity_providers_bulk: {
    method: 'DELETE',
    path: '/profiles/hs20/identityproviders',
    description: 'Delete multiple Hotspot 2.0 identity provider profiles.',
  },
  get_hs20_identity_provider: {
    method: 'GET',
    path: '/profiles/hs20/identityproviders/{id}',
    description: 'Retrieve a Hotspot 2.0 identity provider profile.',
  },
  delete_hs20_identity_provider: {
    method: 'DELETE',
    path: '/profiles/hs20/identityproviders/{id}',
    description: 'Delete a Hotspot 2.0 identity provider profile.',
  },
  update_hs20_identity_provider: {
    method: 'PATCH',
    path: '/profiles/hs20/identityproviders/{id}',
    description: 'Modify a Hotspot 2.0 identity provider profile.',
  },
  delete_hs20_identity_provider_accountings: {
    method: 'DELETE',
    path: '/profiles/hs20/identityproviders/{id}/accountings',
    description: 'Disable accountings of a Hotspot 2.0 identity provider.',
  },
  delete_hs20_identity_provider_osu: {
    method: 'DELETE',
    path: '/profiles/hs20/identityproviders/{id}/osu',
    description: 'Disable online signup of a Hotspot 2.0 identity provider.',
  },
  query_hs20_identity_providers: {
    method: 'POST',
    path: '/profiles/hs20/identityproviders/query',
    description: 'Query Hotspot 2.0 identity provider profiles.',
  },

  // ── Identity Guest Pass ────────────────────────────────────
  list_guest_passes: {
    method: 'GET',
    path: '/identity/guestpass',
    description: 'List identity guest passes.',
  },
  delete_guest_passes_bulk: {
    method: 'DELETE',
    path: '/identity/guestpass',
    description: 'Delete multiple identity guest passes.',
  },
  delete_guest_pass: {
    method: 'DELETE',
    path: '/identity/guestpass/{id}',
    description: 'Delete an identity guest pass.',
  },
  update_guest_pass: {
    method: 'PATCH',
    path: '/identity/guestpass/{id}',
    description: 'Modify an identity guest pass.',
  },
  generate_guest_pass: {
    method: 'POST',
    path: '/identity/guestpass/generate',
    description: 'Generate identity guest passes.',
  },
  upload_guest_pass: {
    method: 'POST',
    path: '/identity/guestpass/upload',
    description: 'Upload identity guest pass CSV file.',
  },
  upload_guest_pass_common: {
    method: 'POST',
    path: '/identity/guestpass/upload/common',
    description: 'Update common identity guest pass settings.',
  },
  query_guest_passes: {
    method: 'POST',
    path: '/identity/guestpassList',
    description: 'Query identity guest passes with filters.',
  },

  // ── Identity Subscription Package ──────────────────────────
  query_packages: {
    method: 'POST',
    path: '/identity/packageList',
    description: 'Query subscription packages with filters.',
  },
  list_packages: {
    method: 'GET',
    path: '/identity/packages',
    description: 'List subscription packages.',
  },
  create_package: {
    method: 'POST',
    path: '/identity/packages',
    description: 'Create a subscription package.',
  },
  delete_packages_bulk: {
    method: 'DELETE',
    path: '/identity/packages',
    description: 'Delete multiple subscription packages.',
  },
  get_package: {
    method: 'GET',
    path: '/identity/packages/{id}',
    description: 'Retrieve a subscription package.',
  },
  delete_package: {
    method: 'DELETE',
    path: '/identity/packages/{id}',
    description: 'Delete a subscription package.',
  },
  update_package: {
    method: 'PATCH',
    path: '/identity/packages/{id}',
    description: 'Modify a subscription package.',
  },

  // ── Identity User ──────────────────────────────────────────
  query_identity_users: {
    method: 'POST',
    path: '/identity/userList',
    description: 'Query identity users with filters.',
  },
  list_identity_users: {
    method: 'GET',
    path: '/identity/users',
    description: 'List identity users.',
  },
  create_identity_user: {
    method: 'POST',
    path: '/identity/users',
    description: 'Create an identity user.',
  },
  delete_identity_users_bulk: {
    method: 'DELETE',
    path: '/identity/users',
    description: 'Delete multiple identity users.',
  },
  get_identity_user: {
    method: 'GET',
    path: '/identity/users/{id}',
    description: 'Retrieve an identity user.',
  },
  delete_identity_user: {
    method: 'DELETE',
    path: '/identity/users/{id}',
    description: 'Delete an identity user.',
  },
  update_identity_user: {
    method: 'PATCH',
    path: '/identity/users/{id}',
    description: 'Modify an identity user.',
  },
  list_aaa_servers: {
    method: 'GET',
    path: '/identity/users/aaaserver',
    description: 'List AAA servers for identity users.',
  },
  list_countries: {
    method: 'GET',
    path: '/identity/users/countries',
    description: 'List countries for identity users.',
  },
  list_user_packages: {
    method: 'GET',
    path: '/identity/users/packages',
    description: 'List packages for identity users.',
  },

  // ── Identity User Role ─────────────────────────────────────
  list_user_roles: {
    method: 'GET',
    path: '/identity/userrole',
    description: 'List identity user roles.',
  },
  create_user_role: {
    method: 'POST',
    path: '/identity/userrole',
    description: 'Create an identity user role.',
  },
  delete_user_roles_bulk: {
    method: 'DELETE',
    path: '/identity/userrole',
    description: 'Delete multiple identity user roles.',
  },
  get_user_role: {
    method: 'GET',
    path: '/identity/userrole/{id}',
    description: 'Retrieve an identity user role.',
  },
  delete_user_role: {
    method: 'DELETE',
    path: '/identity/userrole/{id}',
    description: 'Delete an identity user role.',
  },
  update_user_role: {
    method: 'PATCH',
    path: '/identity/userrole/{id}',
    description: 'Modify an identity user role.',
  },
  query_user_roles: {
    method: 'POST',
    path: '/identity/userRoleList',
    description: 'Query identity user roles with filters.',
  },

  // ── SCG User ───────────────────────────────────────────────
  create_scg_user: {
    method: 'POST',
    path: '/users',
    description: 'Add an SCG user.',
  },
  delete_scg_users_bulk: {
    method: 'DELETE',
    path: '/users',
    description: 'Delete multiple SCG users.',
  },
  get_scg_user: {
    method: 'GET',
    path: '/users/{id}',
    description: 'Retrieve an SCG user.',
  },
  delete_scg_user: {
    method: 'DELETE',
    path: '/users/{id}',
    description: 'Delete an SCG user.',
  },
  update_scg_user: {
    method: 'PATCH',
    path: '/users/{id}',
    description: 'Update an SCG user.',
  },
  query_scg_users: {
    method: 'POST',
    path: '/users/query',
    description: 'Query SCG users.',
  },

  // ── SCG User Group ─────────────────────────────────────────
  create_user_group: {
    method: 'POST',
    path: '/userGroups',
    description: 'Add an SCG user group.',
  },
  delete_user_groups_bulk: {
    method: 'DELETE',
    path: '/userGroups',
    description: 'Delete multiple SCG user groups.',
  },
  get_user_group: {
    method: 'GET',
    path: '/userGroups/{id}',
    description: 'Retrieve an SCG user group.',
  },
  delete_user_group: {
    method: 'DELETE',
    path: '/userGroups/{id}',
    description: 'Delete an SCG user group.',
  },
  update_user_group: {
    method: 'PATCH',
    path: '/userGroups/{id}',
    description: 'Update an SCG user group.',
  },
  get_current_user_permissions: {
    method: 'GET',
    path: '/userGroups/currentUser/permissionCategories',
    description: 'Get permitted categories of the current user.',
  },
  query_user_groups: {
    method: 'POST',
    path: '/userGroups/query',
    description: 'Query SCG user groups.',
  },
  list_predefined_roles: {
    method: 'GET',
    path: '/userGroups/roles',
    description: 'List pre-defined SCG user group roles.',
  },
  get_role_permissions: {
    method: 'GET',
    path: '/userGroups/roles/{id}',
    description: 'Get permission items of a pre-defined role.',
  },
};

export function createVszIdentityTool(httpClient: VszHttpClient): ToolDefinition {
  return createDomainTool(
    {
      name: 'vsz_identity',
      description:
        'Ruckus vSZ identity and user management. Manage Hotspot 2.0 identity ' +
        'providers, guest passes, subscription packages, identity users and ' +
        'roles, SCG users and groups.',
      actions,
    },
    httpClient,
  );
}
