/**
 * Unit tests for SessionAuthManager.
 *
 * Uses vitest. Mocks the Node.js https module to avoid real network calls.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { VszMcpConfig } from '../../../src/types/config.js';
import { resolveConfig } from '../../../src/types/config.js';

// Mock https module before importing the class under test
vi.mock('node:https', () => {
  const mockRequest = vi.fn();
  return { default: { request: mockRequest }, request: mockRequest };
});

// Import after mock setup
import https from 'node:https';
import { SessionAuthManager } from '../../../src/auth/session-auth.js';

const mockedRequest = vi.mocked(https.request);

function makeConfig(overrides?: Partial<VszMcpConfig>): Required<VszMcpConfig> {
  return resolveConfig({
    host: '10.0.0.1',
    edition: 'vsz-e',
    username: 'admin',
    password: 'secret',
    ...overrides,
  });
}

/**
 * Helper: simulate an HTTPS response with headers from the mocked https.request.
 */
function mockHttpResponse(
  status: number,
  body: string,
  headers?: Record<string, string | string[]>,
): void {
  mockedRequest.mockImplementationOnce((_options: unknown, callback: unknown) => {
    const cb = callback as (res: {
      statusCode: number;
      headers: Record<string, string | string[] | undefined>;
      on: (event: string, handler: (data?: Buffer) => void) => void;
    }) => void;

    const res = {
      statusCode: status,
      headers: headers ?? {},
      on: vi.fn((event: string, handler: (data?: Buffer) => void) => {
        if (event === 'data') {
          handler(Buffer.from(body));
        } else if (event === 'end') {
          handler();
        }
      }),
    };
    cb(res);

    return {
      on: vi.fn(),
      write: vi.fn(),
      end: vi.fn(),
    };
  });
}

/**
 * Helper: simulate a network error from https.request.
 */
function mockHttpError(errorMessage: string): void {
  mockedRequest.mockImplementationOnce((_options: unknown, _callback: unknown) => {
    const req = {
      on: vi.fn((event: string, handler: (err: Error) => void) => {
        if (event === 'error') {
          handler(new Error(errorMessage));
        }
      }),
      write: vi.fn(),
      end: vi.fn(),
    };
    return req;
  });
}

