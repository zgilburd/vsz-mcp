/**
 * Tests for vsz_identity tool.
 */

import { describe, it, expect, vi } from 'vitest';
import type { VszHttpClient } from '../../../src/http/client.js';

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

describe('vsz_identity tool', () => {
  it('should create a tool with name vsz_identity', async () => {
    const { createVszIdentityTool } = await import('../../../src/tools/vsz-identity.js');
    const mock = createMockHttpClient();
    const tool = createVszIdentityTool(mock.client);

    expect(tool.name).toBe('vsz_identity');
  });

  it('should map list_guest_passes to GET /identity/guestpass', async () => {
    const { createVszIdentityTool } = await import('../../../src/tools/vsz-identity.js');
    const mock = createMockHttpClient();
    const tool = createVszIdentityTool(mock.client);

    mock.get.mockResolvedValue({ list: [], totalCount: 0 });
    await tool.handler({ action: 'list_guest_passes' });

    expect(mock.get).toHaveBeenCalledWith('/identity/guestpass', undefined);
  });

  it('should map generate_guest_pass to POST /identity/guestpass/generate', async () => {
    const { createVszIdentityTool } = await import('../../../src/tools/vsz-identity.js');
    const mock = createMockHttpClient();
    const tool = createVszIdentityTool(mock.client);

    mock.post.mockResolvedValue({ id: 'gp1' });
    const data = { passValidFor: 24, numberOfPasses: 10 };
    await tool.handler({ action: 'generate_guest_pass', data });

    expect(mock.post).toHaveBeenCalledWith('/identity/guestpass/generate', data);
  });

  it('should map create_identity_user to POST /identity/users', async () => {
    const { createVszIdentityTool } = await import('../../../src/tools/vsz-identity.js');
    const mock = createMockHttpClient();
    const tool = createVszIdentityTool(mock.client);

    mock.post.mockResolvedValue({ id: 'user1' });
    const data = { userName: 'testuser', password: 'secret' };
    await tool.handler({ action: 'create_identity_user', data });

    expect(mock.post).toHaveBeenCalledWith('/identity/users', data);
  });

  it('should map delete_scg_user to DELETE /users/{id}', async () => {
    const { createVszIdentityTool } = await import('../../../src/tools/vsz-identity.js');
    const mock = createMockHttpClient();
    const tool = createVszIdentityTool(mock.client);

    mock.del.mockResolvedValue(undefined);
    await tool.handler({ action: 'delete_scg_user', id: 'u1' });

    expect(mock.del).toHaveBeenCalledWith('/users/u1');
  });

  it('should map get_role_permissions to GET /userGroups/roles/{id}', async () => {
    const { createVszIdentityTool } = await import('../../../src/tools/vsz-identity.js');
    const mock = createMockHttpClient();
    const tool = createVszIdentityTool(mock.client);

    mock.get.mockResolvedValue({ permissions: ['READ', 'WRITE'] });
    await tool.handler({ action: 'get_role_permissions', id: 'SUPER_ADMIN' });

    expect(mock.get).toHaveBeenCalledWith('/userGroups/roles/SUPER_ADMIN', undefined);
  });
});
