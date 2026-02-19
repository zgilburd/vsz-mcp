# vSZ 7.1.1 OpenAPI Endpoint Catalog (from live controller)

> **Source**: OpenAPI spec downloaded from live vSZ controller 7.1.1.0.872
> **API Version**: v13_1 | **Title**: Virtual SmartZone - Essentials
> **Base Path**: /wsg/api/public/v13_1
> **Total Operations**: 1068 | **Total Paths**: 688 | **Tags**: 114
> **Definitions/Schemas**: 936

---

## MCP Tool Mapping Summary

| MCP Tool | Tags Mapped | Endpoint Count |
|----------|-------------|----------------|
| `vsz_ap` | Access Point APP, Access Point Configuration, Access Point Operational, AP External Syslog Server Profile, AP Group, AP Registration Rules, AP SNMP Agent Profile | 201 |
| `vsz_auth_services` | Accounting Service, Authentication Profile, Authentication Service, Test AAA Server, Vendor Specific Attribute Profile, Web Authentication | 57 |
| `vsz_backup` | Cluster Management | 26 |
| `vsz_certificate` | Certificate, Dynamic PSK | 34 |
| `vsz_client` | Block Client, Client Isolation Whitelist, Rogue Client, Wired Client, Wireless Client | 29 |
| `vsz_hotspot` | Guest Access, Hotspot 2.0 Wi-Fi Operator Profile, Hotspot Service, Hotspot20 Venue Service, Portal Detection and Suppression Profile, SMS Gateway, Social Media Login Profile, Wechat | 57 |
| `vsz_identity` | Hotspot 2.0 Identity Provider Profile, Identity Guest Pass, Identity Subscription Package, Identity User, Identity User Role, SCG User, SCG User Group | 56 |
| `vsz_indoor_map` | IndoorMap, LBS profile, Real Time Location Service Profile | 18 |
| `vsz_internal_auth` | Service Ticket, Session Management | 3 |
| `vsz_monitoring` | Connectivity Tools, Event and Alarm, Event Management Setting, Switch Event Management Setting, Traffic Class Profile, User Traffic Profile | 39 |
| `vsz_network` | Bond Port Profile, Bonjour Fencing Policy, Bonjour Gateway Policies, Bridge, Control Planes, Data Plane Operational, DHCP, DiffServ, DNS Server Management, DNS Spoofing Profile, DP DHCP & NAT Profile, DP DHCP Profile, DP Group, DP NAT Profile, DP Network, Ethernet Port Profile, Flexi-VPN, IPSEC Profile, L3 Roaming, Multicast Forwarding, Network Segmentation Profile, Precedence Profile, RuckusGRE Tunnel Profile, SoftGRE Tunnel Profile, Split Tunnel Profile, SystemIPsec, VDP Profile, VLAN Name Profile, VlanPooling | 201 |
| `vsz_query` | Query With Filter, URL Filtering Policy | 10 |
| `vsz_security` | Account Security, Allowed Device Profile, Application Visibility Control, Device Policy, Device Policy in Domain Level, Firewall Profile, Geofence Profile, L2 Access Control, L2 Access Control in Domain Level, L3 Access Control Policy, Mark Rogue, Restricted AP Access Profile, Rogue Classification Policy, Signature Based Profile | 118 |
| `vsz_system` | Administration, Application Log And Status, FtpServerSettings, GDPR, Global reference, LWAPP TO SCG, Northbound Data Streaming, SCI, SNMP Agent, Syslog Server, System, ZDImport | 86 |
| `vsz_wlan` | Hotspot20 WLAN Service, Wi-Fi Calling Policy, WLAN, WLAN Group, WLAN Scheduler | 57 |
| `vsz_zones` | Domain, Ruckus Wireless AP Zone, Zone AAA, Zone Schedule Upgrade, Zone Switch Group Link | 76 |

---

## Endpoints by Tag

### Access Point APP (4 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/aps/lineman` | Use this API command to retrieve the summary information of an AP. This is used  |
| GET | `/aps/totalCount` | Use this API command to retrieve the total AP count within a zone or a domain. |
| GET | `/lineman/workflow` | Use this API command to download the workflow file used by the Ruckus Wireless A |
| PUT | `/lineman/workflow` | Use this API command to upload a workflow file used by the Ruckus Wireless AP mo |

### Access Point Configuration (83 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/aps` | Use this API command to retrieve the list of APs that belong to a zone or a doma |
| POST | `/aps` | Use this API command to create a new access point. |
| GET | `/aps/{apMac}` | Use this API command to retrieve the configuration of an AP. |
| PUT | `/aps/{apMac}` | Use this API command to modify the entire information of an AP. |
| DELETE | `/aps/{apMac}` | Use this API command to delete an access point. |
| PATCH | `/aps/{apMac}` | Use this API command to modify the configuration of an AP. |
| DELETE | `/aps/{apMac}/altitude` | Use this API command to disable AP level override of altitude. The access point  |
| DELETE | `/aps/{apMac}/apMgmtVlan` | Disable AP Management Vlan Override of an AP. |
| DELETE | `/aps/{apMac}/bonjourGateway` | Use this API command to disable AP level override of bonjour gateway. The access |
| DELETE | `/aps/{apMac}/channelEvaluationInterval` | Disable AP lChannel Evaluation Interval. The access point will take its group's  |
| DELETE | `/aps/{apMac}/clientAdmissionControl24` | Use this API command to disable AP level override of client admission control 2. |
| DELETE | `/aps/{apMac}/clientAdmissionControl50` | Use this API command to disable AP level override of client admission control 5G |
| DELETE | `/aps/{apMac}/directedMulticastFromNetworkEnabled` | Use this API command to disable Directed Multicast from network to wired/wireles |
| DELETE | `/aps/{apMac}/directedMulticastFromWiredClientEnabled` | Use this API command to disable Island SSID Broadcast enabled configuration over |
| DELETE | `/aps/{apMac}/directedMulticastFromWirelessClientEnabled` | Use this API command to disable Island SSID Broadcast enabled configuration over |
| DELETE | `/aps/{apMac}/gpsCoordinates` | Disable AP Management GPS Cooordinates of an AP. |
| DELETE | `/aps/{apMac}/location` | Use this API command to disable AP level override of location. The access point  |
| DELETE | `/aps/{apMac}/locationAdditionalInfo` | Use this API command to disable AP level override of location additionalInfo. Th |
| DELETE | `/aps/{apMac}/login` | Use this API command to disable the AP-level logon override. The AP will apply i |
| DELETE | `/aps/{apMac}/lteBandLockChannels` | Use this API command to disable LTE band lock channel override. The AP will appl |
| DELETE | `/aps/{apMac}/meshOptions` | Use this API command to disable mesh options. |
| GET | `/aps/{apMac}/picture` | Use this API command to retrieve the current AP picture. |
| POST | `/aps/{apMac}/picture` | Use this API command to upload a new AP picture. |
| DELETE | `/aps/{apMac}/picture` | Use this API command to delete an AP picture. |
| DELETE | `/aps/{apMac}/radioConfig/radio24g` | Use this API command to disable the AP level override of 2.4GHz radio configurat |
| DELETE | `/aps/{apMac}/radioConfig/radio24g/autoChannelSelection` | Use this API command to disable the AP level override of auto channel selection  |
| DELETE | `/aps/{apMac}/radioConfig/radio24g/channel` | Use this API command to disable the AP level override of the 2.4GHz radio channe |
| DELETE | `/aps/{apMac}/radioConfig/radio24g/channelRange` | Use this API command to disable the AP level override of the 2.4GHz radio channe |
| DELETE | `/aps/{apMac}/radioConfig/radio24g/channelWidth` | Use this API command to disable the AP level override of the 2.4GHz radio channe |
| DELETE | `/aps/{apMac}/radioConfig/radio24g/protectionMode` | Use this API command to disable 2.4GHz radio protection mode configuration overr |
| DELETE | `/aps/{apMac}/radioConfig/radio24g/txPower` | Use this API command to disable the AP level override of the 2.4GHz radio txPowe |
| DELETE | `/aps/{apMac}/radioConfig/radio24g/wlanGroupId` | Use this API command to disable the AP level override of WLAN group configuratio |
| DELETE | `/aps/{apMac}/radioConfig/radio5g` | Use this API command to disable the AP level override of 5GHz radio configuratio |
| DELETE | `/aps/{apMac}/radioConfig/radio5g/autoChannelSelection` | Use this API command to disable the AP level override of auto channel selection  |
| DELETE | `/aps/{apMac}/radioConfig/radio5g/channel` | Use this API command to disable the AP level override of 5GHz radio channel. The |
| DELETE | `/aps/{apMac}/radioConfig/radio5g/channelRange` | Use this API command to disable the AP level override of 5GHz radio channelRange |
| DELETE | `/aps/{apMac}/radioConfig/radio5g/channelWidth` | Use this API command to disable the AP level override of 5GHz radio channelWidth |
| DELETE | `/aps/{apMac}/radioConfig/radio5g/txPower` | Use this API command to disable the AP level override of 5GHz radio txPower. The |
| DELETE | `/aps/{apMac}/radioConfig/radio5g/wlanGroupId` | Use this API command to disable the AP level override of WLAN group on the 5GHz  |
| DELETE | `/aps/{apMac}/radioConfig/radio5gLower` | Use this API command to disable the AP level override of lower 5GHz radio config |
| DELETE | `/aps/{apMac}/radioConfig/radio5gLower/autoChannelSelection` | Use this API command to disable the AP level override of auto channel selection  |
| DELETE | `/aps/{apMac}/radioConfig/radio5gLower/channel` | Use this API command to disable the AP level override of lower 5GHz radio channe |
| DELETE | `/aps/{apMac}/radioConfig/radio5gLower/channelRange` | Use this API command to disable the AP level override of lower 5GHz radio channe |
| DELETE | `/aps/{apMac}/radioConfig/radio5gLower/channelWidth` | Use this API command to disable the AP level override of lower 5GHz radio channe |
| DELETE | `/aps/{apMac}/radioConfig/radio5gLower/txPower` | Use this API command to disable the AP level override of lower 5GHz radio txPowe |
| DELETE | `/aps/{apMac}/radioConfig/radio5gLower/wlanGroupId` | Use this API command to disable the AP level override of WLAN group on the lower |
| DELETE | `/aps/{apMac}/radioConfig/radio5gUpper` | Use this API command to disable the AP level override of upper 5GHz radio config |
| DELETE | `/aps/{apMac}/radioConfig/radio5gUpper/autoChannelSelection` | Use this API command to disable the AP level override of auto channel selection  |
| DELETE | `/aps/{apMac}/radioConfig/radio5gUpper/channel` | Use this API command to disable the AP level override of upper 5GHz radio channe |
| DELETE | `/aps/{apMac}/radioConfig/radio5gUpper/channelRange` | Use this API command to disable the AP level override of upper 5GHz radio channe |
| DELETE | `/aps/{apMac}/radioConfig/radio5gUpper/channelWidth` | Use this API command to disable the AP level override of upper 5GHz radio channe |
| DELETE | `/aps/{apMac}/radioConfig/radio5gUpper/txPower` | Use this API command to disable the AP level override of upper 5GHz radio txPowe |
| DELETE | `/aps/{apMac}/radioConfig/radio5gUpper/wlanGroupId` | Use this API command to disable the AP level override of WLAN group on the upper |
| DELETE | `/aps/{apMac}/radioConfig/radio6g` | Use this API command to disable the AP level override of 6GHz radio configuratio |
| DELETE | `/aps/{apMac}/radioConfig/radio6g/autoChannelSelection` | Use this API command to disable the AP level override of auto channel selection  |
| DELETE | `/aps/{apMac}/radioConfig/radio6g/bssMinRate` | Use this API command to disable the AP level override of BSS minimum rate on the |
| DELETE | `/aps/{apMac}/radioConfig/radio6g/channel` | Use this API command to disable the AP level override of 6GHz radio channel. The |
| DELETE | `/aps/{apMac}/radioConfig/radio6g/channelRange` | Use this API command to disable the AP level override of 6GHz radio channelRange |
| DELETE | `/aps/{apMac}/radioConfig/radio6g/channelWidth` | Use this API command to disable the AP level override of 6GHz radio channelWidth |
| DELETE | `/aps/{apMac}/radioConfig/radio6g/mgmtTxRate` | Use this API command to disable the AP level override of management TX rate on t |
| DELETE | `/aps/{apMac}/radioConfig/radio6g/multicastDownlinkRateLimit` | Use this API command to disable the AP level override of multicast downlink rate |
| DELETE | `/aps/{apMac}/radioConfig/radio6g/multicastUplinkRateLimit` | Use this API command to disable the AP level override of multicast uplink rate l |
| DELETE | `/aps/{apMac}/radioConfig/radio6g/txPower` | Use this API command to disable the AP level override of 6GHz radio txPower. The |
| DELETE | `/aps/{apMac}/radioConfig/radio6g/wlanGroupId` | Use this API command to disable the AP level override of WLAN group on the 6GHz  |
| PUT | `/aps/{apMac}/reboot` | reboot an access point. |
| PUT | `/aps/{apMac}/rebootCableModem` | reboot the cable modem. |
| DELETE | `/aps/{apMac}/recoverySsid` | Use this API command to disable Recovery SSID configuration override.The AP will |
| POST | `/aps/{apMac}/resetCableModem` | reset the cable modem. |
| DELETE | `/aps/{apMac}/rksGreForwardBroadcast` | Use this API command to disable Ruckus GRE Broadcast packet forwarding override. |
| DELETE | `/aps/{apMac}/rogueApAggressivenessMode` | Use this API command to disable rogue AP aggressiveness mode override. The AP wi |
| DELETE | `/aps/{apMac}/rogueApJammingThreshold` | Use this API command to disable rogue AP jamming threshold override. The AP will |
| DELETE | `/aps/{apMac}/rogueApReportThreshold` | Use this API command to disable rogue AP report threshold override. The AP will  |
| DELETE | `/aps/{apMac}/smartMonitor` | Use this API command to disable AP level override of smart monitor. The access p |
| PUT | `/aps/{apMac}/specific` | Use this API command to modify specific configuration. |
| DELETE | `/aps/{apMac}/specific` | Use this API command to disable specific configuration override from AP group or |
| GET | `/aps/{apMac}/supportLog` | Use this API command to download AP support log. |
| DELETE | `/aps/{apMac}/syslog` | Use this API command to disable the AP level syslog override. The access point w |
| DELETE | `/aps/{apMac}/venueProfile` | Use this API command to disable AP level override of venue profile. The access p |
| POST | `/aps/move` | Use this API command to move multiple APs to another Zone/AP Group |
| POST | `/aps/syncProvisionApsToCloudService` | Use this API command to sync provision APs to Cloud Service |
| GET | `/mesh/zeroTouch` | Use this API command to retrieve a list of unapproved AP. |
| PUT | `/mesh/zeroTouch` | Use this API command to approve/reject unapproved AP. Recommend to deploy 20 isl |
| POST | `/swapAps` | Use this API command to swap in specific AP |

### Access Point Operational (16 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/aps/{apMac}/apPacketCapture` | Use this API to get AP packet capture status |
| POST | `/aps/{apMac}/apPacketCapture/download` | Use this API to download AP packet capture file |
| POST | `/aps/{apMac}/apPacketCapture/startFileCapture` | Use this API to start AP packet capture |
| POST | `/aps/{apMac}/apPacketCapture/startStreaming` | Use this API to start AP packet streaming |
| POST | `/aps/{apMac}/apPacketCapture/stop` | Use this API to stop AP packet capture or streaming |
| POST | `/aps/{apMac}/operational/blinkLed` | use this API to make ap blink its led to show its position. |
| GET | `/aps/{apMac}/operational/neighbor` | Use this API command to retrieve a list of neighbor access points on mesh AP. |
| GET | `/aps/{apMac}/operational/summary` | This API provide detailed AP status and configuration, therefore it was designed |
| POST | `/aps/switchoverCluster` | Use this API command to switchover AP to another cluster |
| POST | `/query/ap` | Query APs with specified filters |
| POST | `/query/ap/wlan` | Use this API command to retrieve AP Wlan list with BSSID information by QueryCri |
| POST | `/query/indoorMap` | Query indoorMap with specified filters. |
| POST | `/query/mesh/{apMac}/neighbor` | Use this API command to retrieve a list of neighbor access points on mesh AP. |
| POST | `/query/mesh/{apMac}/topology` | Use this API command to retrieve a list of topology on mesh AP. |
| POST | `/query/mesh/topology` | Use this API command to retrieve a list of topology on zone. |
| POST | `/query/roguesInfoList` | Use this API command to retrieve a list of rogue access points. |

### Account Security (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/accountSecurity` | Use this API command to get account security profiles. |
| POST | `/accountSecurity` | Use this API command to create the account security proile. |
| DELETE | `/accountSecurity` | Use this API command to selete the account security profile. |
| GET | `/accountSecurity/{id}` | Use this API command to retrieve the specific account security profile. |
| PUT | `/accountSecurity/{id}` | Use this API command to modify the specific account security profile. |
| DELETE | `/accountSecurity/{id}` | Use this API command to delete the account security profile by id. |
| PATCH | `/accountSecurity/{id}` | Use this API command to modify the specific account security profile. |

### Accounting Service (13 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/services/aaaServer/acct` | Query Non-Proxy Accounting AAAServers with specified filters. |
| DELETE | `/services/acct` | Use this API command to delete a list of accounting service. |
| DELETE | `/services/acct/{id}` | Use this API command to delete an accounting service. |
| POST | `/services/acct/query` | Use this API command to retrieve a list of accounting services by query criteria |
| GET | `/services/acct/radius` | Use this API command to retrieve a list of RADIUS accounting services. |
| POST | `/services/acct/radius` | Use this API command to create a new RADIUS accounting service. |
| GET | `/services/acct/radius/{id}` | Use this API command to retrieve a RADIUS accounting service. |
| PUT | `/services/acct/radius/{id}` | Use this API command to modify entire RADIUS accounting service. |
| DELETE | `/services/acct/radius/{id}` | Use this API command to delete a RADIUS accounting service. |
| PATCH | `/services/acct/radius/{id}` | Use this API command to modify the configuration of a RADIUS accounting service. |
| DELETE | `/services/acct/radius/{id}/secondary` | Use this API command to disable secondary RADIUS server of a RADIUS accounting s |
| POST | `/services/acct/radius/query` | Use this API command to retrieve a list of Radius accounting services by query c |
| POST | `/services/acct/test/{id}` | Use this API command to test an accounting service. |

### Administration (13 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/adminaaa` | Use this API command to retrieve the list of Admin AAA server |
| POST | `/adminaaa` | Use this API command to create a new Admin AAA server |
| GET | `/adminaaa/{id}` | Use this API command to retrieve an existing Admin AAA server |
| PUT | `/adminaaa/{id}` | Use this API command to modify an existing Admin AAA server |
| DELETE | `/adminaaa/{id}` | Use this API command to delete an existing Admin AAA server |
| GET | `/licenses` | Use this API command to get all licenses currently assign in SCG. |
| PUT | `/licenses/sync` | Use this API command to ask all SCG in cluster to sync licenses from license ser |
| GET | `/licenseServer` | Use this API command to get license server configuration. |
| PUT | `/licenseServer` | Use this API command to update license server configuration. |
| GET | `/licensesSummary` | Use this API command to get licenses summary information. |
| GET | `/licensesSyncLogs` | Use this API command to get licenses synchronize logs. |
| POST | `/restart` | Use this API command to restart the controller. |
| POST | `/shutdown` | Use this API command to shut down the controller. |

### Allowed Device Profile (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/allowedDeviceProfiles` | Use this API command to create a Allowed Device Profile. |
| DELETE | `/allowedDeviceProfiles` | Use this API command to delete bulk Allowed Device Profile. |
| GET | `/allowedDeviceProfiles/{id}` | Use this API command to retrieve an Allowed Device Profile. |
| PUT | `/allowedDeviceProfiles/{id}` | Use this API command to modify an Allowed Device Profile. |
| DELETE | `/allowedDeviceProfiles/{id}` | Use this API command to delete a Allowed Device Profile. |
| POST | `/allowedDeviceProfiles/query` | Use this API command to retrieve a list of Allowed Device Profile by query crite |

### AP External Syslog Server Profile (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/apSyslogServerProfiles` | Use this API command to retrieve AP Syslog Server Profile list. |
| POST | `/apSyslogServerProfiles` | Create Ap Syslog Server Profile |
| DELETE | `/apSyslogServerProfiles` | Bulk delete Ap Syslog Server Profile |
| GET | `/apSyslogServerProfiles/{id}` | Get Ap Syslog Server Profile |
| PUT | `/apSyslogServerProfiles/{id}` | Update Ap Syslog Server Profile |
| DELETE | `/apSyslogServerProfiles/{id}` | Delete Ap Syslog Server Profile |

