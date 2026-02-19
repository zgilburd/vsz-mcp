# Ruckus vSZ 7.1.1 API Patterns Analysis

> **Document Purpose**: Analysis of authentication, pagination, error handling, and common patterns used by the Ruckus Virtual SmartZone (vSZ) 7.1.1 Public API.
>
> **Primary Source**: [vSZ-E 7.1.1 Public API Reference Guide](https://docs.ruckuswireless.com/smartzone/7.1.1/vsze-public-api-reference-guide-711.html)
>
> **Date**: 2026-02-19

---

## Table of Contents

1. [Base URL Structure and API Versioning](#1-base-url-structure-and-api-versioning)
2. [Authentication](#2-authentication)
3. [Common Headers](#3-common-headers)
4. [Pagination](#4-pagination)
5. [Error Handling](#5-error-handling)
6. [Query and Filter Patterns](#6-query-and-filter-patterns)
7. [Common Request/Response Patterns](#7-common-requestresponse-patterns)
8. [Data Types and Formats](#8-data-types-and-formats)
9. [Rate Limiting](#9-rate-limiting)
10. [OpenAPI/Swagger Self-Documentation](#10-openapiswagger-self-documentation)

---

## 1. Base URL Structure and API Versioning

### Base URL

The vSZ API uses different base URL patterns depending on the controller deployment model:

| Controller Model | Port | Base URL Pattern |
|------------------|------|------------------|
| vSZ-E (Essentials) | 7443 | `https://{host}:7443/api/public/{version}/` |
| vSZ-H (High Scale), SZ100, SZ300, SZ144 | 8443 | `https://{host}:8443/wsg/api/public/{version}/` |

Where `{host}` is the IP address of the management interface of the controller.

> **Source**: vSZ-E Public API Reference Guide (multiple versions, including 3.2.1, 3.5, 5.0): "All API URIs use the common prefix `https://{host}:7443/api/public`" for vSZ-E, and `https://{host}:8443/wsg/api/public` for vSZ-H/SZ models. Also confirmed via [Ruckus SmartZone Postman Collection](https://github.com/commscope-ruckus/RUCKUS-SmartZone-Postman) which uses `https://{{host}}:8443/wsg/api/` as base URL.

### API Versioning

The API version is embedded directly in the URL path as a prefix (e.g., `v9_0`, `v11_1`). SmartZone software supports up to 3 major API versions simultaneously, allowing backward compatibility.

**Version format**: `v{major}_{minor}` (e.g., `v9_0`, `v9_1`, `v11_1`)

**Known version-to-software mapping** (reconstructed from documentation across multiple releases):

| SmartZone Software Version | Primary API Version | Also Supports |
|---------------------------|--------------------:|---------------|
| 3.2.1 | v3_1 | v1_0 |
| 3.4 | v4_0 | v3_1 |
| 3.5 | v5_0 | v4_0, v3_0 (incl. v3_1) |
| 3.6 / 3.6.1 | v6_0 / v6_1 | v5_0, v4_0 |
| 5.0 | v8_0 | Prior 2 major versions |
| 5.1 / 5.1.1 / 5.1.2 | v8_1 / v9_0 / v9_1 | Prior 2 major versions |
| 5.2.0 / 5.2.1 | v9_1 | Prior 2 major versions |
| 6.0.0 | v10_0 | Prior 2 major versions |
| 6.1.0 / 6.1.1 / 6.1.2 | v11_0 / v11_1 | Prior 2 major versions |
| 7.0.0 | v12_0 | Prior 2 major versions |
| 7.1.0 / 7.1.1 | v13_0 / v13_1 | Prior 2 major versions |

> **Source**: Reconstructed from multiple vSZ Public API Reference Guides across versions (3.2.1 through 7.0.0) and the [Ruckus SmartZone Postman Collection](https://github.com/commscope-ruckus/RUCKUS-SmartZone-Postman) which references `v9_0`. The exact mapping for 7.1.1 could not be directly verified from the 7.1.1 reference guide (document exceeds fetch limits). The pattern follows the convention that each major SmartZone release increments the API major version. **NEEDS VERIFICATION** against the actual 7.1.1 guide for the exact version number.

**Compatibility rule**: "SmartZone software has API support for up to 3 major API versions."
> **Source**: Multiple vSZ Public API Reference Guides (e.g., vSZ-E 3.5 guide: "SmartZone release 3.5 is compatible with the three most recent major public API versions").

---

## 2. Authentication

The vSZ API supports **two distinct authentication methods**. Both use the same credentials (same as the web GUI login).

> **Source**: Multiple vSZ Public API Reference Guides: "There are two separate API commands: one to log on and acquire a valid logon session, and another to acquire a valid service ticket."

### Method 1: Service Ticket Authentication

Used primarily with vSZ-H, SZ100, SZ300, SZ144 models (port 8443, `wsg/api/public` path).

#### Step 1: Obtain a Service Ticket

**Endpoint**: `POST /wsg/api/public/{version}/serviceTicket`

**Request Body**:
```json
{
    "username": "admin",
    "password": "admin!234"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | Logon user name |
| `password` | string | Yes | Logon password |

**Response (200 OK)**:
```json
{
    "controllerVersion": "7.1.1.0.xxx",
    "serviceTicket": "ST-123-aBcDeFgHiJkLmNoPqRsT-cas"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `controllerVersion` | string | SmartZone software version |
| `serviceTicket` | string | Authentication token for subsequent requests |

> **Source**: vSZ Public API Reference Guides (SZ300 5.1.1, vSZ-H 5.0, and others): "Logon authentication successful, the server generates a service ticket" with response containing `controllerVersion` and `serviceTicket`. Also confirmed via [Ruckus SmartZone Postman Collection](https://github.com/commscope-ruckus/RUCKUS-SmartZone-Postman).

#### Step 2: Use Service Ticket in Subsequent Requests

The `serviceTicket` is passed as a **URI query parameter** in all subsequent API requests:

```
GET https://{host}:8443/wsg/api/public/{version}/rkszones?serviceTicket={serviceTicket}
```

> **Source**: Multiple vSZ Public API Reference Guides: "serviceTicket is returned as a parameter in the response payload of the Service Ticket Logon API" and "is required in the Request URI Parameters of all API requests (except for the logon API)." Also confirmed via [Ruckus SmartZone Postman Collection](https://github.com/commscope-ruckus/RUCKUS-SmartZone-Postman): `serviceTicket={{serviceTicket}}` as query parameter.

#### Step 3: Logoff (Delete Service Ticket)

**Endpoint**: `DELETE /wsg/api/public/{version}/serviceTicket?serviceTicket={serviceTicket}`

> **Source**: vSZ Public API Reference Guides and [Ruckus Community Forums](https://community.ruckuswireless.com/t5/SmartZone-and-Virtual-SmartZone/Virtual-SmartZone-API-How-should-serviceTicket-be-used/m-p/31873): "You can use the DELETE option to delete a service ticket for logoff purposes."

#### Service Ticket Lifetime

- Service tickets are valid for approximately **24 hours** after generation.
- It is recommended to delete an existing service ticket before generating a new one.

> **Source**: [Ruckus Community Forums - ServiceTicket time to live](https://community.ruckuswireless.com/t5/SmartZone-and-Virtual-SmartZone/ServiceTicket-time-to-live/m-p/45370): "Once a serviceTicket is generated, it is generally valid for 24 hours."

### Method 2: Session-Based Authentication (JSESSIONID)

Used primarily with vSZ-E models (port 7443, `api/public` path). Also available on other models.

#### Step 1: Create Session (Logon)

**Endpoint**: `POST /api/public/{version}/session`

**Request Body**:
```json
{
    "username": "admin",
    "password": "admin!234",
    "apiVersions": ["1", "2"],
    "timeZoneUtcOffset": "+08:00"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | Logon user name |
| `password` | string | Yes | Logon password |
| `apiVersions` | string[] | No | Client-supported API versions |
| `timeZoneUtcOffset` | string | No | Client timezone offset |

**Response (200 OK)**:
```json
{
    "apiVersion": "1"
}
```

**Response Headers**:
```
Set-Cookie: JSESSIONID={JSESSIONID}; Path=/wsg; Secure
```

> **Source**: vSZ-E Public API Reference Guide 3.2.1, 3.4, 3.5: "JSESSIONID is returned as the following parameter in the response header of the logon API."

#### Step 2: Use JSESSIONID in Subsequent Requests

The `JSESSIONID` is passed as an **HTTP Cookie header** in all subsequent requests:

```
Cookie: JSESSIONID={JSESSIONID}
```

> **Source**: vSZ-E Public API Reference Guide 3.2.1: "JSESSIONID... must be passed in subsequent requests via the Cookie header."

#### Step 3: Retrieve Session Info

**Endpoint**: `GET /api/public/{version}/session`

**Response (200 OK)**:
```json
{
    "cpId": "DEV_BLADE_UUID",
    "domainId": "8b2081d5-9662-40d9-a3db-2a3cf4dde3f7",
    "adminRoleId": "69962d35-9447-41a1-aff5-facf1e85c674",
    "mvnoId": "839f87c6-d116-497e-afce-aa8157abd30c",
    "adminId": "92cc1b65-c3cd-4f26-8c9b-3e7b055c7c25",
    "clientIp": "172.18.193.1",
    "apiVersions": ["1_0"],
    "timeZoneUtcOffset": 0
}
```

> **Source**: vSZ-E Public API Reference Guide 3.2.1, Section: Session Retrieval.

#### Step 4: Logoff (Delete Session)

**Endpoint**: `DELETE /api/public/{version}/session`

**Response**: 200 OK (no body)

> **Source**: vSZ-E Public API Reference Guide 3.2.1, 3.4, 3.5.

### Authentication Summary

| Aspect | Service Ticket Method | Session Method |
|--------|----------------------|----------------|
| Logon endpoint | `POST /{version}/serviceTicket` | `POST /{version}/session` |
| Logoff endpoint | `DELETE /{version}/serviceTicket` | `DELETE /{version}/session` |
| Token delivery | Query parameter (`?serviceTicket=...`) | Cookie header (`Cookie: JSESSIONID=...`) |
| Token lifetime | ~24 hours | Server-managed session |
| Primary usage | vSZ-H, SZ100, SZ300, SZ144 | vSZ-E |
| Response contains | `controllerVersion`, `serviceTicket` | `apiVersion` + `Set-Cookie` header |

---

## 3. Common Headers

### Required Headers for All Requests

| Header | Value | Notes |
|--------|-------|-------|
| `Content-Type` | `application/json;charset=UTF-8` | Required for all requests with a body |
| `Cookie` | `JSESSIONID={JSESSIONID}` | Required when using session-based auth |

For service-ticket-based auth, no special header is needed -- the `serviceTicket` is passed as a query parameter instead.

> **Source**: vSZ-E Public API Reference Guide 3.2.1: Required headers include `Content-Type: application/json;charset=UTF-8` and `Cookie: JSESSIONID={JSESSIONID}`.

### HTTPS Requirement

All API access requires HTTPS. The controllers use self-signed certificates by default.

> **Source**: All vSZ Public API Reference Guides specify `https://` in all endpoint examples.

---

## 4. Pagination

The vSZ API uses two different pagination styles depending on the type of endpoint.

### Style 1: GET List Endpoints (index/listSize)

For standard GET list endpoints, pagination is controlled via query parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `index` | integer | 0 | Starting offset (0-based) |
| `listSize` | integer | 100 | Maximum number of entries to retrieve |

**Example Request**:
```
GET /api/public/{version}/rkszones?index=0&listSize=100
```

**Response Format**:
```json
{
    "totalCount": 250,
    "hasMore": true,
    "firstIndex": 0,
    "list": [
        {
            "id": "zone-uuid-1",
            "name": "Zone 1"
        },
        {
            "id": "zone-uuid-2",
            "name": "Zone 2"
        }
    ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `totalCount` | integer | Total number of items matching the query |
| `hasMore` | boolean | Whether more items exist beyond the current page |
| `firstIndex` | integer | Index of the first item in the current response |
| `list` | array | Array of resource objects |

> **Source**: vSZ-E Public API Reference Guide 3.2.1, 3.4, 3.5: `index` (default 0), `listSize` (default 100), response with `totalCount`, `hasMore`, `firstIndex`, `list`. Also confirmed in vSZ-H 3.4 guide.

### Style 2: POST Query Endpoints (page/limit)

For POST-based query endpoints (e.g., `/query/ap`, `/query/client`), pagination is controlled via request body fields:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-based) |
| `limit` | integer | 100 | Maximum entries per page |

**Example Request**:
```json
{
    "page": 1,
    "limit": 8,
    "filters": [...],
    "sortInfo": {...}
}
```

> **Source**: [Ruckus SmartZone Postman Collection](https://github.com/commscope-ruckus/RUCKUS-SmartZone-Postman): POST query endpoints use `page` and `limit` fields in the request body. Confirmed across multiple query endpoint examples.

### Additional List Parameters

Some GET list endpoints also support:

| Parameter | Type | Description |
|-----------|------|-------------|
| `domainId` | string | Filter by domain (defaults to current session domain) |

> **Source**: vSZ-E Public API Reference Guide 3.2.1: `domainId` parameter on zone listing endpoints.

---

## 5. Error Handling

### HTTP Status Codes

| Code | Name | Usage |
|------|------|-------|
| 200 | OK | Successful retrieval or modification |
| 201 | Created | Resource created successfully |
| 204 | No Content | Successful operation with no response body (e.g., DELETE, PATCH) |
| 400 | Bad Request | Malformed or missing parameters |
| 401 | Unauthorized | Authentication failed or session expired |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 405 | Method Not Allowed | Unsupported HTTP method for endpoint |
| 406 | Not Acceptable | Incompatible response format |
| 422 | Unprocessable Entity | Semantic validation failure (valid JSON but invalid data) |
| 500 | Internal Server Error | Server-side processing failure |
| 503 | Service Unavailable | Controller temporarily unavailable |

> **Source**: vSZ-E Public API Reference Guide 3.2.1, 3.4, 3.5, and SZ100 3.0 guide.

### Ruckus-Specific Error Codes

When the server is unable to process a request, a Ruckus Wireless-specific error code and message are returned in the response body.

| Error Code | Description |
|-----------|-------------|
| 0 | Internal server error |
| 101 | Bad HTTP request |
| 102 | Bad HTTP response |
| 103 | Invalid HTTP request body |
| 104 | HTTP response body cannot be generated |
| 105 | Unsupported API version |
| 150 | Cluster not in service |
| 151 | Controller node not in service |
| 201 | No active session |
| 202 | Login denied |
| 211 | Insufficient administrative privileges |
| 212 | Resource access denied |
| 301 | Resource cannot be found |
| 302 | Business rule violation |

> **Source**: vSZ-E Public API Reference Guide 3.2.1, SZ100 3.0 guide, vSZ-H 3.4 guide: "When the server is unable to process a request, Ruckus Wireless-specific error code and message are returned in the response body."

### Error Response Format

Error responses contain a Ruckus-specific error code and a human-readable message. Based on the pattern described in the documentation, the likely JSON structure is:

```json
{
    "errorCode": 301,
    "message": "Resource cannot be found",
    "errorType": "Not Found"
}
```

> **Source**: Inferred from the error code table in multiple vSZ Public API Reference Guides. The exact JSON field names could not be directly confirmed from the 7.1.1 guide due to document size limits. **NEEDS VERIFICATION** against the actual 7.1.1 guide or a live controller for exact field names.

---

## 6. Query and Filter Patterns

### POST Query Endpoints

The vSZ API provides dedicated POST-based query endpoints for complex searches. These endpoints follow the pattern:

```
POST /api/public/{version}/query/{resource}
```

Known query endpoints include:
- `POST /query/ap` - Query access points
- `POST /query/client` - Query wireless clients
- `POST /query/wlans` - Query WLANs
- `POST /query/dpsks` - Query DPSKs

> **Source**: vSZ-E Public API Reference Guide 3.5 and [Ruckus SmartZone Postman Collection](https://github.com/commscope-ruckus/RUCKUS-SmartZone-Postman).

### Query Request Body Format

```json
{
    "filters": [
        {
            "type": "ZONE",
            "value": "zone-uuid-here"
        }
    ],
    "extraFilters": [
        {
            "type": "WLAN",
            "value": "wlan-uuid-here"
        }
    ],
    "extraNotFilters": [
        {
            "type": "MONITORINGENABLED",
            "value": "true"
        }
    ],
    "fullTextSearch": {
        "type": "AND",
        "value": "search-term"
    },
    "attributes": [
        "*"
    ],
    "sortInfo": {
        "sortColumn": "apMac",
        "dir": "ASC"
    },
    "page": 1,
    "limit": 100
}
```

> **Source**: [Ruckus SmartZone Postman Collection](https://github.com/commscope-ruckus/RUCKUS-SmartZone-Postman): Multiple POST query examples with filters, sortInfo, and pagination fields.

### Query Body Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `filters` | array | No | Primary filter conditions (AND logic) |
| `extraFilters` | array | No | Additional AND filter conditions |
| `extraNotFilters` | array | No | Exclusion filter conditions (NOT logic) |
| `fullTextSearch` | object | No | Full-text search across attributes |
| `attributes` | string[] | No | Fields to return (`["*"]` for all) |
| `sortInfo` | object | No | Sort specification |
| `page` | integer | No | Page number (1-based, default: 1) |
| `limit` | integer | No | Results per page (default: 100) |

### Filter Object Schema

```json
{
    "type": "FILTER_TYPE",
    "value": "filter_value"
}
```

**Known Filter Types**:
- `ZONE` - Filter by zone ID
- `DOMAIN` - Filter by domain ID
- `WLAN` - Filter by WLAN ID
- `RADIOID` - Filter by radio ID
- `MONITORINGENABLED` - Filter by monitoring status

> **Source**: [Ruckus SmartZone Postman Collection](https://github.com/commscope-ruckus/RUCKUS-SmartZone-Postman) and [Ruckus Community Forums](https://community.ruckuswireless.com/t5/SmartZone-and-Virtual-SmartZone/SZ-API-query-for-specific-attributes/m-p/30611).

### Full Text Search Object

```json
{
    "type": "AND",
    "value": "search term"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Logic operator: `"AND"` or `"OR"` (default: `"AND"`) |
| `value` | string | Search term to match across fields |

### Sort Info Object

```json
{
    "sortColumn": "fieldName",
    "dir": "ASC"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `sortColumn` | string | Field name to sort by |
| `dir` | string | Sort direction: `"ASC"` or `"DESC"` |

### Attributes Field

The `attributes` field allows selecting specific fields in the response. Use `["*"]` to return all fields.

> **Note**: According to a [Ruckus Community Forum post](https://community.ruckuswireless.com/t5/SmartZone-and-Virtual-SmartZone/SZ-API-query-for-specific-attributes/m-p/30611), the `attributes` field "was never fully implemented" in earlier API versions. Compatibility may vary depending on SmartZone version.

### GET List Filtering

For standard GET list endpoints, filtering is typically done via query parameters:

```
GET /api/public/{version}/rkszones?index=0&listSize=100&domainId={domainId}
```

Operational endpoints (alarms, events) support additional query-based filtering:

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | Logic: `"AND"` or `"OR"` (default: `"AND"`) |
| `value` | string | Filter values (can be repeated) |
| `order` | string | Sort field |
| `direction` | string | `"ASC"` or `"DESC"` (default: `"DESC"`) |

> **Source**: SZ100 Public API Reference Guide 3.0: Operational alarm/event endpoints use these query parameters.

---

## 7. Common Request/Response Patterns

### HTTP Methods and Their Usage

| Method | Usage | Typical Response |
|--------|-------|-----------------|
| `GET` | Retrieve a resource or list | 200 with resource/list body |
| `POST` | Create a resource OR query/search | 201 with `{"id": "..."}` for create; 200 with results for query |
| `PUT` | Full replacement of a resource | 204 No Content |
| `PATCH` | Partial update of a resource | 204 No Content |
| `DELETE` | Remove or disable a resource | 204 No Content |

> **Source**: Multiple vSZ Public API Reference Guides consistently use these patterns across all endpoint documentation.

### Resource URL Patterns

The API follows a hierarchical RESTful URL structure:

```
/{version}/{resource}                          # List / Create
/{version}/{resource}/{id}                     # Get / Update / Delete
/{version}/{resource}/{id}/{sub-resource}      # List sub-resources
/{version}/{resource}/{id}/{sub-resource}/{id} # Get / Update / Delete sub-resource
```

**Examples**:
```
GET    /{version}/rkszones                           # List zones
POST   /{version}/rkszones                           # Create zone
GET    /{version}/rkszones/{zoneId}                  # Get zone
PATCH  /{version}/rkszones/{zoneId}                  # Update zone
DELETE /{version}/rkszones/{zoneId}                  # Delete zone
GET    /{version}/rkszones/{zoneId}/wlans            # List WLANs in zone
POST   /{version}/rkszones/{zoneId}/wlans            # Create WLAN in zone
GET    /{version}/rkszones/{zoneId}/wlans/{wlanId}   # Get WLAN
PATCH  /{version}/rkszones/{zoneId}/wlans/{wlanId}   # Update WLAN
```

> **Source**: Multiple vSZ Public API Reference Guides and [Ruckus SmartZone Postman Collection](https://github.com/commscope-ruckus/RUCKUS-SmartZone-Postman).

### Create Response Pattern

When creating a resource, the response body typically contains only the new resource's ID:

```json
{
    "id": "newly-created-resource-uuid"
}
```

> **Source**: vSZ-E Public API Reference Guide 3.2.1 and [RuckusVirtualSmartZoneAPIClient on PyPI](https://pypi.org/project/RuckusVirtualSmartZoneAPIClient/): "Status codes follow REST conventions (201 for creation)."

### List Response Pattern

All list endpoints share the same response envelope:

```json
{
    "totalCount": 10,
    "hasMore": false,
    "firstIndex": 0,
    "list": [
        { "id": "...", "name": "..." }
    ]
}
```

> **Source**: vSZ-E Public API Reference Guide 3.2.1, vSZ-H 3.4: Consistent list response format across all versions.

### Operational Endpoints

Operational actions on resources use a nested path pattern:

```
POST /{version}/aps/{apMac}/operational/blinkLed
GET  /{version}/aps/{apMac}/operational/summary
GET  /{version}/aps/{apMac}/airtimeReport
```

> **Source**: [Ruckus SmartZone Postman Collection](https://github.com/commscope-ruckus/RUCKUS-SmartZone-Postman).

### Profile Endpoints

Configuration profiles use a nested pattern under zones:

```
GET /{version}/rkszones/{zoneId}/profile/ethernetPort
GET /{version}/rkszones/{zoneId}/profile/ethernetPort/{ethProfileId}
```

> **Source**: [Ruckus SmartZone Postman Collection](https://github.com/commscope-ruckus/RUCKUS-SmartZone-Postman).

### Traffic and Analytics Endpoints

Time-range-based analytics endpoints use millisecond timestamps:

```
POST /{version}/trafficAnalysis/client/app/wlan
POST /{version}/healthExtend/groupBar/eapFailure
```

Query parameters for time ranges:

| Parameter | Type | Description |
|-----------|------|-------------|
| `start` | long | Start timestamp in milliseconds |
| `end` | long | End timestamp in milliseconds |
| `interval` | long | Aggregation interval in milliseconds |

> **Source**: [Ruckus SmartZone Postman Collection](https://github.com/commscope-ruckus/RUCKUS-SmartZone-Postman).

---

## 8. Data Types and Formats

### ID Format

Resource IDs use **UUID format** (e.g., `8b2081d5-9662-40d9-a3db-2a3cf4dde3f7`).

> **Source**: vSZ-E Public API Reference Guide 3.2.1: All resource IDs in examples use UUID format.

### MAC Address Format

AP MAC addresses use colon-separated format: `AA:BB:CC:DD:EE:FF`

> **Source**: [Ruckus SmartZone Postman Collection](https://github.com/commscope-ruckus/RUCKUS-SmartZone-Postman): Endpoint paths use `{apMAC}` parameters.

### String Validation

The API enforces string validation patterns:
- **Name fields**: 2-32 characters, pattern `^[!-~]([ -~]){0,30}[!-~]$`
- **Description fields**: 0-64 characters (optional)

> **Source**: vSZ-H Public API Reference Guide 3.4: Validation rules with regex patterns documented for create/update operations.

### Common Field Types

| Type | Description | Example |
|------|-------------|---------|
| `string` | UTF-8 text | `"Zone Name"` |
| `integer` | Whole number | `100` |
| `boolean` | True/false | `true` |
| `array` | Ordered list | `["item1", "item2"]` |
| `object` | Nested JSON object | `{"key": "value"}` |

### Timestamps

Analytics/traffic endpoints use **milliseconds since epoch** (Unix timestamp * 1000).

> **Source**: [Ruckus SmartZone Postman Collection](https://github.com/commscope-ruckus/RUCKUS-SmartZone-Postman): `start` and `end` parameters for traffic analysis.

---

## 9. Rate Limiting

**No explicit rate limiting is documented** in any version of the vSZ Public API Reference Guide.

The API does not describe rate limit headers (e.g., `X-RateLimit-*`), throttling behavior, or request quotas. However, practical limits may be enforced by the controller hardware and session management.

> **Source**: Multiple vSZ Public API Reference Guides (3.2.1, 3.4, 3.5, 5.0): No rate limiting section or parameters found in any reviewed documentation.

---

## 10. OpenAPI/Swagger Self-Documentation

SmartZone controllers expose their API specification in OpenAPI format at:

```
https://{host}:8443/wsg/apiDoc/openapi
```

The OpenAPI documents are based on **OAS 2.0** (Swagger 2.0 format).

> **Source**: Multiple vSZ Public API Reference Guides (SZ300 5.1.1, vSZ-H 6.1.0, SZ100 6.1.0): "The API documentation is available at `https://{host}:8443/wsg/apiDoc/openapi` for the installed SmartZone Software Release." Also confirmed by [Ruckus Developer Central](https://www.ruckusnetworks.com/developer-central/).

This self-documenting endpoint is valuable for:
- Generating client SDKs automatically
- Discovering all available endpoints for the specific SmartZone version installed
- Validating API version compatibility

---

## Key Considerations for MCP Server Implementation

Based on this analysis, the following patterns are critical for implementing an MCP server:

1. **Dual Authentication Support**: The MCP server must support both service ticket (query param) and session (cookie) authentication methods, as the appropriate method depends on the controller model.

2. **Base URL Flexibility**: The base URL differs between vSZ-E (port 7443, `/api/public/`) and vSZ-H/SZ models (port 8443, `/wsg/api/public/`). This must be configurable.

3. **API Version Negotiation**: The version prefix in the URL must be configurable or auto-detected (e.g., by reading the OpenAPI spec from the controller).

4. **Dual Pagination Models**: GET list endpoints use `index`/`listSize` while POST query endpoints use `page`/`limit`. Both must be supported.

5. **Self-Signed Certificates**: Controllers use self-signed HTTPS certificates by default; the HTTP client must allow configurable TLS verification.

6. **Service Ticket Lifecycle**: Service tickets last ~24 hours but should be proactively renewed before expiration and properly deleted on shutdown.

7. **Error Mapping**: Ruckus-specific error codes (0-302) need to be mapped to appropriate MCP error responses.

8. **OpenAPI Discovery**: The `/wsg/apiDoc/openapi` endpoint can be used to dynamically discover available endpoints for the connected controller version.

---

## Sources Summary

| Source | Type | URL |
|--------|------|-----|
| vSZ-E 7.1.1 Public API Reference Guide | Primary (authoritative) | https://docs.ruckuswireless.com/smartzone/7.1.1/vsze-public-api-reference-guide-711.html |
| vSZ-E 3.2.1 Public API Reference Guide | Official supplementary | https://docs.ruckuswireless.com/vscg-enterprise/vsz-e-public-api-reference-guide-3-2-1.html |
| vSZ-E 3.5 Public API Reference Guide | Official supplementary | https://docs.ruckuswireless.com/vscg-enterprise/vsz-e-public-api-reference-guide-3-5.html |
| vSZ-H 3.4 Public API Reference Guide | Official supplementary | https://docs.ruckuswireless.com/vscg-carrier/vsz-h-public-api-reference-guide-3-4.html |
| SZ100 3.0 Public API Reference Guide | Official supplementary | https://docs.ruckuswireless.com/sz-100/sz-public-api-reference-guide-3-0.html |
| Ruckus SmartZone Postman Collection | Official GitHub | https://github.com/commscope-ruckus/RUCKUS-SmartZone-Postman |
| RuckusVirtualSmartZoneAPIClient | Community PyPI | https://pypi.org/project/RuckusVirtualSmartZoneAPIClient/ |
| Ruckus Developer Central | Official | https://www.ruckusnetworks.com/developer-central/ |
| Ruckus Community Forums | Community | https://community.ruckuswireless.com/ |

> **Note**: The primary authoritative source (vSZ-E 7.1.1 guide) could not be fully fetched due to document size exceeding 10MB. The patterns documented here are derived from multiple official Ruckus documentation versions and are consistent across all reviewed versions. The API patterns have remained stable across SmartZone releases 3.x through 7.x, with the primary changes being new endpoints and API version numbers. All patterns should be verified against a live SmartZone 7.1.1 controller or its OpenAPI spec at `/wsg/apiDoc/openapi` before production use.
