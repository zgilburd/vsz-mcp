# MCP Server Architecture for Ruckus vSZ 7.1.1 API

> **Document Type**: Architecture Design Document
>
> **Based On**: [API Endpoints Catalog](./api-endpoints-catalog.md) (~750+ endpoints across 87 categories), [API Patterns Analysis](./api-patterns-analysis.md) (authentication, pagination, error handling)
>
> **Date**: 2026-02-19

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Configuration Schema](#2-configuration-schema)
3. [Authentication Architecture](#3-authentication-architecture)
4. [Tool Grouping Strategy](#4-tool-grouping-strategy)
5. [Tool Naming Convention](#5-tool-naming-convention)
6. [Tool Definitions](#6-tool-definitions)
7. [MCP Resource Definitions](#7-mcp-resource-definitions)
8. [Pagination Strategy](#8-pagination-strategy)
9. [Error Handling](#9-error-handling)
10. [TypeScript Interfaces](#10-typescript-interfaces)
11. [Project Directory Structure](#11-project-directory-structure)
12. [Architecture Decision Records](#12-architecture-decision-records)

---

## 1. Design Principles

1. **Domain-grouped tools, not 1:1 endpoint mapping.** The vSZ API has ~750 endpoints. Exposing each as an individual MCP tool would be unusable. Instead, group by operational domain with a uniform CRUD+query interface per domain.

2. **Configuration-driven edition support.** The two vSZ editions (vSZ-H on port 8443 with service tickets, vSZ-E on port 7443 with sessions) share identical endpoint schemas but differ in base URL and auth mechanism. A single configuration choice drives both. (Source: [api-patterns-analysis.md, Section 1-2](./api-patterns-analysis.md))

3. **Transparent pagination.** Tools return complete result sets by default, iterating over pages internally. Callers can opt into manual pagination when needed. (Source: [api-patterns-analysis.md, Section 4](./api-patterns-analysis.md))

4. **Fail-fast with mapped errors.** Ruckus error codes (0-302) map to MCP error codes with actionable messages. (Source: [api-patterns-analysis.md, Section 5](./api-patterns-analysis.md))

5. **Typed throughout.** All tool inputs and outputs use TypeScript interfaces. No `any` types at public boundaries.

---

## 2. Configuration Schema

Users configure the MCP server through a JSON configuration object. The server reads this from environment variables or a config file.

### Configuration Interface

```typescript
interface VszMcpConfig {
  /** vSZ controller hostname or IP */
  host: string;

  /** Controller port. Defaults: 8443 (vSZ-H/SZ), 7443 (vSZ-E) */
  port?: number;

  /** Controller edition. Determines base URL prefix and auth method. */
  edition: 'vsz-h' | 'vsz-e';

  /** API version string. Example: 'v12_0'. */
  apiVersion: string;

  /** Admin credentials */
  username: string;
  password: string;

  /**
   * Accept self-signed TLS certificates.
   * vSZ controllers use self-signed certs by default.
   * Source: api-patterns-analysis.md, Section 3 (HTTPS Requirement)
   */
  tlsRejectUnauthorized?: boolean;

  /**
   * Maximum results to auto-paginate before stopping.
   * Prevents runaway queries. Default: 10000.
   */
  maxAutoPageResults?: number;

  /**
   * Service ticket refresh interval in milliseconds.
   * Default: 23 hours (tickets last ~24h).
   * Source: api-patterns-analysis.md, Section 2 (Service Ticket Lifetime)
   */
  tokenRefreshIntervalMs?: number;
}
```

### Derived Values by Edition

| Setting | `vsz-h` | `vsz-e` |
|---------|---------|---------|
| Default port | 8443 | 7443 |
| Base URL prefix | `/wsg/api/public/{version}/` | `/api/public/{version}/` |
| Auth method | Service Ticket (query param) | Session Cookie (JSESSIONID) |
| Login endpoint | `POST /serviceTicket` | `POST /session` |
| Logout endpoint | `DELETE /serviceTicket` | `DELETE /session` |

Source: [api-patterns-analysis.md, Sections 1-2](./api-patterns-analysis.md); [api-endpoints-catalog.md, Section 1](./api-endpoints-catalog.md)

### Environment Variable Mapping

| Variable | Config field | Required |
|----------|-------------|----------|
| `VSZ_HOST` | `host` | Yes |
| `VSZ_PORT` | `port` | No |
| `VSZ_EDITION` | `edition` | Yes |
| `VSZ_API_VERSION` | `apiVersion` | Yes |
| `VSZ_USERNAME` | `username` | Yes |
| `VSZ_PASSWORD` | `password` | Yes |
| `VSZ_TLS_REJECT_UNAUTHORIZED` | `tlsRejectUnauthorized` | No |

---

## 3. Authentication Architecture

### Design

The MCP server manages authentication transparently. No MCP tool exposes login/logout directly. The server authenticates on startup (or on first tool call) and maintains a valid token/session for the lifetime of the process.

```
                 MCP Client
                     |
                     v
            +------------------+
            |   MCP Server     |
            |                  |
            |  AuthManager     |  <-- manages token lifecycle
            |    |             |
            |    v             |
            |  HttpClient      |  <-- injects auth into every request
            |    |             |
            +----|-----------  +
                 |
                 v
            vSZ Controller
```

### AuthManager Responsibilities

1. **Login**: Call `POST /serviceTicket` or `POST /session` based on `edition` config.
2. **Token storage**: Hold the service ticket string (vSZ-H) or JSESSIONID cookie (vSZ-E) in memory.
3. **Token injection**: For vSZ-H, append `?serviceTicket={token}` to every request URL. For vSZ-E, set `Cookie: JSESSIONID={token}` header on every request. (Source: [api-patterns-analysis.md, Section 2](./api-patterns-analysis.md))
4. **Token refresh**: Proactively re-authenticate before the token expires (~24h for service tickets). Schedule refresh at `tokenRefreshIntervalMs` (default 23h).
5. **Retry on 401**: If a request returns HTTP 401 or Ruckus error code 201 (No active session), re-authenticate once and retry the request. (Source: [api-patterns-analysis.md, Section 5](./api-patterns-analysis.md))
6. **Logout on shutdown**: Call the appropriate logout endpoint when the MCP server process shuts down.

### Auth Flow Sequence

```
Server Start
  |
  +--> AuthManager.login()
  |      |
  |      +--> POST /{version}/serviceTicket  [vsz-h]
  |      |    body: { username, password }
  |      |    response: { serviceTicket, controllerVersion }
  |      |
  |      +--> POST /{version}/session  [vsz-e]
  |           body: { username, password }
  |           response: Set-Cookie: JSESSIONID=...
  |
  +--> Schedule token refresh at (now + tokenRefreshIntervalMs)
  |
  +--> Ready to serve MCP tool calls
```

---

## 4. Tool Grouping Strategy

### Rationale

The 87 API categories contain ~750 endpoints. Many categories follow identical CRUD patterns (list, get, create, update, delete) plus a query variant. Rather than exposing one tool per endpoint, we group by **operational domain** and use a consistent action parameter.

### Domain Groupings (14 tool groups)

| # | Tool Group | API Categories Covered | Key Endpoints |
|---|-----------|----------------------|---------------|
| 1 | **session** | Login/Session (cat. 1) | Service ticket and session lifecycle |
| 2 | **zones** | AP Zones, Zone sub-resources, Zone AAA, Zone WLANs, Zone Hotspot (cat. 3, 11, 21) | `/rkszones`, `/rkszones/{id}/*` |
| 3 | **ap** | AP Config, AP Operational, AP Overrides, AP Packet Capture, AP Registration Rules, AP USB (cat. 5-7, 46-47) | `/aps`, `/aps/{mac}/*`, `/query/ap` |
| 4 | **wlan** | WLANs, WLAN Groups, WLAN Scheduler (cat. 8-10) | `/wlans`, `/wlangroups`, `/wlanSchedulers` |
| 5 | **client** | Wireless Client, Wired Client, Block Client (cat. 29-30, 35) | `/client`, `/query/client`, `/blockClients` |
| 6 | **identity** | Identity Users, Roles, Guest Passes, Subscription Packages, SCG Users/Groups (cat. 59-64) | `/identityUsers`, `/identityUserRoles`, `/identityGuestPasses`, `/scgUsers` |
| 7 | **auth-services** | Authentication Services (RADIUS, AD, LDAP, OAuth, Proxy AAA), Accounting Services (cat. 12-13) | `/radiusAuthenticationService`, `/adAuthenticationService`, `/ldapAuthenticationService`, `/oAuthAuthenticationService`, `/radiusAccountingService` |
| 8 | **hotspot** | Hotspot Service, Hotspot 2.0 (WLAN, Venue, Operator, IdP profiles), Guest Access, Web Auth, WISPr (cat. 14-21, 87) | `/hotspotService`, `/hotspot20*`, `/guestAccess`, `/webAuthentication` |
| 9 | **security** | L2 ACL, L3 ACL, Firewall, Device Policy, Mark Rogue, AVC, Client Isolation, CALEA (cat. 31-38, 56, 71) | `/profiles/l2ACL`, `/l3AccessControlPolicies`, `/firewallProfiles`, `/avc/*`, `/rogues/*` |
| 10 | **network** | DHCP, DNS, Data Plane, Control Plane, RuckusGRE, SoftGRE, IPSec, VDP, Bonjour, VLAN Pooling, DiffServ, Precedence, Flexi-VPN, L3 Roaming, Bridge, Mesh, Zone Affinity, Ethernet Port (cat. 25-26, 37, 39, 48-58, 66-68, 73-74) | `/dhcpPools`, `/profiles/dnsServerProfile`, `/dataPlanes`, `/controlPlanes`, various profile endpoints |
| 11 | **system** | System, Controller, Administration, Syslog, SNMP, FTP, App Log, NBI, SCI, LWAPP (cat. 27-28, 44-45, 72, 75-77, 80, 85-86) | `/system/*`, `/controller`, `/syslogServer`, `/snmpAgent` |
| 12 | **monitoring** | Events, Alarms, Health Monitoring, Traffic Analysis, Connectivity Tools (cat. 79, 81, 83-84) | `/events/query`, `/alarms/query`, `/trafficAnalysis/*`, `/connectivityTools/*` |
| 13 | **backup** | Configuration Backup/Restore, Cluster Backup, System Upgrade (cat. 41-43) | `/backupRestore`, `/clusterBackup`, `/systemUpgrade` |
| 14 | **certificate** | Certificate Management, Certificate Store, DPSK (cat. 22-23, 40) | `/certificate`, `/certstore/*`, `/dpsk/*` |
| 15 | **query** | Cross-cutting query endpoint (cat. 82) | `POST /query/{resource}` for any supported resource |
| 16 | **indoor-map** | Indoor Map, LBS Profile (cat. 69-70) | `/indoorMaps`, `/lbsProfiles` |

### Tool Count Summary

Each tool group provides a single MCP tool with an `action` parameter. This yields **16 MCP tools** total (plus any utility tools like `vsz_raw_request`), compared to the ~750 raw API endpoints. This is a manageable number for an LLM to select from while still covering the full API surface.

---

## 5. Tool Naming Convention

### Pattern

```
vsz_{domain}
```

All tools use the prefix `vsz_` for namespace clarity. The domain name uses snake_case and maps directly to the tool group names from Section 4.

### Tool Names

| Tool Name | Domain |
|-----------|--------|
| `vsz_zones` | Zone management |
| `vsz_ap` | Access point management |
| `vsz_wlan` | WLAN and WLAN group management |
| `vsz_client` | Client monitoring and control |
| `vsz_identity` | Identity/user management |
| `vsz_auth_services` | Authentication and accounting services |
| `vsz_hotspot` | Hotspot and guest access |
| `vsz_security` | Security policies and ACLs |
| `vsz_network` | Network infrastructure profiles |
| `vsz_system` | System administration |
| `vsz_monitoring` | Events, alarms, health, traffic |
| `vsz_backup` | Backup, restore, upgrade |
| `vsz_certificate` | Certificates and DPSK |
| `vsz_query` | Generic query with filters |
| `vsz_indoor_map` | Indoor maps and LBS |
| `vsz_raw_request` | Escape hatch: arbitrary API call |

---

## 6. Tool Definitions

### Common Action Pattern

Most domain tools share a common action pattern:

```typescript
interface ToolInput {
  /** The operation to perform */
  action: 'list' | 'get' | 'create' | 'update' | 'delete' | 'query' | string;

  /** Resource sub-type within the domain (e.g., 'radius', 'ldap' for auth-services) */
  resource?: string;

  /** Resource ID (UUID) for get/update/delete operations */
  id?: string;

  /** Parent resource ID (e.g., zoneId for zone sub-resources) */
  parentId?: string;

  /** Request body for create/update/query operations */
  data?: Record<string, unknown>;

  /** Pagination override. If omitted, auto-paginate. */
  page?: number;
  limit?: number;
}
```

### Tool: `vsz_zones`

Manages AP zones and their sub-resources (radio settings, mesh, syslog, AAA, WLANs within zones).

**Actions**:
- `list` -- `GET /rkszones` (Source: [api-endpoints-catalog.md, Section 3](./api-endpoints-catalog.md))
- `get` -- `GET /rkszones/{id}`
- `create` -- `POST /rkszones` (also `create_ipv6`, `create_dual` for IPv6/dual-stack)
- `update` -- `PATCH /rkszones/{id}`
- `delete` -- `DELETE /rkszones/{id}`
- `get_sub` -- `GET /rkszones/{id}/{subResource}` (e.g., `meshConfig`, `radio24g`)
- `update_sub` -- `PATCH /rkszones/{id}/{subResource}`
- `delete_sub` -- `DELETE /rkszones/{id}/{subResource}`
- `list_wlans` -- `GET /rkszones/{zoneId}/wlans`
- `create_wlan` -- `POST /rkszones/{zoneId}/wlans`
- `list_aaa` -- `GET /rkszones/{zoneId}/aaa/{aaaType}` (resource: `radius`, `activeDirectory`, `ldap`)
- `create_aaa` -- `POST /rkszones/{zoneId}/aaa/{aaaType}`

### Tool: `vsz_ap`

Manages access points -- configuration, operational data, overrides, and packet capture.

**Actions**:
- `list` -- `GET /aps` (Source: [api-endpoints-catalog.md, Section 5](./api-endpoints-catalog.md))
- `get` -- `GET /aps/{apMac}`
- `create` -- `POST /aps`
- `update` -- `PATCH /aps/{apMac}`
- `delete` -- `DELETE /aps/{apMac}`
- `reboot` -- `PUT /aps/{apMac}/reboot`
- `blink_led` -- `POST /aps/{apMac}/operational/blinkLed`
- `get_operational` -- `GET /aps/{apMac}/operational/summary` (Source: [api-endpoints-catalog.md, Section 6](./api-endpoints-catalog.md))
- `get_alarms` -- `GET /aps/{apMac}/alarmSummary`
- `get_events` -- `GET /aps/{apMac}/eventSummary`
- `get_rogues` -- `GET /aps/{apMac}/rogueApList`
- `update_override` -- `PATCH /aps/{apMac}/{overrideName}` (e.g., `radio24gOverride`)
- `delete_override` -- `DELETE /aps/{apMac}/{overrideName}`
- `move` -- `PUT /aps/move/{zoneId}` (body: MAC address array)
- `start_capture` -- `POST /aps/{apMac}/apPacketCapture/startFileCapture`
- `stop_capture` -- `POST /aps/{apMac}/apPacketCapture/stop`
- `query` -- `POST /query/ap` (Source: [api-endpoints-catalog.md, Section 82](./api-endpoints-catalog.md))

### Tool: `vsz_wlan`

Manages WLANs, WLAN groups, and WLAN schedulers.

**Actions**:
- `list` -- `GET /wlans` (Source: [api-endpoints-catalog.md, Section 9](./api-endpoints-catalog.md))
- `get` -- `GET /wlans/{id}`
- `create` -- `POST /wlans/{type}` (type: `standardOpen`, `802_1x`, `macAuth`, `hotspot`, `guestAccess`, `webAuth`, `hotspot2_0`, etc.)
- `update` -- `PATCH /wlans/{id}`
- `update_sub` -- `PATCH /wlans/{id}/{subResource}` (e.g., `authentication`, `encryption`, `vlan`)
- `delete` -- `DELETE /wlans/{id}`
- `list_groups` -- `GET /wlangroups` (Source: [api-endpoints-catalog.md, Section 8](./api-endpoints-catalog.md))
- `get_group` -- `GET /wlangroups/{id}`
- `create_group` -- `POST /wlangroups`
- `update_group` -- `PATCH /wlangroups/{id}`
- `delete_group` -- `DELETE /wlangroups/{id}`
- `list_schedulers` -- `GET /wlanSchedulers`
- `query` -- `POST /wlans/query`

### Tool: `vsz_client`

Client monitoring, deauthentication, and block management.

**Actions**:
- `list` -- `GET /client` (Source: [api-endpoints-catalog.md, Section 29](./api-endpoints-catalog.md))
- `total` -- `GET /client/total`
- `query` -- `POST /query/client`
- `deauth` -- `POST /client/{id}/deAuth` (single or `POST /client/deAuth` bulk)
- `disconnect` -- `POST /client/{id}/disconnect`
- `historical` -- `POST /client/historical`
- `query_wired` -- `POST /wiredClients/query` (Source: [api-endpoints-catalog.md, Section 30](./api-endpoints-catalog.md))
- `list_blocked` -- `GET /blockClients` (Source: [api-endpoints-catalog.md, Section 35](./api-endpoints-catalog.md))
- `block` -- `POST /blockClients`
- `unblock` -- `DELETE /blockClients/{id}`
- `query_blocked` -- `POST /blockClients/query`

### Tool: `vsz_query`

Generic query tool using the POST query pattern. Supports any resource that has a `/query/{resource}` endpoint.

**Input**:
```typescript
interface VszQueryInput {
  /** Resource to query: 'ap', 'client', 'wlans', 'dpsks', etc. */
  resource: string;

  /** Filter conditions. Source: api-patterns-analysis.md, Section 6 */
  filters?: Array<{ type: string; value: string }>;
  extraFilters?: Array<{ type: string; value: string }>;
  extraNotFilters?: Array<{ type: string; value: string }>;

  /** Full-text search */
  fullTextSearch?: { type: 'AND' | 'OR'; value: string };

  /** Fields to return. Use ['*'] for all. */
  attributes?: string[];

  /** Sort specification */
  sortInfo?: { sortColumn: string; dir: 'ASC' | 'DESC' };

  /** Pagination (1-based page). Auto-paginates if omitted. */
  page?: number;
  limit?: number;
}
```

Source: [api-patterns-analysis.md, Section 6](./api-patterns-analysis.md) -- Query body format with filters, extraFilters, fullTextSearch, sortInfo, page, limit.

### Tool: `vsz_monitoring`

Events, alarms, health, traffic analysis, and connectivity tools.

**Actions**:
- `query_events` -- `POST /events/query` (Source: [api-endpoints-catalog.md, Section 81](./api-endpoints-catalog.md))
- `query_alarms` -- `POST /alarms/query`
- `acknowledge_alarm` -- `PUT /alarms/{id}/acknowledge`
- `clear_alarm` -- `PUT /alarms/{id}/clear`
- `traffic_analysis` -- `POST /trafficAnalysis/client/app/wlan` (Source: [api-endpoints-catalog.md, Section 83](./api-endpoints-catalog.md))
- `health` -- `POST /healthExtend/groupBar/eapFailure` (Source: [api-endpoints-catalog.md, Section 84](./api-endpoints-catalog.md))
- `ping` -- `GET /connectivityTools/ping`
- `traceroute` -- `GET /connectivityTools/traceRoute`
- `speedflex` -- `POST /connectivityTools/speedFlex`

### Tool: `vsz_raw_request`

Escape hatch for any endpoint not covered by the domain tools, or for advanced use cases.

**Input**:
```typescript
interface VszRawRequestInput {
  /** HTTP method */
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

  /** Path relative to base URL (e.g., '/rkszones') */
  path: string;

  /** Query parameters (serviceTicket injected automatically) */
  queryParams?: Record<string, string>;

  /** Request body */
  body?: Record<string, unknown>;
}
```

This tool injects authentication automatically but does not auto-paginate.

---

## 7. MCP Resource Definitions

MCP resources expose vSZ objects as readable data. Resources use URI templates.

### Resource URI Scheme

```
vsz://{resourceType}/{id}
vsz://{resourceType}
```

### Resource Definitions

| Resource URI | Description | API Source |
|-------------|-------------|-----------|
| `vsz://zones` | List of all AP zones | `GET /rkszones` |
| `vsz://zones/{zoneId}` | Single zone configuration | `GET /rkszones/{id}` |
| `vsz://zones/{zoneId}/wlans` | WLANs in a zone | `GET /rkszones/{zoneId}/wlans` |
| `vsz://aps` | List of all access points | `GET /aps` |
| `vsz://aps/{apMac}` | Single AP configuration | `GET /aps/{apMac}` |
| `vsz://aps/{apMac}/operational` | AP operational status | `GET /aps/{apMac}/operational/summary` |
| `vsz://wlans` | List of all WLANs | `GET /wlans` |
| `vsz://wlans/{wlanId}` | Single WLAN | `GET /wlans/{id}` |
| `vsz://clients` | Connected wireless clients | `GET /client` |
| `vsz://clients/total` | Client count | `GET /client/total` |
| `vsz://domains` | Domain list | `GET /domains` |
| `vsz://domains/{domainId}` | Single domain | `GET /domains/{id}` |
| `vsz://system/summary` | System summary | `GET /system/summary` |
| `vsz://system/inventory` | System inventory | `GET /system/inventory` |
| `vsz://controller` | Controller info | `GET /controller` |
| `vsz://alarms` | Active alarms (via query) | `POST /alarms/query` |
| `vsz://events` | Recent events (via query) | `POST /events/query` |

Sources: [api-endpoints-catalog.md, Sections 2-6, 9, 27-29, 81](./api-endpoints-catalog.md)

---

## 8. Pagination Strategy

### Two Pagination Styles

The vSZ API uses two distinct pagination mechanisms (Source: [api-patterns-analysis.md, Section 4](./api-patterns-analysis.md)):

| Style | Used by | Parameters | Page Numbering |
|-------|---------|-----------|----------------|
| **GET list** | `GET /rkszones`, `GET /aps`, etc. | `?index=0&listSize=100` | 0-based offset |
| **POST query** | `POST /query/ap`, `POST /query/client`, etc. | `{ page: 1, limit: 100 }` in body | 1-based page |

### Auto-Pagination Behavior

By default, MCP tools auto-paginate to return the complete result set. The implementation:

1. Issue the first request with the default page size (100, matching the API default).
2. Check `hasMore` (GET list) or compare result count against `totalCount` (POST query).
3. If more results exist, issue subsequent requests incrementing `index` or `page`.
4. Concatenate all `list` arrays into a single response.
5. Stop if the total exceeds `maxAutoPageResults` (default 10000) and return a truncation warning.

### Manual Pagination

If the caller provides explicit `page`/`limit` parameters, auto-pagination is disabled. A single page of results is returned along with pagination metadata (`totalCount`, `hasMore`, `firstIndex`).

### Implementation

```typescript
interface PaginatedResponse<T> {
  totalCount: number;
  hasMore: boolean;
  firstIndex: number;
  list: T[];
  /** Present if auto-pagination was truncated */
  truncated?: boolean;
}
```

Source: [api-patterns-analysis.md, Section 4](./api-patterns-analysis.md) -- response format with `totalCount`, `hasMore`, `firstIndex`, `list`.

---

## 9. Error Handling

### Ruckus Error Code to MCP Error Mapping

Source: [api-patterns-analysis.md, Section 5](./api-patterns-analysis.md)

| Ruckus Code | Ruckus Description | HTTP Status | MCP Error Code | MCP Message |
|-------------|-------------------|-------------|----------------|-------------|
| 0 | Internal server error | 500 | `InternalError` | Controller internal error |
| 101 | Bad HTTP request | 400 | `InvalidParams` | Malformed request |
| 102 | Bad HTTP response | 500 | `InternalError` | Controller response error |
| 103 | Invalid HTTP request body | 400 | `InvalidParams` | Invalid request body |
| 104 | HTTP response body cannot be generated | 500 | `InternalError` | Response generation failure |
| 105 | Unsupported API version | 400 | `InvalidParams` | API version not supported on this controller |
| 150 | Cluster not in service | 503 | `InternalError` | Controller cluster unavailable |
| 151 | Controller node not in service | 503 | `InternalError` | Controller node unavailable |
| 201 | No active session | 401 | `InvalidRequest` | Session expired (triggers auto re-auth) |
| 202 | Login denied | 401 | `InvalidRequest` | Authentication failed -- check credentials |
| 211 | Insufficient administrative privileges | 403 | `InvalidRequest` | Insufficient permissions |
| 212 | Resource access denied | 403 | `InvalidRequest` | Resource access denied |
| 301 | Resource cannot be found | 404 | `InvalidParams` | Resource not found |
| 302 | Business rule violation | 422 | `InvalidParams` | Validation error: {message} |

### Error Response Structure

```typescript
interface VszErrorResponse {
  errorCode: number;
  message: string;
  errorType: string;
}
```

Source: [api-patterns-analysis.md, Section 5](./api-patterns-analysis.md); [api-endpoints-catalog.md, Common Patterns](./api-endpoints-catalog.md)

### Retry Logic

- **401 / Ruckus code 201**: Re-authenticate once, then retry the original request. If the retry also fails, return the error.
- **503 / Ruckus codes 150-151**: Wait 5 seconds, retry up to 3 times.
- **All other errors**: Return immediately, no retry.

---

## 10. TypeScript Interfaces

### Core HTTP Client

```typescript
interface VszHttpClient {
  get<T>(path: string, params?: Record<string, string>): Promise<T>;
  post<T>(path: string, body?: unknown): Promise<T>;
  put<T>(path: string, body?: unknown): Promise<T>;
  patch<T>(path: string, body?: unknown): Promise<T>;
  delete<T>(path: string): Promise<T>;
}
```

### Authentication

```typescript
interface AuthManager {
  /** Authenticate and store credentials */
  login(): Promise<void>;

  /** Invalidate the current session/ticket */
  logout(): Promise<void>;

  /** Apply auth to a request config (mutates in place) */
  applyAuth(config: RequestConfig): void;

  /** Whether a valid token currently exists */
  isAuthenticated(): boolean;
}

interface ServiceTicketAuth {
  type: 'service-ticket';
  serviceTicket: string;
  controllerVersion: string;
  expiresAt: number;
}

interface SessionAuth {
  type: 'session';
  jsessionId: string;
  sessionInfo: {
    cpId: string;
    domainId: string;
    adminRoleId: string;
    adminId: string;
  };
}

type AuthState = ServiceTicketAuth | SessionAuth;
```

### API Response Types

```typescript
/** Standard list response envelope.
 *  Source: api-patterns-analysis.md, Section 7 */
interface ListResponse<T> {
  totalCount: number;
  hasMore: boolean;
  firstIndex: number;
  list: T[];
}

/** Create response. Source: api-patterns-analysis.md, Section 7 */
interface CreateResponse {
  id: string;
}

/** Query request body. Source: api-patterns-analysis.md, Section 6 */
interface QueryRequest {
  filters?: QueryFilter[];
  extraFilters?: QueryFilter[];
  extraNotFilters?: QueryFilter[];
  fullTextSearch?: { type: 'AND' | 'OR'; value: string };
  attributes?: string[];
  sortInfo?: { sortColumn: string; dir: 'ASC' | 'DESC' };
  page?: number;
  limit?: number;
}

interface QueryFilter {
  type: string;
  value: string;
}
```

### Domain Object Types (Key Resources)

```typescript
interface Zone {
  id: string;
  name: string;
  description?: string;
  domainId?: string;
  countryCode?: string;
  timezone?: string;
}

interface AccessPoint {
  /** MAC address in AA:BB:CC:DD:EE:FF format */
  mac: string;
  name?: string;
  zoneId: string;
  apGroupId?: string;
  model: string;
  serial?: string;
  description?: string;
  gpsCoordinates?: { latitude: number; longitude: number };
}

interface Wlan {
  id: string;
  name: string;
  ssid: string;
  zoneId: string;
  description?: string;
  type: string;
  authType?: string;
  encryptionType?: string;
  vlan?: { accessVlan?: number; coreVlan?: number };
}

interface WirelessClient {
  mac: string;
  ipAddress?: string;
  hostname?: string;
  osType?: string;
  apMac: string;
  ssid: string;
  wlanId: string;
  zoneId: string;
  radioType?: string;
  status: string;
}

interface Domain {
  id: string;
  name: string;
  parentDomainId?: string;
}

interface Alarm {
  id: string;
  alarmType: string;
  severity: string;
  acknowledged: boolean;
  timestamp: number;
  message?: string;
}
```

### MCP Tool Handler

```typescript
interface ToolHandler {
  name: string;
  description: string;
  inputSchema: object; // JSON Schema
  handler(input: Record<string, unknown>): Promise<ToolResult>;
}

interface ToolResult {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
}
```

---

## 11. Project Directory Structure

```
vsz-mcp/
  src/
    index.ts                    # MCP server entry point, stdio transport
    server.ts                   # McpServer setup, tool/resource registration
    config.ts                   # Configuration loading and validation
    auth/
      auth-manager.ts           # AuthManager interface + factory
      service-ticket-auth.ts    # vSZ-H service ticket implementation
      session-auth.ts           # vSZ-E session/JSESSIONID implementation
    http/
      client.ts                 # HTTP client with auth injection, retry, TLS
      pagination.ts             # Auto-pagination logic for both styles
    tools/
      base-tool.ts              # Shared tool handler base class
      vsz-zones.ts              # vsz_zones tool
      vsz-ap.ts                 # vsz_ap tool
      vsz-wlan.ts               # vsz_wlan tool
      vsz-client.ts             # vsz_client tool
      vsz-identity.ts           # vsz_identity tool
      vsz-auth-services.ts      # vsz_auth_services tool
      vsz-hotspot.ts            # vsz_hotspot tool
      vsz-security.ts           # vsz_security tool
      vsz-network.ts            # vsz_network tool
      vsz-system.ts             # vsz_system tool
      vsz-monitoring.ts         # vsz_monitoring tool
      vsz-backup.ts             # vsz_backup tool
      vsz-certificate.ts        # vsz_certificate tool
      vsz-query.ts              # vsz_query tool
      vsz-indoor-map.ts         # vsz_indoor_map tool
      vsz-raw-request.ts        # vsz_raw_request escape hatch
    resources/
      resource-registry.ts      # MCP resource registration
      zone-resources.ts         # vsz://zones/* resources
      ap-resources.ts           # vsz://aps/* resources
      wlan-resources.ts         # vsz://wlans/* resources
      client-resources.ts       # vsz://clients/* resources
      system-resources.ts       # vsz://system/* resources
    types/
      config.ts                 # VszMcpConfig interface
      api-responses.ts          # ListResponse, CreateResponse, etc.
      domain-objects.ts         # Zone, AccessPoint, Wlan, etc.
      errors.ts                 # VszErrorResponse, error mapping
      auth.ts                   # ServiceTicketAuth, SessionAuth
  tests/
    unit/
      auth/
        auth-manager.test.ts
        service-ticket-auth.test.ts
        session-auth.test.ts
      http/
        client.test.ts
        pagination.test.ts
      tools/
        vsz-zones.test.ts
        vsz-ap.test.ts
        vsz-query.test.ts
        ...
    integration/
      live-controller.test.ts   # Tests against a real vSZ (env-gated)
  docs/
    api-endpoints-catalog.md
    api-patterns-analysis.md
    mcp-architecture.md         # This document
  package.json
  tsconfig.json
```

### Key Design Notes on Directory Structure

- **`auth/`** separates the two auth strategies behind a common interface, selected by the `edition` config.
- **`http/`** encapsulates all HTTP concerns: TLS, auth injection, retry, pagination.
- **`tools/`** has one file per MCP tool. Each file exports a `ToolHandler` that maps actions to HTTP calls.
- **`resources/`** has one file per resource group. Resources are read-only and delegate to the HTTP client.
- **`types/`** contains all TypeScript interfaces. Domain object types are approximations -- the definitive shapes come from the vSZ OpenAPI spec at `/wsg/apiDoc/openapi` (Source: [api-patterns-analysis.md, Section 10](./api-patterns-analysis.md)).
- **`tests/unit/`** mirrors `src/` structure. Integration tests are gated behind a `VSZ_TEST_HOST` env var.

---

## 12. Architecture Decision Records

### ADR-001: Domain-Grouped Tools Over Per-Endpoint Tools

**Status**: Accepted

**Context**: The vSZ API has ~750 endpoints across 87 categories. Exposing each as a separate MCP tool would overwhelm LLM tool selection.

**Decision**: Group endpoints into 16 domain-based tools with an `action` parameter.

**Consequences**: LLMs see a manageable tool list. The `action` parameter adds one level of indirection but keeps the interface discoverable. The `vsz_raw_request` escape hatch ensures no endpoint is unreachable.

### ADR-002: Edition-Based Configuration Over Runtime Detection

**Status**: Accepted

**Context**: vSZ-H and vSZ-E use different ports, base URL prefixes, and auth mechanisms. We could auto-detect by probing both ports, or require explicit configuration.

**Decision**: Require `edition` in configuration. Derive port and base URL from it.

**Rationale**: Auto-detection is fragile (firewalls may block one port, custom port assignments). Explicit config is reliable and takes one field.

**Consequences**: Users must know their edition. The config validation will fail fast with a clear message if edition is missing.

### ADR-003: Transparent Auto-Pagination by Default

**Status**: Accepted

**Context**: Most vSZ list endpoints return paginated results with 100 items per page. LLMs calling tools expect complete results.

**Decision**: Auto-paginate by default, with `maxAutoPageResults` safety cap (default 10000). Manual pagination available via explicit `page`/`limit` parameters.

**Consequences**: Simple queries return complete data. Large datasets (e.g., 10000+ clients) are safely capped. Power users can manually paginate for fine control.

### ADR-004: Single HTTP Client With Auth Injection

**Status**: Accepted

**Context**: Both auth methods (service ticket, session cookie) need to be injected into every HTTP request transparently.

**Decision**: A single `VszHttpClient` wraps `fetch`/`undici`, takes an `AuthManager` dependency, and calls `authManager.applyAuth(config)` before every request.

**Rationale**: Keeps auth concerns out of tool handlers. The auth manager is the single source of truth for credentials.

**Consequences**: All HTTP traffic flows through one code path, simplifying logging, retry, and error handling.

### ADR-005: TypeScript with MCP SDK

**Status**: Accepted

**Context**: The MCP ecosystem provides official SDKs in TypeScript and Python. The vSZ API is JSON-based.

**Decision**: Use TypeScript with the `@modelcontextprotocol/sdk` package and stdio transport.

**Rationale**: TypeScript provides strong typing for the large API surface. The MCP TypeScript SDK is the primary reference implementation.

**Consequences**: Requires Node.js 18+ runtime. Types can be progressively refined from the vSZ OpenAPI spec.

### ADR-006: Escape Hatch via `vsz_raw_request`

**Status**: Accepted

**Context**: The 16 domain tools cover the known ~750 endpoints, but the vSZ API may have additional endpoints in newer versions, or users may need internal API paths (e.g., `/wsg/api/scg/` paths noted in [api-endpoints-catalog.md, Sections 80, 87](./api-endpoints-catalog.md)).

**Decision**: Provide a `vsz_raw_request` tool that accepts arbitrary method, path, and body. Authentication is still injected automatically.

**Consequences**: No endpoint is unreachable. The raw tool should be documented as an advanced escape hatch, not the primary interface.

---

## Appendix: Complete API Category to Tool Mapping

| Cat. # | Category Name | MCP Tool |
|--------|--------------|----------|
| 1 | Login / Session Management | (internal -- AuthManager) |
| 2 | Domains | `vsz_zones` |
| 3 | AP Zones (rkszones) | `vsz_zones` |
| 4 | AP Groups | `vsz_ap` |
| 5 | Access Point Configuration | `vsz_ap` |
| 6 | Access Point Operational | `vsz_ap` |
| 7 | AP Packet Capture | `vsz_ap` |
| 8 | WLAN Groups | `vsz_wlan` |
| 9 | WLANs | `vsz_wlan` |
| 10 | WLAN Scheduler | `vsz_wlan` |
| 11 | Zone AAA (RADIUS, AD, LDAP) | `vsz_zones` |
| 12 | Authentication Services | `vsz_auth_services` |
| 13 | Accounting Services | `vsz_auth_services` |
| 14 | Web Authentication | `vsz_hotspot` |
| 15 | Guest Access | `vsz_hotspot` |
| 16 | Hotspot Service | `vsz_hotspot` |
| 17 | Hotspot 2.0 WLAN Profile | `vsz_hotspot` |
| 18 | Hotspot 2.0 Venue Profile | `vsz_hotspot` |
| 19 | Hotspot 2.0 Wi-Fi Operator Profile | `vsz_hotspot` |
| 20 | Hotspot 2.0 Identity Provider Profile | `vsz_hotspot` |
| 21 | Hotspot 2.0 Zone Profile | `vsz_hotspot` |
| 22 | Certificate Management | `vsz_certificate` |
| 23 | Certificate Store | `vsz_certificate` |
| 24 | User Traffic Profile | `vsz_network` |
| 25 | IPSec Profile | `vsz_network` |
| 26 | VDP Profile | `vsz_network` |
| 27 | System | `vsz_system` |
| 28 | Controller | `vsz_system` |
| 29 | Wireless Client | `vsz_client` |
| 30 | Wired Client | `vsz_client` |
| 31 | Application Visibility Control | `vsz_security` |
| 32 | L2 Access Control | `vsz_security` |
| 33 | L3 Access Control Policies | `vsz_security` |
| 34 | Firewall Profiles | `vsz_security` |
| 35 | Block Client | `vsz_client` |
| 36 | Mark Rogue | `vsz_security` |
| 37 | Ethernet Port Profile | `vsz_network` |
| 38 | Device Policy | `vsz_security` |
| 39 | VLAN Pooling | `vsz_network` |
| 40 | Dynamic PSK | `vsz_certificate` |
| 41 | Configuration Backup/Restore | `vsz_backup` |
| 42 | Cluster Backup/Restore | `vsz_backup` |
| 43 | System Upgrade | `vsz_backup` |
| 44 | Syslog Server | `vsz_system` |
| 45 | SNMP Agent | `vsz_system` |
| 46 | AP USB Software Package | `vsz_ap` |
| 47 | AP Registration Rules | `vsz_ap` |
| 48 | Data Plane | `vsz_network` |
| 49 | Control Planes | `vsz_network` |
| 50 | RuckusGRE Tunnel Profile | `vsz_network` |
| 51 | SoftGRE Tunnel Profile | `vsz_network` |
| 52 | DHCP | `vsz_network` |
| 53 | DNS Server Management | `vsz_network` |
| 54 | Bonjour Gateway Policies | `vsz_network` |
| 55 | Bonjour Fencing Policy | `vsz_network` |
| 56 | Client Isolation Whitelist | `vsz_security` |
| 57 | DiffServ | `vsz_network` |
| 58 | Precedence Profile | `vsz_network` |
| 59 | Identity User | `vsz_identity` |
| 60 | Identity User Role | `vsz_identity` |
| 61 | Identity Guest Pass | `vsz_identity` |
| 62 | Identity Subscription Package | `vsz_identity` |
| 63 | SCG User | `vsz_identity` |
| 64 | SCG User Group | `vsz_identity` |
| 65 | WeChat | `vsz_hotspot` |
| 66 | Zone Affinity Profile | `vsz_network` |
| 67 | Bridge | `vsz_network` |
| 68 | Mesh | `vsz_network` |
| 69 | Indoor Map | `vsz_indoor_map` |
| 70 | LBS Profile | `vsz_indoor_map` |
| 71 | CALEA | `vsz_security` |
| 72 | SCI | `vsz_system` |
| 73 | Flexi-VPN | `vsz_network` |
| 74 | L3 Roaming | `vsz_network` |
| 75 | FTP Server Settings | `vsz_system` |
| 76 | Application Log and Status | `vsz_system` |
| 77 | LWAPP to SCG | `vsz_system` |
| 78 | Test AAA Server | `vsz_auth_services` |
| 79 | Connectivity Tools | `vsz_monitoring` |
| 80 | AP APP | `vsz_ap` |
| 81 | Event and Alarm | `vsz_monitoring` |
| 82 | Query With Filter | `vsz_query` |
| 83 | Traffic Analysis | `vsz_monitoring` |
| 84 | Health Monitoring | `vsz_monitoring` |
| 85 | Administration | `vsz_system` |
| 86 | Global Reference | `vsz_system` |
| 87 | WISPr Portal | `vsz_hotspot` |