### AP Group (79 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/rkszones/{zoneId}/apgroups` | Use this API command to retrieve the list of AP groups that belong to a zone. |
| POST | `/rkszones/{zoneId}/apgroups` | Use this API command to create new AP group within a zone. |
| GET | `/rkszones/{zoneId}/apgroups/{id}` | Use this API command to retrieve information about an AP group. |
| PUT | `/rkszones/{zoneId}/apgroups/{id}` | Use this API command to modify the entire information of an AP group. |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}` | Use this API command to delete an AP group. |
| PATCH | `/rkszones/{zoneId}/apgroups/{id}` | Use this API command to modify the configuration of an AP group. |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/altitude` | Use this API command to clear the altitude of AP group. |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/apMgmtVlan` | Disable AP Management Vlan Override of an AP group. |
| GET | `/rkszones/{zoneId}/apgroups/{id}/apmodel/{model}` | Use this API command to retrieve AP model specific configuration override zone t |
| PUT | `/rkszones/{zoneId}/apgroups/{id}/apmodel/{model}` | Use this API command to modify AP model specific configuration override zone tha |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/apmodel/{model}` | Use this API command to disable AP model specific configuration override zone th |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/awsVenue` | Use this API command to disable AWS venue override. The AP will apply its group' |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/channelEvaluationInterval` | Disable Channel Evaluation Interval Override of an AP group. |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/clientAdmissionControl24` | Use this API command to disable client admission control 2.4GHz radio configurat |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/clientAdmissionControl50` | Use this API command to disable client admission control 5GHz radio configuratio |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/directedMulticastFromNetworkEnabled` | Use this API command to disable Directed Multicast from Network to wired/wireles |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/directedMulticastFromWiredClientEnabled` | Use this API command to disable Directed Multicast from wired client to Network  |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/directedMulticastFromWirelessClientEnabled` | Use this API command to disable Directed Multicast from wireless client to Netwo |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/location` | Use this API command to disable location override for APs that belong to an AP g |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/locationAdditionalInfo` | Use this API command to disable location additionalInfo override zone for APs th |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/locationBasedService` | Use this API command to disable location based service override zone for APs tha |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/lteBandLockChannels` | Use this API command to disable LTE band lock channel override zone for APs that |
| POST | `/rkszones/{zoneId}/apgroups/{id}/members` | Add multiple members to an AP group. |
| POST | `/rkszones/{zoneId}/apgroups/{id}/members/{apMac}` | Use this API command to add a member AP to an AP group. |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/members/{apMac}` | Use this API command to remove a member AP from an AP group. |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/protectionMode24` | Use this API command to disable 2.4GHz radio protection mode configuration overr |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio24g` | Use this API command to disable 2.4GHz radio configuration override zone for APs |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio24g/autoChannelSelection` | Disable Radio 2.4G Auto ChannelSelectMode and ChannelFly MTBC Override of an AP  |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio24g/channel` | Use this API command to disable 2.4GHz radio channel override zone for APs that  |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio24g/channelRange` | Use this API command to disable 2.4GHz radio channelRange override zone for APs  |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio24g/channelWidth` | Use this API command to disable 2.4GHz radio channelWidth override zone for APs  |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio24g/protectionMode` | Use this API command to disable 2.4GHz radio protection mode configuration overr |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio24g/txPower` | Use this API command to disable 2.4GHz radio txPower override zone for APs that  |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio24g/wlanGroupId` | Use this API command to disable WLAN group on 2.4GHz radio override zone for APs |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5g` | Use this API command to disable 5GHz radio configuration override zone for APs t |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5g/autoChannelSelection` | Disable Radio 5G Auto ChannelSelectMode and ChannelFly MTBC Override of an AP gr |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5g/channel` | Use this API command to disable 5GHz radio outdoorChannel override zone for APs  |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5g/channelIndoor` | Use this API command to disable 5GHz radio indoorChannel override zone for APs t |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5g/channelRange` | Use this API command to disable 5GHz radio outdoorChannelRange override zone for |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5g/channelRangeIndoor` | Use this API command to disable 5GHz radio indoorChannelRange override zone for  |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5g/channelWidth` | Use this API command to disable 5GHz radio channelWidth override zone for APs th |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5g/txPower` | Use this API command to disable 5GHz radio txPower override zone for APs that be |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5g/wlanGroupId` | Use this API command to disable WLAN group on 5GHz radio override zone for APs t |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5gLower` | Use this API command to disable lower 5GHz radio configuration override zone for |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5gLower/autoChannelSelection` | Disable Radio Lower 5G Auto ChannelSelectMode and ChannelFly MTBC Override of an |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5gLower/channel` | Use this API command to disable lower 5GHz radio outdoorChannel override zone fo |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5gLower/channelIndoor` | Use this API command to disable lower 5GHz radio indoorChannel override zone for |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5gLower/channelRange` | Use this API command to disable lower 5GHz radio outdoorChannelRange override zo |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5gLower/channelRangeIndoor` | Use this API command to disable lower 5GHz radio indoorChannelRange override zon |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5gLower/channelWidth` | Use this API command to disable lower 5GHz radio channelWidth override zone for  |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5gLower/txPower` | Use this API command to disable lower 5GHz radio txPower override zone for APs t |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5gLower/wlanGroupId` | Use this API command to disable WLAN group on lower 5GHz radio override zone for |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5gUpper` | Use this API command to disable upper 5GHz radio configuration override zone for |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5gUpper/autoChannelSelection` | Disable Radio Upper 5G Auto ChannelSelectMode and ChannelFly MTBC Override of an |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5gUpper/channel` | Use this API command to disable upper 5GHz radio outdoorChannel override zone fo |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5gUpper/channelIndoor` | Use this API command to disable upper 5GHz radio indoorChannel override zone for |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5gUpper/channelRange` | Use this API command to disable upper 5GHz radio outdoorChannelRange override zo |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5gUpper/channelRangeIndoor` | Use this API command to disable upper 5GHz radio indoorChannelRange override zon |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5gUpper/channelWidth` | Use this API command to disable upper 5GHz radio channelWidth override zone for  |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5gUpper/txPower` | Use this API command to disable upper 5GHz radio txPower override zone for APs t |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio5gUpper/wlanGroupId` | Use this API command to disable WLAN group on upper 5GHz radio override zone for |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio6g` | Use this API command to disable 6GHz radio configuration override zone for APs t |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio6g/autoChannelSelection` | Disable Radio 6G Auto ChannelSelectMode and ChannelFly MTBC Override of an AP gr |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio6g/bssMinRate` | Use this API command to disable 6G BSS minimum rate override for APs that belong |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio6g/channel` | Use this API command to disable 6GHz radio channel override zone for APs that be |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio6g/channelRange` | Use this API command to disable 6GHz radio channelRange override zone for APs th |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio6g/channelWidth` | Use this API command to disable 6GHz radio channelWidth override zone for APs th |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio6g/mgmtTxRate` | Use this API command to disable 6G management TX rate override for APs that belo |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio6g/multicastDownlinkRateLimit` | Use this API command to disable 6G multicast downlink rate limit override for AP |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio6g/multicastUplinkRateLimit` | Use this API command to disable 6G multicast uplink rate limit override for APs  |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio6g/txPower` | Use this API command to disable 6GHz radio txPower override zone for APs that be |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/radioConfig/radio6g/wlanGroupId` | Use this API command to disable WLAN group on 6GHz radio override zone for APs t |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/recoverySsid` | Use this API command to disable Recovery SSID configuration override zone for AP |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/rksGreForwardBroadcast` | Use this API command to disable Ruckus GRE Broadcast packet forwarding override  |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/rogueApAggressivenessMode` | Use this API command to disable rogue AP aggressiveness mode override zone for A |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/rogueApJammingThreshold` | Use this API command to disable rogue AP jamming threshold override zone for APs |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/rogueApReportThreshold` | Use this API command to disable rogue AP report threshold override zone for APs  |
| DELETE | `/rkszones/{zoneId}/apgroups/{id}/venueProfile` | Use this API command to clear Hotspot 2.0 venue profile for APs that belong to a |
| GET | `/rkszones/{zoneId}/apgroups/default` | Use this API command to retrieve information about default AP group of zone. |

### AP Registration Rules (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/apRules` | Use this API command to retrieve a list of AP Registration Rules profile. |
| POST | `/apRules` | Use this API command to create AP Registration Rules profile. |
| GET | `/apRules/{id}` | Use this API command to retrieve AP Registration Rules profile by ID. |
| DELETE | `/apRules/{id}` | Use this API command to delete AP Registration Rules profile. |
| PATCH | `/apRules/{id}` | Use this API command to modify the configuration of AP Registration Rules profil |
| GET | `/apRules/priorityDown/{id}` | Use this API command to move Priority Down of AP Registration Rules profile. |
| GET | `/apRules/priorityUp/{id}` | Use this API command to move Priority Up of AP Registration Rules profile. |

### AP SNMP Agent Profile (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/apSnmpAgentProfiles` | Use this API command to retrieve AP SNMP Agent Profile list. |
| POST | `/apSnmpAgentProfiles` | Use this API command to create a new AP SNMP Agent Profile. |
| DELETE | `/apSnmpAgentProfiles` | Use this API command to bulk delete AP SNMP Agent Profile. |
| GET | `/apSnmpAgentProfiles/{id}` | Use this API command to retrieve AP SNMP Agent Profile by profile's ID. |
| PUT | `/apSnmpAgentProfiles/{id}` | Use this API command to modify AP SNMP Agent Profile by profile's ID. |
| DELETE | `/apSnmpAgentProfiles/{id}` | Use this API command to delete AP SNMP Agent Profile by profile's ID. |

### Application Log And Status (4 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| PATCH | `/applications` | Use this API command to modify log level of specified application. |
| GET | `/applications/{bladeUUID}` | Use this API command to retrieve a list of application log and status. |
| GET | `/applications/download/{bladeUUID}` | Use this API command to download logs of the application. |
| GET | `/applications/downloadsnap/{bladeUUID}` | Use this API command to download snapshot logs. |

