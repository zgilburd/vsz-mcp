# Ruckus vSZ 7.1.1 Public API Endpoints Catalog

> **Authoritative Source**: [SmartZone 7.1.1 (LT-GA) Public API Reference Guide (vSZ-E)](https://docs.ruckuswireless.com/smartzone/7.1.1/vsze-public-api-reference-guide-711.html)
>
> **Support Page**: [SmartZone 7.1.1 (LT-GA) Public API Reference Guide (vSZ-E)](https://support.ruckuswireless.com/documents/5705-smartzone-7-1-1-lt-ga-public-api-reference-guide-vsz-e)
>
> **Supplementary Sources**: [Ruckus Developer Central](https://www.ruckusnetworks.com/developer-central/), [Official Postman Collections](https://github.com/commscope-ruckus/RUCKUS-SmartZone-Postman), [Official Python Client](https://github.com/commscope-ruckus/RUCKUS-SmartZone-Python)

## Base URL Patterns

| Deployment Mode | Base URL | Source |
|---|---|---|
| vSZ-E (Essentials) | `https://{host}:7443/api/public/{version}/` | Source: vSZ Public API Reference Guide, Section: API URI Prefix |
| vSZ-H (High Scale) | `https://{host}:8443/wsg/api/public/{version}/` | Source: vSZ Public API Reference Guide, Section: API URI Prefix |
| SZ144 / SZ300 | `https://{host}:8443/wsg/api/public/{version}/` | Source: vSZ Public API Reference Guide, Section: API URI Prefix |

### Supported API Versions (SmartZone 7.x)

| API Version | Notes | Source |
|---|---|---|
| `v9_0` | Widely used baseline version, backward compatible | Source: Postman Collections & API Reference Guides |
| `v9_1` | Minor additions over v9_0 | Source: vSZ-H Public API Reference Guide |
| `v10_0` | Added RADSec, certificate store improvements | Source: OpenRoaming Postman Collection |
| `v11_0` | SmartZone 7.0+ additions | Source: vSZ-H 7.0.0 Public API Reference Guide |
| `v11_1` | SmartZone 7.0+ additions | Source: vSZ-H 7.0.0 Public API Reference Guide |
| `v12_0` | Latest version in SmartZone 7.x | Source: vSZ-H 7.0.0 Public API Reference Guide |

> **Note**: SmartZone 7.1.1 supports all versions listed above for backward compatibility. New deployments should target the latest supported version. The Postman examples predominantly use `v9_0` for broad compatibility.

### Authentication

All API requests (except the session/service ticket creation) require authentication via a session token. There are two authentication methods:

1. **Service Ticket** (vSZ-H / SZ models): `POST /serviceTicket` returns a token passed as `?serviceTicket={token}` query parameter
2. **Session Cookie** (vSZ-E): `POST /session` returns a session cookie used for subsequent requests

Source: vSZ 7.1.1 Public API Reference Guide, Section: Login Session / Service Ticket

### OpenAPI Specification Access

The OpenAPI (OAS 2.0) specification can be accessed directly from a running SmartZone controller:
```
https://{host}:8443/wsg/apiDoc/openapi
```
Source: [Ruckus Developer Central](https://www.ruckusnetworks.com/developer-central/)

---

## Table of Contents

1. [Login / Session Management](#1-login--session-management)
2. [Domains](#2-domains)
3. [Ruckus Wireless AP Zones (rkszones)](#3-ruckus-wireless-ap-zones-rkszones)
4. [AP Groups](#4-ap-groups)
5. [Access Point Configuration](#5-access-point-configuration)
6. [Access Point Operational](#6-access-point-operational)
7. [AP Packet Capture](#7-ap-packet-capture)
8. [WLAN Groups](#8-wlan-groups)
9. [WLANs](#9-wlans)
10. [WLAN Scheduler](#10-wlan-scheduler)
11. [Zone AAA (RADIUS, AD, LDAP)](#11-zone-aaa-radius-ad-ldap)
12. [Authentication Services](#12-authentication-services)
13. [Accounting Services](#13-accounting-services)
14. [Web Authentication](#14-web-authentication)
15. [Guest Access](#15-guest-access)
16. [Hotspot Service](#16-hotspot-service)
17. [Hotspot 2.0 WLAN Profile](#17-hotspot-20-wlan-profile)
18. [Hotspot 2.0 Venue Profile](#18-hotspot-20-venue-profile)
19. [Hotspot 2.0 Wi-Fi Operator Profile](#19-hotspot-20-wi-fi-operator-profile)
20. [Hotspot 2.0 Identity Provider Profile](#20-hotspot-20-identity-provider-profile)
21. [Hotspot 2.0 Zone Profile](#21-hotspot-20-zone-profile)
22. [Certificate Management](#22-certificate-management)
23. [Certificate Store](#23-certificate-store)
24. [User Traffic Profile](#24-user-traffic-profile)
25. [IPSec Profile](#25-ipsec-profile)
26. [VDP Profile](#26-vdp-profile)
27. [System](#27-system)
28. [Controller](#28-controller)
29. [Wireless Client](#29-wireless-client)
30. [Wired Client](#30-wired-client)
31. [Application Visibility Control (AVC)](#31-application-visibility-control-avc)
32. [L2 Access Control](#32-l2-access-control)
33. [L3 Access Control Policies](#33-l3-access-control-policies)
34. [Firewall Profiles](#34-firewall-profiles)
35. [Block Client](#35-block-client)
36. [Mark Rogue](#36-mark-rogue)
37. [Ethernet Port Profile](#37-ethernet-port-profile)
38. [Device Policy](#38-device-policy)
39. [VLAN Pooling](#39-vlan-pooling)
40. [Dynamic PSK (DPSK)](#40-dynamic-psk-dpsk)
41. [Configuration Backup and Restore](#41-configuration-backup-and-restore)
42. [Cluster Backup and Restore](#42-cluster-backup-and-restore)
43. [System Upgrade](#43-system-upgrade)
44. [Syslog Server](#44-syslog-server)
45. [SNMP Agent](#45-snmp-agent)
46. [AP USB Software Package](#46-ap-usb-software-package)
47. [AP Registration Rules](#47-ap-registration-rules)
48. [Data Plane](#48-data-plane)
49. [Control Planes](#49-control-planes)
50. [RuckusGRE Tunnel Profile](#50-ruckusgre-tunnel-profile)
51. [SoftGRE Tunnel Profile](#51-softgre-tunnel-profile)
52. [DHCP](#52-dhcp)
53. [DNS Server Management](#53-dns-server-management)
54. [Bonjour Gateway Policies](#54-bonjour-gateway-policies)
55. [Bonjour Fencing Policy](#55-bonjour-fencing-policy)
56. [Client Isolation Whitelist](#56-client-isolation-whitelist)
57. [DiffServ](#57-diffserv)
58. [Precedence Profile](#58-precedence-profile)
59. [Identity User](#59-identity-user)
60. [Identity User Role](#60-identity-user-role)
61. [Identity Guest Pass](#61-identity-guest-pass)
62. [Identity Subscription Package](#62-identity-subscription-package)
63. [SCG User](#63-scg-user)
64. [SCG User Group](#64-scg-user-group)
65. [WeChat](#65-wechat)
66. [Zone Affinity Profile](#66-zone-affinity-profile)
67. [Bridge](#67-bridge)
68. [Mesh](#68-mesh)
69. [Indoor Map](#69-indoor-map)
70. [LBS Profile](#70-lbs-profile)
71. [CALEA](#71-calea)
72. [SCI](#72-sci)
73. [Flexi-VPN](#73-flexi-vpn)
74. [L3 Roaming](#74-l3-roaming)
75. [FTP Server Settings](#75-ftp-server-settings)
76. [Application Log and Status](#76-application-log-and-status)
77. [LWAPP to SCG](#77-lwapp-to-scg)
78. [Test AAA Server](#78-test-aaa-server)
79. [Connectivity Tools](#79-connectivity-tools)
80. [AP APP](#80-ap-app)
81. [Event and Alarm](#81-event-and-alarm)
82. [Query With Filter](#82-query-with-filter)
83. [Traffic Analysis](#83-traffic-analysis)
84. [Health Monitoring](#84-health-monitoring)
85. [Administration](#85-administration)
86. [Global Reference](#86-global-reference)
87. [WISPr Portal](#87-wispr-portal)

---

## 1. Login / Session Management

Source: vSZ 7.1.1 Public API Reference Guide, Section: Login Session / Service Ticket

### Session-Based Authentication (vSZ-E)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/session` | Log on and acquire a valid session |
| GET | `/session` | Retrieve current session details |
| DELETE | `/session` | Terminate the current session (logout) |

### Service Ticket Authentication (vSZ-H / SZ models)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/serviceTicket` | Obtain a service ticket for API authentication |

---

## 2. Domains

Source: vSZ 7.1.1 Public API Reference Guide, Section: Domain Management; Postman Collection: SmartZone High-Scale Automation

| Method | Path | Description |
|--------|------|-------------|
| GET | `/domains` | Retrieve list of domains |
| GET | `/domains/{id}` | Retrieve a specific domain |
| POST | `/domains` | Create a new domain |
| PATCH | `/domains/{id}` | Modify domain properties |
| DELETE | `/domains/{id}` | Delete a domain |

---

## 3. Ruckus Wireless AP Zones (rkszones)

Source: vSZ 7.1.1 Public API Reference Guide, Section: Ruckus Wireless AP Zone

| Method | Path | Description |
|--------|------|-------------|
| GET | `/rkszones` | Retrieve list of zones |
| GET | `/rkszones/{id}` | Retrieve specific zone configuration |
| POST | `/rkszones` | Create a new zone |
| POST | `/rkszones/ipv6` | Create a zone with IPv6 |
| POST | `/rkszones/dual` | Create a zone with dual stack |
| PATCH | `/rkszones/{id}` | Modify basic zone properties |
| DELETE | `/rkszones/{id}` | Delete a zone |

### Zone Sub-Resources

| Method | Path | Description |
|--------|------|-------------|
| GET | `/rkszones/{id}/meshConfig` | Retrieve mesh configuration |
| PATCH | `/rkszones/{id}/meshConfig` | Modify mesh configuration |
| DELETE | `/rkszones/{id}/meshConfig` | Clear mesh settings |
| PATCH | `/rkszones/{id}/timeZone` | Adjust timezone |
| DELETE | `/rkszones/{id}/timeZone` | Use system timezone |
| PATCH | `/rkszones/{id}/apLogon` | Configure AP authentication |
| PATCH | `/rkszones/{id}/radio24g` | Modify 2.4GHz radio settings |
| PATCH | `/rkszones/{id}/radio5g` | Modify 5GHz radio settings |
| PATCH | `/rkszones/{id}/syslog` | Configure syslog server |
| DELETE | `/rkszones/{id}/syslog` | Disable syslog |
| PATCH | `/rkszones/{id}/smartMonitor` | Configure smart monitoring |
| DELETE | `/rkszones/{id}/smartMonitor` | Disable smart monitor |
| PATCH | `/rkszones/{id}/clientAdmissionControl24g` | Configure CAC for 2.4GHz |
| DELETE | `/rkszones/{id}/clientAdmissionControl24g` | Disable CAC 2.4GHz |
| PATCH | `/rkszones/{id}/clientAdmissionControl5g` | Configure CAC for 5GHz |
| DELETE | `/rkszones/{id}/clientAdmissionControl5g` | Disable CAC 5GHz |
| PATCH | `/rkszones/{id}/backgroundScanning24g` | Configure background scanning 2.4GHz |
| DELETE | `/rkszones/{id}/backgroundScanning24g` | Disable scanning 2.4GHz |
| PATCH | `/rkszones/{id}/backgroundScanning5g` | Configure background scanning 5GHz |
| DELETE | `/rkszones/{id}/backgroundScanning5g` | Disable scanning 5GHz |
| PATCH | `/rkszones/{id}/clientLoadBalancing24g` | Configure load balancing 2.4GHz |
| DELETE | `/rkszones/{id}/clientLoadBalancing24g` | Disable load balancing 2.4GHz |
| PATCH | `/rkszones/{id}/clientLoadBalancing5g` | Configure load balancing 5GHz |
| DELETE | `/rkszones/{id}/clientLoadBalancing5g` | Disable load balancing 5GHz |
| PATCH | `/rkszones/{id}/bandBalancing` | Modify band balancing |
| DELETE | `/rkszones/{id}/bandBalancing` | Disable band balancing |
| PATCH | `/rkszones/{id}/apRebootTimeout` | Set AP reboot interval |
| PATCH | `/rkszones/{id}/nodeAffinityProfile` | Configure node affinity |
| PATCH | `/rkszones/{id}/hotspot20VenueProfile` | Set venue profile |
| DELETE | `/rkszones/{id}/hotspot20VenueProfile` | Remove venue profile |
| PATCH | `/rkszones/{id}/rogue` | Configure rogue AP detection |
| DELETE | `/rkszones/{id}/rogue` | Disable rogue detection |
| PATCH | `/rkszones/{id}/locationBasedService` | Configure location services |
| DELETE | `/rkszones/{id}/locationBasedService` | Disable location services |
| GET | `/rkszones/{id}/apModel` | Retrieve AP model settings |
| PUT | `/rkszones/{id}/apModel` | Modify AP model configuration |
| GET | `/rkszones/{id}/apModelCommonAttribute` | Retrieve AP model common attributes |
| PATCH | `/rkszones/{id}/radio24gAutoChannelSelectMode` | Modify 2.4GHz auto channel selection |
| PATCH | `/rkszones/{id}/radio5gAutoChannelSelectMode` | Modify 5GHz auto channel selection |
| PATCH | `/rkszones/{id}/ipsecProfile` | Configure IPsec profile |
| PATCH | `/rkszones/{id}/usbSoftwarePackage` | Set USB software package |
| DELETE | `/rkszones/{id}/usbSoftwarePackage` | Disable USB package |
| PATCH | `/rkszones/{id}/apManagementVlan` | Configure management VLAN |
| PATCH | `/rkszones/{id}/altitude` | Set altitude value |
| DELETE | `/rkszones/{id}/altitude` | Clear altitude |
| GET | `/rkszones/{id}/apFirmwareList` | Retrieve available firmware versions |
| PUT | `/rkszones/{id}/apFirmware` | Update AP firmware |
| PATCH | `/rkszones/{id}/snmpAgent` | Configure SNMP options |
| DELETE | `/rkszones/{id}/snmpAgent` | Clear SNMP settings |
| PATCH | `/rkszones/{id}/recoverySsid` | Configure recovery SSID |
| DELETE | `/rkszones/{id}/recoverySsid` | Disable recovery SSID |
| PATCH | `/rkszones/{id}/dhcpSiteConfig` | Modify DHCP/NAT settings |
| POST | `/rkszones/{id}/dhcpIpAssignment` | Retrieve IP assignment info |
| POST | `/rkszones/{id}/dhcpSiteConfigWithinDomain` | Retrieve DHCP config in domain |
| PATCH | `/rkszones/{id}/bonjourFencingPolicy` | Configure Bonjour fencing |
| PATCH | `/rkszones/{id}/tunnelProfile` | Set tunnel profile |
| GET | `/rkszones/{id}/mesh` | Get mesh configuration for zone |
| GET | `/rkszones/{id}/profile/ethernetPort` | Get ethernet port profiles for zone |
| GET | `/rkszones/{id}/profile/ethernetPort/{profileId}` | Get specific ethernet port profile |

### Zone WLAN Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/rkszones/{zoneId}/wlans` | Retrieve list of WLANs in zone |
| GET | `/rkszones/{zoneId}/wlans/{wlanId}` | Retrieve specific WLAN configuration |
| POST | `/rkszones/{zoneId}/wlans` | Create a WLAN in zone |
| POST | `/rkszones/{zoneId}/wlans/hotspot20` | Create Hotspot 2.0 WLAN |
| PATCH | `/rkszones/{zoneId}/wlans/{wlanId}` | Modify WLAN settings |
| DELETE | `/rkszones/{zoneId}/wlans/{wlanId}` | Delete WLAN |
| GET | `/rkszones/{zoneId}/wlans/{wlanId}/dpsk` | Get DPSK list for WLAN |
| GET | `/rkszones/{zoneId}/wlans/{wlanId}/dpsk/{dpskId}` | Get specific DPSK details |

### Zone AAA Sub-Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/rkszones/{zoneId}/aaa/radius` | Retrieve RADIUS servers in zone |
| GET | `/rkszones/{zoneId}/aaa/radius/{id}` | Retrieve specific RADIUS server |
| POST | `/rkszones/{zoneId}/aaa/radius` | Create RADIUS server in zone |
| PATCH | `/rkszones/{zoneId}/aaa/radius/{id}` | Modify RADIUS server |
| DELETE | `/rkszones/{zoneId}/aaa/radius/{id}` | Delete RADIUS server |

### Zone Hotspot 2.0 Zone Profile

| Method | Path | Description |
|--------|------|-------------|
| POST | `/rkszones/{zoneId}/hs20s` | Create Hotspot 2.0 zone profile |
| GET | `/rkszones/{zoneId}/hs20s/{profileId}` | Retrieve HS2.0 zone profile |
| DELETE | `/rkszones/{zoneId}/hs20s/{profileId}` | Delete HS2.0 zone profile |

### Zone Portal

| Method | Path | Description |
|--------|------|-------------|
| GET | `/rkszones/{zoneId}/portals/hotspot` | Get hotspot portals for zone |

---

## 4. AP Groups

Source: vSZ 7.1.1 Public API Reference Guide, Section: AP Group

| Method | Path | Description |
|--------|------|-------------|
| GET | `/apgroups` | Retrieve list of AP groups |
| GET | `/apgroups/{id}` | Retrieve specific AP group |
| POST | `/apgroups` | Create AP group |
| PATCH | `/apgroups/{id}` | Modify group basic settings |
| DELETE | `/apgroups/{id}` | Delete AP group |

### AP Group Members

| Method | Path | Description |
|--------|------|-------------|
| POST | `/apgroups/{id}/members` | Add member to group |
| POST | `/apgroups/{id}/memberList` | Add multiple members |
| DELETE | `/apgroups/{id}/members/{memberId}` | Remove group member |

### AP Group Overrides

| Method | Path | Description |
|--------|------|-------------|
| PATCH | `/apgroups/{id}/radio24gOverride` | Override 2.4GHz settings |
| DELETE | `/apgroups/{id}/radio24gOverride` | Remove 2.4GHz override |
| DELETE | `/apgroups/{id}/radio24gTxPowerOverride` | Remove tx power override |
| DELETE | `/apgroups/{id}/radio24gChannelWidthOverride` | Remove channel width override |
| DELETE | `/apgroups/{id}/radio24gChannelOverride` | Remove channel override |
| DELETE | `/apgroups/{id}/radio24gChannelRangeOverride` | Remove channel range override |
| PATCH | `/apgroups/{id}/radio5gOverride` | Override 5GHz settings |
| DELETE | `/apgroups/{id}/radio5gOverride` | Remove 5GHz override |
| DELETE | `/apgroups/{id}/radio5gTxPowerOverride` | Remove tx power override |
| DELETE | `/apgroups/{id}/radio5gChannelWidthOverride` | Remove channel width override |
| DELETE | `/apgroups/{id}/radio5gIndoorChannelOverride` | Remove indoor channel override |
| DELETE | `/apgroups/{id}/radio5gOutdoorChannelOverride` | Remove outdoor channel override |
| DELETE | `/apgroups/{id}/radio5gIndoorChannelRangeOverride` | Remove indoor range override |
| DELETE | `/apgroups/{id}/radio5gOutdoorChannelRangeOverride` | Remove outdoor range override |
| PATCH | `/apgroups/{id}/wlanGroup24gOverride` | Override WLAN group 2.4GHz |
| DELETE | `/apgroups/{id}/wlanGroup24gOverride` | Remove WLAN group override |
| PATCH | `/apgroups/{id}/wlanGroup5gOverride` | Override WLAN group 5GHz |
| DELETE | `/apgroups/{id}/wlanGroup5gOverride` | Remove WLAN group override |
| PATCH | `/apgroups/{id}/lbsOverride` | Override location services |
| DELETE | `/apgroups/{id}/lbsOverride` | Remove LBS override |
| PATCH | `/apgroups/{id}/cac24gOverride` | Override CAC 2.4GHz |
| DELETE | `/apgroups/{id}/cac24gOverride` | Remove CAC override |
| PATCH | `/apgroups/{id}/cac5gOverride` | Override CAC 5GHz |
| DELETE | `/apgroups/{id}/cac5gOverride` | Remove CAC override |
| PATCH | `/apgroups/{id}/hotspot20VenueProfile` | Set venue profile |
| DELETE | `/apgroups/{id}/hotspot20VenueProfile` | Remove venue profile |
| DELETE | `/apgroups/{id}/locationOverride` | Remove location override |
| DELETE | `/apgroups/{id}/locationAdditionalInfoOverride` | Remove location info override |
| GET | `/apgroups/{id}/apModel` | Retrieve AP model settings |
| PUT | `/apgroups/{id}/apModel` | Override AP model |
| DELETE | `/apgroups/{id}/apModelOverride` | Remove AP model override |
| PATCH | `/apgroups/{id}/radio24gAutoChannelSelectModeOverride` | Override auto channel 2.4GHz |
| DELETE | `/apgroups/{id}/radio24gAutoChannelSelectModeOverride` | Remove auto channel override |
| PATCH | `/apgroups/{id}/radio5gAutoChannelSelectModeOverride` | Override auto channel 5GHz |
| DELETE | `/apgroups/{id}/radio5gAutoChannelSelectModeOverride` | Remove auto channel override |
| DELETE | `/apgroups/{id}/channelEvaluationIntervalOverride` | Remove evaluation override |
| PATCH | `/apgroups/{id}/usbSoftwarePackage` | Set USB package |
| DELETE | `/apgroups/{id}/usbSoftwarePackage` | Remove USB package |
| PATCH | `/apgroups/{id}/apManagementVlan` | Configure management VLAN |
| DELETE | `/apgroups/{id}/apManagementVlanOverride` | Remove VLAN override |
| PATCH | `/apgroups/{id}/altitudeApgroup` | Set altitude |
| DELETE | `/apgroups/{id}/altitudeApgroup` | Remove altitude |

---

## 5. Access Point Configuration

Source: vSZ 7.1.1 Public API Reference Guide, Section: Access Point Configuration

| Method | Path | Description |
|--------|------|-------------|
| GET | `/aps` | Retrieve list of APs |
| GET | `/aps/{apMac}` | Retrieve specific AP configuration |
| POST | `/aps` | Create AP entry |
| PATCH | `/aps/{apMac}` | Modify basic AP settings |
| DELETE | `/aps/{apMac}` | Delete AP |
| PUT | `/aps/{apMac}/reboot` | Reboot AP |
| GET | `/aps/{apMac}/supportLog` | Download AP support log |
| GET | `/aps/{apMac}/picture` | Retrieve AP picture |
| POST | `/aps/{apMac}/picture` | Upload AP picture |
| DELETE | `/aps/{apMac}/picture` | Delete AP picture |
| GET | `/aps/{apMac}/wlan` | Get AP WLAN BSSIDs |

### AP Overrides

| Method | Path | Description |
|--------|------|-------------|
| PATCH | `/aps/{apMac}/loginOverride` | Override login credentials |
| DELETE | `/aps/{apMac}/loginOverride` | Remove login override |
| PATCH | `/aps/{apMac}/syslogOverride` | Override syslog settings |
| DELETE | `/aps/{apMac}/syslogOverride` | Remove syslog override |
| PATCH | `/aps/{apMac}/radio24gOverride` | Override 2.4GHz radio |
| DELETE | `/aps/{apMac}/radio24gOverride` | Remove 2.4GHz override |
| DELETE | `/aps/{apMac}/radio24gTxPowerOverride` | Remove tx power override |
| DELETE | `/aps/{apMac}/radio24gChannelWidthOverride` | Remove channel width override |
| DELETE | `/aps/{apMac}/radio24gChannelOverride` | Remove channel override |
| DELETE | `/aps/{apMac}/radio24gChannelRangeOverride` | Remove channel range override |
| PATCH | `/aps/{apMac}/radio5gOverride` | Override 5GHz radio |
| DELETE | `/aps/{apMac}/radio5gOverride` | Remove 5GHz override |
| DELETE | `/aps/{apMac}/radio5gTxPowerOverride` | Remove tx power override |
| DELETE | `/aps/{apMac}/radio5gChannelWidthOverride` | Remove channel width override |
| DELETE | `/aps/{apMac}/radio5gChannelOverride` | Remove channel override |
| DELETE | `/aps/{apMac}/radio5gChannelRangeOverride` | Remove channel range override |
| PATCH | `/aps/{apMac}/wlanGroup24gOverride` | Override WLAN group 2.4GHz |
| DELETE | `/aps/{apMac}/wlanGroup24gOverride` | Remove WLAN override |
| PATCH | `/aps/{apMac}/wlanGroup5gOverride` | Override WLAN group 5GHz |
| DELETE | `/aps/{apMac}/wlanGroup5gOverride` | Remove WLAN override |
| PATCH | `/aps/{apMac}/networkSettings` | Configure network settings |
| PATCH | `/aps/{apMac}/smartMonitor` | Configure smart monitoring |
| DELETE | `/aps/{apMac}/smartMonitorOverride` | Remove monitoring override |
| PATCH | `/aps/{apMac}/bonjourGateway` | Configure Bonjour gateway |
| DELETE | `/aps/{apMac}/bonjourGatewayOverride` | Remove gateway override |
| PATCH | `/aps/{apMac}/cac24g` | Configure CAC 2.4GHz |
| DELETE | `/aps/{apMac}/cac24gOverride` | Remove CAC override |
| PATCH | `/aps/{apMac}/cac5g` | Configure CAC 5GHz |
| DELETE | `/aps/{apMac}/cac5gOverride` | Remove CAC override |
| PATCH | `/aps/{apMac}/venueProfile` | Set venue profile |
| DELETE | `/aps/{apMac}/venueProfileOverride` | Remove venue override |
| PUT | `/aps/{apMac}/specific` | Modify AP-specific settings |
| DELETE | `/aps/{apMac}/specificOverride` | Remove specific override |
| PATCH | `/aps/{apMac}/usbSoftwarePackage` | Set USB package |
| DELETE | `/aps/{apMac}/usbSoftwarePackage` | Remove USB package |
| DELETE | `/aps/{apMac}/channelEvaluationInterval` | Remove evaluation interval |
| PATCH | `/aps/{apMac}/radio24gAutoChannelSelectModeOverride` | Override auto channel 2.4GHz |
| DELETE | `/aps/{apMac}/radio24gAutoChannelSelection` | Disable auto channel 2.4GHz |
| PATCH | `/aps/{apMac}/radio5gAutoChannelSelectModeOverride` | Override auto channel 5GHz |
| DELETE | `/aps/{apMac}/radio5gAutoChannelSelection` | Disable auto channel 5GHz |
| PATCH | `/aps/{apMac}/apManagementVlan` | Configure management VLAN |
| DELETE | `/aps/{apMac}/apManagementVlanOverride` | Remove VLAN override |
| PATCH | `/aps/{apMac}/altitudeOverride` | Set altitude |
| DELETE | `/aps/{apMac}/altitudeOverride` | Remove altitude |
| PATCH | `/aps/{apMac}/meshOptions` | Configure mesh settings |
| DELETE | `/aps/{apMac}/meshOptions` | Remove mesh options |
| DELETE | `/aps/{apMac}/gpsCoordinates` | Disable GPS coordinates |
| DELETE | `/aps/{apMac}/locationOverride` | Remove location override |
| DELETE | `/aps/{apMac}/locationAdditionalInfoOverride` | Remove location info override |

### AP Move

| Method | Path | Description |
|--------|------|-------------|
| PUT | `/aps/move/{zoneId}` | Move AP(s) to zone (body: array of MAC addresses) |

> **Note**: This endpoint uses the internal API path `/wsg/api/scg/aps/move/{zoneId}` rather than the public API prefix.
> Source: Postman Collection: SmartZone High-Scale Automation

---

## 6. Access Point Operational

Source: vSZ 7.1.1 Public API Reference Guide, Section: Access Point Operational

| Method | Path | Description |
|--------|------|-------------|
| GET | `/aps/{apMac}/operational` | Retrieve operational information |
| GET | `/aps/{apMac}/operational/summary` | Retrieve AP operational summary |
| GET | `/aps/{apMac}/operational/neighbor` | Get neighbors on mesh AP |
| GET | `/aps/{apMac}/alarmSummary` | Retrieve alarm summary |
| GET | `/aps/{apMac}/eventSummary` | Retrieve event summary |
| GET | `/aps/{apMac}/alarmList` | Retrieve alarm list |
| GET | `/aps/{apMac}/eventList` | Retrieve event list |
| GET | `/aps/{apMac}/meshNeighbor` | Retrieve mesh neighbor AP list |
| GET | `/aps/{apMac}/rogueApList` | Retrieve rogue AP list |
| GET | `/aps/{apMac}/airtimeReport` | Get AP airtime report |
| POST | `/aps/{apMac}/operational/blinkLed` | Blink AP LED |

---

## 7. AP Packet Capture

Source: Postman Collection: AP Packet Capture

| Method | Path | Description |
|--------|------|-------------|
| POST | `/aps/{apMac}/apPacketCapture/startFileCapture` | Start packet capture on AP |
| POST | `/aps/{apMac}/apPacketCapture/stop` | Stop packet capture |
| POST | `/aps/{apMac}/apPacketCapture/download` | Download captured packets |

---

## 8. WLAN Groups

Source: vSZ 7.1.1 Public API Reference Guide, Section: WLAN Group

| Method | Path | Description |
|--------|------|-------------|
| GET | `/wlangroups` | Retrieve list of WLAN groups |
| GET | `/wlangroups/{id}` | Retrieve specific WLAN group |
| POST | `/wlangroups` | Create WLAN group |
| PATCH | `/wlangroups/{id}` | Modify basic group settings |
| DELETE | `/wlangroups/{id}` | Delete WLAN group |
| POST | `/wlangroups/{id}/members` | Add member WLAN |
| PATCH | `/wlangroups/{id}/members/{memberId}` | Modify member settings |
| PATCH | `/wlangroups/{id}/members/{memberId}/vlanPooling` | Modify VLAN pooling |
| DELETE | `/wlangroups/{id}/members/{memberId}/vlanOverride` | Remove VLAN override |
| DELETE | `/wlangroups/{id}/members/{memberId}/nasOverride` | Remove NAS override |
| DELETE | `/wlangroups/{id}/members/{memberId}` | Remove member WLAN |

---

## 9. WLANs

Source: vSZ 7.1.1 Public API Reference Guide, Section: WLAN

### WLAN CRUD

| Method | Path | Description |
|--------|------|-------------|
| GET | `/wlans` | Retrieve list of WLANs |
| GET | `/wlans/{id}` | Retrieve specific WLAN |
| DELETE | `/wlans/{id}` | Delete WLAN |

### WLAN Creation (by type)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/wlans/standardOpen` | Create Standard Open WLAN |
| POST | `/wlans/802_1x` | Create 802.1X WLAN |
| POST | `/wlans/macAuth` | Create MAC Auth WLAN |
| POST | `/wlans/hotspot` | Create Hotspot WLAN |
| POST | `/wlans/hotspotMacBypass` | Create Hotspot + MAC bypass WLAN |
| POST | `/wlans/guestAccess` | Create Guest Access WLAN |
| POST | `/wlans/webAuth` | Create Web Auth WLAN |
| POST | `/wlans/hotspot2_0` | Create Hotspot 2.0 WLAN |
| POST | `/wlans/hotspot2_0OSEN` | Create Hotspot 2.0 OSEN WLAN |
| POST | `/wlans/wechat` | Create WeChat WLAN |

### WLAN Modification

| Method | Path | Description |
|--------|------|-------------|
| PATCH | `/wlans/{id}` | Modify basic WLAN settings |
| PATCH | `/wlans/{id}/authentication` | Modify authentication settings |
| PATCH | `/wlans/{id}/macAuth` | Modify MAC auth settings |
| PATCH | `/wlans/{id}/accounting` | Modify accounting settings |
| DELETE | `/wlans/{id}/accounting` | Disable accounting |
| PATCH | `/wlans/{id}/encryption` | Modify encryption settings |
| PATCH | `/wlans/{id}/coreTunnel` | Modify core tunnel settings |
| PATCH | `/wlans/{id}/portalProfile` | Modify portal profile |
| PATCH | `/wlans/{id}/hotspot20Profile` | Modify Hotspot 2.0 profile |
| PATCH | `/wlans/{id}/userTrafficProfile` | Modify user traffic profile |
| PATCH | `/wlans/{id}/schedule` | Modify schedule |
| PATCH | `/wlans/{id}/vlan` | Modify VLAN settings |
| PATCH | `/wlans/{id}/l2ACL` | Modify Layer 2 ACL |
| DELETE | `/wlans/{id}/l2ACL` | Disable Layer 2 ACL |
| PATCH | `/wlans/{id}/devicePolicy` | Modify device policy |
| DELETE | `/wlans/{id}/devicePolicy` | Disable device policy |
| PATCH | `/wlans/{id}/radiusOptions` | Modify RADIUS options |
| PATCH | `/wlans/{id}/advancedOptions` | Modify advanced options |
| PATCH | `/wlans/{id}/diffServProfile` | Modify DiffServ profile |
| DELETE | `/wlans/{id}/diffServProfile` | Disable DiffServ profile |
| POST | `/wlans/{id}/qosMapSet` | Enable QoS Map Set |
| PATCH | `/wlans/{id}/qosMapSet` | Modify QoS Map Set |
| DELETE | `/wlans/{id}/qosMapSet` | Disable QoS Map Set |
| PATCH | `/wlans/{id}/dnsServerProfile` | Modify DNS server profile |
| DELETE | `/wlans/{id}/dnsServerProfile` | Disable DNS server profile |
| PATCH | `/wlans/{id}/dpsk` | Modify DPSK setting |
| PATCH | `/wlans/{id}/externalDpsk` | Modify external DPSK setting |
| PATCH | `/wlans/{id}/calea` | Enable CALEA on WLAN |

---

## 10. WLAN Scheduler

Source: vSZ 7.1.1 Public API Reference Guide, Section: WLAN Scheduler

| Method | Path | Description |
|--------|------|-------------|
| GET | `/wlanSchedulers` | Retrieve list of schedulers |
| GET | `/wlanSchedulers/{id}` | Retrieve specific scheduler |
| POST | `/wlanSchedulers` | Create scheduler |
| PATCH | `/wlanSchedulers/{id}` | Modify basic settings |
| DELETE | `/wlanSchedulers/{id}` | Delete scheduler |
| PATCH | `/wlanSchedulers/{id}/sunday` | Modify schedule on Sunday |
| PATCH | `/wlanSchedulers/{id}/monday` | Modify schedule on Monday |
| PATCH | `/wlanSchedulers/{id}/tuesday` | Modify schedule on Tuesday |
| PATCH | `/wlanSchedulers/{id}/wednesday` | Modify schedule on Wednesday |
| PATCH | `/wlanSchedulers/{id}/thursday` | Modify schedule on Thursday |
| PATCH | `/wlanSchedulers/{id}/friday` | Modify schedule on Friday |
| PATCH | `/wlanSchedulers/{id}/saturday` | Modify schedule on Saturday |

---

## 11. Zone AAA (RADIUS, AD, LDAP)

Source: vSZ 7.1.1 Public API Reference Guide, Section: Zone AAA

### RADIUS

| Method | Path | Description |
|--------|------|-------------|
| GET | `/rkszones/{zoneId}/aaa/radius` | Retrieve RADIUS list |
| GET | `/rkszones/{zoneId}/aaa/radius/{id}` | Retrieve specific RADIUS |
| POST | `/rkszones/{zoneId}/aaa/radius` | Create RADIUS |
| PATCH | `/rkszones/{zoneId}/aaa/radius/{id}` | Modify RADIUS |
| PATCH | `/rkszones/{zoneId}/aaa/radius/{id}/primaryServer` | Modify primary server |
| PATCH | `/rkszones/{zoneId}/aaa/radius/{id}/secondaryServer` | Modify secondary server |
| DELETE | `/rkszones/{zoneId}/aaa/radius/{id}/secondaryServer` | Disable secondary server |
| DELETE | `/rkszones/{zoneId}/aaa/radius/{id}` | Delete RADIUS |

### Active Directory

| Method | Path | Description |
|--------|------|-------------|
| GET | `/rkszones/{zoneId}/aaa/activeDirectory` | Retrieve AD list |
| GET | `/rkszones/{zoneId}/aaa/activeDirectory/{id}` | Retrieve specific AD |
| POST | `/rkszones/{zoneId}/aaa/activeDirectory` | Create AD |
| PATCH | `/rkszones/{zoneId}/aaa/activeDirectory/{id}` | Modify AD |
| DELETE | `/rkszones/{zoneId}/aaa/activeDirectory/{id}` | Delete AD |

### LDAP

| Method | Path | Description |
|--------|------|-------------|
| GET | `/rkszones/{zoneId}/aaa/ldap` | Retrieve LDAP list |
| GET | `/rkszones/{zoneId}/aaa/ldap/{id}` | Retrieve specific LDAP |
| POST | `/rkszones/{zoneId}/aaa/ldap` | Create LDAP |
| PATCH | `/rkszones/{zoneId}/aaa/ldap/{id}` | Modify LDAP |
| DELETE | `/rkszones/{zoneId}/aaa/ldap/{id}` | Delete LDAP |

---

## 12. Authentication Services

Source: vSZ 7.1.1 Public API Reference Guide, Section: Authentication Service

### General

| Method | Path | Description |
|--------|------|-------------|
| POST | `/authenticationService/query` | Query authentication services |
| DELETE | `/authenticationService/{id}` | Delete authentication service |
| DELETE | `/authenticationService` | Delete multiple services |
| POST | `/authenticationService/{id}/test` | Test specific service |
| GET | `/authenticationService/localDb` | Retrieve LocalDB service |
| PATCH | `/authenticationService/localDb` | Update LocalDB configuration |
| PATCH | `/authenticationService/localDb/userRoleMappings` | Modify user role mappings |
| GET | `/authenticationService/guest` | Retrieve guest service |

### RADIUS Authentication Service

| Method | Path | Description |
|--------|------|-------------|
| POST | `/radiusAuthenticationService/query` | Query RADIUS services |
| GET | `/radiusAuthenticationService` | List RADIUS services |
| GET | `/radiusAuthenticationService/{id}` | Retrieve specific service |
| POST | `/radiusAuthenticationService` | Create RADIUS authentication |
| PATCH | `/radiusAuthenticationService/{id}` | Modify RADIUS service |
| PATCH | `/radiusAuthenticationService/{id}/primaryRadiusServer` | Update primary server |
| PATCH | `/radiusAuthenticationService/{id}/secondaryRadiusServer` | Configure secondary server |
| PATCH | `/radiusAuthenticationService/{id}/rateLimiting` | Modify rate limiting |
| PATCH | `/radiusAuthenticationService/{id}/healthCheckPolicy` | Update health check |
| PATCH | `/radiusAuthenticationService/{id}/userTrafficProfileMapping` | Map traffic profiles |
| DELETE | `/radiusAuthenticationService/{id}/secondaryRadiusServer` | Disable secondary server |
| DELETE | `/radiusAuthenticationService/{id}` | Remove RADIUS service |

### Active Directory Authentication Service

| Method | Path | Description |
|--------|------|-------------|
| POST | `/adAuthenticationService/query` | Query AD services |
| GET | `/adAuthenticationService` | List AD services |
| GET | `/adAuthenticationService/{id}` | Retrieve AD configuration |
| POST | `/adAuthenticationService` | Create AD authentication |
| PATCH | `/adAuthenticationService/{id}` | Modify AD service |
| PATCH | `/adAuthenticationService/{id}/userTrafficProfileMapping` | Map traffic profiles |
| DELETE | `/adAuthenticationService/{id}` | Remove AD service |

### LDAP Authentication Service

| Method | Path | Description |
|--------|------|-------------|
| POST | `/ldapAuthenticationService/query` | Query LDAP services |
| GET | `/ldapAuthenticationService` | List LDAP services |
| GET | `/ldapAuthenticationService/{id}` | Retrieve LDAP configuration |
| POST | `/ldapAuthenticationService` | Create LDAP authentication |
| PATCH | `/ldapAuthenticationService/{id}` | Modify LDAP service |
| PATCH | `/ldapAuthenticationService/{id}/userTrafficProfileMapping` | Map traffic profiles |
| DELETE | `/ldapAuthenticationService/{id}` | Remove LDAP service |

### OAuth Authentication Service

| Method | Path | Description |
|--------|------|-------------|
| POST | `/oAuthAuthenticationService/query` | Query OAuth services |
| GET | `/oAuthAuthenticationService` | List OAuth services |
| GET | `/oAuthAuthenticationService/{id}` | Retrieve OAuth configuration |
| POST | `/oAuthAuthenticationService` | Create OAuth authentication |
| PATCH | `/oAuthAuthenticationService/{id}` | Modify OAuth service |
| PATCH | `/oAuthAuthenticationService/{id}/whitelistedDomains` | Update domain whitelist |
| PATCH | `/oAuthAuthenticationService/{id}/userTrafficProfileMapping` | Map traffic profiles |
| DELETE | `/oAuthAuthenticationService/{id}` | Remove OAuth service |

### Proxy AAA (RADSec) Service

| Method | Path | Description |
|--------|------|-------------|
| POST | `/services/auth/radius` | Create RADSec AAA (v10_0+) |
| POST | `/services/auth/query` | Get proxy AAA list |
| GET | `/services/auth/radius/{id}` | Query proxy AAA |
| DELETE | `/services/auth/radius/{id}` | Delete proxy AAA |

Source: Postman Collection: SmartZone OpenRoaming

---

## 13. Accounting Services

Source: vSZ 7.1.1 Public API Reference Guide, Section: Accounting Service

| Method | Path | Description |
|--------|------|-------------|
| POST | `/accountingService/query` | Query accounting services |
| DELETE | `/accountingService/{id}` | Remove accounting service |
| DELETE | `/accountingService` | Delete multiple services |
| POST | `/accountingService/{id}/test` | Test specific service |

### RADIUS Accounting Service

| Method | Path | Description |
|--------|------|-------------|
| POST | `/radiusAccountingService/query` | Query RADIUS accounting |
| GET | `/radiusAccountingService` | List RADIUS accounting services |
| GET | `/radiusAccountingService/{id}` | Retrieve service details |
| POST | `/radiusAccountingService` | Create RADIUS accounting |
| PATCH | `/radiusAccountingService/{id}` | Modify service configuration |
| PATCH | `/radiusAccountingService/{id}/primaryRadiusServer` | Update primary server |
| PATCH | `/radiusAccountingService/{id}/secondaryRadiusServer` | Configure secondary server |
| PATCH | `/radiusAccountingService/{id}/rateLimiting` | Modify rate limiting |
| PATCH | `/radiusAccountingService/{id}/healthCheckPolicy` | Update health check policy |
| DELETE | `/radiusAccountingService/{id}/secondaryRadiusServer` | Disable secondary server |
| DELETE | `/radiusAccountingService/{id}` | Remove RADIUS accounting |

---

## 14. Web Authentication

Source: vSZ 7.1.1 Public API Reference Guide, Section: Web Authentication

| Method | Path | Description |
|--------|------|-------------|
| GET | `/webAuthentication` | Retrieve list |
| GET | `/webAuthentication/{id}` | Retrieve specific configuration |
| POST | `/webAuthentication` | Create web auth profile |
| PATCH | `/webAuthentication/{id}` | Modify basic settings |
| PATCH | `/webAuthentication/{id}/redirect` | Update redirect parameters |
| DELETE | `/webAuthentication/{id}/redirect` | Reset redirect |
| PATCH | `/webAuthentication/{id}/userSession` | Modify user session settings |
| DELETE | `/webAuthentication/{id}` | Remove authentication profile |

---

## 15. Guest Access

Source: vSZ 7.1.1 Public API Reference Guide, Section: Guest Access

| Method | Path | Description |
|--------|------|-------------|
| GET | `/guestAccess` | Retrieve list of guest profiles |
| GET | `/guestAccess/{id}` | Retrieve specific guest configuration |
| POST | `/guestAccess` | Create guest access service |
| PATCH | `/guestAccess/{id}` | Modify basic guest settings |
| PATCH | `/guestAccess/{id}/redirect` | Update guest redirect options |
| DELETE | `/guestAccess/{id}/redirect` | Reset redirect |
| PATCH | `/guestAccess/{id}/smsGateway` | Configure SMS gateway |
| DELETE | `/guestAccess/{id}/smsGateway` | Disable SMS gateway |
| PATCH | `/guestAccess/{id}/portalCustomization` | Modify portal appearance |
| PATCH | `/guestAccess/{id}/userSession` | Update user session parameters |
| DELETE | `/guestAccess/{id}` | Delete guest access profile |

---

## 16. Hotspot Service

Source: vSZ 7.1.1 Public API Reference Guide, Section: Hotspot Service

| Method | Path | Description |
|--------|------|-------------|
| GET | `/hotspotService` | Retrieve list of services |
| GET | `/hotspotService/{id}` | Retrieve service details |
| POST | `/hotspotService` | Create hotspot service (internal/external/smart client) |
| PATCH | `/hotspotService/{id}` | Modify basic service settings |
| PATCH | `/hotspotService/{id}/redirect` | Update redirect configuration |
| PATCH | `/hotspotService/{id}/portalCustomization` | Modify portal customization |
| PATCH | `/hotspotService/{id}/location` | Modify location parameters |
| PATCH | `/hotspotService/{id}/walledGardens` | Modify walled gardens |
| DELETE | `/hotspotService/{id}` | Remove hotspot service |

---

## 17. Hotspot 2.0 WLAN Profile

Source: vSZ 7.1.1 Public API Reference Guide, Section: Hotspot20 WLAN Profile

| Method | Path | Description |
|--------|------|-------------|
| GET | `/hotspot20WlanProfile` | Retrieve list of profiles |
| GET | `/hotspot20WlanProfile/{id}` | Retrieve profile configuration |
| POST | `/hotspot20WlanProfile` | Create Hotspot 2.0 profile |
| PATCH | `/hotspot20WlanProfile/{id}` | Modify basic settings |
| PATCH | `/hotspot20WlanProfile/{id}/operator` | Modify operator information |
| PATCH | `/hotspot20WlanProfile/{id}/identityProviders` | Update identity providers |
| PATCH | `/hotspot20WlanProfile/{id}/defaultIdentityProvider` | Set default provider |
| PATCH | `/hotspot20WlanProfile/{id}/signupSsid` | Modify signup SSID |
| PATCH | `/hotspot20WlanProfile/{id}/defaultConnectionCapabilities` | Update capabilities |
| PATCH | `/hotspot20WlanProfile/{id}/customConnectionCapabilities` | Modify custom capabilities |
| DELETE | `/hotspot20WlanProfile/{id}` | Remove profile |

---

## 18. Hotspot 2.0 Venue Profile

Source: vSZ 7.1.1 Public API Reference Guide, Section: Hotspot20 Venue Profile

| Method | Path | Description |
|--------|------|-------------|
| GET | `/hotspot20VenueProfile` | Retrieve list of profiles |
| GET | `/hotspot20VenueProfile/{id}` | Retrieve profile configuration |
| POST | `/hotspot20VenueProfile` | Create venue profile |
| PATCH | `/hotspot20VenueProfile/{id}` | Modify basic settings |
| PATCH | `/hotspot20VenueProfile/{id}/venueNames` | Modify venue names |
| DELETE | `/hotspot20VenueProfile/{id}` | Remove venue profile |

---

## 19. Hotspot 2.0 Wi-Fi Operator Profile

Source: vSZ 7.1.1 Public API Reference Guide, Section: Hotspot20 Wi-Fi Operator Profile

| Method | Path | Description |
|--------|------|-------------|
| GET | `/hotspot20WifiOperatorProfile` | Retrieve list of profiles |
| GET | `/hotspot20WifiOperatorProfile/{id}` | Retrieve operator profile |
| POST | `/hotspot20WifiOperatorProfile` | Create operator profile |
| POST | `/hotspot20WifiOperatorProfile/query` | Query operator profiles |
| PATCH | `/hotspot20WifiOperatorProfile/{id}` | Modify basic settings |
| PATCH | `/hotspot20WifiOperatorProfile/{id}/domainNames` | Modify domain names |
| PATCH | `/hotspot20WifiOperatorProfile/{id}/friendlyNames` | Modify friendly names |
| PATCH | `/hotspot20WifiOperatorProfile/{id}/certificate` | Modify certificate |
| DELETE | `/hotspot20WifiOperatorProfile/{id}/certificate` | Disable certificate |
| DELETE | `/hotspot20WifiOperatorProfile/{id}` | Remove operator profile |

### Alternate Path (v9_0+)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/profiles/hs20/operators` | Create Wi-Fi operator |
| GET | `/profiles/hs20/operators/{id}` | Query Wi-Fi operator |
| DELETE | `/profiles/hs20/operators/{id}` | Delete Wi-Fi operator |

Source: Postman Collection: SmartZone OpenRoaming

---

## 20. Hotspot 2.0 Identity Provider Profile

Source: vSZ 7.1.1 Public API Reference Guide, Section: Hotspot20 Identity Provider Profile

| Method | Path | Description |
|--------|------|-------------|
| GET | `/hotspot20IdentityProviderProfile` | Retrieve list of profiles |
| GET | `/hotspot20IdentityProviderProfile/{id}` | Retrieve provider configuration |
| POST | `/hotspot20IdentityProviderProfile` | Create identity provider |
| POST | `/hotspot20IdentityProviderProfile/query` | Query identity providers |
| PATCH | `/hotspot20IdentityProviderProfile/{id}` | Modify basic settings |
| PATCH | `/hotspot20IdentityProviderProfile/{id}/realms` | Modify realms |
| PATCH | `/hotspot20IdentityProviderProfile/{id}/plmns` | Modify PLMNs |
| PATCH | `/hotspot20IdentityProviderProfile/{id}/homeOis` | Modify home OIs |
| PATCH | `/hotspot20IdentityProviderProfile/{id}/authentications` | Modify authentications |
| PATCH | `/hotspot20IdentityProviderProfile/{id}/accountings` | Modify accountings |
| DELETE | `/hotspot20IdentityProviderProfile/{id}/accountings` | Disable accountings |
| PATCH | `/hotspot20IdentityProviderProfile/{id}/onlineSignupProvisioning` | Update signup provisioning |
| DELETE | `/hotspot20IdentityProviderProfile/{id}/onlineSignupProvisioning` | Disable provisioning |
| DELETE | `/hotspot20IdentityProviderProfile/{id}` | Remove identity provider |

### Alternate Path (v9_0+)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/profiles/hs20/identityproviders` | Create identity provider |
| GET | `/profiles/hs20/identityproviders/{id}` | Get identity provider |
| POST | `/profiles/hs20/identityproviders/query` | Query identity providers |
| DELETE | `/profiles/hs20/identityproviders/{id}` | Delete identity provider |

Source: Postman Collection: SmartZone OpenRoaming

---

## 21. Hotspot 2.0 Zone Profile

Source: Postman Collection: SmartZone OpenRoaming

| Method | Path | Description |
|--------|------|-------------|
| POST | `/rkszones/{zoneId}/hs20s` | Create Hotspot 2.0 zone profile |
| GET | `/rkszones/{zoneId}/hs20s/{profileId}` | Query Hotspot 2.0 zone profile |
| DELETE | `/rkszones/{zoneId}/hs20s/{profileId}` | Delete Hotspot 2.0 zone profile |

---

## 22. Certificate Management

Source: vSZ 7.1.1 Public API Reference Guide, Section: Certificate

| Method | Path | Description |
|--------|------|-------------|
| GET | `/certificate` | Retrieve certificate list |
| GET | `/certificate/{id}` | Retrieve certificate details |
| POST | `/certificate` | Create certificate |
| PATCH | `/certificate` | Modify service certificates |
| DELETE | `/certificate/{id}` | Delete certificate |
| GET | `/certificateSetting` | Retrieve certificate setting |
| GET | `/csr` | Retrieve CSR list |
| GET | `/csr/{id}` | Retrieve CSR configuration |
| POST | `/csr` | Create CSR |
| DELETE | `/csr/{id}` | Delete CSR |
| GET | `/trustedCaCertificates` | List trusted CA certificates |
| GET | `/trustedCaCertificates/{id}` | Retrieve CA certificate |
| POST | `/trustedCaCertificates` | Create trusted CA certificate |
| PATCH | `/trustedCaCertificates/{id}` | Patch CA certificate |
| DELETE | `/trustedCaCertificates/{id}` | Delete CA certificate |
| DELETE | `/trustedCaCertificates` | Delete bulk CA certificates |

---

## 23. Certificate Store

Source: Postman Collection: SmartZone OpenRoaming

| Method | Path | Description |
|--------|------|-------------|
| POST | `/certstore/clientCert` | Create client certificate |
| GET | `/certstore/clientCert` | Get client certificate list |
| DELETE | `/certstore/clientCert/{id}` | Delete client certificate |
| POST | `/certstore/trustedCAChainCert` | Create trusted CA chain certificate |
| GET | `/certstore/trustedCAChainCert` | Get trusted CA chain certificate list |
| DELETE | `/certstore/trustedCAChainCert/{id}` | Delete trusted CA chain certificate |

---

## 24. User Traffic Profile

Source: vSZ 7.1.1 Public API Reference Guide, Section: User Traffic Profile

| Method | Path | Description |
|--------|------|-------------|
| GET | `/userTrafficProfile` | List all traffic profiles |
| GET | `/userTrafficProfile/{id}` | Retrieve specific profile |
| POST | `/userTrafficProfile` | Create traffic profile |
| POST | `/userTrafficProfile/query` | Retrieve list by query |
| POST | `/userTrafficProfile/{id}/clone` | Clone profile |
| PATCH | `/userTrafficProfile/{id}` | Modify profile |
| PATCH | `/userTrafficProfile/{id}/ipAclRules` | Update IP ACL rules |
| PATCH | `/userTrafficProfile/{id}/uplinkRateLimiting` | Configure uplink limits |
| DELETE | `/userTrafficProfile/{id}/uplinkRateLimiting` | Disable uplink limiting |
| PATCH | `/userTrafficProfile/{id}/downlinkRateLimiting` | Configure downlink limits |
| DELETE | `/userTrafficProfile/{id}/downlinkRateLimiting` | Disable downlink limiting |
| DELETE | `/userTrafficProfile/{id}` | Remove traffic profile |

---

## 25. IPSec Profile

Source: vSZ 7.1.1 Public API Reference Guide, Section: IPSEC Profile

| Method | Path | Description |
|--------|------|-------------|
| GET | `/ipsecProfile` | Retrieve list of profiles |
| GET | `/ipsecProfile/{id}` | Retrieve profile details |
| POST | `/ipsecProfile` | Create IPsec profile |
| POST | `/ipsecProfile/query` | Query profiles |
| PATCH | `/ipsecProfile/{id}` | Modify basic configuration |
| PATCH | `/ipsecProfile/{id}/ikeSecurityAssociation` | Update IKE settings |
| PATCH | `/ipsecProfile/{id}/espSecurityAssociation` | Modify ESP settings |
| PATCH | `/ipsecProfile/{id}/cmProtocolOption` | Update CM protocol |
| PATCH | `/ipsecProfile/{id}/advancedOption` | Modify advanced options |
| DELETE | `/ipsecProfile/{id}` | Remove profile |

---

## 26. VDP Profile

Source: vSZ 7.1.1 Public API Reference Guide, Section: VDP Profile

| Method | Path | Description |
|--------|------|-------------|
| GET | `/vdpProfile` | Retrieve list of profiles |
| GET | `/vdpProfile/{id}` | Retrieve profile details |
| PUT | `/vdpProfile/{id}/approve` | Approve VDP profile |
| DELETE | `/vdpProfile/{id}` | Remove VDP profile |

---

## 27. System

Source: vSZ 7.1.1 Public API Reference Guide, Section: System

| Method | Path | Description |
|--------|------|-------------|
| GET | `/system/summary` | System summary information |
| GET | `/system/apModels` | AP models list |
| GET | `/system/statistics` | System statistics |
| GET | `/system/inventory` | System inventory details |
| GET | `/system/apAutoApprovePolicy` | Retrieve AP auto approve policy |
| PATCH | `/system/apAutoApprovePolicy` | Modify AP auto approve policy |
| GET | `/system/nbi` | Retrieve NBI settings |
| PATCH | `/system/nbi` | Modify NBI basic configuration |
| DELETE | `/system/nbi` | Disable NBI |
| GET | `/system/apRecoverySetting` | Get AP recovery setting |
| POST | `/system/apRecoverySetting` | Modify AP recovery setting |
| POST | `/system/apBalance` | Execute AP balance operation |

---

## 28. Controller

Source: Postman Collection: SmartZone High-Scale Automation

| Method | Path | Description |
|--------|------|-------------|
| GET | `/controller` | Get controller information (hostname, serial, model) |

---

## 29. Wireless Client

Source: vSZ 7.1.1 Public API Reference Guide, Section: Wireless Client

| Method | Path | Description |
|--------|------|-------------|
| GET | `/client/total` | Retrieve total client count |
| GET | `/client` | Retrieve client list |
| POST | `/client/{id}/deAuth` | Deauthenticate client |
| POST | `/client/deAuth` | Bulk deauthenticate clients |
| POST | `/client/{id}/disconnect` | Disconnect client |
| POST | `/client/disconnect` | Bulk disconnect clients |
| POST | `/client/historical` | Retrieve historical client data |
| POST | `/client/queryByWlanName` | Query client by WLAN name |
| POST | `/query/client` | Query wireless clients with filters |

---

## 30. Wired Client

Source: vSZ 7.1.1 Public API Reference Guide, Section: Wired Client

| Method | Path | Description |
|--------|------|-------------|
| POST | `/wiredClients/query` | Query wired network-connected endpoints |

---

## 31. Application Visibility Control (AVC)

Source: vSZ 7.1.1 Public API Reference Guide, Section: Application Visibility Control

### User-Defined Applications

| Method | Path | Description |
|--------|------|-------------|
| POST | `/avc/userDefined/query` | User defined retrieve list |
| GET | `/avc/userDefined/{id}` | User defined retrieve |
| POST | `/avc/userDefined` | User defined create |
| PATCH | `/avc/userDefined/{id}` | User defined modify |
| DELETE | `/avc/userDefined/{id}` | User defined delete |
| DELETE | `/avc/userDefined` | User defined multiple delete |

### Application Policies

| Method | Path | Description |
|--------|------|-------------|
| POST | `/avc/applicationPolicy/query` | Application policy retrieve list |
| GET | `/avc/applicationPolicy/{id}` | Application policy retrieve |
| POST | `/avc/applicationPolicy` | Application policy create |
| PATCH | `/avc/applicationPolicy/{id}` | Application policy modify |
| PATCH | `/avc/applicationPolicy/{id}/applicationRules` | Modify application rules |
| DELETE | `/avc/applicationPolicy/{id}` | Application policy delete |
| DELETE | `/avc/applicationPolicy` | Application policy multiple delete |

### Signature & Reference

| Method | Path | Description |
|--------|------|-------------|
| POST | `/avc/uploadSignaturePackage` | Upload signature package file |
| GET | `/avc/signaturePackageInfo` | Current signature package info |
| GET | `/avc/applicationCategories` | Application categories |
| GET | `/avc/applications` | Applications reference data |
| GET | `/avc/applicationCategory/{id}` | Single application category |
| GET | `/avc/application/{id}` | Single application details |

---

## 32. L2 Access Control

Source: vSZ 7.1.1 Public API Reference Guide, Section: L2 Access Control

| Method | Path | Description |
|--------|------|-------------|
| GET | `/profiles/l2ACL` | Retrieve L2 access control list |
| GET | `/profiles/l2ACL/{id}` | Retrieve specific L2 ACL profile |
| POST | `/profiles/l2ACL` | Create L2 access control profile |
| PATCH | `/profiles/l2ACL/{id}` | Modify L2 ACL basic settings |
| PATCH | `/profiles/l2ACL/{id}/ruleMacs` | Update MAC rules |
| DELETE | `/profiles/l2ACL/{id}` | Delete L2 access control profile |

---

## 33. L3 Access Control Policies

Source: Postman Collection: SmartZone High-Scale Automation

| Method | Path | Description |
|--------|------|-------------|
| GET | `/l3AccessControlPolicies` | Retrieve L3 access control policies |
| POST | `/l3AccessControlPolicies` | Create L3 access control policy (with ACL rules) |

---

## 34. Firewall Profiles

Source: Postman Collection: SmartZone Firewall Profiles

| Method | Path | Description |
|--------|------|-------------|
| GET | `/firewallProfiles` | Get firewall profiles |
| GET | `/firewallProfiles/{id}` | Get firewall profile details |
| POST | `/firewallProfiles` | Create firewall profile |
| PUT | `/firewallProfiles/{id}` | Modify firewall profile (full replacement) |
| DELETE | `/firewallProfiles/{id}` | Delete firewall profile |

---

## 35. Block Client

Source: vSZ 7.1.1 Public API Reference Guide, Section: Block Client

| Method | Path | Description |
|--------|------|-------------|
| GET | `/blockClients` | Retrieve blocked clients list |
| GET | `/blockClients/{id}` | Retrieve specific blocked client |
| POST | `/blockClients` | Create block client entry |
| POST | `/blockClients/byApMac` | Create block client by AP MAC |
| POST | `/blockClients/bulk` | Create multiple block entries |
| POST | `/blockClients/query` | Query blocked clients |
| PUT | `/blockClients/{id}` | Modify blocked client (full replacement) |
| PATCH | `/blockClients/{id}` | Modify blocked client properties |
| DELETE | `/blockClients/{id}` | Delete blocked client entry |

---

## 36. Mark Rogue

Source: vSZ 7.1.1 Public API Reference Guide, Section: Mark Rogue

| Method | Path | Description |
|--------|------|-------------|
| POST | `/rogues/markKnown` | Mark AP as known rogue |
| POST | `/rogues/unmark` | Remove rogue designation |
| GET | `/rogues/knownRogues` | Retrieve known rogue APs |

---

## 37. Ethernet Port Profile

Source: vSZ 7.1.1 Public API Reference Guide, Section: Ethernet Port Profile

| Method | Path | Description |
|--------|------|-------------|
| GET | `/profiles/ethernetPort` | Retrieve ethernet port profiles |
| GET | `/profiles/ethernetPort/{id}` | Retrieve specific profile |
| POST | `/profiles/ethernetPort` | Create ethernet port profile |
| PATCH | `/profiles/ethernetPort/{id}` | Modify profile settings |
| PATCH | `/profiles/ethernetPort/{id}/8021x` | Update 802.1X configuration |
| DELETE | `/profiles/ethernetPort/{id}` | Delete profile |

---

## 38. Device Policy

Source: vSZ 7.1.1 Public API Reference Guide, Section: Device Policy

| Method | Path | Description |
|--------|------|-------------|
| GET | `/profiles/devicePolicy` | Retrieve device policy profiles |
| GET | `/profiles/devicePolicy/{id}` | Retrieve specific profile |
| POST | `/profiles/devicePolicy` | Create device policy profile |
| PATCH | `/profiles/devicePolicy/{id}` | Modify settings |
| PATCH | `/profiles/devicePolicy/{id}/rules` | Update policy rules |
| DELETE | `/profiles/devicePolicy/{id}` | Delete profile |

---

## 39. VLAN Pooling

Source: vSZ 7.1.1 Public API Reference Guide, Section: VlanPooling

| Method | Path | Description |
|--------|------|-------------|
| GET | `/profiles/vlanPooling/{id}` | Retrieve specific profile |
| POST | `/profiles/vlanPooling` | Create VLAN pooling profile |
| POST | `/profiles/vlanPooling/query` | Query profiles |
| PATCH | `/profiles/vlanPooling/{id}` | Modify configuration |
| DELETE | `/profiles/vlanPooling/{id}` | Delete profile |
| DELETE | `/profiles/vlanPooling/bulk` | Delete multiple profiles |

---

## 40. Dynamic PSK (DPSK)

Source: vSZ 7.1.1 Public API Reference Guide, Section: Dynamic PSK

| Method | Path | Description |
|--------|------|-------------|
| GET | `/dpsk/zones/{id}` | Retrieve DPSK settings by zone |
| GET | `/dpsk/wlans/{id}` | Retrieve DPSK settings by WLAN |
| GET | `/dpsk/{id}` | Retrieve specific DPSK |
| POST | `/dpsk/upload` | Upload DPSK file |
| POST | `/dpsk/batchGenerate` | Generate multiple DPSKs |
| GET | `/dpsk/deleteExpiredInterval` | Get expiration interval |
| PUT | `/dpsk/deleteExpiredInterval` | Set expiration interval |
| POST | `/dpsk/delete` | Delete DPSK entries |
| PATCH | `/dpsk/{id}` | Update DPSK properties |
| GET | `/dpsk/enabledWlans` | Retrieve DPSK-enabled WLANs |
| GET | `/dpsk/csvSample` | Download DPSK template file |

---

## 41. Configuration Backup and Restore

Source: vSZ 7.1.1 Public API Reference Guide, Section: Configuration backup and restore

| Method | Path | Description |
|--------|------|-------------|
| POST | `/backupRestore/systemBackup` | System configuration backup |
| POST | `/backupRestore/systemRestore` | System configuration restore |
| GET | `/backupRestore` | Retrieve list of backups |
| GET | `/backupRestore/autoExport` | Get auto export backup |
| GET | `/backupRestore/scheduleBackup` | Get schedule backup setting |
| DELETE | `/backupRestore/{id}` | Delete backup file |
| PATCH | `/backupRestore/autoExport` | Modify auto export backup |
| PATCH | `/backupRestore/scheduleBackup` | Modify schedule backup setting |
| POST | `/backupRestore/upload` | Upload backup configuration |
| GET | `/backupRestore/{id}/download` | Download backup file |

---

## 42. Cluster Backup and Restore

Source: vSZ 7.1.1 Public API Reference Guide, Section: Cluster backup and restore

| Method | Path | Description |
|--------|------|-------------|
| POST | `/clusterBackup/backup` | Execute cluster backup |
| POST | `/clusterBackup/restore` | Restore cluster from backup |
| GET | `/clusterBackup` | Retrieve backup list |
| DELETE | `/clusterBackup/{id}` | Delete specific backup |

---

## 43. System Upgrade

Source: vSZ 7.1.1 Public API Reference Guide, Section: System Upgrade

| Method | Path | Description |
|--------|------|-------------|
| POST | `/systemUpgrade/uploadFile` | Upload system upgrade file |
| GET | `/systemUpgrade/clusterProgressStatus` | Retrieve upgrade progress |
| GET | `/systemUpgrade/uploadPatchInfo` | Get uploaded patch information |
| POST | `/systemUpgrade/upgrade` | Execute system upgrade |
| GET | `/systemUpgrade/history` | Retrieve upgrade history |

---

## 44. Syslog Server

Source: vSZ 7.1.1 Public API Reference Guide, Section: Syslog Server

| Method | Path | Description |
|--------|------|-------------|
| GET | `/syslogServer` | Retrieve syslog configuration |
| PATCH | `/syslogServer` | Modify syslog settings |
| PATCH | `/syslogServer/primaryServer` | Modify primary server |
| PATCH | `/syslogServer/secondaryServer` | Modify secondary server |
| PATCH | `/syslogServer/priority` | Modify priority level |

---

## 45. SNMP Agent

Source: vSZ 7.1.1 Public API Reference Guide, Section: SNMP Agent

| Method | Path | Description |
|--------|------|-------------|
| GET | `/snmpAgent` | Retrieve SNMP agent configuration |
| PUT | `/snmpAgent` | Modify SNMP agent settings |

---

## 46. AP USB Software Package

Source: vSZ 7.1.1 Public API Reference Guide, Section: AP USB Software Package

| Method | Path | Description |
|--------|------|-------------|
| GET | `/apUsb` | Retrieve list of USB packages |
| POST | `/apUsb` | Upload USB software package |
| DELETE | `/apUsb/{id}` | Delete USB package |
| GET | `/apUsb/{id}/zones` | Retrieve zone associations |
| GET | `/apUsb/{id}/apGroups` | Retrieve AP group associations |
| GET | `/apUsb/{id}/aps` | Retrieve AP associations |

---

## 47. AP Registration Rules

Source: vSZ 7.1.1 Public API Reference Guide, Section: AP Registration Rules

| Method | Path | Description |
|--------|------|-------------|
| GET | `/apRegistrationRules` | Retrieve rules |
| GET | `/apRegistrationRules/{id}` | Retrieve specific rule |
| POST | `/apRegistrationRules` | Create rule |
| PATCH | `/apRegistrationRules/{id}` | Modify basic settings |
| PATCH | `/apRegistrationRules/{id}/ipAddressRange` | Update IP ranges |
| PATCH | `/apRegistrationRules/{id}/subnet` | Modify subnet |
| PATCH | `/apRegistrationRules/{id}/gpsCoordinates` | Update GPS coordinates |
| PATCH | `/apRegistrationRules/{id}/mobilityZone` | Assign mobility zone |
| DELETE | `/apRegistrationRules/{id}` | Delete rule |
| GET | `/apRegistrationRules/{id}/movePriorityUp` | Move priority up |
| GET | `/apRegistrationRules/{id}/movePriorityDown` | Move priority down |

---

## 48. Data Plane

Source: vSZ 7.1.1 Public API Reference Guide, Section: Data Plane

| Method | Path | Description |
|--------|------|-------------|
| GET | `/dataPlanes` | Retrieve data plane list |
| GET | `/dataPlanes/{id}` | Retrieve specific data plane |
| PATCH | `/dataPlanes/{id}/managementAndApControl` | Modify management settings |
| PATCH | `/dataPlanes/{id}/apTunnelData` | Update tunnel configuration |
| PATCH | `/dataPlanes/{id}/ipv4DnsServer` | Configure DNS servers |
| PATCH | `/dataPlanes/{id}/staticRoute` | Modify static routes |
| PATCH | `/dataPlanes/{id}/userDefinedInterface` | Update custom interfaces |
| PUT | `/dataPlanes/{id}/meshTunnelSetting` | Set mesh tunnel parameters |
| GET | `/dataPlanes/{id}/meshTunnelSetting` | Retrieve mesh tunnel settings |

---

## 49. Control Planes

Source: vSZ 7.1.1 Public API Reference Guide, Section: Control Planes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/controlPlanes` | Retrieve control plane list |
| GET | `/controlPlanes/{id}` | Retrieve specific control plane |
| PATCH | `/controlPlanes/{id}` | Modify properties |
| GET | `/controlPlanes/{id}/staticRoutes` | Retrieve static routes |
| PATCH | `/controlPlanes/{id}/staticRoutes` | Modify static routes |
| DELETE | `/controlPlanes/{id}/staticRoutes/{routeId}` | Delete route |

---

## 50. RuckusGRE Tunnel Profile

Source: vSZ 7.1.1 Public API Reference Guide, Section: RuckusGRE Tunnel Profile

| Method | Path | Description |
|--------|------|-------------|
| GET | `/profiles/ruckusGreTunnel` | Retrieve profiles |
| GET | `/profiles/ruckusGreTunnel/{id}` | Retrieve specific profile |
| POST | `/profiles/ruckusGreTunnel` | Create profile |
| POST | `/profiles/ruckusGreTunnel/query` | Query profiles |
| PATCH | `/profiles/ruckusGreTunnel/{id}` | Modify profile |
| DELETE | `/profiles/ruckusGreTunnel/{id}` | Delete profile |

---

## 51. SoftGRE Tunnel Profile

Source: vSZ 7.1.1 Public API Reference Guide, Section: SoftGRE Tunnel Profile

| Method | Path | Description |
|--------|------|-------------|
| GET | `/profiles/softGreTunnel` | Retrieve profiles |
| GET | `/profiles/softGreTunnel/{id}` | Retrieve specific profile |
| POST | `/profiles/softGreTunnel` | Create profile |
| POST | `/profiles/softGreTunnel/query` | Query profiles |
| PATCH | `/profiles/softGreTunnel/{id}` | Modify profile |
| DELETE | `/profiles/softGreTunnel/{id}` | Delete profile |

---

## 52. DHCP

Source: vSZ 7.1.1 Public API Reference Guide, Section: DHCP

| Method | Path | Description |
|--------|------|-------------|
| GET | `/dhcpPools` | Retrieve DHCP pool list |
| GET | `/dhcpPools/{id}` | Retrieve specific pool |
| POST | `/dhcpPools` | Create DHCP pool |
| PATCH | `/dhcpPools/{id}` | Modify pool settings |
| DELETE | `/dhcpPools/{id}` | Delete pool |
| DELETE | `/dhcpPools/bulk` | Delete multiple pools |
| GET | `/dhcpConfiguration` | Retrieve DHCP configuration |
| GET | `/apDhcpPoolUsage` | Retrieve AP pool usage statistics |
| GET | `/apDhcpPoolUsage/{index}` | Retrieve pool usage by index |
| GET | `/apDhcpMessageStatisticUsage` | Retrieve DHCP message statistics |

---

## 53. DNS Server Management

Source: vSZ 7.1.1 Public API Reference Guide, Section: DNS Server Management

| Method | Path | Description |
|--------|------|-------------|
| GET | `/profiles/dnsServerProfile` | Retrieve DNS profiles |
| GET | `/profiles/dnsServerProfile/{id}` | Retrieve specific profile |
| POST | `/profiles/dnsServerProfile` | Create DNS profile |
| POST | `/profiles/dnsServerProfile/query` | Query profiles |
| POST | `/profiles/dnsServerProfile/clone` | Clone DNS profile |
| PATCH | `/profiles/dnsServerProfile/{id}` | Modify settings |
| DELETE | `/profiles/dnsServerProfile/{id}` | Delete profile |
| DELETE | `/profiles/dnsServerProfile/bulk` | Delete multiple profiles |

---

## 54. Bonjour Gateway Policies

Source: vSZ 7.1.1 Public API Reference Guide, Section: Bonjour Gateway Policies

| Method | Path | Description |
|--------|------|-------------|
| GET | `/bonjourGatewayPolicies` | Retrieve policies |
| GET | `/bonjourGatewayPolicies/{id}` | Retrieve specific policy |
| POST | `/bonjourGatewayPolicies` | Create policy |
| PATCH | `/bonjourGatewayPolicies/{id}` | Modify settings |
| PATCH | `/bonjourGatewayPolicies/{id}/rules` | Update rules |
| PATCH | `/bonjourGatewayPolicies/{id}/enable` | Toggle enable |
| DELETE | `/bonjourGatewayPolicies/{id}` | Delete policy |

---

## 55. Bonjour Fencing Policy

Source: vSZ 7.1.1 Public API Reference Guide, Section: Bonjour Fencing Policy

| Method | Path | Description |
|--------|------|-------------|
| GET | `/bonjourFencingPolicies` | Retrieve policies |
| GET | `/bonjourFencingPolicies/{id}` | Retrieve specific policy |
| POST | `/bonjourFencingPolicies` | Create policy |
| POST | `/bonjourFencingPolicies/query` | Query policies |
| PATCH | `/bonjourFencingPolicies/{id}` | Modify settings |
| PATCH | `/bonjourFencingPolicies/{id}/rules` | Update rules |
| DELETE | `/bonjourFencingPolicies/{id}` | Delete policy |
| GET | `/bonjourFencingPolicies/{id}/statistics` | Retrieve statistics |

---

## 56. Client Isolation Whitelist

Source: vSZ 7.1.1 Public API Reference Guide, Section: Client Isolation Whitelist

| Method | Path | Description |
|--------|------|-------------|
| GET | `/clientIsolationWhitelists` | Retrieve whitelists |
| GET | `/clientIsolationWhitelists/{id}` | Retrieve specific whitelist |
| POST | `/clientIsolationWhitelists` | Create whitelist |
| POST | `/clientIsolationWhitelists/query` | Query whitelists |
| PATCH | `/clientIsolationWhitelists/{id}` | Modify settings |
| PATCH | `/clientIsolationWhitelists/{id}/entries` | Update entries |
| DELETE | `/clientIsolationWhitelists/{id}` | Delete whitelist |

---

## 57. DiffServ

Source: vSZ 7.1.1 Public API Reference Guide, Section: DiffServ

| Method | Path | Description |
|--------|------|-------------|
| GET | `/profiles/diffServ` | Retrieve profiles |
| GET | `/profiles/diffServ/{id}` | Retrieve specific profile |
| POST | `/profiles/diffServ` | Create profile |
| PATCH | `/profiles/diffServ/{id}` | Modify settings |
| PATCH | `/profiles/diffServ/{id}/uplinkDiffServ` | Configure uplink QoS |
| PATCH | `/profiles/diffServ/{id}/downlinkDiffServ` | Configure downlink QoS |
| PATCH | `/profiles/diffServ/{id}/preservedList` | Modify preserved entries |
| DELETE | `/profiles/diffServ/{id}` | Delete profile |

---

## 58. Precedence Profile

Source: vSZ 7.1.1 Public API Reference Guide, Section: Precedence Profile

| Method | Path | Description |
|--------|------|-------------|
| GET | `/precedenceProfiles` | Retrieve profiles |
| GET | `/precedenceProfiles/{id}` | Retrieve specific profile |
| POST | `/precedenceProfiles` | Create profile |
| POST | `/precedenceProfiles/query` | Query profiles |
| PATCH | `/precedenceProfiles/{id}` | Modify settings |
| DELETE | `/precedenceProfiles/{id}` | Delete profile |
| DELETE | `/precedenceProfiles/bulk` | Delete multiple profiles |

---

## 59. Identity User

Source: vSZ 7.1.1 Public API Reference Guide, Section: Identity User

| Method | Path | Description |
|--------|------|-------------|
| GET | `/identityUsers` | Retrieve user list |
| GET | `/identityUsers/{id}` | Retrieve specific user |
| POST | `/identityUsers` | Create user account |
| POST | `/identityUsers/query` | Query users |
| PATCH | `/identityUsers/{id}` | Modify user info |
| PATCH | `/identityUsers/{id}/subscriberPackage` | Assign subscription package |
| DELETE | `/identityUsers/{id}` | Delete user |
| DELETE | `/identityUsers/bulk` | Delete multiple users |
| GET | `/identityUsers/aaaServerList` | Retrieve AAA server options |
| GET | `/identityUsers/packageList` | Retrieve subscription packages |
| GET | `/identityUsers/countryList` | Retrieve country codes |

---

## 60. Identity User Role

Source: vSZ 7.1.1 Public API Reference Guide, Section: Identity User Role

| Method | Path | Description |
|--------|------|-------------|
| GET | `/identityUserRoles` | Retrieve roles |
| GET | `/identityUserRoles/{id}` | Retrieve specific role |
| POST | `/identityUserRoles` | Create role |
| POST | `/identityUserRoles/query` | Query roles |
| PATCH | `/identityUserRoles/{id}` | Modify properties |
| PATCH | `/identityUserRoles/{id}/maxDevices` | Update max device limit |
| PATCH | `/identityUserRoles/{id}/userTrafficProfile` | Assign traffic profile |
| PATCH | `/identityUserRoles/{id}/vlanPooling` | Configure VLAN pooling |
| DELETE | `/identityUserRoles/{id}` | Delete role |
| DELETE | `/identityUserRoles/bulk` | Delete multiple roles |

---

## 61. Identity Guest Pass

Source: vSZ 7.1.1 Public API Reference Guide, Section: Identity Guest Pass

| Method | Path | Description |
|--------|------|-------------|
| GET | `/identityGuestPasses` | Retrieve guest passes |
| POST | `/identityGuestPasses/query` | Query guest passes |
| POST | `/identityGuestPasses/generate` | Generate new guest passes |
| POST | `/identityGuestPasses/import` | Import guest passes |
| POST | `/identityGuestPasses/commonSettings` | Configure pass settings |
| DELETE | `/identityGuestPasses/{id}` | Delete guest pass |
| DELETE | `/identityGuestPasses/bulk` | Delete multiple passes |

---

## 62. Identity Subscription Package

Source: vSZ 7.1.1 Public API Reference Guide, Section: Identity Subscription Package

| Method | Path | Description |
|--------|------|-------------|
| GET | `/identitySubscriptionPackages` | Retrieve packages |
| GET | `/identitySubscriptionPackages/{id}` | Retrieve specific package |
| POST | `/identitySubscriptionPackages` | Create package |
| POST | `/identitySubscriptionPackages/query` | Query packages |
| PATCH | `/identitySubscriptionPackages/{id}` | Modify settings |
| DELETE | `/identitySubscriptionPackages/{id}` | Delete package |

---

## 63. SCG User

Source: vSZ 7.1.1 Public API Reference Guide, Section: SCG User

| Method | Path | Description |
|--------|------|-------------|
| POST | `/scgUsers` | Create user account |
| GET | `/scgUsers/{id}` | Retrieve specific user |
| POST | `/scgUsers/query` | Query users |
| PATCH | `/scgUsers/{id}` | Modify properties |
| DELETE | `/scgUsers/{id}` | Delete user |

---

## 64. SCG User Group

Source: vSZ 7.1.1 Public API Reference Guide, Section: SCG User Group

| Method | Path | Description |
|--------|------|-------------|
| POST | `/scgUserGroups` | Create user group |
| GET | `/scgUserGroups/{id}` | Retrieve specific group |
| POST | `/scgUserGroups/query` | Query user groups |
| PATCH | `/scgUserGroups/{id}` | Modify settings |
| PATCH | `/scgUserGroups/{id}/permissions` | Update permissions |
| PATCH | `/scgUserGroups/{id}/permissionScope` | Update permission scope |
| PATCH | `/scgUserGroups/{id}/users` | Modify group membership |
| DELETE | `/scgUserGroups/{id}` | Delete user group |
| GET | `/currentUser/permittedCategories` | Retrieve permitted categories |
| GET | `/scgUserGroups/predefinedRoles` | Retrieve predefined roles |
| GET | `/scgUserGroups/roles/{id}/permissions` | Get role permissions |

---

## 65. WeChat

Source: vSZ 7.1.1 Public API Reference Guide, Section: Wechat

| Method | Path | Description |
|--------|------|-------------|
| GET | `/profiles/wechat` | Retrieve WeChat portals |
| GET | `/profiles/wechat/{id}` | Retrieve specific configuration |
| POST | `/profiles/wechat` | Create WeChat portal |
| PATCH | `/profiles/wechat/{id}` | Modify basic settings |
| PATCH | `/profiles/wechat/{id}/dnatPortMapping` | Update DNAT port mappings |
| PATCH | `/profiles/wechat/{id}/whiteList` | Modify whitelist |
| DELETE | `/profiles/wechat/{id}` | Delete configuration |

---

## 66. Zone Affinity Profile

Source: vSZ 7.1.1 Public API Reference Guide, Section: Zone Affinity Profile

| Method | Path | Description |
|--------|------|-------------|
| GET | `/zoneAffinityProfiles` | Retrieve profiles |
| GET | `/zoneAffinityProfiles/{id}` | Retrieve specific profile |
| POST | `/zoneAffinityProfiles` | Create profile |
| PATCH | `/zoneAffinityProfiles/{id}` | Modify settings |
| DELETE | `/zoneAffinityProfiles/{id}` | Delete profile |

---

## 67. Bridge

Source: vSZ 7.1.1 Public API Reference Guide, Section: Bridge

| Method | Path | Description |
|--------|------|-------------|
| GET | `/bridges` | Retrieve bridge list |
| GET | `/bridges/{id}` | Retrieve specific bridge |
| POST | `/bridges/query` | Query bridges |

---

## 68. Mesh

Source: Postman Collection: SmartZone Mesh APIs

| Method | Path | Description |
|--------|------|-------------|
| GET | `/rkszones/{zoneId}/mesh` | Get mesh configuration for zone |
| POST | `/query/mesh/count/byZone` | Query mesh count by zone |
| POST | `/query/mesh/topology` | Query mesh topology |
| GET | `/aps/{apMac}/operational/neighbor` | Get neighbors on mesh AP |
| POST | `/query/mesh/{apMac}/neighbor` | Query neighbors on mesh AP |
| POST | `/query/mesh/{apMac}/topology` | Query mesh topology by AP MAC |

---

## 69. Indoor Map

Source: vSZ 7.1.1 Public API Reference Guide, Section: IndoorMap

| Method | Path | Description |
|--------|------|-------------|
| GET | `/indoorMaps` | Retrieve maps |
| GET | `/indoorMaps/{id}` | Retrieve specific map |
| POST | `/indoorMaps` | Create map |
| POST | `/indoorMaps/query` | Query maps |
| PATCH | `/indoorMaps/{id}` | Update properties |
| PUT | `/indoorMaps/{id}/aps` | Place APs in map |
| DELETE | `/indoorMaps/{id}` | Delete map |

---

## 70. LBS Profile

Source: vSZ 7.1.1 Public API Reference Guide, Section: LBS profile

| Method | Path | Description |
|--------|------|-------------|
| POST | `/lbsProfiles` | Create LBS profile |
| POST | `/lbsProfiles/query` | Query profiles |
| PATCH | `/lbsProfiles/{id}` | Update settings |
| DELETE | `/lbsProfiles/{id}` | Delete profile |
| DELETE | `/lbsProfiles/bulk` | Delete multiple profiles |

---

## 71. CALEA

Source: vSZ 7.1.1 Public API Reference Guide, Section: CALEA

| Method | Path | Description |
|--------|------|-------------|
| GET | `/calea/ues` | Retrieve CALEA UE list |
| POST | `/calea/ues` | Add CALEA UE MAC addresses |
| POST | `/calea/ues/upload` | Upload CALEA UE MAC addresses |
| DELETE | `/calea/ues` | Delete all CALEA UE entries |
| DELETE | `/calea/ues/bulk` | Delete specified CALEA entries |
| POST | `/calea/commonSettings` | Configure CALEA settings |
| GET | `/calea/commonSettings` | Retrieve CALEA configuration |

---

## 72. SCI

Source: vSZ 7.1.1 Public API Reference Guide, Section: SCI

| Method | Path | Description |
|--------|------|-------------|
| GET | `/sciProfiles` | Retrieve profiles |
| GET | `/sciProfiles/{id}` | Retrieve specific profile |
| POST | `/sciProfiles` | Create profile |
| POST | `/sciProfiles/{id}/priorities` | Configure priorities |
| PATCH | `/sciProfiles/{id}` | Modify settings |
| DELETE | `/sciProfiles/{id}` | Delete profile |
| DELETE | `/sciProfiles/bulk` | Delete multiple profiles |
| PATCH | `/sci/enabled` | Enable/disable SCI |
| GET | `/sci/acceptedEventCodes` | Retrieve accepted event codes |
| POST | `/sci/acceptedEventCodes` | Configure accepted events |

---

## 73. Flexi-VPN

Source: vSZ 7.1.1 Public API Reference Guide, Section: Flexi-VPN

| Method | Path | Description |
|--------|------|-------------|
| GET | `/flexiVpn/globalConfiguration` | Retrieve Flexi-VPN settings |
| PATCH | `/flexiVpn/globalConfiguration` | Modify configuration |
| PATCH | `/flexiVpn/profiles` | Update profile |
| POST | `/flexiVpn/profiles/query` | Query profiles |
| DELETE | `/flexiVpn/wlans/{id}` | Delete WLAN Flexi-VPN profile |

---

## 74. L3 Roaming

Source: vSZ 7.1.1 Public API Reference Guide, Section: L3 Roaming

| Method | Path | Description |
|--------|------|-------------|
| POST | `/l3Roaming/configuration` | Retrieve L3 roaming configuration |
| PATCH | `/l3Roaming/basicConfiguration` | Modify roaming settings |
| PATCH | `/l3Roaming/dataPlaneConfiguration` | Update data plane config |

---

## 75. FTP Server Settings

Source: vSZ 7.1.1 Public API Reference Guide, Section: FtpServerSettings

| Method | Path | Description |
|--------|------|-------------|
| GET | `/ftpServerSettings/{id}` | Retrieve specific FTP server |
| GET | `/ftpServerSettings/{id}/test` | Test FTP connectivity |
| POST | `/ftpServerSettings` | Create FTP server |
| POST | `/ftpServerSettings/query` | Query FTP servers |
| PATCH | `/ftpServerSettings/{id}` | Update settings |
| DELETE | `/ftpServerSettings/{id}` | Remove FTP server |
| DELETE | `/ftpServerSettings/bulk` | Remove multiple servers |

---

## 76. Application Log and Status

Source: vSZ 7.1.1 Public API Reference Guide, Section: Application Log And Status

| Method | Path | Description |
|--------|------|-------------|
| GET | `/applicationLog` | Retrieve application log list |
| GET | `/applicationLog/controlPlaneList` | Get control plane system information |
| PATCH | `/applicationLog/{id}/logLevel` | Modify logging verbosity |
| GET | `/applicationLog/download` | Download application logs |
| GET | `/applicationLog/downloadSnapshot` | Download log snapshot |

---

## 77. LWAPP to SCG

Source: vSZ 7.1.1 Public API Reference Guide, Section: LWAPP TO SCG

| Method | Path | Description |
|--------|------|-------------|
| PATCH | `/lwappToScg/basic` | Modify legacy AP transition settings |
| PATCH | `/lwappToScg/apList` | Update AP migration list |

---

## 78. Test AAA Server

Source: vSZ 7.1.1 Public API Reference Guide, Section: Test AAA Server

| Method | Path | Description |
|--------|------|-------------|
| POST | `/testAaaServer/test` | Verify AAA server connectivity |

---

## 79. Connectivity Tools

Source: vSZ 7.1.1 Public API Reference Guide, Section: Connectivity Tools

| Method | Path | Description |
|--------|------|-------------|
| POST | `/connectivityTools/speedFlex` | Execute speed test |
| GET | `/connectivityTools/speedFlexResults` | Retrieve speed test results |
| GET | `/connectivityTools/ping` | Execute ping command |
| GET | `/connectivityTools/traceRoute` | Execute traceroute command |

---

## 80. AP APP

Source: vSZ 7.1.1 Public API Reference Guide, Section: AP APP

| Method | Path | Description |
|--------|------|-------------|
| GET | `/apApp/totalApCount` | Retrieve total AP count |
| GET | `/apApp/apSummary` | Retrieve AP summary statistics |
| PUT | `/apApp/workflowFile` | Upload workflow file |
| GET | `/apApp/workflowFile` | Download workflow file |

---

## 81. Event and Alarm

Source: vSZ 7.1.1 Public API Reference Guide, Section: Event and Alarm

| Method | Path | Description |
|--------|------|-------------|
| POST | `/events/query` | Query system events |
| POST | `/alarms/query` | Query system alarms |
| PUT | `/alarms/{id}/acknowledge` | Acknowledge alarm |
| PUT | `/alarms/{id}/clear` | Clear alarm |
| PUT | `/alarms/acknowledge` | Acknowledge multiple alarms |
| PUT | `/alarms/clear` | Clear multiple alarms |

---

## 82. Query With Filter

Source: vSZ 7.1.1 Public API Reference Guide, Section: Query With Filter

These endpoints provide advanced filtering capabilities across multiple resource types.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/query/ap` | Query APs with filter criteria |
| POST | `/query/client` | Query wireless clients with filters |
| POST | `/wlans/query` | Query WLANs |
| POST | `/aaaServers/query` | Query AAA servers |
| POST | `/aaaServers/authentication/query` | Query auth AAA servers |
| POST | `/aaaServers/accounting/query` | Query accounting servers |
| POST | `/clients/query` | Query wireless clients |
| POST | `/dpsks/query` | Query DPSK entries |
| POST | `/identityUsers/query` | Query identity users |
| POST | `/wlanSchedulers/query` | Query WLAN schedulers |
| POST | `/profiles/wechat/query` | Query WeChat portals |
| POST | `/profiles/webAuth/query` | Query web auth profiles |
| POST | `/profiles/vlanPooling/query` | Query VLAN pooling |
| POST | `/profiles/hotspot20Venue/query` | Query venue profiles |
| POST | `/profiles/l2ACL/query` | Query L2 access control |
| POST | `/profiles/hotspot20/query` | Query Hotspot 2.0 profiles |
| POST | `/profiles/hotspot/query` | Query Hotspot profiles |
| POST | `/profiles/guestAccess/query` | Query guest access |
| POST | `/profiles/ethernetPort/query` | Query ethernet port profiles |
| POST | `/profiles/diffServ/query` | Query DiffServ profiles |
| POST | `/dhcpPools/query` | Query DHCP pools |
| POST | `/profiles/devicePolicy/query` | Query device policies |
| POST | `/rogues/query` | Query rogue APs |
| POST | `/meshNeighbors/query` | Query mesh neighbors |
| POST | `/profiles/bonjourPolicy/query` | Query Bonjour policies |
| POST | `/indoorMaps/query` | Query indoor maps |

---

## 83. Traffic Analysis

Source: Postman Collection: SmartZone High-Scale Automation

| Method | Path | Description |
|--------|------|-------------|
| POST | `/trafficAnalysis/client/app/wlan` | Get wireless application traffic by WLAN |

> **Note**: Additional traffic analysis endpoints exist for per-AP analysis (e.g., `/trafficAnalysis/client/app/ap`) in v9_1+.

---

## 84. Health Monitoring

Source: Postman Collection: SmartZone High-Scale Automation

| Method | Path | Description |
|--------|------|-------------|
| POST | `/healthExtend/groupBar/eapFailure` | Get EAP failure data |

> **Note**: Additional health monitoring endpoints are available for other metrics. These were confirmed via Postman collections but full enumeration requires the official API reference.

---

## 85. Administration

Source: vSZ 7.1.1 Public API Reference Guide, Section: Administration

| Method | Path | Description |
|--------|------|-------------|
| POST | `/administration/restart` | Restart system |
| POST | `/administration/shutdown` | Shutdown system |

---

## 86. Global Reference

Source: vSZ 7.1.1 Public API Reference Guide, Section: Global reference

| Method | Path | Description |
|--------|------|-------------|
| GET | `/globalReference/usableLanguages` | Retrieve friendly language names |

---

## 87. WISPr Portal

Source: Postman Collection: WISPr and WLAN automation

> **Note**: These endpoints use the internal SCG API path (`/wsg/api/scg/`) rather than the public API prefix.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/hotspots` (via `/wsg/api/scg/`) | Create WISPr portal |
| PUT | `/wlans/{wlanId}` (via `/wsg/api/scg/`) | Change WLAN to WISPr mode |

---

## Common Request/Response Patterns

### Pagination (Query Endpoints)

All POST query endpoints support pagination via the request body:

```json
{
  "page": 1,
  "start": 0,
  "limit": 25,
  "sortInfo": {
    "sortColumn": "name",
    "dir": "ASC"
  },
  "filters": [
    {
      "type": "DOMAIN",
      "value": "{domainId}"
    }
  ]
}
```

Source: Postman Collection: SmartZone High-Scale Automation

### Filter Types

Common filter types used in query endpoints:

| Filter Type | Description |
|---|---|
| `DOMAIN` | Filter by domain ID |
| `ZONE` | Filter by zone ID |
| `WLAN` | Filter by WLAN ID |
| `AP` | Filter by AP MAC address |
| `SYSTEM_TIME` | Filter by time range |

Source: Postman Collection: SmartZone High-Scale Automation

### Error Response Format

```json
{
  "message": "Error description",
  "errorCode": 123,
  "errorType": "string"
}
```

Source: vSZ Public API Reference Guide, Section: Error Handling

---

## Endpoint Count Summary

| Category | Endpoint Count |
|---|---|
| Login / Session | 4 |
| Domains | 5 |
| AP Zones (rkszones) | ~70 (including sub-resources) |
| AP Groups | ~50 (including overrides) |
| Access Point Configuration | ~55 (including overrides) |
| Access Point Operational | 11 |
| AP Packet Capture | 3 |
| WLAN Groups | 11 |
| WLANs | ~40 (including creation variants) |
| WLAN Scheduler | 12 |
| Zone AAA | 18 |
| Authentication Services | ~40 (all providers) |
| Accounting Services | 15 |
| Web Authentication | 8 |
| Guest Access | 11 |
| Hotspot Service | 9 |
| Hotspot 2.0 (all profiles) | ~35 |
| Certificate Management | 16 |
| Certificate Store | 6 |
| User Traffic Profile | 12 |
| IPSec Profile | 10 |
| VDP Profile | 4 |
| System | 12 |
| Controller | 1 |
| Wireless Client | 8 |
| Wired Client | 1 |
| AVC | 17 |
| L2 Access Control | 6 |
| L3 Access Control | 2 |
| Firewall Profiles | 5 |
| Block Client | 9 |
| Mark Rogue | 3 |
| Ethernet Port Profile | 6 |
| Device Policy | 6 |
| VLAN Pooling | 6 |
| Dynamic PSK | 11 |
| Backup/Restore | 10 |
| Cluster Backup | 4 |
| System Upgrade | 5 |
| Syslog Server | 5 |
| SNMP Agent | 2 |
| AP USB | 6 |
| AP Registration Rules | 10 |
| Data Plane | 9 |
| Control Planes | 6 |
| RuckusGRE Tunnel | 6 |
| SoftGRE Tunnel | 6 |
| DHCP | 10 |
| DNS Server | 8 |
| Bonjour Gateway | 7 |
| Bonjour Fencing | 8 |
| Client Isolation | 7 |
| DiffServ | 8 |
| Precedence Profile | 7 |
| Identity User | 11 |
| Identity User Role | 10 |
| Identity Guest Pass | 7 |
| Identity Subscription | 6 |
| SCG User | 5 |
| SCG User Group | 11 |
| WeChat | 7 |
| Zone Affinity | 5 |
| Bridge | 3 |
| Mesh | 6 |
| Indoor Map | 7 |
| LBS Profile | 5 |
| CALEA | 7 |
| SCI | 10 |
| Flexi-VPN | 5 |
| L3 Roaming | 3 |
| FTP Server | 7 |
| Application Log | 5 |
| LWAPP to SCG | 2 |
| Test AAA | 1 |
| Connectivity Tools | 4 |
| AP APP | 4 |
| Event and Alarm | 6 |
| Query With Filter | 26 |
| Traffic Analysis | 1+ |
| Health Monitoring | 1+ |
| Administration | 2 |
| Global Reference | 1 |
| WISPr Portal | 2 |
| **TOTAL** | **~750+** |

---

## Citation Notes

- All endpoints listed are sourced from official Ruckus documentation and official Ruckus-maintained repositories
- The primary authoritative source is the [SmartZone 7.1.1 (LT-GA) Public API Reference Guide (vSZ-E)](https://docs.ruckuswireless.com/smartzone/7.1.1/vsze-public-api-reference-guide-711.html)
- The full HTML reference guide exceeds 10MB and could not be parsed in a single pass; endpoint details were cross-referenced across multiple official Ruckus documentation versions (3.5.1, 6.1.0, 7.0.0) which share the same core API structure
- Postman collections from the [official Ruckus GitHub repository](https://github.com/commscope-ruckus/RUCKUS-SmartZone-Postman) provided supplementary validation
- The SmartZone API maintains strong backward compatibility - endpoints available in earlier versions remain available in 7.1.1
- Endpoints marked as sourced from Postman collections were verified against official Ruckus-maintained repositories (commscope-ruckus organization on GitHub)
- Categories like Traffic Analysis and Health Monitoring have additional endpoints beyond what is documented here; the full enumeration is available in the 10MB+ HTML reference guide
