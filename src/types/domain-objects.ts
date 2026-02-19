/**
 * vSZ Domain Object Types
 *
 * These are approximations based on documented API patterns.
 * Definitive shapes come from the vSZ OpenAPI spec at /wsg/apiDoc/openapi.
 *
 * Source: docs/mcp-architecture.md, Section 10
 * Source: docs/api-endpoints-catalog.md (various sections)
 */

export interface Zone {
  id: string;
  name: string;
  description?: string;
  domainId?: string;
  countryCode?: string;
  timezone?: string;
}

export interface AccessPoint {
  /** MAC address in AA:BB:CC:DD:EE:FF format */
  mac: string;
  name?: string;
  zoneId: string;
  apGroupId?: string;
  model: string;
  serial?: string;
  description?: string;
  gpsCoordinates?: GpsCoordinates;
}

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
}

export interface Wlan {
  id: string;
  name: string;
  ssid: string;
  zoneId: string;
  description?: string;
  type: string;
  authType?: string;
  encryptionType?: string;
  vlan?: WlanVlan;
}

export interface WlanVlan {
  accessVlan?: number;
  coreVlan?: number;
}

export interface WlanGroup {
  id: string;
  name: string;
  zoneId: string;
  description?: string;
}

export interface WirelessClient {
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

export interface WiredClient {
  mac: string;
  ipAddress?: string;
  hostname?: string;
  switchPort?: string;
  vlan?: number;
  status: string;
}

export interface Domain {
  id: string;
  name: string;
  parentDomainId?: string;
}

export interface Alarm {
  id: string;
  alarmType: string;
  severity: string;
  acknowledged: boolean;
  timestamp: number;
  message?: string;
}

export interface Event {
  id: string;
  eventType: string;
  severity: string;
  timestamp: number;
  message?: string;
}

export interface ApGroup {
  id: string;
  name: string;
  zoneId: string;
  description?: string;
}

export interface IdentityUser {
  id: string;
  userName: string;
  displayName?: string;
  email?: string;
}

export interface GuestPass {
  id: string;
  guestName?: string;
  wlan?: string;
  key?: string;
  expirationDate?: string;
}

export interface Certificate {
  id: string;
  name: string;
  description?: string;
  certType?: string;
}

export interface DhcpPool {
  id: string;
  name: string;
  zoneId: string;
  description?: string;
}