### Application Visibility Control (32 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/avc/applicationPolicy` | Use this API command to create a new AVC Application Policy profile (for 5.0 and |
| DELETE | `/avc/applicationPolicy` | Use this API command to delete a AVC Application Policy Profile (for 5.0 and Ear |
| GET | `/avc/applicationPolicy/{id}` | Use this API command to retrieve a AVC Application Policy profile (for 5.0 and E |
| DELETE | `/avc/applicationPolicy/{id}` | Use this API command to delete a AVC Application Policy Profile (for 5.0 and Ear |
| PATCH | `/avc/applicationPolicy/{id}` | Use this API command to modify the configuration on AVC Application Policy profi |
| POST | `/avc/applicationPolicyV2` | Use this API command to create a new AVC Application Policy profile. |
| DELETE | `/avc/applicationPolicyV2` | Use this API command to delete a AVC Application Policy Profile. |
| GET | `/avc/applicationPolicyV2/{id}` | Use this API command to retrieve a AVC Application Policy profile. |
| DELETE | `/avc/applicationPolicyV2/{id}` | Use this API command to delete a AVC Application Policy Profile. |
| PATCH | `/avc/applicationPolicyV2/{id}` | Use this API command to modify the configuration on AVC Application Policy profi |
| GET | `/avc/signaturePackage` | Get current Signature Package info (for 5.0 and Earlier Firmware Versions). |
| GET | `/avc/signaturePackage/application/{applicationName}` | Get Application info (catId, appId and name) by application name (for 5.0 and Ea |
| GET | `/avc/signaturePackage/applications` | Get Application list from current Signature Package (for 5.0 and Earlier Firmwar |
| GET | `/avc/signaturePackage/categories` | Get Application Category list from current Signature Package (for 5.0 and Earlie |
| GET | `/avc/signaturePackage/category/{categoryName}` | Get Application Category info (catId and name) by category name (for 5.0 and Ear |
| POST | `/avc/signaturePackage/upload` | Update AVC Signature Package by upload file (for 5.0 and Earlier Firmware Versio |
| GET | `/avc/signaturePackageV2` | Get current Signature Package info. |
| PATCH | `/avc/signaturePackageV2` | Use this API command to update Signature Package related settings |
| GET | `/avc/signaturePackageV2/applications` | Get Application list from current Signature Package. |
| GET | `/avc/signaturePackageV2/categories` | Get Application Category list from current Signature Package. |
| POST | `/avc/signaturePackageV2/checkLatest` | Check latest Signature Package from Ruckus support site and get latest Signature |
| POST | `/avc/signaturePackageV2/downloadAndInstallLastChecked` | Download Signature Package from Ruckus support site and install. |
| GET | `/avc/signaturePackageV2/downloadAndInstallLastChecked/progress` | Get the progress of download and install Signature Package. |
| POST | `/avc/signaturePackageV2/upload` | Update AVC Signature Package by upload file. |
| POST | `/avc/userDefined` | Use this API command to create a new AVC User Defined profile. |
| DELETE | `/avc/userDefined` | Use this API command to delete a AVC User Defined Profile. |
| GET | `/avc/userDefined/{id}` | Use this API command to retrieve a AVC User Defined profile. |
| DELETE | `/avc/userDefined/{id}` | Use this API command to delete a AVC User Defined Profile. |
| PATCH | `/avc/userDefined/{id}` | Use this API command to modify the configuration on AVC User Defined profile. |
| POST | `/query/applicationPolicy` | Use this API command to retrieve a list of AVC Application Policy profiles (for  |
| POST | `/query/applicationPolicyV2` | Use this API command to retrieve a list of AVC Application Policy profiles. |
| POST | `/query/userDefined` | Use this API command to retrieve a list of AVC User Defined profiles. |

### Authentication Profile (1 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/profiles/auth/authServiceList/query` | Use this API command to retrieve a list of authentication service. |

### Authentication Service (28 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/services/aaaServer/auth` | Query Non-Proxy Authentication AAAServers with specified filters. |
| DELETE | `/services/auth` | Use this API command to delete a list of authentication service. |
| DELETE | `/services/auth/{id}` | Use this API command to delete an authentication service. |
| GET | `/services/auth/ad` | Use this API command to retrieve a list of active directory authentication servi |
| POST | `/services/auth/ad` | Use this API command to create a new active directory authentication service. |
| GET | `/services/auth/ad/{id}` | Use this API command to retrieve an active directory authentication service. |
| DELETE | `/services/auth/ad/{id}` | Use this API command to delete an active directory authentication service. |
| PATCH | `/services/auth/ad/{id}` | Use this API command to modify the configuration of an active directory authenti |
| POST | `/services/auth/ad/query` | Use this API command to retrieve a list of AD Authentication services by query c |
| GET | `/services/auth/guest/{id}` | Use this API command to retrieve a Guest authentication service. |
| GET | `/services/auth/ldap` | Use this API command to retrieve a list of LDAP authentication services. |
| POST | `/services/auth/ldap` | Use this API command to create a new LDAP authentication service. |
| GET | `/services/auth/ldap/{id}` | Use this API command to retrieve a LDAP authentication service. |
| DELETE | `/services/auth/ldap/{id}` | Use this API command to delete a LDAP authentication service. |
| PATCH | `/services/auth/ldap/{id}` | Use this API command to modify the configuration of a LDAP authentication servic |
| POST | `/services/auth/ldap/query` | Use this API command to retrieve a list of LDAP Authentication services by query |
| GET | `/services/auth/local_db/{id}` | Use this API command to retrieve a LocalDB authentication service. |
| PATCH | `/services/auth/local_db/{id}` | Use this API command to update LocalDB authentication service. |
| POST | `/services/auth/query` | Use this API command to retrieve a list of Authentication services by query crit |
| GET | `/services/auth/radius` | Use this API command to retrieve a list of RADIUS authentication services. |
| POST | `/services/auth/radius` | Use this API command to create a new RADIUS authentication service. |
| GET | `/services/auth/radius/{id}` | Use this API command to retrieve a RADIUS authentication service. |
| PUT | `/services/auth/radius/{id}` | Use this API command to modify entire RADIUS authentication service. |
| DELETE | `/services/auth/radius/{id}` | Use this API command to delete a RADIUS authentication service. |
| PATCH | `/services/auth/radius/{id}` | Use this API command to modify the configuration of a RADIUS authentication serv |
| DELETE | `/services/auth/radius/{id}/secondary` | Use this API command to disable secondary RADIUS server of a RADIUS authenticati |
| POST | `/services/auth/radius/query` | Use this API command to retrieve a list of radius Authentication services by que |
| POST | `/services/auth/test/{id}` | Use this API command to test an authentication service. |

### Block Client (10 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/blockClient` | Create new Block Clients by list. |
| DELETE | `/blockClient` | Delete Block Client List. |
| GET | `/blockClient/{id}` | Retrieve a Block Client. |
| PUT | `/blockClient/{id}` | Modify a specific Block Client basic. |
| DELETE | `/blockClient/{id}` | Delete a Block Client. |
| PATCH | `/blockClient/{id}` | Modify a specific Block Client basic. |
| POST | `/blockClient/byApMac/{apMac}` | Create a new Block Client by AP MAC. |
| GET | `/blockClient/byZone/{zoneId}` | Retrieve a list of Block Client. |
| POST | `/blockClient/byZoneId/{zoneId}` | Create a new Block Client by Zone ID |
| POST | `/blockClient/query` | Retrieve a list of Block Client. |

### Bond Port Profile (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/rkszones/{zoneId}/profile/bondPort` | Retrieve a list of Bond Port Profiles within a zone. |
| POST | `/rkszones/{zoneId}/profile/bondPort` | Create a new Bond Port Profile. |
| GET | `/rkszones/{zoneId}/profile/bondPort/{id}` | Retrieve a Bond Port Profile. |
| PUT | `/rkszones/{zoneId}/profile/bondPort/{id}` | Modify a specific Bond Port Profile. |
| DELETE | `/rkszones/{zoneId}/profile/bondPort/{id}` | Delete Bond Port Profile. |
| DELETE | `/rkszones/bondPortProfiles` | Delete bulk Bond Port Profile. |
| POST | `/rkszones/bondPortProfiles/query` | Query Bond Port Profiles with specified filters. |

### Bonjour Fencing Policy (8 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/aps/{apMac}/bonjourFencingStatistic` | Use this API command to get Bonjour Fencing Statistic per AP. |
| POST | `/query/services/bonjourFencingPolicy` | Use this API command to retrieve a list of Bonjour Fencing Policy. |
| GET | `/rkszones/{zoneId}/bonjourFencingPolicy` | Use this API command to retrieve a list of Bonjour Fencing Policy. |
| POST | `/rkszones/{zoneId}/bonjourFencingPolicy` | Use this API command to create Bonjour Fencing Policy. |
| GET | `/rkszones/{zoneId}/bonjourFencingPolicy/{id}` | Use this API command to retrieve Bonjour Fencing Policy. |
| PATCH | `/rkszones/{zoneId}/bonjourFencingPolicy/{id}` | Use this API command to modify the configuration of Bonjour Fencing Policy. |
| DELETE | `/rkszones/bonjourFencingPolicy` | Use this API command to delete Bulk Bonjour Fencing Policy. |
| DELETE | `/rkszones/bonjourFencingPolicy/{id}` | Use this API command to delete Bonjour Fencing Policy. |

### Bonjour Gateway Policies (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/services/bonjourPolicy` | Query bonjourPolicy Profiles with specified filters. |
| POST | `/rkszones/{zoneId}/bonjourGateway/enable` | Use this API command to enable/disable bonjour gateway policy. |
| GET | `/rkszones/{zoneId}/bonjourGateway/policies` | Use this API command to retrieve a list of bonjour gateway policies. |
| POST | `/rkszones/{zoneId}/bonjourGateway/policies` | Use this API command to create bonjour gateway policy. |
| GET | `/rkszones/{zoneId}/bonjourGateway/policies/{id}` | Use this API command to retrieve bonjour gateway policy. |
| DELETE | `/rkszones/{zoneId}/bonjourGateway/policies/{id}` | Use this API command to delete bonjour gateway policy. |
| PATCH | `/rkszones/{zoneId}/bonjourGateway/policies/{id}` | Use this API command to modify the configuration of bonjour gateway policy. |

### Bridge (3 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/profiles/bridge` | Use this API command to retrieve a list of Bridge profile. Unavailable when the  |
| GET | `/profiles/bridge/{id}` | Use this API command to retrieve Bridge profile by ID. Unavailable when the syst |
| POST | `/profiles/bridge/query` | Use this API command to query a list of Bridge profile. Unavailable when the sys |

### Certificate (22 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/certstore/certificate` | Use this API command to retrieve list of installed certificates. |
| POST | `/certstore/certificate` | Use this API command to create an installed certificate. |
| GET | `/certstore/certificate/{id}` | Use this API command to retrieve an installed certificate. |
| DELETE | `/certstore/certificate/{id}` | Use this API command to delete an installed certificate. |
| GET | `/certstore/clientCert` | Use this API command to retrieve list of client certificates. |
| POST | `/certstore/clientCert` | Use this API command to create a client certificate. |
| GET | `/certstore/clientCert/{id}` | Use this API command to retrieve a client certificate. |
| DELETE | `/certstore/clientCert/{id}` | Use this API command to delete a client certificate. |
| GET | `/certstore/csr` | Use this API command to retrieve list of certificates signing request. |
| POST | `/certstore/csr` | Use this API command to create a certificates signing request. |
| GET | `/certstore/csr/{id}` | Use this API command to retrieve a certificates signing request. |
| DELETE | `/certstore/csr/{id}` | Use this API command to delete a certificates signing request. |
| GET | `/certstore/defaultCACerts` | Use this API command to retrieve the default CA certificates. |
| GET | `/certstore/setting` | Use this API command to retrieve certificate setting. |
| PATCH | `/certstore/setting` | Use this API command to Modify the Certificate Setting. |
| PATCH | `/certstore/setting/serviceCertificates` | Use this API command to Modify serviceCertificates of the Certificate Setting. |
| GET | `/certstore/trustedCAChainCert` | Use this API command to retrieve list of installed trusted CA chain certificates |
| POST | `/certstore/trustedCAChainCert` | Use this API command to create trusted CA chain certificates. |
| DELETE | `/certstore/trustedCAChainCert` | Use this API command to delete bulk trusted CA chain certificates. |
| GET | `/certstore/trustedCAChainCert/{id}` | Use this API command to retrieve an installed trusted CA chain certificates. |
| DELETE | `/certstore/trustedCAChainCert/{id}` | Use this API command to delete a trusted CA chain certificate. |
| PATCH | `/certstore/trustedCAChainCert/{id}` | Use this API command to patch a trusted CA chain certificates. |

### Client Isolation Whitelist (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/services/clientIsolationWhitelist` | Retrieve a list of Client Isolation Whitelist. |
| GET | `/rkszones/{zoneId}/clientIsolationWhitelist` | Retrieve a list of Client Isolation Whitelist. |
| POST | `/rkszones/{zoneId}/clientIsolationWhitelist` | Create a new ClientIsolationWhitelist. |
| GET | `/rkszones/{zoneId}/clientIsolationWhitelist/{id}` | Retrieve an Client Isolation Whitelist. |
| PATCH | `/rkszones/{zoneId}/clientIsolationWhitelist/{id}` | Modify a specific Client Isolation Whitelist basic. |
| DELETE | `/rkszones/clientIsolationWhitelist` | Use this API command to delete Bulk Client Isolation Whitelist. |
| DELETE | `/rkszones/clientIsolationWhitelist/{id}` | Delete a Client Isolation Whitelist. |

### Cluster Management (26 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/apPatch` | Use this API command to retrive uploaded AP patch file info. |
| POST | `/apPatch` | Use this API command to apply AP patch. |
| POST | `/apPatch/file` | Use this API command to upload AP Patch File. |
| GET | `/apPatch/history` | Use this API command to retrive AP patch history. |
| GET | `/apPatch/status` | Use this API command to retrive cluster progress status. |
| GET | `/cluster` | Retrive cluster backup list. |
| DELETE | `/cluster/{id:.+}` | Delete cluster backup by ID. |
| POST | `/cluster/backup` | Backup cluster. |
| GET | `/cluster/geoRedundancy` | Get cluster redundancy settings. |
| POST | `/cluster/restore/{id:.+}` | Restore cluster backup by ID. |
| GET | `/cluster/state` | Use this API command to get current cluster, blade, and management service state |
| GET | `/configuration` | Retrive system configuration list. |
| DELETE | `/configuration/{id}` | Delete system configuration file. |
| POST | `/configuration/backup` | Backup system configuration. |
| GET | `/configuration/download` | Download system configuration file. |
| POST | `/configuration/restore/{id}` | Restore system configuration with specified backupUUID. |
| POST | `/configuration/upload` | Upload system configuration file. |
| GET | `/configurationSettings/autoExportBackup` | Get Auto Export Backup Settings. |
| PATCH | `/configurationSettings/autoExportBackup` | Modify Auto Export Backup Settings. |
| GET | `/configurationSettings/scheduleBackup` | Get Schedule Backup Setting. |
| PATCH | `/configurationSettings/scheduleBackup` | Modify Schedule Backup Setting. |
| POST | `/upgrade` | Use this API command to do system upgrade. |
| GET | `/upgrade/history` | Use this API command to retrive upgrade history. |
| GET | `/upgrade/patch` | Use this API command to retrive upload file Info. |
| GET | `/upgrade/status` | Use this API command to retrive cluster progress status. |
| POST | `/upgrade/upload` | Use this API command to upload patch file. |

### Connectivity Tools (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/tool/ping` | Use this API command to run the PING test on an AP. |
| POST | `/tool/speedflex` | Use this API command to start the SpeedFlex test. |
| GET | `/tool/speedflex/{wcid}` | Use this API command to retrieve existing SpeedFlex test results. |
| POST | `/tool/speedTestC` | Use this API command to start AP SpeedTestC test. |
| GET | `/tool/speedTestC/{apMac}` | Use this API command to retrieve existing SpeedTestC test results. |
| GET | `/tool/traceRoute` | Use this API command to run the traceroute test on an AP. |

### Control Planes (10 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/controlPlanes/{bladeUUID}/staticRoutes` | Use this API command to retrieve static route of control plane. |
| DELETE | `/controlPlanes/{bladeUUID}/staticRoutes` | Use this API command to delete the static route of control plane. |
| PATCH | `/controlPlanes/{bladeUUID}/staticRoutes` | Use this API command to modify the static route of control plane. |
| GET | `/controlPlanes/{bladeUUID}/userDefinedInterface` | Use this API command to retrieve user defined interface of control plane. |
| DELETE | `/controlPlanes/{bladeUUID}/userDefinedInterface` | Use this API command to delete the user defined interface of control plane. |
| PATCH | `/controlPlanes/{bladeUUID}/userDefinedInterface` | Use this API command to modify user defined interface of control plane. |
| GET | `/controlPlanes/interfaces` | Use this API command to retrieve Control Plane Interface list. |
| GET | `/enterprise/controlPlanes` | Use this API command to retrieve the list of control plane. |
| GET | `/enterprise/controlPlanes/{bladeUUID}` | Use this API command to retrieve control plane. |
| PATCH | `/enterprise/controlPlanes/{bladeUUID}` | Use this API command to modify the configuration of control plane. |

### Data Plane Operational (1 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/dps/switchoverCluster` | Use this API command to switchover DP to another cluster. Unavailable when the s |

### Device Policy (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/services/devicePolicy` | Query Device Policy Profiles with specified filters. |
| GET | `/rkszones/{zoneId}/devicePolicy` | Retrieve a list of Device Policy Profiles within a zone (for Firmware Versions l |
| POST | `/rkszones/{zoneId}/devicePolicy` | Create a new Device Policy Profile (for Firmware Versions less than 5.2). |
| GET | `/rkszones/{zoneId}/devicePolicy/{id}` | Retrieve a Device Policy Profile (for Firmware Versions less than 5.2). |
| DELETE | `/rkszones/{zoneId}/devicePolicy/{id}` | Delete Device Policy Profile (for Firmware Versions less than 5.2). |
| PATCH | `/rkszones/{zoneId}/devicePolicy/{id}` | Modify a specific Device Policy Profile (for Firmware Versions less than 5.2). |

### Device Policy in Domain Level (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/devicePolicy` | Use this API command to retrieve list of Device Policy profiles. |
| POST | `/devicePolicy` | Use this API command to create a Device Policy profile. |
| DELETE | `/devicePolicy` | Use this API command to delete a list of Device Policy profile. |
| GET | `/devicePolicy/{id}` | Use this API command to retrieve a Device Policy profile. |
| PUT | `/devicePolicy/{id}` | Use this API command to update a Device Policy profile. |
| DELETE | `/devicePolicy/{id}` | Use this API command to delete a Device Policy profile. |
| POST | `/devicePolicy/query` | Query Device Policy Profile with specified filters. |

### DHCP (13 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/dhcpData/dhcpMsgStats/{apMac}` | Use this API command to get AP DHCP Message Statistic. |
| GET | `/dhcpData/dhcpPools/{apMac}` | Use this API command to get AP DHCP Pools Usage. |
| GET | `/dhcpData/dhcpPools/{apMac}/{poolIndex}` | Use this API command to get AP DHCP Pool Usage by pool's index. |
| POST | `/query/services/dhcpProfile` | Query DHCP Profiles with specified filters. |
| GET | `/rkszones/{zoneId}/dhcpSite/dhcpProfile` | Use this API command to get DHCP Pool list. |
| POST | `/rkszones/{zoneId}/dhcpSite/dhcpProfile` | Use this API command to create DHCP Pool. |
| DELETE | `/rkszones/{zoneId}/dhcpSite/dhcpProfile` | Use this API command to delete multiple DHCP Pools. |
| GET | `/rkszones/{zoneId}/dhcpSite/dhcpProfile/{id}` | Use this API command to get DHCP Pool by pool's ID. |
| DELETE | `/rkszones/{zoneId}/dhcpSite/dhcpProfile/{id}` | Use this API command to delete DHCP Pool by pool's ID. |
| PATCH | `/rkszones/{zoneId}/dhcpSite/dhcpProfile/{id}` | Use this API command to modify DHCP Pool by pool's ID. |
| GET | `/rkszones/{zoneId}/dhcpSite/dhcpSiteConfig` | Use this API command to get DHCP Configuration. |
| POST | `/rkszones/{zoneId}/dhcpSite/dhcpSiteConfig/doAssignIp` | Use this API command to get the DHCP/NAT service IP assignment when selecting wi |
| POST | `/rkszones/services/dhcpSiteConfig/query` | Use this API command to modify DHCP/NAT service configuration of Domain. |

### DiffServ (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/services/dscpProfile` | Query DSCP Profiles with specified filters. |
| GET | `/rkszones/{zoneId}/diffserv` | Use this API command to retrieve a list of DiffServ profile. |
| POST | `/rkszones/{zoneId}/diffserv` | Use this API command to create DiffServ profile. |
| GET | `/rkszones/{zoneId}/diffserv/{id}` | Use this API command to retrieve DiffServ profile. |
| DELETE | `/rkszones/{zoneId}/diffserv/{id}` | Use this API command to delete DiffServ profile. |
| PATCH | `/rkszones/{zoneId}/diffserv/{id}` | Use this API command to modify the configuration of DiffServ profile. |

### DNS Server Management (8 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/profiles/dnsserver` | Use this API command to retrieve a list of DNS server profile. |
| POST | `/profiles/dnsserver` | Use this API command to create DNS server profile. |
| DELETE | `/profiles/dnsserver` | Use this API command to delete a list of DNS server profile. |
| GET | `/profiles/dnsserver/{id}` | Use this API command to retrieve DNS server profile. |
| DELETE | `/profiles/dnsserver/{id}` | Use this API command to delete DNS server profile. |
| PATCH | `/profiles/dnsserver/{id}` | Use this API command to modify the configuration of DNS server profile. |
| POST | `/profiles/dnsserver/clone/{id}` | Use this API command to clone an DNS server profile. |
| POST | `/profiles/dnsserver/query` | Use this API command to retrieve a list of DNS server profile  by query criteria |

### DNS Spoofing Profile (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/rkszones/{zoneId}/dnsSpoofingProfiles` | Use this API command to retrieve a list of DNS Spoofing profile. |
| POST | `/rkszones/{zoneId}/dnsSpoofingProfiles` | Use this API command to create DNS Spoofing profile. |
| GET | `/rkszones/{zoneId}/dnsSpoofingProfiles/{id}` | Use this API command to retrieve DNS Spoofing profile. |
| PUT | `/rkszones/{zoneId}/dnsSpoofingProfiles/{id}` | Use this API command to update DNS Spoofing profile. |
| DELETE | `/rkszones/{zoneId}/dnsSpoofingProfiles/{id}` | Use this API command to delete DNS Spoofing profile. |
| DELETE | `/rkszones/dnsSpoofingProfiles` | Use this API command to delete bulk DNS Spoofing profile. |

### Domain (4 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/domains` | Use this API command to retrieve a list of domain under Administration Domain. |
| GET | `/domains/{id}` | Use this API command to retrieve domain by specified Domain ID. |
| PATCH | `/domains/{id}` | Use this API command to modify the configuration of domain. |
| GET | `/domains/byName/{domainName}` | Use this API command to retrieve a list of domain by specified Domain name. |

### DP DHCP & NAT Profile (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/dpProfileSettings` | Use this API command to retrieve DP DHCP & NAT profile setting list. Unavailable |
| POST | `/dpProfileSettings` | Use this API command to create DP DHCP & NAT profile setting. Unavailable when t |
| DELETE | `/dpProfileSettings` | Use this API command to delete DP DHCP & NAT profile settings. Unavailable when  |
| GET | `/dpProfileSettings/{dpKey}` | Use this API command to retrieve DP DHCP & NAT profile setting. Unavailable when |
| PUT | `/dpProfileSettings/{dpKey}` | Use this API command to modify DP DHCP & NAT profile setting. Unavailable when t |
| DELETE | `/dpProfileSettings/{dpKey}` | Use this API command to delete DP DHCP & NAT profile setting. Unavailable when t |

### DP DHCP Profile (24 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/dpDhcpProfiles` | Use this API command to retrieve DP profile - basic list. Unavailable when the s |
| POST | `/dpDhcpProfiles` | Use this API command to create basic DP DHCP profile - basic. Unavailable when t |
| DELETE | `/dpDhcpProfiles` | Use this API command to delete DP DHCP profiles. Unavailable when the system is  |
| GET | `/dpDhcpProfiles/{id}` | Use this API command to retrieve DP profile - basic. Unavailable when the system |
| PUT | `/dpDhcpProfiles/{id}` | Use this API command to modify DP DHCP profile - basic. Unavailable when the sys |
| DELETE | `/dpDhcpProfiles/{id}` | Use this API command to delete DP DHCP profile. Unavailable when the system is i |
| GET | `/dpDhcpProfiles/{id}/dpDhcpProfileHosts` | Use this API command to retrieve DP DHCP profile - host list. Unavailable when t |
| POST | `/dpDhcpProfiles/{id}/dpDhcpProfileHosts` | Use this API command to create DP DHCP profile - host. Unavailable when the syst |
| DELETE | `/dpDhcpProfiles/{id}/dpDhcpProfileHosts` | Use this API command to delete DP DHCP profile - hosts. Unavailable when the sys |
| GET | `/dpDhcpProfiles/{id}/dpDhcpProfileHosts/{hostId}` | Use this API command to retrieve DP DHCP profile - host. Unavailable when the sy |
| PUT | `/dpDhcpProfiles/{id}/dpDhcpProfileHosts/{hostId}` | Use this API command to modify DP DHCP profile - host. Unavailable when the syst |
| DELETE | `/dpDhcpProfiles/{id}/dpDhcpProfileHosts/{hostId}` | Use this API command to delete DP DHCP profile - host. Unavailable when the syst |
| GET | `/dpDhcpProfiles/{id}/dpDhcpProfileOptionSpaces` | Use this API command to retrieve DP DHCP profile - option43 space list. Unavaila |
| POST | `/dpDhcpProfiles/{id}/dpDhcpProfileOptionSpaces` | Use this API command to create DP DHCP profile - option43 space. Unavailable whe |
| DELETE | `/dpDhcpProfiles/{id}/dpDhcpProfileOptionSpaces` | Use this API command to delete DP DHCP profile - option43 spaces. Unavailable wh |
| GET | `/dpDhcpProfiles/{id}/dpDhcpProfileOptionSpaces/{spaceId}` | Use this API command to retrieve DP DHCP profile - option43 space. Unavailable w |
| PUT | `/dpDhcpProfiles/{id}/dpDhcpProfileOptionSpaces/{spaceId}` | Use this API command to update DP DHCP profile - option43 space. Unavailable whe |
| DELETE | `/dpDhcpProfiles/{id}/dpDhcpProfileOptionSpaces/{spaceId}` | Use this API command to delete DP DHCP profile - option43 space. Unavailable whe |
| GET | `/dpDhcpProfiles/{id}/dpDhcpProfilePools` | Use this API command to retrieve DP DHCP profile - pool list. Unavailable when t |
| POST | `/dpDhcpProfiles/{id}/dpDhcpProfilePools` | Use this API command to create DP DHCP profile - pool. Unavailable when the syst |
| DELETE | `/dpDhcpProfiles/{id}/dpDhcpProfilePools` | Use this API command to delete DP DHCP profile - pools. Unavailable when the sys |
| GET | `/dpDhcpProfiles/{id}/dpDhcpProfilePools/{poolId}` | Use this API command to retrieve DP DHCP profile - pool. Unavailable when the sy |
| PUT | `/dpDhcpProfiles/{id}/dpDhcpProfilePools/{poolId}` | Use this API command to modify DP DHCP profile - pool. Unavailable when the syst |
| DELETE | `/dpDhcpProfiles/{id}/dpDhcpProfilePools/{poolId}` | Use this API command to delete DP DHCP profile - pool. Unavailable when the syst |

### DP Group (5 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/profiles/dpGroup` | Use this API command to get all DP Groups. Unavailable when the system is in IPv |
| POST | `/profiles/dpGroup` | Use this API command to create DP Group. Unavailable when the system is in IPv6  |
| GET | `/profiles/dpGroup/{id}` | Use this API command to get one DP Group. Unavailable when the system is in IPv6 |
| DELETE | `/profiles/dpGroup/{id}` | Use this API command to delete DP Group. Unavailable when the system is in IPv6  |
| PATCH | `/profiles/dpGroup/{id}` | Use this API command to modify DP Group. Unavailable when the system is in IPv6  |

### DP NAT Profile (12 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/dpNatProfiles` | Use this API command to retrieve DHCP NAT profile - basic list. Unavailable when |
| POST | `/dpNatProfiles` | Use this API command to create DHCP NAT profile - basic. Unavailable when the sy |
| DELETE | `/dpNatProfiles` | Use this API command to delete DHCP NAT profiles. Unavailable when the system is |
| GET | `/dpNatProfiles/{id}` | Use this API command to retrieve DHCP NAT profile - basic. Unavailable when the  |
| PUT | `/dpNatProfiles/{id}` | Use this API command to modify DHCP NAT profile - basic. Unavailable when the sy |
| DELETE | `/dpNatProfiles/{id}` | Use this API command to delete DHCP NAT profile. Unavailable when the system is  |
| GET | `/dpNatProfiles/{id}/dpNatPools` | Use this API command to retrieve DP NAT profile - pool list. Unavailable when th |
| POST | `/dpNatProfiles/{id}/dpNatPools` | Use this API command to create DHCP NAT profile - pool. Unavailable when the sys |
| DELETE | `/dpNatProfiles/{id}/dpNatPools` | Use this API command to delete DP NAT profile - pools. Unavailable when the syst |
| GET | `/dpNatProfiles/{id}/dpNatPools/{poolId}` | Use this API command to retrieve DP DHCP profile - pool. Unavailable when the sy |
| PUT | `/dpNatProfiles/{id}/dpNatPools/{poolId}` | Use this API command to modify DHCP NAT profile - pool. Unavailable when the sys |
| DELETE | `/dpNatProfiles/{id}/dpNatPools/{poolId}` | Use this API command to delete DP NAT profile - pool. Unavailable when the syste |

### DP Network (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/planes` | Use this API command to retrieve a list of data planes. Unavailable when the sys |
| GET | `/planes/{bladeUUID}` | Use this API command to retrieve data plane by id. Unavailable when the system i |
| PATCH | `/planes/{bladeUUID}` | Use this API command to modify the configuration of data plane. Unavailable when |
| DELETE | `/planes/{bladeUUID}/staticRoute` | Use this API command to delete static route. Unavailable when the system is in I |
| GET | `/planes/dpTunnel/setting` | Use this API command to get DP mesh tunnel setting. Unavailable when the system  |
| PUT | `/planes/dpTunnel/setting` | Use this API command to update DP mesh tunnel setting. Unavailable when the syst |

### Dynamic PSK (12 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/dpsk` | Query DPSKs with specified filters. |
| GET | `/rkszones/{zoneId}/deleteExpiredDpsk` | Use this API command to retrieve interval of delete expired DPSK of a zone. |
| PUT | `/rkszones/{zoneId}/deleteExpiredDpsk` | Use this API command to modify interval of delete expired DPSK of a zone. |
| GET | `/rkszones/{zoneId}/dpsk` | Use this API command to retrieve DPSK info of a zone. |
| GET | `/rkszones/{zoneId}/dpskEnabledWlans` | Use this API command to retrieve DPSK enabled WLAN info of a zone. |
| GET | `/rkszones/{zoneId}/wlans/{id}/dpsk` | Use this API command to retrieve DPSK info of a WLAN. |
| POST | `/rkszones/{zoneId}/wlans/{id}/dpsk` | Use this API command to delete DPSKs of a WLAN. |
| GET | `/rkszones/{zoneId}/wlans/{id}/dpsk/{dpskId}` | Use this API command to retrieve DPSK info. |
| PATCH | `/rkszones/{zoneId}/wlans/{id}/dpsk/{dpskId}` | Use this API command to update DPSK info. |
| POST | `/rkszones/{zoneId}/wlans/{id}/dpsk/batchGenUnbound` | Use this API command to batch generate DPSKs of a WLAN. You can either specify p |
| POST | `/rkszones/{zoneId}/wlans/{id}/dpsk/upload` | Use this API command to upload DPSK file of a WLAN (CSV file and Content-Type mu |
| GET | `/rkszones/downloadDpskCsvSample` | Use this API command to download DPSK CSV sample. |

### Ethernet Port Profile (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/services/ethernetPortProfile` | Query Ethernet Port Profiles with specified filters. |
| GET | `/rkszones/{zoneId}/profile/ethernetPort` | Retrieve a list of Ethernet Port Porfiles within a zone. |
| POST | `/rkszones/{zoneId}/profile/ethernetPort` | Create a new Ethernet Port Porfile. |
| GET | `/rkszones/{zoneId}/profile/ethernetPort/{id}` | Retrieve a Ethernet Port Porfile. |
| PUT | `/rkszones/{zoneId}/profile/ethernetPort/{id}` | Modify a specific Ethernet Port Porfile. |
| DELETE | `/rkszones/{zoneId}/profile/ethernetPort/{id}` | Delete Ethernet Port Porfile. |
| PATCH | `/rkszones/{zoneId}/profile/ethernetPort/{id}` | Modify a specific Ethernet Port Porfile. |

### Event and Alarm (8 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| PUT | `/alert/alarm/{alarmID}/ack` | Acknowledge a single Alarm with provided alarmID. |
| PUT | `/alert/alarm/{alarmID}/clear` | Clear a single Alarm with provided alarmID. |
| PUT | `/alert/alarm/ack` | Acknowledge multiple Alarms with provided alarmIDs. |
| PUT | `/alert/alarm/clear` | Clear multiple Alarms with provided alarmIDs. |
| POST | `/alert/alarm/list` | Query Alarms with specified filters. |
| POST | `/alert/alarmSummary` | Use this API command to retrieve the alarm summary with specified filters. |
| POST | `/alert/event/list` | Query Events with specified filters. |
| POST | `/alert/eventSummary` | Use this API command to retrieve the event summary with specified filters. |

### Event Management Setting (4 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/rkszones/{zoneId}/eventEmailSettings` | Get Event E-mail Setting of Zone Override. |
| PUT | `/rkszones/{zoneId}/eventEmailSettings` | Modify Event E-mail Setting of Zone Override. |
| GET | `/rkszones/{zoneId}/eventNotificationSettings` | Get Event Notification Setting of Zone Override. |
| PUT | `/rkszones/{zoneId}/eventNotificationSettings` | Modify Event Notification Setting of Zone Override. |

### Firewall Profile (9 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/firewallProfiles` | Retrieve Firewall Profile list. |
| POST | `/firewallProfiles` | Create a Firewall Profile. |
| DELETE | `/firewallProfiles` | Use this API command to delete Bulk Firewall Profiles. |
| GET | `/firewallProfiles/{id}` | Retrieve a Firewall Profile. |
| PUT | `/firewallProfiles/{id}` | Modify a Firewall Profile. |
| DELETE | `/firewallProfiles/{id}` | Delete a Firewall Profile. |
| GET | `/firewallProfiles/{id}/ethernetPortProfiles` | Retrieve a EthernetPort Profile list of Firewall Profile is used by |
| GET | `/firewallProfiles/{id}/wlans` | Retrieve a WLAN list of Firewall Profile is used by |
| POST | `/firewallProfiles/query` | Retrieve a list of Firewall Profile. |

### Flexi-VPN (2 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/services/flexiVpnProfile` | Use this API command to query Flexi-VPN profiles. Unavailable when the system is |
| DELETE | `/rkszones/{zoneId}/wlans/{id}/flexiVpnProfile` | Use this API command to delete Flexi-VPN on WLAN. Unavailable when the system is |

### FtpServerSettings (8 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/ftps` | Add FTP server. |
| DELETE | `/ftps` | Remove FTP servers. |
| GET | `/ftps/{ftpId}` | Retrieve information of specific FTP server. |
| DELETE | `/ftps/{ftpId}` | Remove FTP server. |
| PATCH | `/ftps/{ftpId}` | Update FTP server settings. |
| POST | `/ftps/query` | Retrieve information of all FTP server. |
| GET | `/ftps/test` | Test ftp server of specific FTP server settings. |
| GET | `/ftps/test/{ftpId}` | Test ftp server of specific FTP server id. |

### GDPR (1 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/gdpr/report` | Use this API command to execute a client-related data search or delete task and  |

### Geofence Profile (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/rkszones/{zoneId}/geofenceProfiles` | Query Geofence Profile with specified filters. |
| POST | `/rkszones/{zoneId}/geofenceProfiles` | Use this API command to create a Geofence Profile. |
| DELETE | `/rkszones/{zoneId}/geofenceProfiles` | Use this API command to delete a list of Geofence Profile. |
| GET | `/rkszones/{zoneId}/geofenceProfiles/{id}` | Use this API command to retrieve a Geofence Profile. |
| PUT | `/rkszones/{zoneId}/geofenceProfiles/{id}` | Use this API command to update a Geofence Profile. |
| DELETE | `/rkszones/{zoneId}/geofenceProfiles/{id}` | Use this API command to delete a Geofence Profile. |

### Global reference (2 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/globalSettings/friendlyNameLang` | Use this API command to get friendly name of usable language for profile: Hotspo |
| GET | `/globalSettings/portalLang` | Use this API command to get friendly name of usable language for profile: Guest  |

### Guest Access (8 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/services/guestAccess` | Query Guest Access Profiles with specified filters. |
| GET | `/rkszones/{zoneId}/portals/guest` | Use this API command to retrieve a list of guest access of a zone. |
| POST | `/rkszones/{zoneId}/portals/guest` | Use this API command to create new guest access of a zone. |
| GET | `/rkszones/{zoneId}/portals/guest/{id}` | Use this API command to retrieve guest access of a zone. |
| DELETE | `/rkszones/{zoneId}/portals/guest/{id}` | Use this API command to delete guest access of a zone. |
| PATCH | `/rkszones/{zoneId}/portals/guest/{id}` | Use this API command to modify the configuration on guest access of a zone. |
| DELETE | `/rkszones/{zoneId}/portals/guest/{id}/redirect` | Use this API command to set redirect to the URL that user intends to visit on gu |
| DELETE | `/rkszones/{zoneId}/portals/guest/{id}/smsGateway` | Use this API command to disable SMS gateway on guest access of a zone. |

### Hotspot 2.0 Identity Provider Profile (9 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/profiles/hs20/identityproviders` | Use this API command to retrieve list of Hotspot 2.0 identity providers. |
| POST | `/profiles/hs20/identityproviders` | Use this API command to create a new Hotspot 2.0 identity provider. |
| DELETE | `/profiles/hs20/identityproviders` | Use this API command to delete multiple Hotspot 2.0 identity provider. |
| GET | `/profiles/hs20/identityproviders/{id}` | Use this API command to retrieve a Hotspot 2.0 identity provider. |
| DELETE | `/profiles/hs20/identityproviders/{id}` | Use this API command to delete a Hotspot 2.0 identity provider. |
| PATCH | `/profiles/hs20/identityproviders/{id}` | Use this API command to modify the configuration of a Hotspot 2.0 identity provi |
| DELETE | `/profiles/hs20/identityproviders/{id}/accountings` | Use this API command to disable accountings of a Hotspot 2.0 identity provider. |
| DELETE | `/profiles/hs20/identityproviders/{id}/osu` | Use this API command to disable online signup & provisioning of a Hotspot 2.0 id |
| POST | `/profiles/hs20/identityproviders/query` | Query hotspot 2.0 identity providers. |

### Hotspot 2.0 Wi-Fi Operator Profile (9 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/profiles/hs20/operators` | Use this API command to retrieve list of Hotspot 2.0 Wi-Fi Operators. |
| POST | `/profiles/hs20/operators` | Use this API command to create a new Hotspot 2.0 Wi-Fi operator. |
| DELETE | `/profiles/hs20/operators` | Use this API command to delete multiple Hotspot 2.0 Wi-Fi operators. |
| GET | `/profiles/hs20/operators/{id}` | Use this API command to retrieve a Hotspot 2.0 Wi-Fi operator. |
| PUT | `/profiles/hs20/operators/{id}` | Use this API command to modify entire configuration of a Hotspot 2.0 Wi-Fi opera |
| DELETE | `/profiles/hs20/operators/{id}` | Use this API command to delete a Hotspot 2.0 Wi-Fi operator. |
| PATCH | `/profiles/hs20/operators/{id}` | Use this API command to modify the configuration of a Hotspot 2.0 Wi-Fi operator |
| DELETE | `/profiles/hs20/operators/{id}/certificate` | Use this API command to disable certificate of a Hotspot 2.0 Wi-Fi operator. |
| POST | `/profiles/hs20/operators/query` | Query hotspot 2.0 Wi-Fi operators. |

### Hotspot Service (11 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/services/hotspot` | Query Hotspot Profiles with specified filters. |
| GET | `/rkszones/{zoneId}/portals/hotspot` | Use this API command to retrieve a list of Hotspot (WISPr) of a zone. |
| GET | `/rkszones/{zoneId}/portals/hotspot/{id}` | Use this API command to retrieve a Hotspot (WISPr) of zone. |
| DELETE | `/rkszones/{zoneId}/portals/hotspot/{id}` | Use this API command to delete a Hotspot (WISPr) of a zone. |
| PATCH | `/rkszones/{zoneId}/portals/hotspot/{id}` | Use this API command to modify the configuration on Hotspot (WISPr) of a zone.Ma |
| POST | `/rkszones/{zoneId}/portals/hotspot/external` | Use this API command to create a new Hotspot (WISPr) with external logon URL of  |
| PUT | `/rkszones/{zoneId}/portals/hotspot/external/{id}` | Use this API command to update Hotspot (WISPr) with external logon URL of a zone |
| POST | `/rkszones/{zoneId}/portals/hotspot/internal` | Use this API command to create a new Hotspot (WISPr) with internal logon URL of  |
| PUT | `/rkszones/{zoneId}/portals/hotspot/internal/{id}` | Use this API command to update Hotspot (WISPr) with internal logon URL of a zone |
| POST | `/rkszones/{zoneId}/portals/hotspot/smartClientOnly` | Use this API command to create a new Hotspot (WISPr) with smart client only of a |
| PUT | `/rkszones/{zoneId}/portals/hotspot/smartClientOnly/{id}` | Use this API command to update Hotspot (WISPr) with smart client only of a zone. |

### Hotspot20 Venue Service (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/services/venueProfile` | Query Venue Profiles with specified filters. |
| GET | `/rkszones/{zoneId}/hs20/venues` | Use this API command to retrieve a list of Hotspot 2.0 venue profile of a zone. |
| POST | `/rkszones/{zoneId}/hs20/venues` | Use this API command to create a new Hotspot 2.0 venue profile of a zone. |
| GET | `/rkszones/{zoneId}/hs20/venues/{id}` | Use this API command to retrieve a Hotspot 2.0 venue profile of a zone. |
| DELETE | `/rkszones/{zoneId}/hs20/venues/{id}` | Use this API command to delete Hotspot 2.0 venue profile of a zone. |
| PATCH | `/rkszones/{zoneId}/hs20/venues/{id}` | Use this API command to modify the configuration on Hotspot 2.0 venue profile of |

### Hotspot20 WLAN Service (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/services/hotspot20Profile` | Query Hotspot20 Profiles with specified filters. |
| GET | `/rkszones/{zoneId}/hs20s` | Use this API command to retrieve a list of Hotspot 2.0 WLAN profiles of a zone. |
| POST | `/rkszones/{zoneId}/hs20s` | Use this API command to create a new Hotspot 2.0 WLAN profile of a zone. |
| GET | `/rkszones/{zoneId}/hs20s/{id}` | Use this API command to retrieve a Hotspot 2.0 WLAN profile of a zone. |
| DELETE | `/rkszones/{zoneId}/hs20s/{id}` | Use this API command to delete a Hotspot 2.0 WLAN Profile of a zone. |
| PATCH | `/rkszones/{zoneId}/hs20s/{id}` | Use this API command to modify the configuration on Hotspot 2.0 WLAN profile of  |

### Identity Guest Pass (8 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/identity/guestpass` | Use this API command to retrieve a list of identity guest pass. |
| DELETE | `/identity/guestpass` | Use this API command to delete multiple identity guest passes. |
| DELETE | `/identity/guestpass/{userId}` | Use this API command to delete identity guest pass. |
| PATCH | `/identity/guestpass/{userId}` | Use this API command to modify the configuration of identity guest. |
| POST | `/identity/guestpass/generate` | Use this API command to generate identity guest pass. |
| POST | `/identity/guestpass/upload` | Use this API command to upload identity guest pass csv file. |
| POST | `/identity/guestpass/upload/common` | Use this API command to update common identity guest pass settings. |
| POST | `/identity/guestpassList` | Use this API command to retrieve a list of identity guest pass. |

### Identity Subscription Package (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/identity/packageList` | Use this API command to retrieve a list of subscription package. |
| GET | `/identity/packages` | Use this API command to retrieve a list of subscription package. |
| POST | `/identity/packages` | Use this API command to create subscription package. |
| DELETE | `/identity/packages` | Use this API command to delete multiple subscription packages. |
| GET | `/identity/packages/{id}` | Use this API command to retrieve subscription package. |
| DELETE | `/identity/packages/{id}` | Use this API command to delete subscription package. |
| PATCH | `/identity/packages/{id}` | Use this API command to modify the configuration of subscription package. |

### Identity User (10 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/identity/userList` | Use this API command to retrieve a list of identity user. |
| GET | `/identity/users` | Use this API command to retrieve a list of identity user. |
| POST | `/identity/users` | Use this API command to create identity user. |
| DELETE | `/identity/users` | Use this API command to delete multiple identity users. |
| GET | `/identity/users/{id}` | Use this API command to retrieve identity user. |
| DELETE | `/identity/users/{id}` | Use this API command to delete identity user. |
| PATCH | `/identity/users/{id}` | Use this API command to modify the configuration of identity user. |
| GET | `/identity/users/aaaserver` | Use this API command to retrieve a list of aaa server. |
| GET | `/identity/users/countries` | Use this API command to retrieve a list of countries. |
| GET | `/identity/users/packages` | Use this API command to retrieve a list of packages. |

### Identity User Role (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/identity/userrole` | Use this API command to retrieve a list of identity user role. |
| POST | `/identity/userrole` | Use this API command to create identity user role. |
| DELETE | `/identity/userrole` | Use this API command to delete multiple identity user roles. |
| GET | `/identity/userrole/{id}` | Use this API command to retrieve identity user role by ID. |
| DELETE | `/identity/userrole/{id}` | Use this API command to delete identity user role. |
| PATCH | `/identity/userrole/{id}` | Use this API command to modify the configuration of identity user role. |
| POST | `/identity/userRoleList` | Use this API command to retrieve a list of identity user role. |

### IndoorMap (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/maps` | Use this API command to get indoor map list. |
| POST | `/maps` | Use this API command to create indoorMap. |
| GET | `/maps/{indoorMapId}` | Use this API command to get indoor maps. |
| DELETE | `/maps/{indoorMapId}` | Use this API command to delete indoor map. |
| PATCH | `/maps/{indoorMapId}` | Use this API command to update specific indoor map. |
| PUT | `/maps/{indoorMapId}/aps` | Use this API command to put Aps in indoor map. |
| POST | `/maps/query` | Use this API command to query indoorMap. |

### IPSEC Profile (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/profiles/tunnel/ipsec` | Retrieve a list of IPSEC. |
| POST | `/profiles/tunnel/ipsec` | Create a new ipsec. |
| DELETE | `/profiles/tunnel/ipsec` | Delete multiple ipsec. |
| GET | `/profiles/tunnel/ipsec/{id}` | Retrieve a IPSEC. |
| DELETE | `/profiles/tunnel/ipsec/{id}` | Delete a ipsec. |
| PATCH | `/profiles/tunnel/ipsec/{id}` | Modify a specific ipsec basic. |
| POST | `/profiles/tunnel/ipsec/query` | Query a list of IPSEC. |

### L2 Access Control (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/services/l2AccessControl` | Query L2 AccessControl Profiles with specified filters. |
| GET | `/rkszones/{zoneId}/l2ACL` | Retrieve a list of L2 Access Control (for Firmware Versions less than 5.2). |
| POST | `/rkszones/{zoneId}/l2ACL` | Create a new L2 Access Control (for Firmware Versions less than 5.2). |
| GET | `/rkszones/{zoneId}/l2ACL/{id}` | Retrieve an L2 Access Control (for Firmware Versions less than 5.2). |
| DELETE | `/rkszones/{zoneId}/l2ACL/{id}` | Delete an L2 Access Control (for Firmware Versions less than 5.2). |
| PATCH | `/rkszones/{zoneId}/l2ACL/{id}` | Modify a specific L2 Access Control basic (for Firmware Versions less than 5.2). |

### L2 Access Control in Domain Level (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/l2AccessControls` | Use this API command to retrieve a list of L2 Access Control. |
| POST | `/l2AccessControls` | Use this API command to create a new L2 Access Control. |
| DELETE | `/l2AccessControls` | Use this API command to delete a list of L2 Access Control. |
| GET | `/l2AccessControls/{id}` | Use this API command to retrieve an L2 Access Control. |
| PUT | `/l2AccessControls/{id}` | Use this API command to modify a specific L2 Access Control. |
| DELETE | `/l2AccessControls/{id}` | Use this API command to delete an L2 Access Control. |
| POST | `/l2AccessControls/query` | Query L2 Access Control with specified filters. |

### L3 Access Control Policy (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/l3AccessControlPolicies` | Retrieve L3 Access Control Policy list. |
| POST | `/l3AccessControlPolicies` | Create a L3 Access Control Policy. |
| DELETE | `/l3AccessControlPolicies` | Use this API command to delete Bulk L3 Access Control Policies. |
| GET | `/l3AccessControlPolicies/{id}` | Retrieve a L3 Access Control Policy. |
| PUT | `/l3AccessControlPolicies/{id}` | Modify a L3 Access Control Policy. |
| DELETE | `/l3AccessControlPolicies/{id}` | Delete a L3 Access Control Policy. |
| POST | `/l3AccessControlPolicies/query` | Retrieve a list of L3 Access Control Policy. |

### L3 Roaming (2 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/profiles/tunnel/l3Roaming` | Use this API command to retrieve L3 Roaming basic configuration. Unavailable whe |
| PATCH | `/profiles/tunnel/l3Roaming` | Use this API command to modify L3 Roaming basic configuration. Unavailable when  |

### LBS profile (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/profiles/lbs` | Create LBS profile. |
| DELETE | `/profiles/lbs` | Delete multiple LBS profile. |
| GET | `/profiles/lbs/{id}` | Retrieve LBS profile. |
| DELETE | `/profiles/lbs/{id}` | Delete LBS profile. |
| PATCH | `/profiles/lbs/{id}` | Update LBS profile. |
| POST | `/profiles/lbs/query` | Query LBS profiles. |

### LWAPP TO SCG (3 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/lwapp2scg` | Use this API command to retrieve Lwapp Config. |
| PATCH | `/lwapp2scg` | Use this API command to modify the basic information of the Lwapp Config. |
| PATCH | `/lwapp2scg/apList` | Use this API command to modify the apList of the Lwapp Config. |

### Mark Rogue (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/rogue/markIgnore` | Mark a rogue AP as ignore. |
| GET | `/rogue/markKnown` | Get Known Rogue AP list. |
| POST | `/rogue/markKnown` | Mark a rogue AP as know. |
| POST | `/rogue/markMalicious` | Mark a rogue AP as malicious. |
| POST | `/rogue/markRogue` | Mark a rogue AP as rogue. |
| POST | `/rogue/unMark` | Use this API command to remove the manual admin classification marking. |

### Multicast Forwarding (2 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/planes/multicastForwarding/setting` | Use this API command to get Multicast Forwarding global setting. Unavailable whe |
| PATCH | `/planes/multicastForwarding/setting` | Use this API command to set Multicast Forwarding global setting. Unavailable whe |

### Network Segmentation Profile (11 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/networkSegmentation` | Use this API command to create a new network segmentation profile. Unavailable w |
| GET | `/networkSegmentation/{id}` | Use this API command to retrieve network segmentation profile by id. Unavailable |
| PUT | `/networkSegmentation/{id}` | Use this API command to modify network segmentation profile by id. Unavailable w |
| DELETE | `/networkSegmentation/{id}` | Use this API command to delete network segmentation profile by id. Unavailable w |
| GET | `/networkSegmentation/ethernetPortProfile` | Use this API command to retrieve network segmentation ethernet port profile list |
| POST | `/networkSegmentation/ethernetPortProfile` | Use this API command to create network segmentation ethernet port profile. Unava |
| DELETE | `/networkSegmentation/ethernetPortProfile` | Use this API command to bulk delete network segmentation ethernet port profile l |
| GET | `/networkSegmentation/ethernetPortProfile/{id}` | Use this API command to retrieve network segmentation ethernet port profile. Una |
| PUT | `/networkSegmentation/ethernetPortProfile/{id}` | Use this API command to update network segmentation ethernet port profile. Unava |
| DELETE | `/networkSegmentation/ethernetPortProfile/{id}` | Use this API command to delete network segmentation ethernet port profile list.  |
| POST | `/networkSegmentation/query` | Use this API command to query network segmentation profile. Unavailable when the |

### Northbound Data Streaming (8 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/northboundDataStreamingEventCodes` | Use this API command to retrieve NorthboundDataStreamingEventCodes. |
| PUT | `/northboundDataStreamingEventCodes` | Use this API command to modify NorthboundDataStreamingEventCodes. |
| POST | `/northboundDataStreamingProfile` | Use this API command to create northbound Data Streaming Profile |
| GET | `/northboundDataStreamingProfile/{id}` | Use this API command to retrieve northbound Data Streaming Profile |
| PUT | `/northboundDataStreamingProfile/{id}` | Use this API command to update northbound Data Streaming Profile |
| DELETE | `/northboundDataStreamingProfile/{id}` | Use this API command to delete northbound Data Streaming Profile |
| GET | `/northboundDataStreamingProfileList` | Use this API command to retrieve northbound Data Streaming Profile List |
| PUT | `/northboundDataStreamingSettings` | Use this API command to modify Northbound Data Streaming Settings. |

### Portal Detection and Suppression Profile (8 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/rkszones/{zoneId}/portalDetectionProfiles` | Use this API command to get portal detection and suppression profile list. |
| POST | `/rkszones/{zoneId}/portalDetectionProfiles` | Use this API command to create portal detection and suppression profile. |
| DELETE | `/rkszones/{zoneId}/portalDetectionProfiles` | Use this API command to delete multiple portal detection and suppression profile |
| GET | `/rkszones/{zoneId}/portalDetectionProfiles/{id}` | Use this API command to get portal detection and suppression profile by profile' |
| PUT | `/rkszones/{zoneId}/portalDetectionProfiles/{id}` | Use this API command to modify portal detection and suppression profile by profi |
| DELETE | `/rkszones/{zoneId}/portalDetectionProfiles/{id}` | Use this API command to delete portal detection and suppression profile by profi |
| PATCH | `/rkszones/{zoneId}/portalDetectionProfiles/{id}` | Use this API command to modify portal detection and suppression profile by profi |
| POST | `/rkszones/portalDetectionProfiles/query` | Query portal detection and suppression profile with specified filters. |

### Precedence Profile (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/precedence` | Use this API command to Get Precedence Profile list. |
| POST | `/precedence` | Use this API command to create Precedence Profile. |
| DELETE | `/precedence` | Use this API command to Bulk Delete Precedence Profile. |
| GET | `/precedence/{id}` | Use this API command to Get Precedence Profile by profile's ID. |
| DELETE | `/precedence/{id}` | Use this API command to Delete Precedence Profile by profile's ID. |
| PATCH | `/precedence/{id}` | Use this API command to Modify Precedence Profile by profile's ID. |
| POST | `/precedence/query` | Use this API command to query Precedence Profile. |

### Query With Filter (1 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/radiusProxy/stats` | Use this API command to retrieve a list of Radius Proxy. |

### Real Time Location Service Profile (5 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/rkszones/{zoneId}/realTimeLocationService` | Use this API command to Get RTLS Profile by zone ID. |
| POST | `/rkszones/{zoneId}/realTimeLocationService` | Use this API command to create RTLS Profile. |
| GET | `/rkszones/{zoneId}/realTimeLocationService/{id}` | Use this API command to Get RTLS Profile by profile's ID. |
| PUT | `/rkszones/{zoneId}/realTimeLocationService/{id}` | Use this API command to Modify RTLS Profile by profile's ID. |
| DELETE | `/rkszones/{zoneId}/realTimeLocationService/{id}` | Use this API command to Delete RTLS Profile by profile's ID. |

### Restricted AP Access Profile (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/rkszones/{zoneId}/restrictedApAccessProfiles` | Retrieve Restricted AP Access Profile list. |
| POST | `/rkszones/{zoneId}/restrictedApAccessProfiles` | Create a Restricted AP Access Profile. |
| GET | `/rkszones/{zoneId}/restrictedApAccessProfiles/{id}` | Retrieve a Restricted AP Access Profile. |
| PUT | `/rkszones/{zoneId}/restrictedApAccessProfiles/{id}` | Modify a Restricted AP Access Profile. |
| DELETE | `/rkszones/{zoneId}/restrictedApAccessProfiles/{id}` | Delete a Restricted AP Access Profile. |
| DELETE | `/rkszones/restrictedApAccessProfiles` | Use this API command to delete Bulk Restricted AP Access Profile. |
| POST | `/rkszones/restrictedApAccessProfiles/query` | Retrieve a list of Restricted AP Access Profile. |

### Rogue Classification Policy (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/rkszones/{zoneId}/rogueApPolicies` | Use this API command to retrieve a list of rogue AP policy. |
| POST | `/rkszones/{zoneId}/rogueApPolicies` | Use this API command to create rogue AP policy. |
| DELETE | `/rkszones/{zoneId}/rogueApPolicies` | Use this API command to delete bulk rogue AP policy. |
| GET | `/rkszones/{zoneId}/rogueApPolicies/{id}` | Use this API command to retrieve rogue AP policy. |
| DELETE | `/rkszones/{zoneId}/rogueApPolicies/{id}` | Use this API command to delete rogue AP policy. |
| PATCH | `/rkszones/{zoneId}/rogueApPolicies/{id}` | Use this API command to modify rogue AP policy. |

### Rogue Client (1 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/rogueclients/query` | Use this API command to retrieve a list of rogue clients. |

### Ruckus Wireless AP Zone (39 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/rkszones` | Use this API command to retrieve the list of Ruckus Wireless AP zones that belon |
| POST | `/rkszones` | Use this API command to create a new Ruckus Wireless AP zone. |
| GET | `/rkszones/{id}` | Use this API command to retrieve Ruckus Wireless AP zones configuration. |
| PUT | `/rkszones/{id}` | Use this API command to modify entire information of a zone.  |
| DELETE | `/rkszones/{id}` | Use this API command to delete a zone. |
| PATCH | `/rkszones/{id}` | Use this API command to modify the configuration of a zone. |
| DELETE | `/rkszones/{id}/altitude` | Use this API command to disable altitude configuration of zone. |
| DELETE | `/rkszones/{id}/clientAdmissionControl24` | Use this API command to disable client admission control 2.4GHz radio configurat |
| DELETE | `/rkszones/{id}/clientAdmissionControl50` | Use this API command to disable client admission control 5GHz radio configuratio |
| DELETE | `/rkszones/{id}/ipsecProfiles` | Use this API command to Delete IPsec profiles. |
| DELETE | `/rkszones/{id}/loadBalancing` | Use this API command to disable overall load balancing configuration for APs tha |
| DELETE | `/rkszones/{id}/loadBalancing/bandBalancing` | Use this API command to disable band balancing for APs that belong to a zone. |
| DELETE | `/rkszones/{id}/loadBalancing/clientLoadBalancing24` | Use this API command to disable client load balancing 2.4GHz radio configuration |
| DELETE | `/rkszones/{id}/loadBalancing/clientLoadBalancing50` | Use this API command to disable client load balancing 5GHz radio configuration f |
| DELETE | `/rkszones/{id}/locationBasedService` | Use this API command to disable location based service for APs that belong to a  |
| GET | `/rkszones/{id}/mesh` | Use this API command to retrieve the mesh configuration of a zone. |
| DELETE | `/rkszones/{id}/mesh` | Use this API command to disable mesh networking. |
| DELETE | `/rkszones/{id}/radioConfig/radio24g/backgroundScanning` | Use this API command to disable background scanning 2.4GHz radio configuration f |
| DELETE | `/rkszones/{id}/radioConfig/radio5g/backgroundScanning` | Use this API command to disable background scanning 5GHz radio configuration for |
| DELETE | `/rkszones/{id}/radioConfig/radio5gLower/backgroundScanning` | Use this API command to disable background scanning lower 5GHz radio configurati |
| DELETE | `/rkszones/{id}/radioConfig/radio5gUpper/backgroundScanning` | Use this API command to disable background scanning upper 5GHz radio configurati |
| DELETE | `/rkszones/{id}/radioConfig/radio6g/backgroundScanning` | Use this API command to disable background scanning 6GHz radio configuration for |
| DELETE | `/rkszones/{id}/recoverySsid` | Use this API command to clear recovery ssid setting of a zone. |
| DELETE | `/rkszones/{id}/rogue` | Use this API command to disable rogue AP detection for APs that belong to a zone |
| DELETE | `/rkszones/{id}/smartMonitor` | Use this API command to disable smart monitor for APs that belong to a zone. |
| DELETE | `/rkszones/{id}/snmpAgent` | Use this API command to clear SNMPv2 and SNMPv3 agent that belong to a zone. |
| DELETE | `/rkszones/{id}/softGreTunnelProflies` | Use this API command to Delete IPsec profiles. |
| DELETE | `/rkszones/{id}/syslog` | Use this API command to disable syslog configuration for APs that belong to a zo |
| DELETE | `/rkszones/{id}/timezone` | Use this API command to reset the time zone with system time zone of a zone.  |
| DELETE | `/rkszones/{id}/venueProfile` | Use this API command to clear Hotspot 2.0 venue profile for APs that belong to a |
| GET | `/rkszones/{zoneId}/apFirmware` | Use this API command to retrieve AP Firmware the list that belong to a zone. |
| PUT | `/rkszones/{zoneId}/apFirmware` | Use this API command to change the AP Firmware that belong to a zone. |
| GET | `/rkszones/{zoneId}/apmodel/{model}` | Use this API command to retrieve AP model specific configuration that belong to  |
| PUT | `/rkszones/{zoneId}/apmodel/{model}` | Use this API command to modify the AP model specific configuration that belong t |
| GET | `/rkszones/{zoneId}/apmodel/{model}/commonAttribute` | Use this API command to retrieve AP model common attribute that belong to a zone |
| GET | `/rkszones/{zoneId}/availableIpsecProfiles` | Get available IPSec tunnel profiles of this Zone. |
| GET | `/rkszones/{zoneId}/availableTunnelProfiles` | Get available GRE tunnel profiles of this Zone. |
| POST | `/rkszones/dual` | Use this API command to create a new Ruckus Wireless AP zone of IPv4/IPv6. |
| POST | `/rkszones/ipv6` | Use this API command to create a new Ruckus Wireless AP zone of IPv6. |

### RuckusGRE Tunnel Profile (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/profiles/tunnel/ruckusgre` | Use this API command to retrieve a list of RuckusGRE tunnel profile. Unavailable |
| POST | `/profiles/tunnel/ruckusgre` | Use this API command to create RuckusGRE tunnel profile. Unavailable when the sy |
| DELETE | `/profiles/tunnel/ruckusgre` | Use this API command to delete multiple RuckusGRE tunnel profile. Unavailable wh |
| GET | `/profiles/tunnel/ruckusgre/{id}` | Use this API command to retrieve RuckusGRE tunnel profile. Unavailable when the  |
| DELETE | `/profiles/tunnel/ruckusgre/{id}` | Use this API command to delete RuckusGRE tunnel profile. Unavailable when the sy |
| PATCH | `/profiles/tunnel/ruckusgre/{id}` | Use this API command to modify the configuration of RuckusGRE tunnel profile. Un |
| POST | `/profiles/tunnel/ruckusgre/query` | Use this API command to query a list of RuckusGRE tunnel profile. Unavailable wh |

### SCG User (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/users` | Add SCG user. |
| DELETE | `/users` | Delete multiple SCG user. |
| GET | `/users/{userId}` | Get SCG user. |
| DELETE | `/users/{userId}` | Delete SCG user. |
| PATCH | `/users/{userId}` | Update SCG user. |
| POST | `/users/query` | Query SCG users. |

### SCG User Group (9 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/userGroups` | Add SCG user group. |
| DELETE | `/userGroups` | Delete multiple SCG user group. |
| GET | `/userGroups/{userGroupId}` | Get SCG user group. |
| DELETE | `/userGroups/{userGroupId}` | Delete SCG user group. |
| PATCH | `/userGroups/{userGroupId}` | Update user groups. |
| GET | `/userGroups/currentUser/permissionCategories` | Get permitted categories of current user. |
| POST | `/userGroups/query` | Query user groups. |
| GET | `/userGroups/roles` | Get pre-defined roles. |
| GET | `/userGroups/roles/{role}/permissions` | Get permission items of role. |

### SCI (9 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| PATCH | `/sci/sciEnabled` | Use this API command to modify SCI settings is enabled or not. |
| GET | `/sci/sciEventCode` | Use this API command to retrieve SciAcceptedEventCodes. |
| POST | `/sci/sciEventCode` | Use this API command to modify SciAcceptedEventCodes. |
| GET | `/sci/sciProfile` | Use this API command to retrieve sciProfile list. |
| POST | `/sci/sciProfile` | Use this API command to create sciProfile. |
| DELETE | `/sci/sciProfile` | Use this API command to delete sciProfile list. |
| GET | `/sci/sciProfile/{id}` | Use this API command to retrieve sciProfile. |
| DELETE | `/sci/sciProfile/{id}` | Use this API command to delete sciProfile. |
| PATCH | `/sci/sciProfile/{id}` | Use this API command to modify sciProfile. |

### Service Ticket (2 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/serviceTicket` | Use this API command to log on to the controller and acquire a valid service tic |
| DELETE | `/serviceTicket` | Use this API command to log off of the controller. |

### Session Management (1 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/sessionManagement` | Use this API command to retrieve information about the current logon sessions. |

### Signature Based Profile (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/signatureBasedProfiles` | Use this API to get list of signature-based profiles with id and name |
| POST | `/signatureBasedProfiles` | Use this API to create a signature based profile |
| DELETE | `/signatureBasedProfiles` | Use this API to delete a signature based profile list |
| GET | `/signatureBasedProfiles/{id}` | Use this API to get config of a signature based profile |
| PUT | `/signatureBasedProfiles/{id}` | Use this API to modify entire config of a signature based profile |
| DELETE | `/signatureBasedProfiles/{id}` | Use this API to delete a signature based profile |

### SMS Gateway (3 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/smsGateway` | Get SMS gateway. |
| PATCH | `/smsGateway` | Update SMS gateway. |
| POST | `/smsGateway/query` | Query SMS gateway. |

### SNMP Agent (2 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/system/snmpAgent` | Retrieve SNMP Agent sertting. |
| PUT | `/system/snmpAgent` | Modify syslog server setting. |

### Social Media Login Profile (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/rkszones/{zoneId}/socialMediaLoginProfiles` | Use this API command to retrieve a list of Social Media Login profile. |
| POST | `/rkszones/{zoneId}/socialMediaLoginProfiles` | Use this API command to create a new Social Media Login profile. |
| GET | `/rkszones/{zoneId}/socialMediaLoginProfiles/{id}` | Use this API command to retrieve the specific Social Media Login profile. |
| PUT | `/rkszones/{zoneId}/socialMediaLoginProfiles/{id}` | Use this API command to update the specific Social Media Login profile. |
| DELETE | `/rkszones/{zoneId}/socialMediaLoginProfiles/{id}` | Use this API command to delete the specific Social Media Login profile. |
| DELETE | `/rkszones/socialMediaLoginProfiles` | Use this API command to delete bulk Social Media Login profiles. |

### SoftGRE Tunnel Profile (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/profiles/tunnel/softgre` | Use this API command to retrieve a list of SoftGRE tunnel profile. |
| POST | `/profiles/tunnel/softgre` | Use this API command to create SoftGRE tunnel profile. |
| DELETE | `/profiles/tunnel/softgre` | Use this API command to delete multiple SoftGRE tunnel profile. |
| GET | `/profiles/tunnel/softgre/{id}` | Use this API command to retrieve SoftGRE tunnel profile. |
| DELETE | `/profiles/tunnel/softgre/{id}` | Use this API command to delete SoftGRE tunnel profile. |
| PATCH | `/profiles/tunnel/softgre/{id}` | Use this API command to modify the configuration of SoftGRE tunnel profile. |
| POST | `/profiles/tunnel/softgre/query` | Use this API command to query a list of SoftGRE tunnel profile. |

### Split Tunnel Profile (8 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/rkszones/{zoneId}/splitTunnelProfiles` | Get a ID list of split tunnel profile in this Zone. Unavailable when the system  |
| POST | `/rkszones/{zoneId}/splitTunnelProfiles` | Create a split tunnel profile. Unavailable when the system is in IPv6 mode. |
| GET | `/rkszones/{zoneId}/splitTunnelProfiles/{id}` | Get a split tunnel profile by ID. Unavailable when the system is in IPv6 mode. |
| PUT | `/rkszones/{zoneId}/splitTunnelProfiles/{id}` | Use this API command to modify entire information of a split tunnel profile. Una |
| DELETE | `/rkszones/{zoneId}/splitTunnelProfiles/{id}` | Use this API command to delete a split tunnel profile by ID. Unavailable when th |
| PATCH | `/rkszones/{zoneId}/splitTunnelProfiles/{id}` | Use this API command to modify a split tunnel profile. Unavailable when the syst |
| DELETE | `/rkszones/splitTunnelProfiles` | Use this API command to delete bulk split tunnel profiles. Unavailable when the  |
| POST | `/rkszones/splitTunnelProfiles/query` | Use this API command to retrieve a list of split tunnel profile by query criteri |

### Switch Event Management Setting (4 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/domains/{domainId}/eventEmailSettings` | Get Switch Event E-mail Setting of Domain Override. |
| PUT | `/domains/{domainId}/eventEmailSettings` | Modify Switch Event E-mail Setting of Domain Override. |
| GET | `/domains/{domainId}/eventNotificationSettings` | Get Switch Event Notification Setting of Domain Override. |
| PUT | `/domains/{domainId}/eventNotificationSettings` | Modify Switch Event Notification Setting of Domain Override. |

### Syslog Server (5 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/system/syslog` | Retrieve syslog server sertting. |
| PATCH | `/system/syslog` | Modify syslog server setting. |
| PATCH | `/system/syslog/primaryServer` | Modify Primary Server of syslog. |
| PATCH | `/system/syslog/priority` | Modify Priority of syslog. |
| PATCH | `/system/syslog/secondaryServer` | Modify Secondary Server of syslog. |

### System (27 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/controller` | Use this API command to retrieve the system summary. |
| GET | `/controller/{id}/statistics` | Use this API command to retrieve the system statistics. |
| POST | `/globalSettings/systemTime/validate` | Use this API command to validate a NTP server. |
| GET | `/system` | Use this API command to get settings of system. Currently, Only can get settings |
| PATCH | `/system` | Use this API command to modify settings of system. Currently, Only can modify se |
| POST | `/system/ap_balance` | Execute ap balance. |
| GET | `/system/apMacOUIs` | Use this API command to retrieve a list of AP Mac OUIs. |
| POST | `/system/apMacOUIs` | Use this API command to create AP Mac OUI. |
| PUT | `/system/apMacOUIs/{OUI}` | Use this API command to update AP Mac OUI. |
| DELETE | `/system/apMacOUIs/{OUI}` | Use this API command to delete AP Mac OUI. |
| GET | `/system/apmodels` | Use this API command to retrieve support AP models for the current installed SZ  |
| GET | `/system/apmodels/{firmwareVersion:.+}` | Use this API command to retrieve support AP models from input firmware version. |
| GET | `/system/apSettings/approval` | Retrieve AP Auto Approve Policy. |
| PATCH | `/system/apSettings/approval` | Modify AP Auto Approve Policy. |
| GET | `/system/cloudOptions` | Use this API command to retrieve SZ Cloud Options settings. |
| PUT | `/system/cloudOptions` | Use this API command to modify SZ Cloud Options settings. |
| GET | `/system/commonAccessCardSettings` | Use this API command to retrieve common access card settings. |
| PUT | `/system/commonAccessCardSettings` | Use this API command to retrieve common access card settings. |
| GET | `/system/devicesSummary` | Use this API command to retrieve devices summary. |
| GET | `/system/inventory` | Use this API command to retrieve the system inventory with current logon user do |
| GET | `/system/nbi` | Use this API command to retrieve user information by Northbound Portal Interface |
| DELETE | `/system/nbi` | Use this API command to disable the user information by Northbound Portal Interf |
| PATCH | `/system/nbi` | Use this API command to modify the user information by Northbound Portal Interfa |
| GET | `/system/securitySetting` | Use this API command to retrieve the security setting. |
| PUT | `/system/securitySetting` | Use this API command to retrieve the security setting. |
| GET | `/system/systemTime` | Retrieve System Time Setting. |
| PATCH | `/system/systemTime` | Modify System Time Setting. |

### SystemIPsec (2 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/systemIpsec` | Use this API command to retrieve the System IPSec. |
| PUT | `/systemIpsec` | Use this API command to modify the System IPSec. |

### Test AAA Server (1 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/system/aaa/test` | Use this API command to test AAA server. |

### Traffic Class Profile (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/services/trafficClassProfile` | Retrieve a list of Traffic Class Profile. |
| GET | `/rkszones/{zoneId}/trafficClassProfile` | Use this API command to retrieve a list of Traffic Class Profile of a zone. |
| POST | `/rkszones/{zoneId}/trafficClassProfile` | Use this API command to create a new Traffic Class Profile of a zone. |
| DELETE | `/rkszones/{zoneId}/trafficClassProfile` | Use this API command to bulk delete Traffic Class Profiles of a zone. |
| GET | `/rkszones/{zoneId}/trafficClassProfile/{id}` | Use this API command to retrieve a Traffic Class Profile of zone. |
| DELETE | `/rkszones/{zoneId}/trafficClassProfile/{id}` | Use this API command to delete a Traffic Class Profile of a zone. |
| PATCH | `/rkszones/{zoneId}/trafficClassProfile/{id}` | Use this API command to modify Traffic Class Profile of a zone. |

### URL Filtering Policy (9 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/urlFiltering/blockCategories` | Use this API command to retrieve the block categories of URL Filtering. |
| POST | `/urlFiltering/query` | Use this API command to retrieve a list of URL Filtering policies by query crite |
| GET | `/urlFiltering/urlFilteringPolicy` | Use this API command to retrieve list of URL Filtering policies. |
| POST | `/urlFiltering/urlFilteringPolicy` | Use this API command to create a URL Filtering policy. |
| DELETE | `/urlFiltering/urlFilteringPolicy` | Use this API command to delete bulk URL Filtering policies. |
| GET | `/urlFiltering/urlFilteringPolicy/{id}` | Use this API command to retrieve an URL Filtering policy. |
| PUT | `/urlFiltering/urlFilteringPolicy/{id}` | Use this API command to modify a URL Filtering policy. |
| DELETE | `/urlFiltering/urlFilteringPolicy/{id}` | Use this API command to delete a URL Filtering policy. |
| PATCH | `/urlFiltering/urlFilteringPolicy/{id}` | Use this API command to patch a URL Filtering policy. |

### User Traffic Profile (10 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/profiles/utp` | Use this API command to retrieve a list of user traffic profile. |
| POST | `/profiles/utp` | Use this API command to create a new user traffic profile. |
| DELETE | `/profiles/utp` | Use this API command to delete a list of traffic profile. |
| GET | `/profiles/utp/{id}` | Use this API command to retrieve an user traffic profile. |
| DELETE | `/profiles/utp/{id}` | Use this API command to delete an user traffic profile. |
| PATCH | `/profiles/utp/{id}` | Use this API command to modify the configuration of user traffic profile. |
| DELETE | `/profiles/utp/{id}/downlinkRateLimiting` | Use this API command to disable downlink rate limiting of user traffic profile. |
| DELETE | `/profiles/utp/{id}/uplinkRateLimiting` | Use this API command to disable uplink rateLimiting of user traffic profile. |
| POST | `/profiles/utp/clone/{id}` | Use this API command to copy a traffic profile. |
| POST | `/profiles/utp/query` | Use this API command to retrieve a list of User Traffic Profile by query criteri |

### VDP Profile (4 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/profiles/vdp` | Use this API command to retrieve a list of vdp. Unavailable when the system is i |
| GET | `/profiles/vdp/{id}` | Use this API command to retrieve an vdp. Unavailable when the system is in IPv6  |
| DELETE | `/profiles/vdp/{id}` | Use this API command to delete an vdp. Unavailable when the system is in IPv6 mo |
| PUT | `/profiles/vdp/{id}/approve` | Use this API command to approve vdp. Unavailable when the system is in IPv6 mode |

### Vendor Specific Attribute Profile (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/rkszones/{zoneId}/vendorSpecificAttributeProfiles` | Get a ID list of vendor specific attribute profile in this Zone. |
| POST | `/rkszones/{zoneId}/vendorSpecificAttributeProfiles` | Create a vendor specific attribute profile. |
| DELETE | `/rkszones/{zoneId}/vendorSpecificAttributeProfiles` | Use this API command to delete a list of vendor specific attribute profile. |
| GET | `/rkszones/{zoneId}/vendorSpecificAttributeProfiles/{id}` | Get a vendor specific attribute profile by ID. |
| PUT | `/rkszones/{zoneId}/vendorSpecificAttributeProfiles/{id}` | Use this API command to modify entire information of a vendor specific attribute |
| DELETE | `/rkszones/{zoneId}/vendorSpecificAttributeProfiles/{id}` | Use this API command to delete a vendor specific attribute profile by ID. |
| POST | `/rkszones/vendorSpecificAttributeProfiles/query` | Use this API command to retrieve a list of vendor specific attribute profile by  |

### VLAN Name Profile (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/rkszones/{zoneId}/vlanNameProfiles` | Use this API command to retrieve a list of VLAN Name profile. |
| POST | `/rkszones/{zoneId}/vlanNameProfiles` | Use this API command to create VLAN Name profile. |
| GET | `/rkszones/{zoneId}/vlanNameProfiles/{id}` | Use this API command to retrieve VLAN Name profile. |
| PUT | `/rkszones/{zoneId}/vlanNameProfiles/{id}` | Use this API command to update VLAN Name profile. |
| DELETE | `/rkszones/{zoneId}/vlanNameProfiles/{id}` | Use this API command to delete VLAN Name profile. |
| DELETE | `/rkszones/vlanNameProfiles` | Use this API command to delete bulk VLAN Name profile. |

### VlanPooling (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/services/vlanPooling` | Query Vlan Pooling Profiles with specified filters. |
| POST | `/vlanpoolings` | Use this API command to create new VLAN pooling. |
| DELETE | `/vlanpoolings` | Use this API command to bulk delete VLAN pooling. |
| GET | `/vlanpoolings/{id}` | Use this API command to retrieve VLAN pooling. |
| DELETE | `/vlanpoolings/{id}` | Use this API command to delete VLAN pooling. |
| PATCH | `/vlanpoolings/{id}` | Use this API command to modify the configuration on VLAN pooling. |
| POST | `/vlanpoolings/query` | Use this API command to retrieve a list of VLAN poolings. |

### Web Authentication (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/services/webAuthentication` | Query Web Authentications with specified filters. |
| GET | `/rkszones/{zoneId}/portals/webauth` | Use this API command to retrieve a list of web authentication of a zone. |
| POST | `/rkszones/{zoneId}/portals/webauth` | Use this API command to create a new web authentication of a zone. |
| GET | `/rkszones/{zoneId}/portals/webauth/{id}` | Use this API command to retrieve a web authentication of a zone. |
| DELETE | `/rkszones/{zoneId}/portals/webauth/{id}` | Use this API command to delete an web authentication of a zone. |
| PATCH | `/rkszones/{zoneId}/portals/webauth/{id}` | Use this API command to modify the configuration on web authentication of a zone |
| DELETE | `/rkszones/{zoneId}/portals/webauth/{id}/redirect` | Use this API command to set redirect to the URL that user intends to visit on we |

### Wechat (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/services/wechatProfile` | Query Wechat Portals with specified filters. |
| GET | `/rkszones/{zoneId}/portals/wechat` | Use this API command to retrieve a list of wechat portal. |
| POST | `/rkszones/{zoneId}/portals/wechat` | Use this API command to create wechat portal. |
| GET | `/rkszones/{zoneId}/portals/wechat/{id}` | Use this API command to retrieve wechat portal by ID. |
| DELETE | `/rkszones/{zoneId}/portals/wechat/{id}` | Use this API command to delete wechat portal. |
| PATCH | `/rkszones/{zoneId}/portals/wechat/{id}` | Use this API command to modify the configuration of wechat portal. |

### Wi-Fi Calling Policy (8 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/wifiCalling/query` | Use this API command to Query Wi-Fi Calling Policy List. |
| GET | `/wifiCalling/wifiCallingPolicy` | Use this API command to Retrieve List of Wi-Fi Calling Policy. |
| POST | `/wifiCalling/wifiCallingPolicy` | Use this API command to Create Wi-Fi Calling Policy. |
| DELETE | `/wifiCalling/wifiCallingPolicy` | Use this API command to Delete bulk Wi-Fi Calling policies. |
| GET | `/wifiCalling/wifiCallingPolicy/{id}` | Use this API command to Retrieve Wi-Fi Calling Policy. |
| PUT | `/wifiCalling/wifiCallingPolicy/{id}` | Use this API command to Modify Entire Wi-Fi Calling policy. |
| DELETE | `/wifiCalling/wifiCallingPolicy/{id}` | Use this API command to Delete a Wi-Fi Calling policy by ID. |
| PATCH | `/wifiCalling/wifiCallingPolicy/{id}` | Use this API command to Modify a Wi-Fi Calling policy. |

### Wired Client (3 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/wiredclient` | Query wired clients with specified filters |
| POST | `/wiredClients/bulkDeauth` | Use this API command to bulk deauth client. |
| POST | `/wiredClients/deauth` | Use this API command to deauth client. |

### Wireless Client (8 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/aps/{apMac}/operational/client/totalCount` | Use this API command to retrieve the total client count per AP. |
| POST | `/clients/bulkDeauth` | Use this API command to bulk deauth client. |
| POST | `/clients/bulkDisconnect` | Use this API command to bulk disconnect client. |
| POST | `/clients/byWlanName/{wlanname}` | Use this API command to query client by wlan name. |
| POST | `/clients/deauth` | Use this API command to deauth client. |
| POST | `/clients/disconnect` | Use this API command to disconnect client. |
| POST | `/query/client` | Query clients with specified filters. |
| POST | `/query/historicalclient` | Use this API command to retrive historical client. |

### WLAN (26 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/wlan` | Query WLANs with specified filters. |
| GET | `/rkszones/{zoneId}/wlans` | Use this API command to retrieve a list of WLANs within a zone. |
| POST | `/rkszones/{zoneId}/wlans` | Use this API command to create a new standard, open and non-tunneled basic WLAN. |
| GET | `/rkszones/{zoneId}/wlans/{id}` | Use this API command to retrieve a WLAN. |
| PUT | `/rkszones/{zoneId}/wlans/{id}` | Use this API command to modify entire information of a WLAN. |
| DELETE | `/rkszones/{zoneId}/wlans/{id}` | Use this API command to delete a WLAN. |
| PATCH | `/rkszones/{zoneId}/wlans/{id}` | Use this API command to modify the configuration of a WLAN. |
| DELETE | `/rkszones/{zoneId}/wlans/{id}/accountingServiceOrProfile` | Use this API command to disable the accounting of a WLAN. |
| DELETE | `/rkszones/{zoneId}/wlans/{id}/devicePolicy` | Use this API command to disable the device policy of a WLAN. |
| DELETE | `/rkszones/{zoneId}/wlans/{id}/diffServProfile` | Use this API command to disable the DiffServ profile of a WLAN. |
| DELETE | `/rkszones/{zoneId}/wlans/{id}/dnsServerProfile` | Use this API command to disable DNS server profile of a WLAN. |
| DELETE | `/rkszones/{zoneId}/wlans/{id}/l2ACL` | Use this API command to disable the layer 2 access control list (ACL) configurat |
| POST | `/rkszones/{zoneId}/wlans/{id}/qosMaps` | Use this API command to enable Qos Map Set of a WLAN. |
| DELETE | `/rkszones/{zoneId}/wlans/{id}/qosMaps` | Use this API command to disable Qos Map Set of a WLAN. |
| POST | `/rkszones/{zoneId}/wlans/guest` | Use this API command to create a new guest access WLAN. |
| POST | `/rkszones/{zoneId}/wlans/hotspot20` | Use this API command to create a new Hotspot 2.0 access WLAN. |
| POST | `/rkszones/{zoneId}/wlans/hotspot20open` | Use this API command to create a new Hotspot 2.0 Onboarding WLAN with Authentica |
| POST | `/rkszones/{zoneId}/wlans/hotspot20osen` | Use this API command to create a new Hotspot 2.0 Onboarding WLAN with Authentica |
| POST | `/rkszones/{zoneId}/wlans/standard8021X` | Use this API command to create a new standard, 802.1X and non-tunneled WLAN. |
| POST | `/rkszones/{zoneId}/wlans/standard8021Xmac` | Use this API command to create a new standard, 802.1X with MAC address and non-t |
| POST | `/rkszones/{zoneId}/wlans/standardmac` | Use this API command to create a new standard, MAC auth and non-tunneled WLAN. |
| POST | `/rkszones/{zoneId}/wlans/webauth` | Use this API command to creates new web authentication WLAN. |
| POST | `/rkszones/{zoneId}/wlans/wechat` | Use this API command to create a new wechat WLAN. |
| POST | `/rkszones/{zoneId}/wlans/wispr` | Use this API command to create new hotspot (WISPr) WLAN. |
| POST | `/rkszones/{zoneId}/wlans/wispr8021X` | Use this API command to create a new hotspot (WISPr) with 802.1X WLAN. |
| POST | `/rkszones/{zoneId}/wlans/wisprmac` | Use this API command to create a new hotspot (WISPr) with MAC bypass WLAN. |

### WLAN Group (11 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/rkszones/{zoneId}/wlangroups` | Use this API command to retrieve the list of WLAN groups within a zone. |
| POST | `/rkszones/{zoneId}/wlangroups` | Use this API command to create a new WLAN group. |
| GET | `/rkszones/{zoneId}/wlangroups/{id}` | Use this API command to retrieve the WLAN group. |
| DELETE | `/rkszones/{zoneId}/wlangroups/{id}` | Use this API command to delete a WLAN group. |
| PATCH | `/rkszones/{zoneId}/wlangroups/{id}` | Use this API command to modify the configuration of a WLAN group. |
| POST | `/rkszones/{zoneId}/wlangroups/{id}/members` | Use this API command to add a member to a WLAN group. |
| PUT | `/rkszones/{zoneId}/wlangroups/{id}/members/{memberId}` | Use this API command to modify the member's entire information of a WLAN group. |
| DELETE | `/rkszones/{zoneId}/wlangroups/{id}/members/{memberId}` | Use this API command to remove a member from a WLAN group. |
| PATCH | `/rkszones/{zoneId}/wlangroups/{id}/members/{memberId}` | Use this API command to modify a member of a WLAN group. |
| DELETE | `/rkszones/{zoneId}/wlangroups/{id}/members/{memberId}/nasId` | Use this API command to disable a member NAS-ID override of a WLAN group. |
| DELETE | `/rkszones/{zoneId}/wlangroups/{id}/members/{memberId}/vlanOverride` | Use this API command to disable a member VLAN override of a WLAN group. |

### WLAN Scheduler (6 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/query/services/wlanScheduler` | Query Wlan Schedulers with specified filters. |
| GET | `/rkszones/{zoneId}/wlanSchedulers` | Use this API command to retrieve the list of WLAN schedule from a zone. |
| POST | `/rkszones/{zoneId}/wlanSchedulers` | Use this API command to create a new WLAN schedule. |
| GET | `/rkszones/{zoneId}/wlanSchedulers/{id}` | Use this API command to retrieve a WLAN schedule. |
| DELETE | `/rkszones/{zoneId}/wlanSchedulers/{id}` | Use this API command to delete a WLAN schedule. |
| PATCH | `/rkszones/{zoneId}/wlanSchedulers/{id}` | Use this API command to modify the configuration of a WLAN schedule. |

### ZDImport (4 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| POST | `/zdImport/connectZD` | Connect to ZD. |
| GET | `/zdImport/getZDAPs` | Get ZD AP. |
| POST | `/zdImport/migrate` | Migrate ZD to SCG. |
| GET | `/zdImport/status` | Get Migrate Status. |

### Zone AAA (21 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| DELETE | `/rkszones/{zoneId}/aaa` | Use this API command to delete a list of AAA server. |
| DELETE | `/rkszones/{zoneId}/aaa/{id}` | Use this API command to delete an AAA server. |
| GET | `/rkszones/{zoneId}/aaa/ad` | Use this API command to retrieve a list of active directory servers of a zone. |
| POST | `/rkszones/{zoneId}/aaa/ad` | Use this API command to create a new active directory server of a zone. |
| GET | `/rkszones/{zoneId}/aaa/ad/{id}` | Use this API command to retrieve an active directory server of a zone. |
| PUT | `/rkszones/{zoneId}/aaa/ad/{id}` | Use this API command to modify the configuration on active directory server of a |
| DELETE | `/rkszones/{zoneId}/aaa/ad/{id}` | Use this API command to delete an active directory server of a zone. |
| PATCH | `/rkszones/{zoneId}/aaa/ad/{id}` | Use this API command to modify the configuration on active directory server of a |
| GET | `/rkszones/{zoneId}/aaa/ldap` | Use this API command to retrieve a list of LDAP servers of a zone. |
| POST | `/rkszones/{zoneId}/aaa/ldap` | Use this API command to create a new LDAP server of a zone. |
| GET | `/rkszones/{zoneId}/aaa/ldap/{id}` | Use this API command to retrieve a LDAP server of a zone. |
| PUT | `/rkszones/{zoneId}/aaa/ldap/{id}` | Use this API command to modify the configuration on LDAP server of a zone by com |
| DELETE | `/rkszones/{zoneId}/aaa/ldap/{id}` | Use this API command to delete a LDAP server of a zone. |
| PATCH | `/rkszones/{zoneId}/aaa/ldap/{id}` | Use this API command to modify the configuration on LDAP server of a zone. |
| GET | `/rkszones/{zoneId}/aaa/radius` | Use this API command to retrieve a list of radius servers of a zone. |
| POST | `/rkszones/{zoneId}/aaa/radius` | Use this API command to create a new radius server of a zone. |
| GET | `/rkszones/{zoneId}/aaa/radius/{id}` | Use this API command to retrieve a radius server of a zone. |
| PUT | `/rkszones/{zoneId}/aaa/radius/{id}` | Use this API command to modify the configuration on radius server of a zone by c |
| DELETE | `/rkszones/{zoneId}/aaa/radius/{id}` | Use this API command to delete a radius server of a zone. |
| PATCH | `/rkszones/{zoneId}/aaa/radius/{id}` | Use this API command to modify the configuration on radius server of a zone. |
| DELETE | `/rkszones/{zoneId}/aaa/radius/{id}/secondary` | Use this API command to disable secondary server on radius server of a zone. |

### Zone Schedule Upgrade (7 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/zoneScheduleUpgrade` | Retrieve Zone Firmware Schedule Upgrade Task List |
| POST | `/zoneScheduleUpgrade` | Create Zone Firmware Schedule Upgrade Task |
| DELETE | `/zoneScheduleUpgrade` | Bulk Delete Zone Firmware Schedule Upgrade Tasks |
| GET | `/zoneScheduleUpgrade/{id}` | Retrieve Zone Firmware Schedule Upgrade Task |
| PUT | `/zoneScheduleUpgrade/{id}` | Modify Zone Firmware Schedule Upgrade Task |
| DELETE | `/zoneScheduleUpgrade/{id}` | Delete Zone Firmware Schedule Upgrade Task |
| GET | `/zoneScheduleUpgrade/history` | Retrieve Zone Firmware Schedule Upgrade History |

### Zone Switch Group Link (5 endpoints)

| Method | Path | Summary |
|--------|------|---------|
| GET | `/zoneSwitchGroupLinks` | Retrieve all(at most 1000) Zone Switch Group link relations. |
| POST | `/zoneSwitchGroupLinks` | Create a new Zone Switch Group link relation. |
| GET | `/zoneSwitchGroupLinks/{id}` | Retrieve a new Zone Switch Group link relation by its ID. |
| PUT | `/zoneSwitchGroupLinks/{id}` | Update a new Zone Switch Group link relation. |
| DELETE | `/zoneSwitchGroupLinks/{id}` | Delete a new Zone Switch Group link relation. |

---

## Schema Definitions

Total definitions: 936

| Schema Name | Properties | Required Fields |
|-------------|-----------|-----------------|
| `aaa_activeDirectory` | 12 | none |
| `aaa_activeDirectoryList` | 4 | none |
| `aaa_authenticationServer` | 10 | none |
| `aaa_authenticationServerList` | 4 | none |
| `aaa_createActiveDirectoryServer` | 9 | name, ip, port, globalCatalogEnabled |
| `aaa_createAuthenticationServer` | 5 | name, primary |
| `aaa_createLDAPServer` | 10 | name, ip, port, baseDomainName, adminDomainName, password, keyAttribute, searchFilter |
| `aaa_groupAttrIdentityUserRoleMapping` | 3 | groupAttr, userRole |
| `aaa_LDAPServer` | 13 | none |
| `aaa_LDAPServerList` | 4 | none |
| `aaa_modifyActiveDirectoryServer` | 9 | none |
| `aaa_modifyAuthenticationServer` | 5 | none |
| `aaa_modifyGroupAttrIdentityUserRoleMapping` | 2 | groupAttr, userRole |
| `aaa_modifyLDAPServer` | 10 | none |
| `aaa_testAAAServerSingleResult` | 1 | none |
| `aaa_testAuthenticationServer` | 6 | aaaServer |
| `aaaServerQuery_aaaServerQueryList` | 5 | none |
| `aaaServerQuery_createAaaServer` | 37 | none |
| `accountSecurityProfile_create` | 16 | none |
| `accountSecurityProfile_delete` | 1 | none |
| `accountSecurityProfile_deleteList` | 1 | none |
| `accountSecurityProfile_getById` | 2 | none |
| `accountSecurityProfile_getByIdResult` | 18 | none |
| `accountSecurityProfile_profileListResult` | 4 | none |
| `accountSecurityProfile_update` | 16 | none |
| `administration_activeDirectoryServer` | 8 | realm, ip, port, windowsDomainName |
| `administration_apPatchHistory` | 4 | none |
| `administration_apPatchHistoryList` | 4 | none |
| `administration_apPatchInfo` | 4 | none |
| `administration_apPatchStatus` | 1 | none |
| `administration_applicationLogAndStatus` | 5 | none |
| `administration_applicationLogAndStatusList` | 4 | none |
| `administration_autoExportBackup` | 3 | none |
| `administration_backupFile` | 10 | none |
| `administration_clusterBackupList` | 4 | none |
| `administration_clusterBackupSummary` | 4 | none |
| `administration_configurationBackupList` | 4 | none |
| `administration_connectZD` | 3 | none |
| `administration_createAdminAAAServer` | 8 | name, type |
| `administration_defaultRoleMapping` | 2 | defaultUserGroup |
| `administration_getActiveDirectoryServer` | 7 | realm, ip, port, windowsDomainName |
| `administration_getLdapServer` | 9 | realm, ip, port, baseDomainName, adminDomainName, keyAttribute, searchFilter |
| `administration_getRadiusServer` | 10 | realm, ip, port, ipFqdn |
| `administration_getSecondaryRadiusServer` | 7 | ip, port, ipFqdn, requestTimeOut, maxRetries, retryPriInvl |
| `administration_getTacacsServer` | 3 | service, ip, port |
| `administration_ldapServer` | 10 | realm, ip, port, baseDomainName, adminDomainName, keyAttribute, searchFilter |
| `administration_licenses` | 5 | none |
| `administration_licenseServer` | 3 | none |
| `administration_licensesList` | 4 | none |
| `administration_licensesSummary` | 2 | none |
| `administration_licensesSummaryList` | 4 | none |
| `administration_licensesSyncLogs` | 2 | none |
| `administration_licensesSyncLogsList` | 4 | none |
| `administration_modfiyLicenseServer` | 3 | useCloud |
| `administration_modifyAdminAAAServer` | 7 | name, type |
| `administration_modifyAutoExportBackup` | 3 | none |
| `administration_modifyLogLevel` | 2 | none |
| `administration_modifyScheduleBackup` | 6 | none |
| `administration_radiusServer` | 11 | realm, port, ipFqdn |
| `administration_restoreConfigurationBackup` | 1 | executeWarningValidate |
| `administration_retrieveAdminAAAServer` | 11 | none |
| `administration_retrieveAdminAAAServerList` | 4 | none |
| `administration_scheduleBackup` | 6 | none |
| `administration_secondaryRadiusServer` | 8 | port, ipFqdn, requestTimeOut, maxRetries, retryPriInvl |
| `administration_tacacsServer` | 4 | service, ip, port |
| `administration_upgradeHistoryList` | 4 | none |
| `administration_upgradeHistorySummary` | 11 | none |
| `administration_upgradePatchInfo` | 2 | none |
| `administration_upgradeStatus` | 1 | none |
| `administration_zdAP` | 2 | none |
| `administration_zdAPList` | 5 | none |
| `administration_zdImport` | 4 | none |
| `administration_zdImportStatus` | 4 | none |
| `alarmList_alarmQueryResultList` | 5 | none |
| `alarmList_singleAlarm` | 14 | none |
| `alert_ackBulkAlarms` | 1 | none |
| `alert_clearBulkAlarms` | 2 | none |
| `alertSummary_alarmSummary` | 4 | none |
| `alertSummary_eventSummary` | 6 | none |
| `allowedDeviceProfile_allowedDeviceProfile` | 12 | none |
| `allowedDeviceProfile_allowedDeviceProfileList` | 5 | none |
| `allowedDeviceProfile_createAllowedDeviceProfile` | 5 | name |
| `allowedDeviceProfile_modifyAllowedDeviceProfile` | 4 | name |
| `ap_alarmSummary` | 4 | none |
| `ap_apConfiguration` | 44 | none |
| `ap_apLinemanSummary` | 4 | none |
| `ap_apListEntry` | 4 | none |
| `ap_apOperationalSummary` | 40 | none |
| `ap_createAP` | 16 | mac, zoneId |
| `ap_login` | 2 | apLoginName, apLoginPassword |
| `ap_mesh` | 4 | none |
| `ap_modifyAP` | 40 | none |
| `ap_modifyRogueType` | 1 | none |
| `ap_neighborAPList` | 4 | none |
| `ap_network` | 6 | none |
| `ap_networkIpv6` | 5 | none |
| `ap_resetCableModem` | 1 | none |
| `ap_swapApConfigure` | 2 | swapInMac, swapOutMac |
| `ap_switchoverAP` | 5 | none |
| `ap_syslog` | 12 | enabled |
| `apCloudOnBoarding_syncResult` | 2 | none |
| `apgroup_addMembers` | 1 | none |
| `apgroup_apGroupConfiguration` | 34 | name |
| `apgroup_apGroupList` | 4 | none |
| `apgroup_apGroupMember` | 2 | none |
| `apgroup_apGroupSummary` | 2 | none |
| `apgroup_modifyAPGroup` | 31 | none |
| `apInfo_apInfo` | 7 | none |
| `apmodel_apModel` | 18 | none |
| `apmodel_authenticatorAAAServer` | 2 | enableUseSCGasProxy |
| `apmodel_cellularSettings` | 9 | select3g4g, select3g4g2, wanConnection, wanRecoveryTimer |
| `apmodel_commonAttribute` | 34 | none |
| `apmodel_externalAntenna` | 3 | enabled |
| `apmodel_lacpSetting` | 3 | none |
| `apmodel_lanPort8021X` | 3 | type |
| `apmodel_lanPortAuthenticator` | 4 | macAuthByPassEnabled |
| `apmodel_lanPortSetting` | 6 | portName, enabled |
| `apmodel_lanPortSupplicant` | 3 | type |
| `apmodel_lldpSetting` | 4 | enabled |
| `apMultipleMove_apMultipleMoveRequest` | 3 | targetZoneId, apMacs |
| `apMultipleMove_apMultipleMoveResponse` | 2 | none |
| `apPacketCapture_apPacketCaptureReq` | 4 | captureInterface |
| `apPacketCapture_apPacketCaptureRes` | 7 | none |
| `apQuery_apQueryList` | 5 | none |
| `apQuery_createApQuery` | 195 | none |
| `aprules_apRuleConfiguration` | 9 | none |
| `aprules_apRuleList` | 4 | none |
| `aprules_createApRule` | 7 | type, mobilityZone |
| `aprules_gpsCoordinates` | 3 | none |
| `aprules_ipAddressRange` | 2 | none |
| `aprules_modifyApRule` | 7 | none |
| `aprules_subnet` | 2 | none |
| `apSnmpAgentProfile_apSnmpAgentProfileList` | 4 | none |
| `apSnmpAgentProfile_apSnmpAgentProfileSummary` | 6 | none |
| `apSnmpAgentProfile_apSnmpCommunity` | 6 | communityName, readEnabled, writeEnabled, notificationEnabled |
| `apSnmpAgentProfile_apSnmpUser` | 10 | userName, authProtocol, authPassword, privProtocol, readEnabled, writeEnabled, notificationEnabled |
| `apSnmpAgentProfile_createApSnmpAgentProfile` | 5 | domainId, name |
| `apSnmpAgentProfile_targetConfig` | 2 | address, port |
| `apSnmpAgentProfile_updateApSnmpAgentProfile` | 4 | name |
| `apSyslogServerProfile_apSyslogServerProfile` | 18 | name, primaryAddress |
| `apSyslogServerProfile_apSyslogServerProfileList` | 4 | none |
| `apSyslogServerProfile_createApSyslogServerProfile` | 13 | domainId, name, primaryAddress |
| `apSyslogServerProfile_updateApSyslogServerProfile` | 12 | name, primaryAddress |
| `avc_appCategory` | 2 | none |
| `avc_appCategoryList` | 4 | none |
| `avc_application` | 3 | none |
| `avc_applicationList` | 4 | none |
| `avc_applicationPolicyProfile` | 14 | none |
| `avc_applicationPolicyProfileList` | 5 | none |
| `avc_applicationRule` | 12 | none |
| `avc_checkLatestInstallableSignaturePackageSettings` | 2 | none |
| `avc_createApplicationPolicyProfile` | 6 | name, applicationRules |
| `avc_createUserDefinedProfile` | 7 | name, type, destPort, protocol |
| `avc_deleteBulk` | 1 | none |
| `avc_downloadLatestInstallableSignaturePackage` | 3 | none |
| `avc_latestInstallableSignaturePackage` | 3 | none |
| `avc_latestInstallableSignaturePackageBinary` | 3 | none |
| `avc_modifyApplicationPolicyProfile` | 5 | none |
| `avc_modifyUserDefinedProfile` | 6 | none |
| `avc_patchSignaturePackage` | 1 | none |
| `avc_signaturePackage` | 7 | none |
| `avc_signaturePackageBinary` | 4 | none |
| `avc_userDefinedProfile` | 16 | none |
| `avc_userDefinedProfileList` | 5 | none |
| `bondPort_bondPortProfileList` | 4 | none |
| `bondPort_bondPortProfileQuery` | 5 | none |
| `bondPort_bondPortProfileSummary` | 3 | none |
| `bondPort_bondPortProfileWithEditInfo` | 12 | none |
| `bondPort_createBondPortProfile` | 5 | name, type, untagId |
| `bondPort_modifyBondPortProfile` | 4 | untagId |
| `certificate_certificate` | 11 | none |
| `certificate_certificateList` | 4 | none |
| `certificate_certificatesSigningRequest` | 10 | none |
| `certificate_certSetting` | 1 | none |
| `certificate_clientCert` | 9 | none |
| `certificate_clientCertList` | 4 | none |
| `certificate_createCert` | 8 | name, data |
| `certificate_createClientCert` | 6 | name, data, privateKeyData |
| `certificate_createCSR` | 9 | name, commonName, email, organization, city, state, countryCode |
| `certificate_createTrustedCAChain` | 4 | name, rootCertData |
| `certificate_csrList` | 4 | none |
| `certificate_deleteBulk` | 1 | none |
| `certificate_modifyTrustedCAChain` | 5 | none |
| `certificate_serviceCertificate` | 2 | service |
| `certificate_trustedCAChain` | 5 | none |
| `certificate_trustedCAChainCertList` | 4 | none |
| `client_deAuthClient` | 2 | mac, apMac |
| `client_deAuthClientList` | 1 | none |
| `client_disconnectClient` | 2 | mac, apMac |
| `client_disconnectClientList` | 1 | none |
| `client_historicalClient` | 18 | none |
| `client_historicalClientList` | 5 | none |
| `clientQuery_clientQueryList` | 5 | none |
| `clientQuery_createClientQuery` | 53 | none |
| `clientQuery_tcWithQuota` | 3 | none |
| `clusterblade_bladeProgress` | 5 | none |
| `clusterblade_clusterOperationProgress` | 3 | none |
| `clusterblade_clusterState` | 7 | none |
| `clusterblade_clusterUpgradeProgress` | 8 | none |
| `clusterblade_previousOperationRecord` | 3 | none |
| `clusterblade_uploadPatchInfo` | 8 | none |
| `clusterRedundancy_activeCluster` | 3 | none |
| `clusterRedundancy_clusterRedundancySettings` | 11 | none |
| `clusterRedundancy_managementEntry` | 3 | none |
| `common_altitude` | 2 | none |
| `common_apAutoRehomeCluster` | 3 | apAutoRehomeClusterEnable, primaryClusterId, failbackIntervalSeconds |
| `common_apLatencyInterval` | 1 | none |
| `common_apManagementVlan` | 2 | none |
| `common_apRebootTimeout` | 2 | none |
| `common_baseServiceInfo` | 4 | none |
| `common_bulkDeleteRequest` | 1 | none |
| `common_clientAdmissionControl` | 3 | none |
| `common_createResult` | 1 | none |
| `common_createResultIdName` | 2 | none |
| `common_dhcpProfileRef` | 13 | none |
| `common_dhcpSiteConfigListRef` | 11 | none |
| `common_dhcpSiteConfigRef` | 9 | none |
| `common_doAssignIp` | 7 | none |
| `common_fullTextSearch` | 3 | none |
| `common_genericRef` | 2 | none |
| `common_getRadiusServerWhenTlsEnabled` | 3 | ip, port |
| `common_healthCheckPolicy` | 4 | responseWindow, reviveInterval, zombiePeriod |
| `common_lteBandLockChannel` | 4 | none |
| `common_myRuckusConfig` | 1 | aclForTunnelWlanAndVlanEnable |
| `common_overrideClientAdmissionControl` | 4 | none |
| `common_overrideGenericRef` | 3 | none |
| `common_overrideSmartMonitor` | 3 | none |
| `common_portalCustomization` | 5 | language |
| `common_qinq` | 2 | none |
| `common_queryCriteria` | 13 | none |
| `common_queryCriteriaOptions` | 21 | none |
| `common_radiusServer` | 3 | ip, port, sharedSecret |
| `common_radiusServerWhenTlsEnabled` | 4 | port, ipFqdn |
| `common_rateLimiting` | 3 | maxOutstandingRequestsPerServer, threshold, sanityTimer |
| `common_rbacMetadata` | 1 | none |
| `common_recoverySsid` | 1 | none |
| `common_smartMonitor` | 2 | none |
| `common_snmpCommunity` | 6 | communityName, readEnabled, writeEnabled, notificationEnabled |
| `common_snmpUser` | 10 | userName |
| `common_sshPublicKeyRef` | 3 | none |
| `common_targetConfig` | 2 | address, port |
| `common_timeRange` | 4 | none |
| `common_trafficClassProfileRef` | 5 | none |
| `common_trafficClassRef` | 2 | none |
| `common_webAuthenticationPortalCustomization` | 2 | logo |
| `deviceCapacity_devicesSummary` | 17 | none |
| `devicePolicy_createDevicePolicy` | 3 | name, defaultAction |
| `devicePolicy_devicePolicyPorfile` | 5 | none |
| `devicePolicy_devicePolicyRule` | 6 | none |
| `devicePolicy_modifyDevicePolicy` | 4 | none |
| `devicePolicy_porfileList` | 4 | none |
| `dhcpMsgStats_dhcpMsgStats` | 6 | none |
| `dhcppools_dhcpClientInfo` | 6 | none |
| `dhcppools_dhcpPoolInfo` | 11 | none |
| `dhcppools_dhcpPools` | 6 | none |
| `dnsSpoofingProfile_dnsSpoofingProfile` | 3 | name |
| `dnsSpoofingProfile_dnsSpoofingProfileDetail` | 9 | none |
| `dnsSpoofingProfile_dnsSpoofingProfileSummary` | 2 | none |
| `dnsSpoofingProfile_dnsSpoofingRule` | 2 | domainName, ipList |
| `dnsSpoofingProfile_getDnsSpoofingProfileList` | 4 | none |
| `domain_domainConfiguration` | 12 | none |
| `domain_domainList` | 4 | none |
| `domain_modifyDomain` | 1 | none |
| `domainDevicePolicy_createDomainDevicePolicy` | 5 | name, defaultAction, rule |
| `domainDevicePolicy_domainDevicePolicyProfile` | 5 | none |
| `domainDevicePolicy_domainDevicePolicyProfileByQueryCriteria` | 6 | none |
| `domainDevicePolicy_domainDevicePolicyRule` | 7 | none |
| `domainDevicePolicy_modifyDomainDevicePolicy` | 4 | none |
| `domainDevicePolicy_profileList` | 4 | none |
| `dp_switchoverDp` | 4 | none |
| `dpProfile_bulkDelete` | 1 | none |
| `dpProfile_dpDhcpProfileBasicBO` | 7 | none |
| `dpProfile_dpDhcpProfileBasicBOList` | 4 | none |
| `dpProfile_dpDhcpProfileHostBO` | 12 | none |
| `dpProfile_dpDhcpProfileHostBOList` | 4 | none |
| `dpProfile_dpDhcpProfileOptionBO` | 4 | none |
| `dpProfile_dpDhcpProfileOptionInstance` | 2 | none |
| `dpProfile_dpDhcpProfileOptionSpaceApplyToBO` | 5 | none |
| `dpProfile_dpDhcpProfileOptionSpaceApplyToBOList` | 4 | none |
| `dpProfile_dpDhcpProfileOptionSpaceBO` | 4 | none |
| `dpProfile_dpDhcpProfileOptionSpaceInstance` | 4 | none |
| `dpProfile_dpDhcpProfilePoolBO` | 20 | none |
| `dpProfile_dpDhcpProfilePoolBOList` | 4 | none |
| `dpProfile_dpDhcpProfileQinqVlanRangeBO` | 2 | none |
| `dpProfile_dpNatProfileBasicBO` | 8 | none |
| `dpProfile_dpNatProfileBasicBOList` | 4 | none |
| `dpProfile_dpNatProfilePoolBO` | 11 | none |
| `dpProfile_dpNatProfilePoolBOList` | 4 | none |
| `dpProfile_dpNatProfilePrivateQinqVlanRangeBO` | 2 | none |
| `dpProfile_dpNatProfilePublicSubnetIdBO` | 2 | none |
| `dpProfile_dpProfileSettingBO` | 8 | none |
| `dpProfile_dpProfileSettingBOList` | 4 | none |
| `dpsk_batchGenUnbound` | 6 | none |
| `dpsk_deleteDpskResult` | 1 | none |
| `dpsk_deleteDPSKs` | 1 | none |
| `dpsk_deleteExpiredDpskConfig` | 1 | none |
| `dpsk_dpskQueryList` | 5 | none |
| `dpsk_getDpskEnabledWlans` | 4 | none |
| `dpsk_getDpskInfoList` | 4 | none |
| `dpsk_getDpskResult` | 2 | none |
| `dpsk_modifyDeleteExpiredDpsk` | 1 | none |
| `dpsk_updateDpsk` | 1 | none |
| `dpsk_wlanDpskSetting` | 5 | none |
| `dpsk_wlanExternalDpsk` | 3 | enabled |
| `ethernetPort_createEthernetPortProfile` | 31 | name, type, _8021X |
| `ethernetPort_dhcpOption82` | 7 | none |
| `ethernetPort_ethernetPortProfile` | 32 | none |
| `ethernetPort_modifyEthernetPortProfile` | 30 | none |
| `ethernetPort_profileList` | 4 | none |
| `eventList_eventQueryResultList` | 5 | none |
| `eventList_singleEvent` | 7 | none |
| `eventManagement_eventDataList` | 4 | none |
| `eventManagement_eventDataResponse` | 4 | none |
| `eventManagement_eventEmailSetting` | 2 | none |
| `eventManagement_singleEventSetting` | 11 | none |
| `flexiVpn_flexiVpnSetting` | 1 | dpGroupId |
| `gdpr_ftp` | 6 | ftpHost, ftpPort |
| `gdpr_report` | 3 | clientMac, action |
| `geofenceProfile_geofenceProfile` | 4 | name, radiusMeter, locationList |
| `geofenceProfile_geofenceProfileLocationData` | 3 | none |
| `geofenceProfile_getGeofenceProfile` | 6 | none |
| `geofenceProfile_getGeofenceProfileProfileList` | 4 | none |
| `identity_aaaServer` | 2 | none |
| `identity_aaaServerList` | 4 | none |
| `identity_authenticationServerConfig` | 7 | none |
| `identity_countryList` | 4 | none |
| `identity_countrySummary` | 2 | none |
| `identity_createIdentityGuestPass` | 13 | guestName, wlan, zone, numberOfPasses, passValidFor, passEffectSince, maxDevices |
| `identity_createIdentityUserRole` | 10 | name, userTrafficProfile, firewallProfileId, maxDevices |
| `identity_createSubscriptionPackage` | 5 | name, expirationInterval, expirationValue |
| `identity_createUser` | 16 | firstName, lastName, isDisabled, userName, password |
| `identity_deleteBulk` | 1 | none |
| `identity_identityGuestPassConfiguration` | 22 | none |
| `identity_identityGuestPassList` | 5 | none |
| `identity_identityList` | 5 | none |
| `identity_identityUserRole` | 16 | none |
| `identity_identityUserSummary` | 8 | none |
| `identity_importIdentityGuestPass` | 8 | wlan, zone, passValidFor, maxDevices |
| `identity_maxDevices` | 2 | none |
| `identity_modifyGuestPass` | 1 | none |
| `identity_modifyIdentityUserRole` | 11 | none |
| `identity_modifySubscriptionPackage` | 6 | none |
| `identity_modifyUser` | 16 | none |
| `identity_packageConfiguration` | 2 | none |
| `identity_packageList` | 4 | none |
| `identity_passValidFor` | 2 | none |
| `identity_sessionDuration` | 3 | none |
| `identity_subscriptionPackage` | 11 | none |
| `identity_subscriptionPackageList` | 5 | none |
| `identity_timeScheduleList` | 7 | none |
| `identity_userConfiguration` | 26 | none |
| `identity_userList` | 5 | none |
| `identity_usernamePasswordCredentialsImplDto` | 10 | none |
| `indoorMap_basicIndoorMap` | 14 | name, description, groupType |
| `indoorMap_indooMapAuditId` | 2 | none |
| `indoorMap_indoorMap` | 16 | name, description, groupType |
| `indoorMap_indoorMapAp` | 2 | none |
| `indoorMap_indoorMapList` | 5 | none |
| `indoorMap_indoorMapSummary` | 15 | name, description, groupType |
| `indoorMap_indoorMapSummaryList` | 5 | none |
| `indoorMap_indoorMapXy` | 2 | none |
| `indoorMap_scale` | 4 | none |
| `l2AccessControl_createL2AccessControl` | 8 | name, restriction, etherTypeRestriction |
| `l2AccessControl_etherTypeObject` | 1 | none |
| `l2AccessControl_l2AccessControl` | 15 | none |
| `l2AccessControl_l2AccessControlList` | 5 | none |
| `l2AccessControl_modifyL2AccessControl` | 7 | restriction, etherTypeRestriction |
| `l2AccessControl_ruleObject` | 1 | mac |
| `l2AccessControl_userDefinedEtherTypeObject` | 2 | etherType, protocolName |
| `mduSegmentationProfile_accessSwitchObj` | 12 | none |
| `mduSegmentationProfile_createMduSegmentationProfile` | 5 | domainId, name, dpInfoList |
| `mduSegmentationProfile_distributionSwitchObj` | 11 | none |
| `mduSegmentationProfile_ethernetPortProfile` | 18 | none |
| `mduSegmentationProfile_ethernetPortProfileConfig` | 5 | none |
| `mduSegmentationProfile_mduProfileApGroupInfo` | 3 | none |
| `mduSegmentationProfile_mduProfileDpInfo` | 12 | dpId |
| `mduSegmentationProfile_mduProfileDpInfoSummary` | 22 | dpId |
| `mduSegmentationProfile_mduSegmentationProfileQuery` | 5 | none |
| `mduSegmentationProfile_mduSegmentationProfileSummary` | 7 | id, domainId, name, dpInfoList |
| `mduSegmentationProfile_profileContentList` | 4 | none |
| `mduSegmentationProfile_RateLimitPorts` | 2 | none |
| `mduSegmentationProfile_siteSecondary` | 2 | none |
| `mduSegmentationProfile_switchGroups` | 3 | none |
| `mduSegmentationProfile_updateMduSegmentationProfile` | 5 | domainId, name, dpInfoList, apGroupInfoList |
| `mduSegmentationProfile_upLinkObj` | 2 | none |
| `meshNeighborInfo_meshNeighborInfo` | 10 | none |
| `meshNeighborInfo_meshNeighborInfoList` | 6 | none |
| `meshNodeInfo_helperZoneInfo` | 2 | none |
| `meshNodeInfo_meshNodeInfo` | 17 | none |
| `meshNodeInfo_meshNodeInfoList` | 6 | none |
| `meshNodeInfo_updateAPZeroTouch` | 4 | none |
| `multicastForwarding_setting` | 1 | enabled |
| `northboundDataStreaming_createNorthboundDataStreamingProfile` | 11 | name, serverHost, serverPort, user, password, systemId |
| `northboundDataStreaming_modifyNorthboundDataStreamingEventCodes` | 1 | northboundDataStreamingAcceptedEventCodes |
| `northboundDataStreaming_modifyNorthboundDataStreamingProfile` | 11 | name, serverHost, serverPort, user, password, systemId |
| `northboundDataStreaming_northboundDataStreamingEventCodes` | 4 | none |
| `northboundDataStreaming_northboundDataStreamingProfile` | 12 | none |
| `northboundDataStreaming_northboundDataStreamingProfileList` | 2 | none |
| `northboundDataStreaming_northboundDataStreamingSettings` | 4 | northboundDataStreamingEnabled, streamingByDomainZoneEnabled |
| `portalDetectionProfile_createPortalDetectionProfile` | 3 | name |
| `portalDetectionProfile_portalDetectionPattern` | 5 | name, userAgentPattern, httpCode |
| `portalDetectionProfile_portalDetectionProfile` | 11 | none |
| `portalDetectionProfile_portalDetectionProfileList` | 5 | none |
| `portalservice_connectionCapability` | 4 | protocolName, protocolNumber, portNumber, status |
| `portalservice_createGuestAccess` | 20 | name, portalCustomization, userSession |
| `portalservice_createHotspot20VenueProfile` | 7 | name, venueNames |
| `portalservice_createHotspot20WlanProfile` | 12 | name, operator, defaultIdentityProvider, internetOption, accessNetworkType, ipv4AddressType, ipv6AddressType |
| `portalservice_createHotspotExternal` | 14 | name, smartClientSupport, portalUrl, macAddressFormat |
| `portalservice_createHotspotInternal` | 9 | name, smartClientSupport, macAddressFormat |
| `portalservice_createHotspotSmartClientOnly` | 12 | name, smartClientInfo, macAddressFormat |
| `portalservice_createL2ACL` | 4 | name, restriction |
| `portalservice_createWebAuthentication` | 4 | name |
| `portalservice_createWechat` | 8 | name, authUrl, dnatDestination, blackList, whiteList |
| `portalservice_defaultConnectionCapability` | 4 | protocolName, protocolNumber, portNumber, status |
| `portalservice_dnatPortMapping` | 2 | none |
| `portalservice_guestAccess` | 22 | none |
| `portalservice_hotspot` | 19 | none |
| `portalservice_hotspot20VeuneProfile` | 9 | none |
| `portalservice_hotspot20WlanProfile` | 16 | none |
| `portalservice_l2ACL` | 6 | none |
| `portalservice_modifyGuestAccess` | 20 | none |
| `portalservice_modifyHotspot` | 16 | none |
| `portalservice_modifyHotspot20VenueProfile` | 7 | none |
| `portalservice_modifyHotspot20WlanProfile` | 14 | none |
| `portalservice_modifyL2ACL` | 4 | none |
| `portalservice_modifyWebAuthentication` | 6 | none |
| `portalservice_modifyWechat` | 8 | none |
| `portalservice_portalLocation` | 2 | none |
| `portalservice_portalRedirect` | 1 | none |
| `portalservice_portalServiceList` | 4 | none |
| `portalservice_userSession` | 2 | none |
| `portalservice_venueName` | 3 | language, name |
| `portalservice_webAuthentication` | 8 | none |
| `portalservice_wechatConfiguration` | 8 | none |
| `profile_advancedOptionContent` | 11 | none |
| `profile_baseServiceInfoList` | 4 | none |
| `profile_blockClient` | 9 | mac |
| `profile_blockClientList` | 4 | none |
| `profile_blockedPort` | 2 | none |
| `profile_bonjourFencingPolicy` | 12 | name, bonjourFencingRuleList |
| `profile_bonjourFencingPolicyList` | 4 | none |
| `profile_bonjourFencingRule` | 7 | deviceType, serviceType, fencingRange |
| `profile_bonjourFencingRuleDeviceMac` | 1 | none |
| `profile_bonjourFencingRuleMapping` | 3 | none |
| `profile_bonjourFencingService` | 4 | none |
| `profile_bonjourFencingStatistic` | 5 | none |
| `profile_bridgeProfile` | 11 | none |
| `profile_bridgeProfileList` | 5 | none |
| `profile_bulkBlockClient` | 2 | none |
| `profile_clientIsolationEntry` | 3 | mac |
| `profile_clientIsolationWhitelist` | 12 | name, whitelist, clientIsolationAutoEnabled |
| `profile_clientIsolationWhitelistArray` | 10 | none |
| `profile_createBonjourFencingPolicy` | 4 | name, bonjourFencingRuleList |
| `profile_createClientIsolationWhitelist` | 4 | name, whitelist, clientIsolationAutoEnabled |
| `profile_createDhcpProfile` | 11 | name, vlanId, subnetNetworkIp, subnetMask, poolStartIp, poolEndIp, leaseTimeHours, leaseTimeMinutes |
| `profile_createDnsServerProfile` | 7 | name, primaryIp |
| `profile_createDPGroup` | 3 | name, dpGroupList |
| `profile_createFirewallProfile` | 10 | name |
| `profile_createIpsecProfile` | 16 | name, ikeRekeyTime, espRekeyTime, ipMode |
| `profile_createL3AccessControlPolicy` | 5 | name, defaultAction |
| `profile_createPrecedenceProfile` | 4 | none |
| `profile_createRestrictedApAccessProfile` | 5 | name |
| `profile_createRogueApPolicy` | 3 | name, rules |
| `profile_createRtlsProfile` | 5 | ekahauEnabled, stanleyEnabled |
| `profile_createRuckusGREProfile` | 12 | name, tunnelMtuAutoEnabled |
| `profile_createSoftGREProfile` | 13 | name, primaryGateway, tunnelMtuAutoEnabled, keepAlivePeriod, keepAliveRetry |
| `profile_createTrafficClassProfile` | 3 | name, trafficClasses |
| `profile_createUserTrafficProfile` | 11 | name, defaultAction |
| `profile_dataPlaneL3RoamingData` | 6 | key, activated, value |
| `profile_deleteBulkPrecedenceProfile` | 1 | none |
| `profile_deleteBulkUserTrafficProfile` | 1 | none |
| `profile_dhcpOption82` | 9 | none |
| `profile_dhcpProfileList` | 10 | none |
| `profile_dhcpRelayNoRelayTunnel` | 5 | none |
| `profile_dnsServerProfile` | 14 | none |
| `profile_dnsServerProfileList` | 5 | none |
| `profile_downlinkRateLimiting` | 2 | none |
| `profile_dpGroupList` | 1 | none |
| `profile_espProposal` | 3 | encAlg, authAlg, dhGroup |
| `profile_espSecurityAssociationContent` | 2 | none |
| `profile_firewallProfile` | 16 | none |
| `profile_firewallProfileArray` | 5 | none |
| `profile_flexiVpnProfile` | 9 | none |
| `profile_flexiVpnProfileList` | 10 | none |
| `profile_gatewayFailback` | 2 | none |
| `profile_getL3RoamingConfig` | 1 | none |
| `profile_getLbsProfile` | 14 | none |
| `profile_hs20AdviceOfCharge` | 3 | type |
| `profile_hs20FriendlyName` | 2 | language, name |
| `profile_hs20Operator` | 16 | name, domainNames, friendlyNames |
| `profile_hs20OperatorIcon` | 3 | language, icon |
| `profile_hs20OperatorList` | 5 | none |
| `profile_hs20Provider` | 16 | none |
| `profile_hs20ProviderList` | 5 | none |
| `profile_hs20TermsConditions` | 2 | none |
| `profile_ikeProposal` | 4 | encAlg, authAlg, dhGroup |
| `profile_ikeSecurityAssociationContent` | 2 | none |
| `profile_ipAclRules` | 27 | none |
| `profile_ipsecProfile` | 22 | none |
| `profile_ipsecProfileList` | 5 | none |
| `profile_l3AccessControlPolicy` | 6 | name, defaultAction |
| `profile_l3AccessControlPolicyArray` | 5 | none |
| `profile_l3AclRuleList` | 23 | none |
| `profile_lbsProfile` | 15 | none |
| `profile_lbsProfileList` | 5 | none |
| `profile_modifyBlockClient` | 2 | none |
| `profile_modifyBonjourFencingPolicy` | 4 | none |
| `profile_modifyClientIsolationWhitelist` | 4 | none |
| `profile_modifyDnsServerProfile` | 8 | none |
| `profile_modifyDPGroup` | 3 | none |
| `profile_modifyFirewallProfile` | 10 | none |
| `profile_modifyHS20Operator` | 10 | none |
| `profile_modifyIpAclRules` | 27 | action, direction |
| `profile_modifyIpsecProfile` | 15 | none |
| `profile_modifyL3AccessControlPolicy` | 5 | name, defaultAction |
| `profile_modifyRestrictedApAccessProfile` | 5 | name |
| `profile_modifyRuckusGREProfile` | 12 | none |
| `profile_modifySoftGREProfile` | 12 | none |
| `profile_modifyUserTrafficProfile` | 12 | none |
| `profile_precedenceList` | 5 | none |
| `profile_profileClone` | 4 | none |
| `profile_profileIdList` | 4 | none |
| `profile_profileList` | 11 | none |
| `profile_providerAccounting` | 4 | realm, serviceType |
| `profile_providerAuthentication` | 5 | realm, serviceType |
| `profile_providerEAPAuthSetting` | 4 | info |
| `profile_providerEAPMethod` | 2 | type |
| `profile_providerExternalOSU` | 7 | provisioningProtocals, osuServiceUrl, osuNaiRealm, commonLanguageIcon, subscriptionDescriptions |
| `profile_providerHomeOIs` | 2 | name, oi |
| `profile_providerOnlineSignup` | 1 | none |
| `profile_providerPLMN` | 2 | mcc, mnc |
| `profile_providerRealm` | 3 | name, encoding, eapMethods |
| `profile_providerSubscriptionDescription` | 4 | language, name |
| `profile_RateLimitingPrecedenceItem` | 2 | none |
| `profile_restrictedApAccessProfile` | 11 | name |
| `profile_restrictedApAccessProfileArray` | 4 | none |
| `profile_returnDPGroup` | 14 | none |
| `profile_rogueApPolicy` | 11 | none |
| `profile_rogueApPolicyList` | 4 | none |
| `profile_rogueApRuleList` | 6 | name, type, priority, classification |
| `profile_rtlsProfileList` | 5 | none |
| `profile_ruckusGREProfile` | 18 | none |
| `profile_ruckusGREProfileList` | 5 | none |
| `profile_SoftGREProfile` | 19 | none |
| `profile_softGREProfileList` | 5 | none |
| `profile_trafficClassProfileList` | 10 | none |
| `profile_updateL3RoamingConfig` | 1 | none |
| `profile_updatePrecedenceProfile` | 4 | none |
| `profile_updateRogueApPolicy` | 3 | none |
| `profile_updateRtlsProfile` | 5 | none |
| `profile_uplinkRateLimiting` | 2 | none |
| `profile_userTrafficProfile` | 19 | none |
| `profile_userTrafficProfileList` | 5 | none |
| `profile_vdpProfile` | 24 | none |
| `profile_VlanPrecedenceItem` | 2 | none |
| `racStats_radiusProxy` | 47 | none |
| `racStats_radiusProxyList` | 5 | none |
| `radio_autoChannelSelection` | 4 | none |
| `radio_backgroundScanning` | 1 | frequencyInSec |
| `radio_radio24gAp` | 10 | none |
| `radio_radio24gApGroup` | 9 | none |
| `radio_radio24gResponse` | 12 | none |
| `radio_radio24gZone` | 9 | none |
| `radio_radio5gAp` | 10 | none |
| `radio_radio5gApGroup` | 12 | none |
| `radio_radio5gResponse` | 21 | none |
| `radio_radio5gResponseAp` | 11 | none |
| `radio_radio5gZone` | 17 | none |
| `radio_radio6gAp` | 15 | none |
| `radio_radio6gApGroup` | 17 | none |
| `radio_radio6gResponse` | 22 | none |
| `radio_radio6gZone` | 17 | none |
| `radio_radioConfigAp` | 6 | none |
| `radio_radioConfigApGroup` | 6 | none |
| `radio_radioConfigResponse` | 6 | none |
| `radio_radioConfigResponseAp` | 6 | none |
| `radio_radioConfigZone` | 6 | none |
| `rogueclient_rogueInfo` | 22 | none |
| `rogueclient_rogueInfoList` | 6 | none |
| `rogueInfo_rogueInfo` | 19 | none |
| `rogueInfo_rogueInfoList` | 6 | none |
| `scguser_createScgUser` | 16 | newPassphrase, userName |
| `scguser_getScgUser` | 20 | none |
| `scguser_modifyScgUser` | 18 | id |
| `scguser_patchScgUserGroup` | 16 | none |
| `scguser_scgUserAuditId` | 1 | none |
| `scguser_scgUserGroup` | 18 | name, role, accountSecurityProfileId, permissions, resourceGroups |
| `scguser_scgUserGroupAuditId` | 1 | none |
| `scguser_scgUserGroupList` | 5 | none |
| `scguser_scgUserGroupPermission` | 6 | none |
| `scguser_scgUserGroupPermissionList` | 5 | none |
| `scguser_scgUserGroupPermissionWithoutDetailItems` | 4 | none |
| `scguser_scgUserGroupResourceGroup` | 3 | none |
| `scguser_scgUserGroupRoleLabelValue` | 2 | none |
| `scguser_scgUserGroupRoleLabelValueList` | 4 | none |
| `scguser_scgUserList` | 5 | none |
| `sci_createSciProfile` | 6 | sciProfile, sciSystemId, sciServerHost, sciServerPort, sciUser, sciPassword |
| `sci_deleteSciProfile` | 1 | id |
| `sci_deleteSciProfileList` | 1 | none |
| `sci_modifyEventCode` | 1 | sciAcceptedEventCodes |
| `sci_modifySciEnabled` | 1 | sciEnabled |
| `sci_modifySciProfile` | 7 | sciProfile, sciSystemId, sciServerHost, sciServerPort, sciUser, sciPassword |
| `sci_sciEventCode` | 4 | none |
| `sci_sciProfile` | 8 | none |
| `sci_sciProfileList` | 2 | none |
| `service_ActiveDirectoryService` | 22 | none |
| `service_ActiveDirectoryServiceList` | 5 | none |
| `service_commonAccountingService` | 14 | none |
| `service_commonAccountingServiceList` | 5 | none |
| `service_commonAuthenticationService` | 16 | none |
| `service_commonAuthenticationServiceList` | 5 | none |
| `service_createActiveDirectoryAuthentication` | 15 | name, ip, port, windowsDomainName, tlsEnabled, globalCatalogEnabled |
| `service_createLDAPAuthentication` | 16 | name, tlsEnabled, ip, port, baseDomainName, adminDomainName, password, keyAttribute, searchFilter |
| `service_createRadiusAccounting` | 19 | name, primary |
| `service_createRadiusAuthentication` | 22 | name, primary |
| `service_deleteBulkAccountingService` | 1 | none |
| `service_deleteBulkAuthenticationService` | 1 | none |
| `service_getSecondaryRadiusServer` | 4 | autoFallbackDisable, ip, port, ipFqdn |
| `service_groupAttrIdentityUserRoleMapping` | 3 | groupAttr, userRole |
| `service_LDAPService` | 23 | none |
| `service_LDAPServiceList` | 5 | none |
| `service_modifyActiveDirectoryAuthentication` | 15 | none |
| `service_modifyEntireRadiusAccounting` | 19 | name, type, primary, rateLimiting |
| `service_modifyEntireRadiusAuthentication` | 21 | name, type, primary, rateLimiting |
| `service_modifyGroupAttrIdentityUserRoleMapping` | 2 | groupAttr, userRole |
| `service_modifyLDAPAuthentication` | 16 | none |
| `service_modifyLocalDbAuthentication` | 9 | none |
| `service_modifyRadiusAccounting` | 20 | none |
| `service_modifyRadiusAuthentication` | 22 | none |
| `service_radiusAccountingService` | 27 | none |
| `service_radiusAccountingServiceList` | 5 | none |
| `service_radiusAuthenticationService` | 30 | none |
| `service_radiusAuthenticationServiceList` | 5 | none |
| `service_secondaryRadiusServer` | 5 | autoFallbackDisable, port, sharedSecret, ipFqdn |
| `service_testingConfig` | 2 | none |
| `serviceTicket_loginRequest` | 2 | username, password |
| `serviceTicket_loginResponse` | 2 | none |
| `sessionManagement_ruckusSession` | 7 | none |
| `sessionManagement_ruckusSessions` | 4 | none |
| `signatureBasedProfile_createSignatureBasedProfile` | 4 | name |
| `signatureBasedProfile_signatureBasedProfile` | 4 | name |
| `signatureBasedProfile_signatureBasedRule` | 4 | name |
| `signatureBasedProfile_signatureDetail` | 4 | none |
| `signatureBasedProfile_signatureItem` | 2 | none |
| `signatureBasedProfile_updateSignatureBasedProfile` | 3 | name |
| `socialMediaLoginProfile_socialMediaLoginProfile` | 15 | name, whitelistedDomains |
| `socialMediaLoginProfile_socialMediaLoginProfileList` | 4 | none |
| `socialMediaLoginProfile_socialMediaLoginProfileSummary` | 15 | none |
| `socialMediaLoginProfile_socialMediaLoginProfileWithEditInfo` | 21 | none |
| `socialMediaLoginProfile_whitelistedDomain` | 1 | domain |
| `splitTunnel_createSplitTunnelProfile` | 4 | name, rules, defaultAction |
| `splitTunnel_modifySplitTunnelProfile` | 4 | none |
| `splitTunnel_SplitTunnelIpMaskRule` | 2 | destinationIp, destinationIpMask |
| `splitTunnel_splitTunnelProfile` | 8 | none |
| `splitTunnel_splitTunnelProfileList` | 4 | none |
| `splitTunnel_splitTunnelProfileQuery` | 5 | none |
| `syslog_modifySyslogSettings` | 13 | none |
| `syslog_primaryServer` | 3 | none |
| `syslog_priority` | 6 | none |
| `syslog_secondaryServer` | 4 | none |
| `syslog_syslogServerSetting` | 13 | none |
| `system_apAutoApporvePolicy` | 1 | none |
| `system_apMacOUI` | 2 | none |
| `system_apMacOUIList` | 4 | none |
| `system_apNumberLimitSettingOfDomain` | 4 | none |
| `system_apNumberLimitSettingOfZone` | 6 | none |
| `system_apTunnelData` | 5 | none |
| `system_authenticationKey` | 3 | none |
| `system_cloudOptions` | 2 | none |
| `system_commonAccessCardSettings` | 5 | none |
| `system_controllerList` | 4 | none |
| `system_controlPlaneConfiguration` | 7 | none |
| `system_controlPlaneInterface` | 2 | none |
| `system_controlPlaneInterfaceList` | 1 | none |
| `system_controlPlaneList` | 4 | none |
| `system_cpStaticRoute` | 5 | none |
| `system_cpUserDefinedInterface` | 7 | none |
| `system_createApMacOUI` | 2 | oui |
| `system_dataPlaneConfiguration` | 6 | none |
| `system_dataPlaneList` | 4 | none |
| `system_deleteBulkFtp` | 1 | none |
| `system_dnsServer` | 2 | none |
| `system_friendlyNameLang` | 2 | none |
| `system_friendlyNameLangList` | 4 | none |
| `system_ftp` | 14 | none |
| `system_ftpList` | 5 | none |
| `system_ftpTestResponse` | 4 | none |
| `system_getDataPlaneMeshTunnelSetting` | 1 | none |
| `system_getFtp` | 13 | none |
| `system_getNorthboundInterface` | 2 | none |
| `system_inventoryList` | 4 | none |
| `system_ipv6PrimaryInterface` | 5 | ipMode |
| `system_lwapp2scgConfiguration` | 6 | none |
| `system_managementAPControl` | 5 | none |
| `system_modifyControlPlane` | 7 | none |
| `system_modifyCPStaticRoute` | 1 | none |
| `system_modifyCPUserDefinedInterface` | 1 | none |
| `system_modifyDataPlane` | 6 | none |
| `system_modifyLwapp2scg` | 5 | none |
| `system_modifySnmpAgent` | 3 | snmpNotificationEnabled |
| `system_modifySystemTimeSetting` | 7 | none |
| `system_northboundInterface` | 3 | none |
| `system_ntpServerValidation` | 2 | ntpServer |
| `system_ntpServerValidationMessage` | 1 | none |
| `system_portalLang` | 2 | none |
| `system_portalLangList` | 4 | none |
| `system_portStatistic` | 12 | none |
| `system_primaryInterface` | 8 | ipMode |
| `system_reservedPort` | 7 | none |
| `system_securitySetting` | 5 | none |
| `system_sms` | 8 | none |
| `system_smsList` | 5 | none |
| `system_snmpAgentConfiguration` | 3 | none |
| `system_staticRouteList` | 1 | none |
| `system_systemSettings` | 4 | none |
| `system_systemTimeSetting` | 9 | none |
| `system_updateApMacOUI` | 1 | none |
| `system_updateDpMeshTunnelSetting` | 1 | none |
| `system_userDefinedInterfaceList` | 1 | none |
| `systemIPsec_getResult` | 20 | none |
| `systemIPsec_proposal` | 2 | encAlg, authAlg |
| `systemIPsec_update` | 20 | ipSecEnabled |
| `tool_speedFlex` | 7 | tool, protocol |
| `tool_speedTestC` | 10 | mode, apMac |
| `tool_speedTestCReport` | 3 | none |
| `tool_speedTestCStatus` | 2 | none |
| `tool_testResult` | 7 | none |
| `urlFiltering_createUrlFilteringPolicy` | 14 | name |
| `urlFiltering_deleteBulk` | 1 | none |
| `urlFiltering_modifyUrlFilteringPolicy` | 13 | none |
| `urlFiltering_urlFilteringBlockCategoriesList` | 4 | none |
| `urlFiltering_urlFilteringBlockCategory` | 2 | none |
| `urlFiltering_urlFilteringPolicy` | 22 | none |
| `urlFiltering_urlFilteringPolicyList` | 5 | none |
| `vendorSpecificAttributeProfile_createResult` | 1 | none |
| `vendorSpecificAttributeProfile_deleteBulk` | 1 | none |
| `vendorSpecificAttributeProfile_get` | 6 | none |
| `vendorSpecificAttributeProfile_list` | 4 | none |
| `vendorSpecificAttributeProfile_persist` | 3 | name, attributes |
| `vendorSpecificAttributeProfile_queryCriteriaResult` | 5 | none |
| `vendorSpecificAttributeProfile_vendorSpecificAttribute` | 5 | vendorId, keyId, value, type, supportedRadiusProtocol |
| `vlanNameProfile_vlanNameProfile` | 3 | name, rules |
| `vlanNameProfile_vlanNameProfileList` | 4 | none |
| `vlanNameProfile_vlanNameProfileSummary` | 2 | none |
| `vlanNameProfile_vlanNameProfileWithEditInfo` | 9 | none |
| `vlanNameProfile_vlanNameRule` | 2 | vlanName, vlanId |
| `vlanpooling_createVlanPooling` | 5 | name, pool, algo |
| `vlanpooling_deleteBulkVlanPooling` | 1 | none |
| `vlanpooling_modifyVlanPooling` | 5 | none |
| `vlanpooling_vlanPooling` | 6 | none |
| `vlanpooling_vlanPoolingList` | 5 | none |
| `wifiCalling_createWifiCallingPolicy` | 5 | name, priority, epdgs |
| `wifiCalling_deleteBulk` | 1 | none |
| `wifiCalling_epdg` | 2 | none |
| `wifiCalling_modifyWifiCallingPolicy` | 4 | none |
| `wifiCalling_wifiCallingPolicy` | 13 | none |
| `wifiCalling_wifiCallingPolicyList` | 5 | none |
| `wiredClientQuery_clientQueryList` | 5 | none |
| `wiredClientQuery_createClientQuery` | 28 | none |
| `wlan_createGuestAccessWlan` | 49 | name, ssid, authServiceOrProfile, portalServiceProfile |
| `wlan_createHotspot20OpenWlan` | 47 | name, ssid |
| `wlan_createHotspot20Wlan` | 46 | name, ssid, hotspot20Profile |
| `wlan_createHotspotWlan` | 48 | name, ssid, authServiceOrProfile, portalServiceProfile |
| `wlan_createStandard80211Wlan` | 46 | name, ssid, authServiceOrProfile |
| `wlan_createStandardOpenWlan` | 48 | name, ssid |
| `wlan_createWebAuthWlan` | 48 | name, ssid, authServiceOrProfile, portalServiceProfile |
| `wlan_createWechatWlan` | 47 | name, ssid, portalServiceProfile |
| `wlan_fastInitialLinkSetup` | 4 | encryptionType, dhcpServerIp |
| `wlan_modifyWlan` | 49 | none |
| `wlan_wlanAccounting` | 7 | none |
| `wlan_wlanAdvanced` | 91 | none |
| `wlan_wlanAuthentication` | 9 | none |
| `wlan_wlanConfiguration` | 54 | none |
| `wlan_wlanCoreTunnel` | 3 | type |
| `wlan_wlanDSCPSetting` | 5 | enable, priority |
| `wlan_wlanEncryption` | 12 | method |
| `wlan_wlanList` | 4 | none |
| `wlan_wlanMACAuth` | 2 | none |
| `wlan_wlanRadius` | 10 | none |
| `wlan_wlanSchedule` | 3 | type |
| `wlan_wlanSummary` | 5 | none |
| `wlan_wlanVlan` | 3 | none |
| `wlangroup_createWlanGroup` | 2 | name |
| `wlangroup_modifyWlanGroup` | 2 | none |
| `wlangroup_modifyWlanGroupMember` | 3 | none |
| `wlangroup_wlanGroup` | 11 | name |
| `wlangroup_wlanGroupList` | 4 | none |
| `wlangroup_wlanMember` | 5 | id |
| `wlanQuery_apWlanBssid` | 3 | none |
| `wlanQuery_apWlanBssidQueryList` | 5 | none |
| `wlanQuery_createWlanQuery` | 34 | none |
| `wlanQuery_wlanBssid` | 4 | none |
| `wlanQuery_wlanQueryList` | 5 | none |
| `wlanscheduler_createWlanScheduler` | 9 | name |
| `wlanscheduler_modifyWlanScheduler` | 9 | none |
| `wlanscheduler_wlanSchedule` | 11 | none |
| `wlanscheduler_wlanScheduleList` | 4 | none |
| `zone_apFirmware` | 3 | none |
| `zone_apFirmwareList` | 4 | none |
| `zone_apLogin` | 2 | apLoginName, apLoginPassword |
| `zone_apSnmpOptions` | 5 | none |
| `zone_availableTunnelProfile` | 6 | none |
| `zone_availableTunnelProfileList` | 4 | none |
| `zone_bandBalancing` | 1 | none |
| `zone_bonjourGatewayPolicyConfiguration` | 3 | none |
| `zone_bonjourGatewayPolicyList` | 4 | none |
| `zone_bonjourGatewayPolicySummary` | 5 | none |
| `zone_bonjourPolicyRule` | 5 | bridgeService, fromVlan, toVlan |
| `zone_bonjourPolicyRuleConfiguration` | 6 | none |
| `zone_createBonjourGatewayPolicy` | 3 | name |
| `zone_createDiffServProfile` | 5 | name |
| `zone_createZone` | 69 | name, login |
| `zone_customizedTimeZone` | 5 | abbreviation, gmtOffset, gmtOffsetMinute |
| `zone_daylightSavingTime` | 4 | month, week, day, hour |
| `zone_dhcpSiteConfigList` | 4 | none |
| `zone_diffServConfiguration` | 6 | none |
| `zone_diffServList` | 4 | none |
| `zone_diffServSummary` | 2 | none |
| `zone_downlinkDiffServ` | 2 | none |
| `zone_loadBalancing` | 6 | none |
| `zone_meshConfiguration` | 4 | none |
| `zone_modfiyApFirmware` | 1 | none |
| `zone_modifyBonjourGatewayEnable` | 1 | enabledBonjourGateway |
| `zone_modifyBonjourGatewayPolicy` | 3 | none |
| `zone_modifyDiffServProfile` | 5 | name |
| `zone_modifyZone` | 74 | none |
| `zone_recoverySsidSet` | 2 | none |
| `zone_rogue` | 3 | none |
| `zone_snmpUser` | 10 | userName, readEnabled, writeEnabled, notificationEnabled |
| `zone_softGreRef` | 3 | none |
| `zone_syslog` | 11 | none |
| `zone_timezoneSetting` | 2 | none |
| `zone_unsupportedApModel` | 2 | none |
| `zone_uplinkDiffServ` | 2 | none |
| `zone_zoneConfiguration` | 77 | none |
| `zone_zoneList` | 4 | none |
| `zone_zoneSummary` | 3 | none |
| `zoneApmodel_apModel` | 17 | none |
| `zoneApmodel_lanPortSetting` | 3 | portName, enabled |
| `zoneScheduleUpgrade_createTaskConfig` | 4 | none |
| `zoneScheduleUpgrade_history` | 6 | none |
| `zoneScheduleUpgrade_historyList` | 4 | none |
| `zoneScheduleUpgrade_taskConfig` | 6 | none |
| `zoneScheduleUpgrade_taskList` | 4 | none |
| `zoneScheduleUpgrade_zone` | 2 | none |
| `zoneSwitchGroupBinding_bindingRecord` | 4 | none |
| `zoneSwitchGroupBinding_createRecord` | 3 | none |
| `zoneSwitchGroupBinding_dataList` | 4 | none |