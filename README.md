# vsz-mcp

MCP server for the Ruckus SmartZone (vSZ) wireless controller API.

Gives AI assistants like Claude full read/write access to your Ruckus vSZ controller through the [Model Context Protocol](https://modelcontextprotocol.io). Manage APs, WLANs, zones, clients, certificates, hotspots, and every other vSZ API endpoint — from natural language.

## Features

- **16 domain tools** covering the entire vSZ 7.1.1 public API (~900 actions)
- **Raw request escape hatch** for any endpoint not covered by a dedicated tool
- **Both vSZ editions** supported: vSZ-H (service-ticket auth) and vSZ-E (session auth)
- **Lazy authentication** — no startup delay, auth happens on first request
- **Self-signed TLS** support (common on vSZ controllers)
- **Automatic retry** — re-authenticates on session expiry, retries on cluster unavailability
- **Zero runtime dependencies** beyond the MCP SDK and Zod
- **273 unit tests** with full coverage

## Requirements

- Node.js >= 18
- Ruckus vSZ controller running firmware 7.1.x (API version v13_1)
- An admin account on the controller

## Installation

### From npm

```bash
npm install -g vsz-mcp
```

### From source

```bash
git clone https://github.com/zgilburd/vsz-mcp.git
cd vsz-mcp
npm install
npm run build
```

## Configuration

Add the server to your MCP client configuration. The example below is for Claude Code (`.mcp.json`):

```json
{
  "mcpServers": {
    "vsz-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "vsz-mcp"],
      "env": {
        "VSZ_HOST": "192.168.1.100",
        "VSZ_EDITION": "vsz-h",
        "VSZ_USERNAME": "admin",
        "VSZ_PASSWORD": "your-password"
      }
    }
  }
}
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VSZ_HOST` | Yes | — | Controller hostname or IP |
| `VSZ_EDITION` | Yes | — | `vsz-h` (SmartZone-H) or `vsz-e` (Essentials) |
| `VSZ_USERNAME` | Yes | — | Admin username (also accepts `VSZ_USER`) |
| `VSZ_PASSWORD` | Yes | — | Admin password (also accepts `VSZ_PASS`) |
| `VSZ_PORT` | No | 8443 (H) / 7443 (E) | API port |
| `VSZ_API_VERSION` | No | `v13_1` | API version string |
| `VSZ_TLS_REJECT_UNAUTHORIZED` | No | `true` | Set to `false` for self-signed certs |

## Available Tools

Each tool groups related API endpoints behind an `action` parameter.

| Tool | Actions | Description |
|------|---------|-------------|
| `vsz_system` | 73 | Controller settings, syslog, SNMP, FTP, licensing, NDS, SCI, LWAPP |
| `vsz_zones` | 59 | Zone CRUD, zone profiles (AP admission, bonjourFencing, rogue, etc.) |
| `vsz_ap` | 84 | AP management, operational commands, firmware, mesh, LLDP |
| `vsz_wlan` | 57 | WLAN CRUD, scheduling, DPSK, Bonjour, diffserv profiles |
| `vsz_client` | 29 | Wireless/wired client queries, deauth, isolation whitelist |
| `vsz_network` | 177 | L2/L3 ACLs, device policies, VLANs, forwarding profiles, DPSK |
| `vsz_security` | 118 | Firewall profiles, web auth, L2 security, encryption |
| `vsz_auth_services` | 57 | RADIUS, LDAP, Active Directory, OAuth, proxy AAA, accounting |
| `vsz_hotspot` | 57 | Hotspot 2.0 profiles, portals, walled gardens, venue profiles |
| `vsz_identity` | 56 | Identity user/roles, guest passes, user traffic profiles |
| `vsz_monitoring` | 39 | Alarms, events, traffic profiles, health checks |
| `vsz_backup` | 26 | Backup/restore, auto-export settings, scheduled backups |
| `vsz_certificate` | 34 | TLS certificates, CSRs, trusted CA chains |
| `vsz_indoor_map` | 18 | Indoor maps, LBS profiles, RTLS profiles |
| `vsz_query` | 10 | Cross-domain query engine (APs, clients, WLANs, DPs) |
| `vsz_raw_request` | — | Escape hatch for arbitrary API requests |

### Usage Examples

**List all APs:**
```
Use vsz_ap with action "list_aps"
```

**Get clients on a specific WLAN:**
```
Use vsz_query with action "query_wireless_clients" and data: {"filters": [{"type": "WLAN", "value": "MyWLAN"}]}
```

**Reboot an AP:**
```
Use vsz_ap with action "reboot_ap" and id "<ap-mac>"
```

**Create a WLAN:**
```
Use vsz_wlan with action "create_wlan", parentId "<zone-id>", and data: {"name": "Guest", "ssid": "Guest-WiFi", ...}
```

**Raw API call (escape hatch):**
```
Use vsz_raw_request with method "GET" and path "/domains"
```

## Architecture

```
src/
├── index.ts                 # Entry point — stdio transport
├── server.ts                # MCP server factory
├── auth/
│   ├── auth-manager.ts      # Auth factory (edition-based)
│   ├── service-ticket-auth.ts  # vSZ-H service ticket auth
│   └── session-auth.ts      # vSZ-E session cookie auth
├── http/
│   ├── client.ts            # HTTP client with retry logic
│   └── pagination.ts        # Auto-pagination helpers
├── tools/
│   ├── base-tool.ts         # Domain tool framework
│   ├── tool-registry.ts     # Tool registration
│   ├── vsz-system.ts        # ... 15 domain tools
│   └── vsz-raw-request.ts   # Raw escape hatch
├── resources/               # MCP resource providers
└── types/                   # TypeScript interfaces
```

## Development

```bash
npm install          # Install dependencies
npm run build        # Compile TypeScript
npm test             # Run 273 unit tests
npm run typecheck    # Type-check without emitting
npm run dev          # Run with tsx (hot reload)
```

## Compatibility

| vSZ Version | API Version | Status |
|-------------|-------------|--------|
| 7.1.1 | v13_1 | Tested and verified |
| 7.0.x | v12_x | Should work (untested) |
| 6.x | v11_x | May work with `VSZ_API_VERSION` override |

## License

[MIT](LICENSE)
