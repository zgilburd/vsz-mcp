/**
 * Tests for vsz_auth_services tool.
 */

import { describe, it, expect, vi } from 'vitest';
import type { VszHttpClient } from '../../../src/http/client.js';
import { createVszAuthServicesTool } from '../../../src/tools/vsz-auth-services.js';

function createMockHttpClient() {
  const get = vi.fn();
  const post = vi.fn();
  const put = vi.fn();
  const patch = vi.fn();
  const del = vi.fn();
  return {
    client: { get, post, put, patch, delete: del } as unknown as VszHttpClient,
    get, post, put, patch, del,
  };
}

describe('vsz_auth_services tool', () => {
  it('should have name vsz_auth_services', () => {
    const mock = createMockHttpClient();
    const tool = createVszAuthServicesTool(mock.client);
    expect(tool.name).toBe('vsz_auth_services');
  });

  it('should map list_acct_radius to GET /services/acct/radius', async () => {
    const mock = createMockHttpClient();
    const tool = createVszAuthServicesTool(mock.client);
    mock.get.mockResolvedValue({ list: [] });

    const result = await tool.handler({ action: 'list_acct_radius' });

    expect(mock.get).toHaveBeenCalledWith('/services/acct/radius', undefined);
    expect(result.isError).toBeUndefined();
  });

  it('should map create_acct_radius to POST /services/acct/radius', async () => {
    const mock = createMockHttpClient();
    const tool = createVszAuthServicesTool(mock.client);
    mock.post.mockResolvedValue({ id: 'new-acct' });

    const data = { name: 'RADIUS Acct', ip: '10.0.0.1' };
    const result = await tool.handler({ action: 'create_acct_radius', data });

    expect(mock.post).toHaveBeenCalledWith('/services/acct/radius', data);
    expect(result.isError).toBeUndefined();
  });

  it('should map get_auth_radius to GET /services/auth/radius/{id}', async () => {
    const mock = createMockHttpClient();
    const tool = createVszAuthServicesTool(mock.client);
    mock.get.mockResolvedValue({ id: 'r1', name: 'Corp RADIUS' });

    await tool.handler({ action: 'get_auth_radius', id: 'r1' });

    expect(mock.get).toHaveBeenCalledWith('/services/auth/radius/r1', undefined);
  });

  it('should map create_auth_ldap to POST /services/auth/ldap', async () => {
    const mock = createMockHttpClient();
    const tool = createVszAuthServicesTool(mock.client);
    mock.post.mockResolvedValue({ id: 'new-ldap' });

    const data = { name: 'LDAP Auth', server: 'ldap.example.com' };
    await tool.handler({ action: 'create_auth_ldap', data });

    expect(mock.post).toHaveBeenCalledWith('/services/auth/ldap', data);
  });

  it('should map test_aaa to POST /system/aaa/test', async () => {
    const mock = createMockHttpClient();
    const tool = createVszAuthServicesTool(mock.client);
    mock.post.mockResolvedValue({ success: true });

    const data = { type: 'RADIUS', ip: '10.0.0.1' };
    await tool.handler({ action: 'test_aaa', data });

    expect(mock.post).toHaveBeenCalledWith('/system/aaa/test', data);
  });

  it('should map list_vsa_profiles to GET /rkszones/{parentId}/vendorSpecificAttributeProfiles', async () => {
    const mock = createMockHttpClient();
    const tool = createVszAuthServicesTool(mock.client);
    mock.get.mockResolvedValue({ list: [] });

    await tool.handler({ action: 'list_vsa_profiles', parentId: 'zone1' });

    expect(mock.get).toHaveBeenCalledWith(
      '/rkszones/zone1/vendorSpecificAttributeProfiles',
      undefined,
    );
  });

  it('should map list_web_auth to GET /rkszones/{parentId}/portals/webauth', async () => {
    const mock = createMockHttpClient();
    const tool = createVszAuthServicesTool(mock.client);
    mock.get.mockResolvedValue({ list: [] });

    await tool.handler({ action: 'list_web_auth', parentId: 'zone1' });

    expect(mock.get).toHaveBeenCalledWith('/rkszones/zone1/portals/webauth', undefined);
  });

  it('should return error for unknown action', async () => {
    const mock = createMockHttpClient();
    const tool = createVszAuthServicesTool(mock.client);

    const result = await tool.handler({ action: 'nonexistent' });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Unknown action');
  });
});
