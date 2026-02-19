/**
 * vsz_network Tool
 *
 * Network infrastructure: DHCP, DNS, tunnels, VLANs, bridges,
 * data planes, IPsec, DiffServ, and network segmentation profiles.
 *
 * Source: docs/openapi-parsed-endpoints.md (29 tags, 201 endpoints)
 */

import type { VszHttpClient } from '../http/client.js';
import type { ToolDefinition, ActionDefinition } from './base-tool.js';
import { createDomainTool } from './base-tool.js';

const actions: Record<string, ActionDefinition> = {
  // ── Bond Port Profile ──────────────────────────────────────
  list_bond_port_profiles: { method: 'GET', path: '/rkszones/{parentId}/profile/bondPort', description: 'List Bond Port Profiles. parentId=zoneId.' },
  create_bond_port_profile: { method: 'POST', path: '/rkszones/{parentId}/profile/bondPort', description: 'Create Bond Port Profile. parentId=zoneId.' },
  get_bond_port_profile: { method: 'GET', path: '/rkszones/{parentId}/profile/bondPort/{id}', description: 'Get Bond Port Profile. parentId=zoneId.' },
  update_bond_port_profile: { method: 'PUT', path: '/rkszones/{parentId}/profile/bondPort/{id}', description: 'Update Bond Port Profile. parentId=zoneId.' },
  delete_bond_port_profile: { method: 'DELETE', path: '/rkszones/{parentId}/profile/bondPort/{id}', description: 'Delete Bond Port Profile. parentId=zoneId.' },
  query_bond_port_profiles: { method: 'POST', path: '/rkszones/bondPortProfiles/query', description: 'Query Bond Port Profiles.' },

  // ── Bonjour Fencing Policy ─────────────────────────────────
  list_bonjour_fencing: { method: 'GET', path: '/rkszones/{parentId}/bonjourFencingPolicy', description: 'List Bonjour Fencing Policies. parentId=zoneId.' },
  create_bonjour_fencing: { method: 'POST', path: '/rkszones/{parentId}/bonjourFencingPolicy', description: 'Create Bonjour Fencing Policy. parentId=zoneId.' },
  get_bonjour_fencing: { method: 'GET', path: '/rkszones/{parentId}/bonjourFencingPolicy/{id}', description: 'Get Bonjour Fencing Policy. parentId=zoneId.' },
  update_bonjour_fencing: { method: 'PATCH', path: '/rkszones/{parentId}/bonjourFencingPolicy/{id}', description: 'Update Bonjour Fencing Policy. parentId=zoneId.' },
  delete_bonjour_fencing: { method: 'DELETE', path: '/rkszones/bonjourFencingPolicy/{id}', description: 'Delete Bonjour Fencing Policy.' },
  query_bonjour_fencing: { method: 'POST', path: '/query/services/bonjourFencingPolicy', description: 'Query Bonjour Fencing Policies.' },

  // ── Bonjour Gateway Policies ───────────────────────────────
  list_bonjour_gateway: { method: 'GET', path: '/rkszones/{parentId}/bonjourGateway/policies', description: 'List Bonjour Gateway policies. parentId=zoneId.' },
  create_bonjour_gateway: { method: 'POST', path: '/rkszones/{parentId}/bonjourGateway/policies', description: 'Create Bonjour Gateway policy. parentId=zoneId.' },
  get_bonjour_gateway: { method: 'GET', path: '/rkszones/{parentId}/bonjourGateway/policies/{id}', description: 'Get Bonjour Gateway policy. parentId=zoneId.' },
  update_bonjour_gateway: { method: 'PATCH', path: '/rkszones/{parentId}/bonjourGateway/policies/{id}', description: 'Update Bonjour Gateway policy. parentId=zoneId.' },
  delete_bonjour_gateway: { method: 'DELETE', path: '/rkszones/{parentId}/bonjourGateway/policies/{id}', description: 'Delete Bonjour Gateway policy. parentId=zoneId.' },
  enable_bonjour_gateway: { method: 'POST', path: '/rkszones/{parentId}/bonjourGateway/enable', description: 'Enable/disable Bonjour Gateway. parentId=zoneId.' },
  query_bonjour_gateway: { method: 'POST', path: '/query/services/bonjourPolicy', description: 'Query Bonjour Gateway policies.' },

  // ── Bridge ─────────────────────────────────────────────────
  list_bridges: { method: 'GET', path: '/profiles/bridge', description: 'List Bridge profiles.' },
  get_bridge: { method: 'GET', path: '/profiles/bridge/{id}', description: 'Get a Bridge profile.' },
  query_bridges: { method: 'POST', path: '/profiles/bridge/query', description: 'Query Bridge profiles.' },

  // ── Control Planes ─────────────────────────────────────────
  list_control_planes: { method: 'GET', path: '/enterprise/controlPlanes', description: 'List control planes.' },
  get_control_plane: { method: 'GET', path: '/enterprise/controlPlanes/{id}', description: 'Get control plane. id=bladeUUID.' },
  update_control_plane: { method: 'PATCH', path: '/enterprise/controlPlanes/{id}', description: 'Update control plane. id=bladeUUID.' },
  list_control_plane_interfaces: { method: 'GET', path: '/controlPlanes/interfaces', description: 'List control plane interfaces.' },
  get_cp_static_routes: { method: 'GET', path: '/controlPlanes/{id}/staticRoutes', description: 'Get control plane static routes. id=bladeUUID.' },
  update_cp_static_routes: { method: 'PATCH', path: '/controlPlanes/{id}/staticRoutes', description: 'Update control plane static routes. id=bladeUUID.' },
  delete_cp_static_routes: { method: 'DELETE', path: '/controlPlanes/{id}/staticRoutes', description: 'Delete control plane static routes. id=bladeUUID.' },
  get_cp_user_interface: { method: 'GET', path: '/controlPlanes/{id}/userDefinedInterface', description: 'Get control plane user-defined interface. id=bladeUUID.' },
  update_cp_user_interface: { method: 'PATCH', path: '/controlPlanes/{id}/userDefinedInterface', description: 'Update control plane user-defined interface. id=bladeUUID.' },
  delete_cp_user_interface: { method: 'DELETE', path: '/controlPlanes/{id}/userDefinedInterface', description: 'Delete control plane user-defined interface. id=bladeUUID.' },

  // ── Data Plane Operational ─────────────────────────────────
  switchover_dp_cluster: { method: 'POST', path: '/dps/switchoverCluster', description: 'Switchover DP to another cluster.' },

  // ── DHCP ───────────────────────────────────────────────────
  list_dhcp_pools: { method: 'GET', path: '/rkszones/{parentId}/dhcpSite/dhcpProfile', description: 'List DHCP pools. parentId=zoneId.' },
  create_dhcp_pool: { method: 'POST', path: '/rkszones/{parentId}/dhcpSite/dhcpProfile', description: 'Create DHCP pool. parentId=zoneId.' },
  get_dhcp_pool: { method: 'GET', path: '/rkszones/{parentId}/dhcpSite/dhcpProfile/{id}', description: 'Get DHCP pool. parentId=zoneId.' },
  update_dhcp_pool: { method: 'PATCH', path: '/rkszones/{parentId}/dhcpSite/dhcpProfile/{id}', description: 'Update DHCP pool. parentId=zoneId.' },
  delete_dhcp_pool: { method: 'DELETE', path: '/rkszones/{parentId}/dhcpSite/dhcpProfile/{id}', description: 'Delete DHCP pool. parentId=zoneId.' },
  get_dhcp_site_config: { method: 'GET', path: '/rkszones/{parentId}/dhcpSite/dhcpSiteConfig', description: 'Get DHCP site config. parentId=zoneId.' },
  dhcp_assign_ip: { method: 'POST', path: '/rkszones/{parentId}/dhcpSite/dhcpSiteConfig/doAssignIp', description: 'Get DHCP/NAT IP assignment. parentId=zoneId.' },
  query_dhcp_profiles: { method: 'POST', path: '/query/services/dhcpProfile', description: 'Query DHCP profiles.' },
  query_dhcp_site_configs: { method: 'POST', path: '/rkszones/services/dhcpSiteConfig/query', description: 'Query DHCP site configs.' },
  get_dhcp_msg_stats: { method: 'GET', path: '/dhcpData/dhcpMsgStats/{id}', description: 'Get AP DHCP message stats. id=apMac.' },
  get_dhcp_pool_usage: { method: 'GET', path: '/dhcpData/dhcpPools/{id}', description: 'Get AP DHCP pools usage. id=apMac.' },

  // ── DiffServ ───────────────────────────────────────────────
  list_diffserv: { method: 'GET', path: '/rkszones/{parentId}/diffserv', description: 'List DiffServ profiles. parentId=zoneId.' },
  create_diffserv: { method: 'POST', path: '/rkszones/{parentId}/diffserv', description: 'Create DiffServ profile. parentId=zoneId.' },
  get_diffserv: { method: 'GET', path: '/rkszones/{parentId}/diffserv/{id}', description: 'Get DiffServ profile. parentId=zoneId.' },
  update_diffserv: { method: 'PATCH', path: '/rkszones/{parentId}/diffserv/{id}', description: 'Update DiffServ profile. parentId=zoneId.' },
  delete_diffserv: { method: 'DELETE', path: '/rkszones/{parentId}/diffserv/{id}', description: 'Delete DiffServ profile. parentId=zoneId.' },
  query_diffserv: { method: 'POST', path: '/query/services/dscpProfile', description: 'Query DiffServ (DSCP) profiles.' },

  // ── DNS Server Management ──────────────────────────────────
  list_dns_servers: { method: 'GET', path: '/profiles/dnsserver', description: 'List DNS server profiles.' },
  create_dns_server: { method: 'POST', path: '/profiles/dnsserver', description: 'Create DNS server profile.' },
  get_dns_server: { method: 'GET', path: '/profiles/dnsserver/{id}', description: 'Get DNS server profile.' },
  update_dns_server: { method: 'PATCH', path: '/profiles/dnsserver/{id}', description: 'Update DNS server profile.' },
  delete_dns_server: { method: 'DELETE', path: '/profiles/dnsserver/{id}', description: 'Delete DNS server profile.' },
  clone_dns_server: { method: 'POST', path: '/profiles/dnsserver/clone/{id}', description: 'Clone DNS server profile.', hasBody: false },
  query_dns_servers: { method: 'POST', path: '/profiles/dnsserver/query', description: 'Query DNS server profiles.' },

  // ── DNS Spoofing Profile ───────────────────────────────────
  list_dns_spoofing: { method: 'GET', path: '/rkszones/{parentId}/dnsSpoofingProfiles', description: 'List DNS Spoofing profiles. parentId=zoneId.' },
  create_dns_spoofing: { method: 'POST', path: '/rkszones/{parentId}/dnsSpoofingProfiles', description: 'Create DNS Spoofing profile. parentId=zoneId.' },
  get_dns_spoofing: { method: 'GET', path: '/rkszones/{parentId}/dnsSpoofingProfiles/{id}', description: 'Get DNS Spoofing profile. parentId=zoneId.' },
  update_dns_spoofing: { method: 'PUT', path: '/rkszones/{parentId}/dnsSpoofingProfiles/{id}', description: 'Update DNS Spoofing profile. parentId=zoneId.' },
  delete_dns_spoofing: { method: 'DELETE', path: '/rkszones/{parentId}/dnsSpoofingProfiles/{id}', description: 'Delete DNS Spoofing profile. parentId=zoneId.' },

  // ── DP DHCP & NAT Profile ─────────────────────────────────
  list_dp_dhcp_nat: { method: 'GET', path: '/dpProfileSettings', description: 'List DP DHCP & NAT profile settings.' },
  create_dp_dhcp_nat: { method: 'POST', path: '/dpProfileSettings', description: 'Create DP DHCP & NAT profile setting.' },
  get_dp_dhcp_nat: { method: 'GET', path: '/dpProfileSettings/{id}', description: 'Get DP DHCP & NAT profile setting. id=dpKey.' },
  update_dp_dhcp_nat: { method: 'PUT', path: '/dpProfileSettings/{id}', description: 'Update DP DHCP & NAT profile setting. id=dpKey.' },
  delete_dp_dhcp_nat: { method: 'DELETE', path: '/dpProfileSettings/{id}', description: 'Delete DP DHCP & NAT profile setting. id=dpKey.' },

  // ── DP DHCP Profile ────────────────────────────────────────
  list_dp_dhcp: { method: 'GET', path: '/dpDhcpProfiles', description: 'List DP DHCP profiles.' },
  create_dp_dhcp: { method: 'POST', path: '/dpDhcpProfiles', description: 'Create DP DHCP profile.' },
  get_dp_dhcp: { method: 'GET', path: '/dpDhcpProfiles/{id}', description: 'Get DP DHCP profile.' },
  update_dp_dhcp: { method: 'PUT', path: '/dpDhcpProfiles/{id}', description: 'Update DP DHCP profile.' },
  delete_dp_dhcp: { method: 'DELETE', path: '/dpDhcpProfiles/{id}', description: 'Delete DP DHCP profile.' },
  list_dp_dhcp_pools: { method: 'GET', path: '/dpDhcpProfiles/{parentId}/dpDhcpProfilePools', description: 'List DP DHCP pools. parentId=profileId.' },
  create_dp_dhcp_pool: { method: 'POST', path: '/dpDhcpProfiles/{parentId}/dpDhcpProfilePools', description: 'Create DP DHCP pool. parentId=profileId.' },
  get_dp_dhcp_pool: { method: 'GET', path: '/dpDhcpProfiles/{parentId}/dpDhcpProfilePools/{id}', description: 'Get DP DHCP pool. parentId=profileId, id=poolId.' },
  update_dp_dhcp_pool: { method: 'PUT', path: '/dpDhcpProfiles/{parentId}/dpDhcpProfilePools/{id}', description: 'Update DP DHCP pool. parentId=profileId, id=poolId.' },
  delete_dp_dhcp_pool: { method: 'DELETE', path: '/dpDhcpProfiles/{parentId}/dpDhcpProfilePools/{id}', description: 'Delete DP DHCP pool. parentId=profileId, id=poolId.' },
  list_dp_dhcp_hosts: { method: 'GET', path: '/dpDhcpProfiles/{parentId}/dpDhcpProfileHosts', description: 'List DP DHCP hosts. parentId=profileId.' },
  create_dp_dhcp_host: { method: 'POST', path: '/dpDhcpProfiles/{parentId}/dpDhcpProfileHosts', description: 'Create DP DHCP host. parentId=profileId.' },
  get_dp_dhcp_host: { method: 'GET', path: '/dpDhcpProfiles/{parentId}/dpDhcpProfileHosts/{id}', description: 'Get DP DHCP host. parentId=profileId, id=hostId.' },
  update_dp_dhcp_host: { method: 'PUT', path: '/dpDhcpProfiles/{parentId}/dpDhcpProfileHosts/{id}', description: 'Update DP DHCP host. parentId=profileId, id=hostId.' },
  delete_dp_dhcp_host: { method: 'DELETE', path: '/dpDhcpProfiles/{parentId}/dpDhcpProfileHosts/{id}', description: 'Delete DP DHCP host. parentId=profileId, id=hostId.' },
  list_dp_dhcp_option_spaces: { method: 'GET', path: '/dpDhcpProfiles/{parentId}/dpDhcpProfileOptionSpaces', description: 'List DP DHCP option43 spaces. parentId=profileId.' },
  create_dp_dhcp_option_space: { method: 'POST', path: '/dpDhcpProfiles/{parentId}/dpDhcpProfileOptionSpaces', description: 'Create DP DHCP option43 space. parentId=profileId.' },
  get_dp_dhcp_option_space: { method: 'GET', path: '/dpDhcpProfiles/{parentId}/dpDhcpProfileOptionSpaces/{id}', description: 'Get DP DHCP option43 space. parentId=profileId, id=spaceId.' },
  update_dp_dhcp_option_space: { method: 'PUT', path: '/dpDhcpProfiles/{parentId}/dpDhcpProfileOptionSpaces/{id}', description: 'Update DP DHCP option43 space. parentId=profileId, id=spaceId.' },
  delete_dp_dhcp_option_space: { method: 'DELETE', path: '/dpDhcpProfiles/{parentId}/dpDhcpProfileOptionSpaces/{id}', description: 'Delete DP DHCP option43 space. parentId=profileId, id=spaceId.' },

  // ── DP Group ───────────────────────────────────────────────
  list_dp_groups: { method: 'GET', path: '/profiles/dpGroup', description: 'List DP Groups.' },
  create_dp_group: { method: 'POST', path: '/profiles/dpGroup', description: 'Create DP Group.' },
  get_dp_group: { method: 'GET', path: '/profiles/dpGroup/{id}', description: 'Get DP Group.' },
  update_dp_group: { method: 'PATCH', path: '/profiles/dpGroup/{id}', description: 'Update DP Group.' },
  delete_dp_group: { method: 'DELETE', path: '/profiles/dpGroup/{id}', description: 'Delete DP Group.' },

  // ── DP NAT Profile ────────────────────────────────────────
  list_dp_nat: { method: 'GET', path: '/dpNatProfiles', description: 'List DP NAT profiles.' },
  create_dp_nat: { method: 'POST', path: '/dpNatProfiles', description: 'Create DP NAT profile.' },
  get_dp_nat: { method: 'GET', path: '/dpNatProfiles/{id}', description: 'Get DP NAT profile.' },
  update_dp_nat: { method: 'PUT', path: '/dpNatProfiles/{id}', description: 'Update DP NAT profile.' },
  delete_dp_nat: { method: 'DELETE', path: '/dpNatProfiles/{id}', description: 'Delete DP NAT profile.' },
  list_dp_nat_pools: { method: 'GET', path: '/dpNatProfiles/{parentId}/dpNatPools', description: 'List DP NAT pools. parentId=profileId.' },
  create_dp_nat_pool: { method: 'POST', path: '/dpNatProfiles/{parentId}/dpNatPools', description: 'Create DP NAT pool. parentId=profileId.' },
  get_dp_nat_pool: { method: 'GET', path: '/dpNatProfiles/{parentId}/dpNatPools/{id}', description: 'Get DP NAT pool. parentId=profileId, id=poolId.' },
  update_dp_nat_pool: { method: 'PUT', path: '/dpNatProfiles/{parentId}/dpNatPools/{id}', description: 'Update DP NAT pool. parentId=profileId, id=poolId.' },
  delete_dp_nat_pool: { method: 'DELETE', path: '/dpNatProfiles/{parentId}/dpNatPools/{id}', description: 'Delete DP NAT pool. parentId=profileId, id=poolId.' },

  // ── DP Network (Data Planes) ──────────────────────────────
  list_data_planes: { method: 'GET', path: '/planes', description: 'List data planes.' },
  get_data_plane: { method: 'GET', path: '/planes/{id}', description: 'Get data plane. id=bladeUUID.' },
  update_data_plane: { method: 'PATCH', path: '/planes/{id}', description: 'Update data plane. id=bladeUUID.' },
  delete_dp_static_route: { method: 'DELETE', path: '/planes/{id}/staticRoute', description: 'Delete data plane static route. id=bladeUUID.' },
  get_dp_tunnel_setting: { method: 'GET', path: '/planes/dpTunnel/setting', description: 'Get DP mesh tunnel setting.' },
  update_dp_tunnel_setting: { method: 'PUT', path: '/planes/dpTunnel/setting', description: 'Update DP mesh tunnel setting.' },

  // ── Ethernet Port Profile ─────────────────────────────────
  list_ethernet_port_profiles: { method: 'GET', path: '/rkszones/{parentId}/profile/ethernetPort', description: 'List Ethernet Port Profiles. parentId=zoneId.' },
  create_ethernet_port_profile: { method: 'POST', path: '/rkszones/{parentId}/profile/ethernetPort', description: 'Create Ethernet Port Profile. parentId=zoneId.' },
  get_ethernet_port_profile: { method: 'GET', path: '/rkszones/{parentId}/profile/ethernetPort/{id}', description: 'Get Ethernet Port Profile. parentId=zoneId.' },
  update_ethernet_port_profile: { method: 'PUT', path: '/rkszones/{parentId}/profile/ethernetPort/{id}', description: 'Update Ethernet Port Profile. parentId=zoneId.' },
  delete_ethernet_port_profile: { method: 'DELETE', path: '/rkszones/{parentId}/profile/ethernetPort/{id}', description: 'Delete Ethernet Port Profile. parentId=zoneId.' },
  query_ethernet_port_profiles: { method: 'POST', path: '/query/services/ethernetPortProfile', description: 'Query Ethernet Port Profiles.' },

  // ── Flexi-VPN ──────────────────────────────────────────────
  query_flexi_vpn: { method: 'POST', path: '/query/services/flexiVpnProfile', description: 'Query Flexi-VPN profiles.' },
  delete_flexi_vpn: { method: 'DELETE', path: '/rkszones/{parentId}/wlans/{id}/flexiVpnProfile', description: 'Delete Flexi-VPN on WLAN. parentId=zoneId, id=wlanId.' },

  // ── IPSEC Profile ──────────────────────────────────────────
  list_ipsec_profiles: { method: 'GET', path: '/profiles/tunnel/ipsec', description: 'List IPsec tunnel profiles.' },
  create_ipsec_profile: { method: 'POST', path: '/profiles/tunnel/ipsec', description: 'Create IPsec tunnel profile.' },
  get_ipsec_profile: { method: 'GET', path: '/profiles/tunnel/ipsec/{id}', description: 'Get IPsec tunnel profile.' },
  update_ipsec_profile: { method: 'PATCH', path: '/profiles/tunnel/ipsec/{id}', description: 'Update IPsec tunnel profile.' },
  delete_ipsec_profile: { method: 'DELETE', path: '/profiles/tunnel/ipsec/{id}', description: 'Delete IPsec tunnel profile.' },
  query_ipsec_profiles: { method: 'POST', path: '/profiles/tunnel/ipsec/query', description: 'Query IPsec tunnel profiles.' },

  // ── L3 Roaming ─────────────────────────────────────────────
  get_l3_roaming: { method: 'GET', path: '/profiles/tunnel/l3Roaming', description: 'Get L3 Roaming configuration.' },
  update_l3_roaming: { method: 'PATCH', path: '/profiles/tunnel/l3Roaming', description: 'Update L3 Roaming configuration.' },

  // ── Multicast Forwarding ───────────────────────────────────
  get_multicast_forwarding: { method: 'GET', path: '/planes/multicastForwarding/setting', description: 'Get Multicast Forwarding setting.' },
  update_multicast_forwarding: { method: 'PATCH', path: '/planes/multicastForwarding/setting', description: 'Update Multicast Forwarding setting.' },

  // ── Network Segmentation Profile ───────────────────────────
  create_network_segment: { method: 'POST', path: '/networkSegmentation', description: 'Create network segmentation profile.' },
  get_network_segment: { method: 'GET', path: '/networkSegmentation/{id}', description: 'Get network segmentation profile.' },
  update_network_segment: { method: 'PUT', path: '/networkSegmentation/{id}', description: 'Update network segmentation profile.' },
  delete_network_segment: { method: 'DELETE', path: '/networkSegmentation/{id}', description: 'Delete network segmentation profile.' },
  query_network_segments: { method: 'POST', path: '/networkSegmentation/query', description: 'Query network segmentation profiles.' },
  list_netseg_eth_ports: { method: 'GET', path: '/networkSegmentation/ethernetPortProfile', description: 'List network segmentation ethernet port profiles.' },
  create_netseg_eth_port: { method: 'POST', path: '/networkSegmentation/ethernetPortProfile', description: 'Create network segmentation ethernet port profile.' },
  get_netseg_eth_port: { method: 'GET', path: '/networkSegmentation/ethernetPortProfile/{id}', description: 'Get network segmentation ethernet port profile.' },
  update_netseg_eth_port: { method: 'PUT', path: '/networkSegmentation/ethernetPortProfile/{id}', description: 'Update network segmentation ethernet port profile.' },
  delete_netseg_eth_port: { method: 'DELETE', path: '/networkSegmentation/ethernetPortProfile/{id}', description: 'Delete network segmentation ethernet port profile.' },

  // ── Precedence Profile ─────────────────────────────────────
  list_precedence: { method: 'GET', path: '/precedence', description: 'List Precedence Profiles.' },
  create_precedence: { method: 'POST', path: '/precedence', description: 'Create Precedence Profile.' },
  get_precedence: { method: 'GET', path: '/precedence/{id}', description: 'Get Precedence Profile.' },
  update_precedence: { method: 'PATCH', path: '/precedence/{id}', description: 'Update Precedence Profile.' },
  delete_precedence: { method: 'DELETE', path: '/precedence/{id}', description: 'Delete Precedence Profile.' },
  query_precedence: { method: 'POST', path: '/precedence/query', description: 'Query Precedence Profiles.' },

  // ── RuckusGRE Tunnel Profile ───────────────────────────────
  list_ruckusgre: { method: 'GET', path: '/profiles/tunnel/ruckusgre', description: 'List RuckusGRE tunnel profiles.' },
  create_ruckusgre: { method: 'POST', path: '/profiles/tunnel/ruckusgre', description: 'Create RuckusGRE tunnel profile.' },
  get_ruckusgre: { method: 'GET', path: '/profiles/tunnel/ruckusgre/{id}', description: 'Get RuckusGRE tunnel profile.' },
  update_ruckusgre: { method: 'PATCH', path: '/profiles/tunnel/ruckusgre/{id}', description: 'Update RuckusGRE tunnel profile.' },
  delete_ruckusgre: { method: 'DELETE', path: '/profiles/tunnel/ruckusgre/{id}', description: 'Delete RuckusGRE tunnel profile.' },
  query_ruckusgre: { method: 'POST', path: '/profiles/tunnel/ruckusgre/query', description: 'Query RuckusGRE tunnel profiles.' },

  // ── SoftGRE Tunnel Profile ─────────────────────────────────
  list_softgre: { method: 'GET', path: '/profiles/tunnel/softgre', description: 'List SoftGRE tunnel profiles.' },
  create_softgre: { method: 'POST', path: '/profiles/tunnel/softgre', description: 'Create SoftGRE tunnel profile.' },
  get_softgre: { method: 'GET', path: '/profiles/tunnel/softgre/{id}', description: 'Get SoftGRE tunnel profile.' },
  update_softgre: { method: 'PATCH', path: '/profiles/tunnel/softgre/{id}', description: 'Update SoftGRE tunnel profile.' },
  delete_softgre: { method: 'DELETE', path: '/profiles/tunnel/softgre/{id}', description: 'Delete SoftGRE tunnel profile.' },
  query_softgre: { method: 'POST', path: '/profiles/tunnel/softgre/query', description: 'Query SoftGRE tunnel profiles.' },

  // ── Split Tunnel Profile ───────────────────────────────────
  list_split_tunnel: { method: 'GET', path: '/rkszones/{parentId}/splitTunnelProfiles', description: 'List Split Tunnel profiles. parentId=zoneId.' },
  create_split_tunnel: { method: 'POST', path: '/rkszones/{parentId}/splitTunnelProfiles', description: 'Create Split Tunnel profile. parentId=zoneId.' },
  get_split_tunnel: { method: 'GET', path: '/rkszones/{parentId}/splitTunnelProfiles/{id}', description: 'Get Split Tunnel profile. parentId=zoneId.' },
  update_split_tunnel: { method: 'PATCH', path: '/rkszones/{parentId}/splitTunnelProfiles/{id}', description: 'Update Split Tunnel profile. parentId=zoneId.' },
  delete_split_tunnel: { method: 'DELETE', path: '/rkszones/{parentId}/splitTunnelProfiles/{id}', description: 'Delete Split Tunnel profile. parentId=zoneId.' },
  query_split_tunnel: { method: 'POST', path: '/rkszones/splitTunnelProfiles/query', description: 'Query Split Tunnel profiles.' },

  // ── System IPsec ───────────────────────────────────────────
  get_system_ipsec: { method: 'GET', path: '/systemIpsec', description: 'Get System IPsec settings.' },
  update_system_ipsec: { method: 'PUT', path: '/systemIpsec', description: 'Update System IPsec settings.' },

  // ── VDP Profile ────────────────────────────────────────────
  list_vdp: { method: 'GET', path: '/profiles/vdp', description: 'List VDP profiles.' },
  get_vdp: { method: 'GET', path: '/profiles/vdp/{id}', description: 'Get VDP profile.' },
  delete_vdp: { method: 'DELETE', path: '/profiles/vdp/{id}', description: 'Delete VDP profile.' },
  approve_vdp: { method: 'PUT', path: '/profiles/vdp/{id}/approve', description: 'Approve VDP profile.' },

  // ── VLAN Name Profile ──────────────────────────────────────
  list_vlan_names: { method: 'GET', path: '/rkszones/{parentId}/vlanNameProfiles', description: 'List VLAN Name profiles. parentId=zoneId.' },
  create_vlan_name: { method: 'POST', path: '/rkszones/{parentId}/vlanNameProfiles', description: 'Create VLAN Name profile. parentId=zoneId.' },
  get_vlan_name: { method: 'GET', path: '/rkszones/{parentId}/vlanNameProfiles/{id}', description: 'Get VLAN Name profile. parentId=zoneId.' },
  update_vlan_name: { method: 'PUT', path: '/rkszones/{parentId}/vlanNameProfiles/{id}', description: 'Update VLAN Name profile. parentId=zoneId.' },
  delete_vlan_name: { method: 'DELETE', path: '/rkszones/{parentId}/vlanNameProfiles/{id}', description: 'Delete VLAN Name profile. parentId=zoneId.' },

  // ── VLAN Pooling ───────────────────────────────────────────
  create_vlan_pool: { method: 'POST', path: '/vlanpoolings', description: 'Create VLAN pooling.' },
  get_vlan_pool: { method: 'GET', path: '/vlanpoolings/{id}', description: 'Get VLAN pooling.' },
  update_vlan_pool: { method: 'PATCH', path: '/vlanpoolings/{id}', description: 'Update VLAN pooling.' },
  delete_vlan_pool: { method: 'DELETE', path: '/vlanpoolings/{id}', description: 'Delete VLAN pooling.' },
  query_vlan_pools: { method: 'POST', path: '/vlanpoolings/query', description: 'Query VLAN poolings.' },
  query_vlan_pools_filter: { method: 'POST', path: '/query/services/vlanPooling', description: 'Query VLAN pooling profiles with filters.' },
};

export function createVszNetworkTool(httpClient: VszHttpClient): ToolDefinition {
  return createDomainTool(
    {
      name: 'vsz_network',
      description:
        'Ruckus vSZ network infrastructure. Manage DHCP, DNS, tunnels, ' +
        'VLANs, bridges, data planes, IPsec, DiffServ, and network ' +
        'segmentation profiles.',
      actions,
    },
    httpClient,
  );
}
