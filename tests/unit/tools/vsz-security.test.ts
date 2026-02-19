/**
 * Tests for vsz_security tool actions.
 */

import { describe, it, expect, vi } from 'vitest';

function createMockHttpClient() {
  const get = vi.fn();
  const post = vi.fn();
  const put = vi.fn();
  const patch = vi.fn();
  const del = vi.fn();
  return {
    client: { get, post, put, patch, delete: del } as any,
    get, post, put, patch, del,
  };
}

describe('vsz_security tool', () => {
  it('should have name vsz_security', async () => {
    const { createVszSecurityTool } = await import('../../../src/tools/vsz-security.js');
    const mock = createMockHttpClient();
    const tool = createVszSecurityTool(mock.client);
    expect(tool.name).toBe('vsz_security');
  });

  it('should have action enum in input schema', async () => {
    const { createVszSecurityTool } = await import('../../../src/tools/vsz-security.js');
    const mock = createMockHttpClient();
    const tool = createVszSecurityTool(mock.client);
    const schema = tool.inputSchema as Record<string, any>;
    const props = schema.properties;
    expect(props.action.enum).toContain('list_account_security');
    expect(props.action.enum).toContain('create_firewall');
    expect(props.action.enum).toContain('mark_rogue');
    expect(schema.required).toEqual(['action']);
  });

  // ── Account Security ────────────────────────────────────
  it('should map list_account_security to GET /accountSecurity', async () => {
    const { createVszSecurityTool } = await import('../../../src/tools/vsz-security.js');
    const mock = createMockHttpClient();
    const tool = createVszSecurityTool(mock.client);

    mock.get.mockResolvedValue({ list: [] });
    const result = await tool.handler({ action: 'list_account_security' });

    expect(mock.get).toHaveBeenCalledWith('/accountSecurity', undefined);
    expect(result.isError).toBeUndefined();
  });

  it('should map get_account_security to GET /accountSecurity/{id}', async () => {
    const { createVszSecurityTool } = await import('../../../src/tools/vsz-security.js');
    const mock = createMockHttpClient();
    const tool = createVszSecurityTool(mock.client);

    mock.get.mockResolvedValue({ id: 'as1', name: 'Default' });
    await tool.handler({ action: 'get_account_security', id: 'as1' });

    expect(mock.get).toHaveBeenCalledWith('/accountSecurity/as1', undefined);
  });

  it('should map create_account_security to POST /accountSecurity', async () => {
    const { createVszSecurityTool } = await import('../../../src/tools/vsz-security.js');
    const mock = createMockHttpClient();
    const tool = createVszSecurityTool(mock.client);

    mock.post.mockResolvedValue({ id: 'new-as' });
    const data = { name: 'Strict', lockoutPeriod: 30 };
    await tool.handler({ action: 'create_account_security', data });

    expect(mock.post).toHaveBeenCalledWith('/accountSecurity', data);
  });

  it('should map delete_account_security to DELETE /accountSecurity/{id}', async () => {
    const { createVszSecurityTool } = await import('../../../src/tools/vsz-security.js');
    const mock = createMockHttpClient();
    const tool = createVszSecurityTool(mock.client);

    mock.del.mockResolvedValue(undefined);
    await tool.handler({ action: 'delete_account_security', id: 'as1' });

    expect(mock.del).toHaveBeenCalledWith('/accountSecurity/as1');
  });

  // ── Firewall Profile ────────────────────────────────────
  it('should map list_firewall to GET /firewallProfiles', async () => {
    const { createVszSecurityTool } = await import('../../../src/tools/vsz-security.js');
    const mock = createMockHttpClient();
    const tool = createVszSecurityTool(mock.client);

    mock.get.mockResolvedValue({ list: [] });
    await tool.handler({ action: 'list_firewall' });

    expect(mock.get).toHaveBeenCalledWith('/firewallProfiles', undefined);
  });

  it('should map create_firewall to POST /firewallProfiles', async () => {
    const { createVszSecurityTool } = await import('../../../src/tools/vsz-security.js');
    const mock = createMockHttpClient();
    const tool = createVszSecurityTool(mock.client);

    mock.post.mockResolvedValue({ id: 'fw1' });
    const data = { name: 'Corporate Firewall' };
    await tool.handler({ action: 'create_firewall', data });

    expect(mock.post).toHaveBeenCalledWith('/firewallProfiles', data);
  });

  // ── Mark Rogue ──────────────────────────────────────────
  it('should map mark_rogue to POST /rogue/markRogue', async () => {
    const { createVszSecurityTool } = await import('../../../src/tools/vsz-security.js');
    const mock = createMockHttpClient();
    const tool = createVszSecurityTool(mock.client);

    mock.post.mockResolvedValue({ success: true });
    const data = { macAddress: 'AA:BB:CC:DD:EE:FF' };
    await tool.handler({ action: 'mark_rogue', data });

    expect(mock.post).toHaveBeenCalledWith('/rogue/markRogue', data);
  });

  it('should map list_rogue_known to GET /rogue/markKnown', async () => {
    const { createVszSecurityTool } = await import('../../../src/tools/vsz-security.js');
    const mock = createMockHttpClient();
    const tool = createVszSecurityTool(mock.client);

    mock.get.mockResolvedValue({ list: [] });
    await tool.handler({ action: 'list_rogue_known' });

    expect(mock.get).toHaveBeenCalledWith('/rogue/markKnown', undefined);
  });

  // ── L3 Access Control ──────────────────────────────────
  it('should map get_l3acl to GET /l3AccessControlPolicies/{id}', async () => {
    const { createVszSecurityTool } = await import('../../../src/tools/vsz-security.js');
    const mock = createMockHttpClient();
    const tool = createVszSecurityTool(mock.client);

    mock.get.mockResolvedValue({ id: 'l3-1', name: 'Allow HTTPS' });
    await tool.handler({ action: 'get_l3acl', id: 'l3-1' });

    expect(mock.get).toHaveBeenCalledWith('/l3AccessControlPolicies/l3-1', undefined);
  });

  // ── Geofence (zone-scoped with parentId) ────────────────
  it('should map list_geofence to GET /rkszones/{parentId}/geofenceProfiles', async () => {
    const { createVszSecurityTool } = await import('../../../src/tools/vsz-security.js');
    const mock = createMockHttpClient();
    const tool = createVszSecurityTool(mock.client);

    mock.get.mockResolvedValue({ list: [] });
    await tool.handler({ action: 'list_geofence', parentId: 'zone1' });

    expect(mock.get).toHaveBeenCalledWith('/rkszones/zone1/geofenceProfiles', undefined);
  });

  // ── Signature Based Profile ─────────────────────────────
  it('should map get_sig_profile to GET /signatureBasedProfiles/{id}', async () => {
    const { createVszSecurityTool } = await import('../../../src/tools/vsz-security.js');
    const mock = createMockHttpClient();
    const tool = createVszSecurityTool(mock.client);

    mock.get.mockResolvedValue({ id: 'sig1', name: 'Default Sig' });
    await tool.handler({ action: 'get_sig_profile', id: 'sig1' });

    expect(mock.get).toHaveBeenCalledWith('/signatureBasedProfiles/sig1', undefined);
  });

  // ── Error handling ──────────────────────────────────────
  it('should return error for unknown action', async () => {
    const { createVszSecurityTool } = await import('../../../src/tools/vsz-security.js');
    const mock = createMockHttpClient();
    const tool = createVszSecurityTool(mock.client);

    const result = await tool.handler({ action: 'nonexistent' });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('Unknown action');
  });
});
