/**
 * Parse the downloaded OpenAPI spec into structured data for MCP implementation.
 *
 * Reads: docs/openapi-spec.json
 * Writes: docs/openapi-parsed-endpoints.md (grouped endpoint catalog from real spec)
 *
 * Source: Live controller verification — v13_1, 688 paths, vSZ-E 7.1.1.0.872
 */

import { readFileSync, writeFileSync } from 'node:fs';

interface PathOperation {
  method: string;
  path: string;
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: Array<{ name: string; in: string; required?: boolean; type?: string; description?: string }>;
  responses?: Record<string, { description?: string; schema?: unknown }>;
}

interface DomainGroup {
  name: string;
  tag: string;
  endpoints: PathOperation[];
}

function main() {
  const specRaw = readFileSync('docs/openapi-spec.json', 'utf-8');
  const spec = JSON.parse(specRaw);

  const info = spec.info ?? {};
  const basePath = spec.basePath ?? '';
  const paths: Record<string, Record<string, unknown>> = spec.paths ?? {};
  const definitions = spec.definitions ?? {};

  // Collect all operations with their tags
  const allOps: PathOperation[] = [];
  const tagMap = new Map<string, PathOperation[]>();

  for (const [path, methods] of Object.entries(paths)) {
    for (const [method, opRaw] of Object.entries(methods as Record<string, Record<string, unknown>>)) {
      if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
        const op: PathOperation = {
          method: method.toUpperCase(),
          path,
          operationId: opRaw.operationId as string | undefined,
          summary: opRaw.summary as string | undefined,
          description: opRaw.description as string | undefined,
          tags: opRaw.tags as string[] | undefined,
          parameters: opRaw.parameters as PathOperation['parameters'],
          responses: opRaw.responses as PathOperation['responses'],
        };
        allOps.push(op);

        const tags = op.tags ?? ['Untagged'];
        for (const tag of tags) {
          if (!tagMap.has(tag)) tagMap.set(tag, []);
          tagMap.get(tag)!.push(op);
        }
      }
    }
  }

  // Sort tags alphabetically
  const sortedTags = [...tagMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  // Build the MCP tool mapping
  const toolMapping: Record<string, string[]> = {};
  for (const [tag] of sortedTags) {
    const normalized = tag.toLowerCase();
    let tool = 'vsz_raw_request'; // default fallback

    // Zone & domain management
    if (/zone|rkszones|^domain$/i.test(normalized)) tool = 'vsz_zones';
    // AP management (config, operational, groups, registration, syslog, snmp, packet capture)
    else if (/^ap\b|access.?point|aps|ap.?group|ap.?registration|ap.?snmp|ap.?syslog|ap.?external/i.test(normalized)) tool = 'vsz_ap';
    // WLAN management (wlan, wlan group, scheduler, hotspot20 wlan service, wi-fi calling)
    else if (/wlan(?!.*hotspot)|wi-?fi.?call/i.test(normalized)) tool = 'vsz_wlan';
    // Client management (wireless, wired, block, rogue client, client isolation)
    else if (/client|block.?client|rogue.?client/i.test(normalized)) tool = 'vsz_client';
    // Identity & user management (identity, guest pass, subscription, scg user)
    else if (/identity|guest.?pass|subscription|scg.?user/i.test(normalized)) tool = 'vsz_identity';
    // Auth services (radius, ldap, ad, oauth, accounting, aaa, vendor specific attribute, authentication profile)
    else if (/radius|ldap|active.?dir|oauth|aaa|accounting|authentication|vendor.?specific/i.test(normalized)) tool = 'vsz_auth_services';
    // Hotspot & guest access (hotspot, guest, web auth, wispr, wechat, social media, sms gateway, portal detection)
    else if (/hotspot|guest.?access|web.?auth|wispr|wechat|social.?media|sms.?gateway|portal.?detection/i.test(normalized)) tool = 'vsz_hotspot';
    // Security (acl, l2 access, l3 access, firewall, rogue classification, device policy, avc, signature, allowed device, restricted ap, account security, geofence)
    else if (/acl|l[23].?access|firewall|rogue|device.?policy|calea|avc|application.?visibility|security|signature.?based|allowed.?device|restricted.?ap|geofence/i.test(normalized)) tool = 'vsz_security';
    // Network (dhcp, dns, data plane, control plane, gre, ipsec, vlan, bonjour, bridge, mesh, diffserv, precedence, roaming, ethernet, vpn, split tunnel, bond port, dp group, dp nat, dp dhcp, dp network, multicast, network segmentation, system ipsec, vdp)
    else if (/dhcp|dns|data.?plane|control.?plane|gre|ipsec|vlan|bonjour|bridge|mesh|diffserv|precedence|roaming|ethernet|vpn|split.?tunnel|bond.?port|dp.?group|dp.?nat|dp.?dhcp|dp.?network|multicast|network.?seg|system.?ipsec|vdp/i.test(normalized)) tool = 'vsz_network';
    // System (system, controller, admin, syslog, snmp, ftp, lwapp, sci, nbi, global ref, northbound, app log, gdpr, zdimport)
    else if (/system|controller|admin|syslog|snmp|ftp|lwapp|sci|nbi|global.?ref|northbound|app.*log|gdpr|zdimport/i.test(normalized)) tool = 'vsz_system';
    // Monitoring (event, alarm, health, traffic, monitor, connectivity)
    else if (/event|alarm|health|traffic|monitor|connectivity/i.test(normalized)) tool = 'vsz_monitoring';
    // Backup & cluster (backup, restore, upgrade, cluster)
    else if (/backup|restore|upgrade|cluster/i.test(normalized)) tool = 'vsz_backup';
    // Certificate & DPSK
    else if (/cert|dpsk|dynamic.?psk/i.test(normalized)) tool = 'vsz_certificate';
    // Indoor map & location (indoor, lbs, real time location)
    else if (/indoor|lbs|map|real.?time.?location/i.test(normalized)) tool = 'vsz_indoor_map';
    // Query & filtering (query, url filtering)
    else if (/query|filter/i.test(normalized)) tool = 'vsz_query';
    // Service ticket & session — internal (auth manager handles these)
    else if (/service.?ticket|session.?manage/i.test(normalized)) tool = 'vsz_internal_auth';

    if (!toolMapping[tool]) toolMapping[tool] = [];
    if (!toolMapping[tool].includes(tag)) toolMapping[tool].push(tag);
  }

  // Generate markdown output
  const lines: string[] = [];
  lines.push('# vSZ 7.1.1 OpenAPI Endpoint Catalog (from live controller)');
  lines.push('');
  lines.push('> **Source**: OpenAPI spec downloaded from live vSZ controller 7.1.1.0.872');
  lines.push(`> **API Version**: ${info.version} | **Title**: ${info.title}`);
  lines.push(`> **Base Path**: ${basePath}`);
  lines.push(`> **Total Operations**: ${allOps.length} | **Total Paths**: ${Object.keys(paths).length} | **Tags**: ${sortedTags.length}`);
  lines.push(`> **Definitions/Schemas**: ${Object.keys(definitions).length}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Tool mapping summary
  lines.push('## MCP Tool Mapping Summary');
  lines.push('');
  lines.push('| MCP Tool | Tags Mapped | Endpoint Count |');
  lines.push('|----------|-------------|----------------|');
  for (const [tool, tags] of Object.entries(toolMapping).sort()) {
    const count = tags.reduce((sum, t) => sum + (tagMap.get(t)?.length ?? 0), 0);
    lines.push(`| \`${tool}\` | ${tags.join(', ')} | ${count} |`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Detailed endpoints by tag
  lines.push('## Endpoints by Tag');
  lines.push('');

  for (const [tag, ops] of sortedTags) {
    lines.push(`### ${tag} (${ops.length} endpoints)`);
    lines.push('');
    lines.push('| Method | Path | Summary |');
    lines.push('|--------|------|---------|');

    for (const op of ops.sort((a, b) => a.path.localeCompare(b.path))) {
      const summary = (op.summary ?? op.description ?? '').substring(0, 80).replace(/\|/g, '\\|');
      lines.push(`| ${op.method} | \`${op.path}\` | ${summary} |`);
    }
    lines.push('');
  }

  // Schema summary
  lines.push('---');
  lines.push('');
  lines.push('## Schema Definitions');
  lines.push('');
  lines.push(`Total definitions: ${Object.keys(definitions).length}`);
  lines.push('');
  lines.push('| Schema Name | Properties | Required Fields |');
  lines.push('|-------------|-----------|-----------------|');

  const defEntries = Object.entries(definitions).sort((a, b) => (a[0] as string).localeCompare(b[0] as string));
  for (const [name, defRaw] of defEntries) {
    const def = defRaw as Record<string, unknown>;
    const props = def.properties ? Object.keys(def.properties as object) : [];
    const required = (def.required as string[]) ?? [];
    if (props.length > 0) {
      lines.push(`| \`${name}\` | ${props.length} | ${required.join(', ') || 'none'} |`);
    }
  }

  const output = lines.join('\n');
  writeFileSync('docs/openapi-parsed-endpoints.md', output);
  console.log(`Written to docs/openapi-parsed-endpoints.md`);
  console.log(`Operations: ${allOps.length}, Tags: ${sortedTags.length}, Schemas: ${Object.keys(definitions).length}`);

  // Also output a JSON summary for programmatic use
  const summary = {
    info,
    basePath,
    totalPaths: Object.keys(paths).length,
    totalOperations: allOps.length,
    totalTags: sortedTags.length,
    totalDefinitions: Object.keys(definitions).length,
    toolMapping,
    tags: sortedTags.map(([tag, ops]) => ({ tag, count: ops.length })),
  };
  writeFileSync('docs/openapi-summary.json', JSON.stringify(summary, null, 2));
  console.log('Written docs/openapi-summary.json');
}

main();
