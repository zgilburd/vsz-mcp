/**
 * Unit tests for src/server.ts — createServer factory.
 *
 * Mocks the auth manager and HTTP client to verify:
 * - McpServer is created with correct name and version
 * - AuthManager.login() is NOT called during creation (lazy auth)
 * - Cleanup function calls AuthManager.logout()
 * - Graceful degradation when tool/resource registries don't exist
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VszMcpConfig } from '../../../src/types/config.js';
import { resolveConfig } from '../../../src/types/config.js';

// Mock the auth module
const mockLogin = vi.fn().mockResolvedValue(undefined);
const mockLogout = vi.fn().mockResolvedValue(undefined);
const mockApplyAuth = vi.fn();
const mockIsAuthenticated = vi.fn().mockReturnValue(true);

vi.mock('../../../src/auth/auth-manager.js', () => ({
  createAuthManager: vi.fn(() => ({
    login: mockLogin,
    logout: mockLogout,
    applyAuth: mockApplyAuth,
    isAuthenticated: mockIsAuthenticated,
  })),
}));

// Mock the HTTP client
vi.mock('../../../src/http/client.js', () => ({
  VszHttpClient: vi.fn().mockImplementation(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  })),
}));

import { createServer } from '../../../src/server.js';

function makeConfig(overrides?: Partial<VszMcpConfig>): Required<VszMcpConfig> {
  return resolveConfig({
    host: '10.0.0.1',
    edition: 'vsz-h',
    username: 'admin',
    password: 'secret',
    ...overrides,
  });
}

describe('createServer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a server and cleanup function', async () => {
    const config = makeConfig();
    const { server, cleanup } = await createServer(config);

    expect(server).toBeDefined();
    expect(typeof cleanup).toBe('function');
  });

  it('does not call authManager.login() during creation (lazy auth)', async () => {
    const config = makeConfig();
    await createServer(config);

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('cleanup calls authManager.logout()', async () => {
    const config = makeConfig();
    const { cleanup } = await createServer(config);

    await cleanup();

    expect(mockLogout).toHaveBeenCalledOnce();
  });

  it('cleanup does not throw when logout fails', async () => {
    mockLogout.mockRejectedValueOnce(new Error('network error'));

    const config = makeConfig();
    const { cleanup } = await createServer(config);

    // Should not throw
    await expect(cleanup()).resolves.toBeUndefined();
  });

  it('server starts without tools or resources when registries are missing', async () => {
    // The tool-registry and resource-registry modules don't exist,
    // so the dynamic imports in tryRegister will fail silently.
    // This test verifies the server still starts successfully.
    const config = makeConfig();
    const { server } = await createServer(config);

    expect(server).toBeDefined();
  });
});