describe('SessionAuthManager', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockedRequest.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('login', () => {
    it('should POST to the correct endpoint and store session state', async () => {
      const config = makeConfig();
      const mgr = new SessionAuthManager(config);

      mockHttpResponse(
        200,
        JSON.stringify({
          cpId: 'cp-1',
          domainId: 'dom-1',
          adminRoleId: 'role-1',
          adminId: 'admin-1',
        }),
        { 'set-cookie': ['JSESSIONID=abc123; Path=/; HttpOnly'] },
      );

      await mgr.login();

      expect(mgr.isAuthenticated()).toBe(true);
      expect(mgr.getSessionId()).toBe('abc123');

      // Verify the request was made to the correct path
      const callArgs = mockedRequest.mock.calls[0][0] as Record<string, unknown>;
      expect(callArgs.hostname).toBe('10.0.0.1');
      expect(callArgs.port).toBe(7443);
      expect(callArgs.path).toBe('/api/public/v13_1/session');
      expect(callArgs.method).toBe('POST');
      expect(callArgs.rejectUnauthorized).toBe(true);
    });

    it('should handle Set-Cookie as array', async () => {
      const mgr = new SessionAuthManager(makeConfig());

      mockHttpResponse(
        200,
        JSON.stringify({}),
        { 'set-cookie': ['OTHER=xyz', 'JSESSIONID=session-from-array; Path=/'] },
      );

      await mgr.login();

      expect(mgr.getSessionId()).toBe('session-from-array');
    });

    it('should throw on non-200 response', async () => {
      const mgr = new SessionAuthManager(makeConfig());

      mockHttpResponse(401, JSON.stringify({
        errorCode: 202,
        message: 'Authentication failed',
        errorType: 'auth',
      }));

      await expect(mgr.login()).rejects.toThrow('Login failed: Authentication failed (HTTP 401)');
      expect(mgr.isAuthenticated()).toBe(false);
    });

    it('should throw if no JSESSIONID in Set-Cookie', async () => {
      const mgr = new SessionAuthManager(makeConfig());

      mockHttpResponse(200, JSON.stringify({ cpId: 'cp-1' }), {});

      await expect(mgr.login()).rejects.toThrow('no JSESSIONID in Set-Cookie');
    });

    it('should throw on network error', async () => {
      const mgr = new SessionAuthManager(makeConfig());

      mockHttpError('ECONNREFUSED');

      await expect(mgr.login()).rejects.toThrow('ECONNREFUSED');
    });

    it('should use custom port and apiVersion from config', async () => {
      const config = makeConfig({ port: 9443, apiVersion: 'v12_0' });
      const mgr = new SessionAuthManager(config);

      mockHttpResponse(
        200,
        JSON.stringify({}),
        { 'set-cookie': ['JSESSIONID=custom-session; Path=/'] },
      );

      await mgr.login();

      const callArgs = mockedRequest.mock.calls[0][0] as Record<string, unknown>;
      expect(callArgs.port).toBe(9443);
      expect(callArgs.path).toBe('/api/public/v12_0/session');
    });

    it('should respect tlsRejectUnauthorized: false', async () => {
      const config = makeConfig({ tlsRejectUnauthorized: false });
      const mgr = new SessionAuthManager(config);

      mockHttpResponse(
        200,
        JSON.stringify({}),
        { 'set-cookie': ['JSESSIONID=tls-session; Path=/'] },
      );

      await mgr.login();

      const callArgs = mockedRequest.mock.calls[0][0] as Record<string, unknown>;
      expect(callArgs.rejectUnauthorized).toBe(false);
    });
  });

  describe('logout', () => {
    it('should DELETE the session endpoint with Cookie header', async () => {
      const mgr = new SessionAuthManager(makeConfig());

      mockHttpResponse(
        200,
        JSON.stringify({}),
        { 'set-cookie': ['JSESSIONID=logout-test; Path=/'] },
      );
      await mgr.login();

      mockHttpResponse(200, '');
      await mgr.logout();

      expect(mgr.isAuthenticated()).toBe(false);

      // Second call should be the DELETE
      const callArgs = mockedRequest.mock.calls[1][0] as Record<string, unknown>;
      expect(callArgs.method).toBe('DELETE');
      expect(callArgs.path).toBe('/api/public/v13_1/session');
      const headers = callArgs.headers as Record<string, string>;
      expect(headers.Cookie).toBe('JSESSIONID=logout-test');
    });

    it('should be a no-op if not authenticated', async () => {
      const mgr = new SessionAuthManager(makeConfig());

      await mgr.logout();

      expect(mockedRequest).not.toHaveBeenCalled();
    });

    it('should swallow network errors during logout', async () => {
      const mgr = new SessionAuthManager(makeConfig());

      mockHttpResponse(
        200,
        JSON.stringify({}),
        { 'set-cookie': ['JSESSIONID=err-logout; Path=/'] },
      );
      await mgr.login();

      mockHttpError('ECONNREFUSED');

      await expect(mgr.logout()).resolves.toBeUndefined();
      expect(mgr.isAuthenticated()).toBe(false);
    });
  });

  describe('applyAuth', () => {
    it('should add Cookie header with JSESSIONID', async () => {
      const mgr = new SessionAuthManager(makeConfig());

      mockHttpResponse(
        200,
        JSON.stringify({}),
        { 'set-cookie': ['JSESSIONID=apply-test; Path=/'] },
      );
      await mgr.login();

      const config = { url: '/api/public/v13_1/zones', headers: {} as Record<string, string> };
      mgr.applyAuth(config);

      expect(config.headers['Cookie']).toBe('JSESSIONID=apply-test');
      // URL should NOT be modified (unlike service-ticket)
      expect(config.url).toBe('/api/public/v13_1/zones');
    });

    it('should throw if not authenticated', () => {
      const mgr = new SessionAuthManager(makeConfig());

      expect(() => {
        mgr.applyAuth({ url: '/test', headers: {} });
      }).toThrow('Not authenticated');
    });
  });

  describe('isAuthenticated', () => {
    it('should return false before login', () => {
      const mgr = new SessionAuthManager(makeConfig());
      expect(mgr.isAuthenticated()).toBe(false);
    });

    it('should return true after successful login', async () => {
      const mgr = new SessionAuthManager(makeConfig());

      mockHttpResponse(
        200,
        JSON.stringify({}),
        { 'set-cookie': ['JSESSIONID=auth-check; Path=/'] },
      );
      await mgr.login();

      expect(mgr.isAuthenticated()).toBe(true);
    });

    it('should return false after logout', async () => {
      const mgr = new SessionAuthManager(makeConfig());

      mockHttpResponse(
        200,
        JSON.stringify({}),
        { 'set-cookie': ['JSESSIONID=logout-auth; Path=/'] },
      );
      await mgr.login();

      mockHttpResponse(200, '');
      await mgr.logout();

      expect(mgr.isAuthenticated()).toBe(false);
    });
  });

  describe('auto-refresh', () => {
    it('should schedule a re-login at 90% of the refresh interval', async () => {
      const config = makeConfig({ tokenRefreshIntervalMs: 10000 });
      const mgr = new SessionAuthManager(config);

      // Initial login
      mockHttpResponse(
        200,
        JSON.stringify({}),
        { 'set-cookie': ['JSESSIONID=initial; Path=/'] },
      );
      await mgr.login();

      // Prepare response for the auto-refresh login
      mockHttpResponse(
        200,
        JSON.stringify({}),
        { 'set-cookie': ['JSESSIONID=refreshed; Path=/'] },
      );

      // Advance to 90% of interval (9000ms)
      vi.advanceTimersByTime(9000);

      // The refresh should have triggered a second login
      expect(mockedRequest).toHaveBeenCalledTimes(2);
      expect(mgr.isAuthenticated()).toBe(true);
    });

    it('should cancel refresh timer on logout', async () => {
      const config = makeConfig({ tokenRefreshIntervalMs: 10000 });
      const mgr = new SessionAuthManager(config);

      mockHttpResponse(
        200,
        JSON.stringify({}),
        { 'set-cookie': ['JSESSIONID=cancel; Path=/'] },
      );
      await mgr.login();

      mockHttpResponse(200, '');
      await mgr.logout();

      // Advance past refresh point -- should NOT trigger another login
      vi.advanceTimersByTime(10000);

      // Only 2 calls: login + logout (no refresh)
      expect(mockedRequest).toHaveBeenCalledTimes(2);
    });

    it('should not throw if refresh login fails', async () => {
      const config = makeConfig({ tokenRefreshIntervalMs: 10000 });
      const mgr = new SessionAuthManager(config);

      mockHttpResponse(
        200,
        JSON.stringify({}),
        { 'set-cookie': ['JSESSIONID=refresh-fail; Path=/'] },
      );
      await mgr.login();

      // Prepare a failure for refresh
      mockHttpError('ECONNREFUSED');

      // Should not throw
      vi.advanceTimersByTime(9000);

      expect(mockedRequest).toHaveBeenCalledTimes(2);
    });
  });
});
