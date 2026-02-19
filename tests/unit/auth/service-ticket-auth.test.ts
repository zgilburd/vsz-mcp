/**
 * Unit tests for ServiceTicketAuthManager and createAuthManager factory.
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
import { ServiceTicketAuthManager } from '../../../src/auth/service-ticket-auth.js';
import { createAuthManager } from '../../../src/auth/auth-manager.js';

const mockedRequest = vi.mocked(https.request);

function makeConfig(overrides?: Partial<VszMcpConfig>): Required<VszMcpConfig> {
  return resolveConfig({
    host: '10.0.0.1',
    edition: 'vsz-h',
    username: 'admin',
    password: 'secret',
    ...overrides,
  });
}

/**
 * Helper: simulate an HTTPS response from the mocked https.request.
 */
function mockHttpResponse(status: number, body: string): void {
  mockedRequest.mockImplementationOnce((_options: unknown, callback: unknown) => {
    const cb = callback as (res: {
      statusCode: number;
      on: (event: string, handler: (data?: Buffer) => void) => void;
    }) => void;

    const res = {
      statusCode: status,
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

describe('ServiceTicketAuthManager', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockedRequest.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('login', () => {
    it('should POST to the correct endpoint and store auth state', async () => {
      const config = makeConfig();
      const mgr = new ServiceTicketAuthManager(config);

      mockHttpResponse(200, JSON.stringify({
        serviceTicket: 'ST-abc123',
        controllerVersion: '7.1.1.0.872',
      }));

      await mgr.login();

      expect(mgr.isAuthenticated()).toBe(true);
      expect(mgr.getControllerVersion()).toBe('7.1.1.0.872');

      // Verify the request was made to the correct path
      const callArgs = mockedRequest.mock.calls[0][0] as Record<string, unknown>;
      expect(callArgs.hostname).toBe('10.0.0.1');
      expect(callArgs.port).toBe(8443);
      expect(callArgs.path).toBe('/wsg/api/public/v13_1/serviceTicket');
      expect(callArgs.method).toBe('POST');
      expect(callArgs.rejectUnauthorized).toBe(true);
    });

    it('should throw on non-200 response', async () => {
      const mgr = new ServiceTicketAuthManager(makeConfig());

      mockHttpResponse(401, JSON.stringify({
        errorCode: 202,
        message: 'Authentication failed',
        errorType: 'auth',
      }));

      await expect(mgr.login()).rejects.toThrow('Login failed: Authentication failed (HTTP 401)');
      expect(mgr.isAuthenticated()).toBe(false);
    });

    it('should throw if response has no serviceTicket field', async () => {
      const mgr = new ServiceTicketAuthManager(makeConfig());

      mockHttpResponse(200, JSON.stringify({ someOther: 'field' }));

      await expect(mgr.login()).rejects.toThrow('no serviceTicket in response');
    });

    it('should throw if response body is not JSON', async () => {
      const mgr = new ServiceTicketAuthManager(makeConfig());

      mockHttpResponse(200, 'not-json');

      await expect(mgr.login()).rejects.toThrow('not valid JSON');
    });

    it('should throw on network error', async () => {
      const mgr = new ServiceTicketAuthManager(makeConfig());

      mockHttpError('ECONNREFUSED');

      await expect(mgr.login()).rejects.toThrow('ECONNREFUSED');
    });

    it('should use custom port and apiVersion from config', async () => {
      const config = makeConfig({ port: 9443, apiVersion: 'v12_0' });
      const mgr = new ServiceTicketAuthManager(config);

      mockHttpResponse(200, JSON.stringify({
        serviceTicket: 'ST-custom',
        controllerVersion: '7.0.0',
      }));

      await mgr.login();

      const callArgs = mockedRequest.mock.calls[0][0] as Record<string, unknown>;
      expect(callArgs.port).toBe(9443);
      expect(callArgs.path).toBe('/wsg/api/public/v12_0/serviceTicket');
    });

    it('should respect tlsRejectUnauthorized: false', async () => {
      const config = makeConfig({ tlsRejectUnauthorized: false });
      const mgr = new ServiceTicketAuthManager(config);

      mockHttpResponse(200, JSON.stringify({
        serviceTicket: 'ST-tls',
        controllerVersion: '7.1.1.0.872',
      }));

      await mgr.login();

      const callArgs = mockedRequest.mock.calls[0][0] as Record<string, unknown>;
      expect(callArgs.rejectUnauthorized).toBe(false);
    });
  });

  describe('logout', () => {
    it('should DELETE the serviceTicket endpoint', async () => {
      const mgr = new ServiceTicketAuthManager(makeConfig());

      mockHttpResponse(200, JSON.stringify({
        serviceTicket: 'ST-logout-test',
        controllerVersion: '7.1.1.0.872',
      }));
      await mgr.login();

      mockHttpResponse(200, '');
      await mgr.logout();

      expect(mgr.isAuthenticated()).toBe(false);

      // Second call should be the DELETE
      const callArgs = mockedRequest.mock.calls[1][0] as Record<string, unknown>;
      expect(callArgs.method).toBe('DELETE');
      expect(callArgs.path).toContain('/serviceTicket?serviceTicket=');
    });

    it('should be a no-op if not authenticated', async () => {
      const mgr = new ServiceTicketAuthManager(makeConfig());

      await mgr.logout();

      expect(mockedRequest).not.toHaveBeenCalled();
    });

    it('should swallow network errors during logout', async () => {
      const mgr = new ServiceTicketAuthManager(makeConfig());

      mockHttpResponse(200, JSON.stringify({
        serviceTicket: 'ST-err-logout',
        controllerVersion: '7.1.1.0.872',
      }));
      await mgr.login();

      mockHttpError('ECONNREFUSED');

      // Should not throw
      await expect(mgr.logout()).resolves.toBeUndefined();
      expect(mgr.isAuthenticated()).toBe(false);
    });
  });

  describe('applyAuth', () => {
    it('should append serviceTicket query param to URL without existing params', async () => {
      const mgr = new ServiceTicketAuthManager(makeConfig());

      mockHttpResponse(200, JSON.stringify({
        serviceTicket: 'ST-apply-test',
        controllerVersion: '7.1.1.0.872',
      }));
      await mgr.login();

      const config = { url: '/wsg/api/public/v13_1/zones', headers: {} };
      mgr.applyAuth(config);

      expect(config.url).toBe('/wsg/api/public/v13_1/zones?serviceTicket=ST-apply-test');
    });

    it('should append with & when URL already has query params', async () => {
      const mgr = new ServiceTicketAuthManager(makeConfig());

      mockHttpResponse(200, JSON.stringify({
        serviceTicket: 'ST-qp',
        controllerVersion: '7.1.1.0.872',
      }));
      await mgr.login();

      const config = { url: '/api/zones?limit=100', headers: {} };
      mgr.applyAuth(config);

      expect(config.url).toBe('/api/zones?limit=100&serviceTicket=ST-qp');
    });

    it('should throw if not authenticated', () => {
      const mgr = new ServiceTicketAuthManager(makeConfig());

      expect(() => {
        mgr.applyAuth({ url: '/test', headers: {} });
      }).toThrow('Not authenticated');
    });

    it('should URL-encode the token', async () => {
      const mgr = new ServiceTicketAuthManager(makeConfig());

      mockHttpResponse(200, JSON.stringify({
        serviceTicket: 'ST-has spaces&special=chars',
        controllerVersion: '7.1.1.0.872',
      }));
      await mgr.login();

      const config = { url: '/test', headers: {} };
      mgr.applyAuth(config);

      expect(config.url).toContain('serviceTicket=ST-has%20spaces%26special%3Dchars');
    });
  });

  describe('isAuthenticated', () => {
    it('should return false before login', () => {
      const mgr = new ServiceTicketAuthManager(makeConfig());
      expect(mgr.isAuthenticated()).toBe(false);
    });

    it('should return true after successful login', async () => {
      const mgr = new ServiceTicketAuthManager(makeConfig());

      mockHttpResponse(200, JSON.stringify({
        serviceTicket: 'ST-auth-check',
        controllerVersion: '7.1.1.0.872',
      }));
      await mgr.login();

      expect(mgr.isAuthenticated()).toBe(true);
    });

    it('should return false after token expiry', async () => {
      const config = makeConfig({ tokenRefreshIntervalMs: 1000 });
      const mgr = new ServiceTicketAuthManager(config);

      mockHttpResponse(200, JSON.stringify({
        serviceTicket: 'ST-expiry',
        controllerVersion: '7.1.1.0.872',
      }));
      await mgr.login();

      expect(mgr.isAuthenticated()).toBe(true);

      // Advance time past expiry
      vi.advanceTimersByTime(1001);

      expect(mgr.isAuthenticated()).toBe(false);
    });

    it('should return false after logout', async () => {
      const mgr = new ServiceTicketAuthManager(makeConfig());

      mockHttpResponse(200, JSON.stringify({
        serviceTicket: 'ST-logout-auth',
        controllerVersion: '7.1.1.0.872',
      }));
      await mgr.login();

      mockHttpResponse(200, '');
      await mgr.logout();

      expect(mgr.isAuthenticated()).toBe(false);
    });
  });

  describe('auto-refresh', () => {
    it('should schedule a re-login at 90% of the refresh interval', async () => {
      const config = makeConfig({ tokenRefreshIntervalMs: 10000 });
      const mgr = new ServiceTicketAuthManager(config);

      // Initial login
      mockHttpResponse(200, JSON.stringify({
        serviceTicket: 'ST-initial',
        controllerVersion: '7.1.1.0.872',
      }));
      await mgr.login();

      // Prepare response for the auto-refresh login
      mockHttpResponse(200, JSON.stringify({
        serviceTicket: 'ST-refreshed',
        controllerVersion: '7.1.1.0.872',
      }));

      // Advance to 90% of interval (9000ms)
      vi.advanceTimersByTime(9000);

      // The refresh should have triggered a second login
      expect(mockedRequest).toHaveBeenCalledTimes(2);
      expect(mgr.isAuthenticated()).toBe(true);
    });

    it('should cancel refresh timer on logout', async () => {
      const config = makeConfig({ tokenRefreshIntervalMs: 10000 });
      const mgr = new ServiceTicketAuthManager(config);

      mockHttpResponse(200, JSON.stringify({
        serviceTicket: 'ST-cancel',
        controllerVersion: '7.1.1.0.872',
      }));
      await mgr.login();

      mockHttpResponse(200, '');
      await mgr.logout();

      // Advance past refresh point — should NOT trigger another login
      vi.advanceTimersByTime(10000);

      // Only 2 calls: login + logout (no refresh)
      expect(mockedRequest).toHaveBeenCalledTimes(2);
    });

    it('should not throw if refresh login fails', async () => {
      const config = makeConfig({ tokenRefreshIntervalMs: 10000 });
      const mgr = new ServiceTicketAuthManager(config);

      mockHttpResponse(200, JSON.stringify({
        serviceTicket: 'ST-refresh-fail',
        controllerVersion: '7.1.1.0.872',
      }));
      await mgr.login();

      // Prepare a failure for refresh
      mockHttpError('ECONNREFUSED');

      // Should not throw
      vi.advanceTimersByTime(9000);

      // The manager was authenticated before, refresh failed but didn't crash
      expect(mockedRequest).toHaveBeenCalledTimes(2);
    });
  });
});

describe('createAuthManager', () => {
  it('should return ServiceTicketAuthManager for vsz-h edition', () => {
    const config = makeConfig({ edition: 'vsz-h' });
    const mgr = createAuthManager(config);
    expect(mgr).toBeInstanceOf(ServiceTicketAuthManager);
  });

  it('should return SessionAuthManager for vsz-e edition', () => {
    const config = makeConfig({ edition: 'vsz-e' as VszMcpConfig['edition'] });
    const mgr = createAuthManager(config);
    expect(mgr).toBeDefined();
    expect(mgr).not.toBeInstanceOf(ServiceTicketAuthManager);
  });
});
