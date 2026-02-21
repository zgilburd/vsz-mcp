/**
 * Unit tests for VszHttpClient.
 *
 * Mocks the Node.js https module to test:
 * - Auth injection on every request
 * - Retry on 401 / session expired (Ruckus 201)
 * - Retry on 503 / cluster unavailable (Ruckus 150/151)
 * - Error parsing through parseVszError
 * - TLS rejectUnauthorized configuration
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import https from 'node:https';
import { EventEmitter } from 'node:events';
import { VszHttpClient, VszHttpError } from '../../../src/http/client.js';
import type { AuthManager, RequestConfig } from '../../../src/types/auth.js';
import type { VszMcpConfig } from '../../../src/types/config.js';

// Mock https module
vi.mock('node:https', () => ({
  default: { request: vi.fn() },
  request: vi.fn(),
}));

function createMockConfig(overrides?: Partial<Required<VszMcpConfig>>): Required<VszMcpConfig> {
  return {
    host: '10.0.0.1',
    port: 8443,
    edition: 'vsz-h' as const,
    apiVersion: 'v13_1',
    username: 'admin',
    password: 'secret',
    tlsRejectUnauthorized: false,
    maxAutoPageResults: 10000,
    tokenRefreshIntervalMs: 82800000,
    ...overrides,
  };
}

function createMockAuthManager(overrides?: Partial<AuthManager>): AuthManager {
  return {
    login: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
    applyAuth: vi.fn((config: RequestConfig) => {
      const sep = config.url.includes('?') ? '&' : '?';
      config.url = `${config.url}${sep}serviceTicket=MOCK_TOKEN`;
    }),
    isAuthenticated: vi.fn().mockReturnValue(true),
    ...overrides,
  };
}

/** Helper to create a mock HTTPS response that fires synchronously via microtask. */
function mockHttpsResponse(statusCode: number, body: unknown): void {
  const mockReq = new EventEmitter() as EventEmitter & { write: ReturnType<typeof vi.fn>; end: ReturnType<typeof vi.fn> };
  mockReq.write = vi.fn();
  mockReq.end = vi.fn();

  const mockRes = new EventEmitter() as EventEmitter & { statusCode: number };
  mockRes.statusCode = statusCode;

  vi.mocked(https.request).mockImplementationOnce((_opts, callback) => {
    const cb = callback as (res: typeof mockRes) => void;
    // Use queueMicrotask so the response fires before any timer-based delays
    queueMicrotask(() => {
      cb(mockRes);
      const data = typeof body === 'string' ? body : JSON.stringify(body);
      mockRes.emit('data', Buffer.from(data));
      mockRes.emit('end');
    });
    return mockReq as unknown as ReturnType<typeof https.request>;
  });
}

/** Mock a network error (no response). */
function mockHttpsNetworkError(errorMessage: string): void {
  const mockReq = new EventEmitter() as EventEmitter & { write: ReturnType<typeof vi.fn>; end: ReturnType<typeof vi.fn> };
  mockReq.write = vi.fn();
  mockReq.end = vi.fn();

  vi.mocked(https.request).mockImplementationOnce(() => {
    queueMicrotask(() => {
      mockReq.emit('error', new Error(errorMessage));
    });
    return mockReq as unknown as ReturnType<typeof https.request>;
  });
}

describe('VszHttpClient', () => {
  let config: Required<VszMcpConfig>;
  let authManager: AuthManager;
  let client: VszHttpClient;

  beforeEach(() => {
    vi.clearAllMocks();
    config = createMockConfig();
    authManager = createMockAuthManager();
    client = new VszHttpClient(config, authManager);
  });

  describe('successful requests', () => {
    it('should make a GET request and return parsed JSON', async () => {
      const responseBody = { id: '123', name: 'test-zone' };
      mockHttpsResponse(200, responseBody);

      const result = await client.get('/rkszones/123');

      expect(result).toEqual(responseBody);
      expect(authManager.applyAuth).toHaveBeenCalledOnce();
    });

    it('should make a POST request with JSON body', async () => {
      const responseBody = { id: 'new-id' };
      mockHttpsResponse(201, responseBody);

      const result = await client.post('/rkszones', { name: 'new-zone' });

      expect(result).toEqual(responseBody);
      const callArgs = vi.mocked(https.request).mock.calls[0]![0] as https.RequestOptions;
      expect(callArgs.method).toBe('POST');
    });

    it('should make PUT, PATCH, and DELETE requests', async () => {
      mockHttpsResponse(200, { ok: true });
      await client.put('/rkszones/123', { name: 'updated' });
      expect((vi.mocked(https.request).mock.calls[0]![0] as https.RequestOptions).method).toBe('PUT');

      mockHttpsResponse(200, { ok: true });
      await client.patch('/rkszones/123', { name: 'patched' });
      expect((vi.mocked(https.request).mock.calls[1]![0] as https.RequestOptions).method).toBe('PATCH');

      mockHttpsResponse(200, { ok: true });
      await client.delete('/rkszones/123');
      expect((vi.mocked(https.request).mock.calls[2]![0] as https.RequestOptions).method).toBe('DELETE');
    });

    it('should append query parameters to URL', async () => {
      mockHttpsResponse(200, { list: [] });

      await client.get('/rkszones', { index: 0, listSize: 100 });

      const callArgs = vi.mocked(https.request).mock.calls[0]![0] as https.RequestOptions;
      expect(callArgs.path).toContain('index=0');
      expect(callArgs.path).toContain('listSize=100');
    });
  });

  describe('concurrent login deduplication', () => {
    it('should call login() exactly once when multiple requests arrive unauthenticated', async () => {
      // Set up a client where isAuthenticated() starts false, then returns true after login
      let authenticated = false;
      const dedupAuthManager = createMockAuthManager({
        isAuthenticated: vi.fn(() => authenticated),
        login: vi.fn().mockImplementation(async () => {
          // Simulate async login
          await Promise.resolve();
          authenticated = true;
        }),
      });
      const dedupClient = new VszHttpClient(config, dedupAuthManager);

      // Set up two concurrent HTTP responses
      mockHttpsResponse(200, { a: 1 });
      mockHttpsResponse(200, { b: 2 });

      // Fire two concurrent requests while unauthenticated
      const [r1, r2] = await Promise.all([
        dedupClient.get('/path-a'),
        dedupClient.get('/path-b'),
      ]);

      expect(r1).toEqual({ a: 1 });
      expect(r2).toEqual({ b: 2 });
      // login() must have been called exactly once, not twice
      expect(dedupAuthManager.login).toHaveBeenCalledOnce();
    });
  });

  describe('auth injection', () => {
    it('should call applyAuth before every request', async () => {
      mockHttpsResponse(200, {});

      await client.get('/test');

      expect(authManager.applyAuth).toHaveBeenCalledOnce();
      const callArgs = vi.mocked(https.request).mock.calls[0]![0] as https.RequestOptions;
      expect(callArgs.path).toContain('serviceTicket=MOCK_TOKEN');
    });

    it('should set Accept header on all requests', async () => {
      mockHttpsResponse(200, {});

      await client.get('/test');

      const callArgs = vi.mocked(https.request).mock.calls[0]![0] as https.RequestOptions;
      expect((callArgs.headers as Record<string, string>)['Accept']).toBe('application/json');
    });

    it('should set Content-Type header on requests with body', async () => {
      mockHttpsResponse(201, {});

      await client.post('/test', { data: true });

      const callArgs = vi.mocked(https.request).mock.calls[0]![0] as https.RequestOptions;
      expect((callArgs.headers as Record<string, string>)['Content-Type']).toBe('application/json;charset=UTF-8');
    });
  });

  describe('TLS configuration', () => {
    it('should pass rejectUnauthorized=false from config', async () => {
      mockHttpsResponse(200, {});
      const insecureClient = new VszHttpClient(
        createMockConfig({ tlsRejectUnauthorized: false }),
        authManager,
      );

      await insecureClient.get('/test');

      const callArgs = vi.mocked(https.request).mock.calls[0]![0] as https.RequestOptions;
      expect(callArgs.rejectUnauthorized).toBe(false);
    });

    it('should pass rejectUnauthorized=true from config', async () => {
      mockHttpsResponse(200, {});
      const secureClient = new VszHttpClient(
        createMockConfig({ tlsRejectUnauthorized: true }),
        authManager,
      );

      await secureClient.get('/test');

      const callArgs = vi.mocked(https.request).mock.calls[0]![0] as https.RequestOptions;
      expect(callArgs.rejectUnauthorized).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should throw VszHttpError on non-2xx status', async () => {
      mockHttpsResponse(404, { success: false });

      await expect(client.get('/nonexistent')).rejects.toThrow(VszHttpError);
    });

    it('should parse vSZ error format A', async () => {
      mockHttpsResponse(400, { errorCode: 302, message: 'Validation error', errorType: 'VALIDATION' });

      try {
        await client.get('/bad-request');
        expect.unreachable('Should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(VszHttpError);
        const httpErr = err as VszHttpError;
        expect(httpErr.vszError.code).toBe(302);
        expect(httpErr.vszError.message).toBe('Validation error');
      }
    });

    it('should throw VszHttpError on network error', async () => {
      mockHttpsNetworkError('ECONNREFUSED');

      const err = await client.get('/test').catch((e: unknown) => e);
      expect(err).toBeInstanceOf(VszHttpError);
      expect((err as VszHttpError).message).toContain('Network error');
    });
  });

  describe('retry on session expired (401 / Ruckus 201)', () => {
    it('should re-auth and retry on HTTP 401', async () => {
      mockHttpsResponse(401, { errorCode: 201, message: 'Session expired', errorType: 'AUTH' });
      mockHttpsResponse(200, { id: '123' });

      const result = await client.get('/rkszones/123');

      expect(result).toEqual({ id: '123' });
      expect(authManager.login).toHaveBeenCalledOnce();
      expect(https.request).toHaveBeenCalledTimes(2);
    });

    it('should re-auth and retry on Ruckus error 201 (even if HTTP is not 401)', async () => {
      mockHttpsResponse(403, { errorCode: 201, message: 'Session expired', errorType: 'AUTH' });
      mockHttpsResponse(200, { ok: true });

      const result = await client.get('/test');

      expect(result).toEqual({ ok: true });
      expect(authManager.login).toHaveBeenCalledOnce();
    });

    it('should only re-auth once per request', async () => {
      mockHttpsResponse(401, { errorCode: 201, message: 'Session expired', errorType: 'AUTH' });
      mockHttpsResponse(401, { errorCode: 201, message: 'Session expired', errorType: 'AUTH' });

      await expect(client.get('/test')).rejects.toThrow(VszHttpError);
      expect(authManager.login).toHaveBeenCalledOnce();
    });
  });

  describe('retry on transient errors (503 / Ruckus 150/151)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should retry on HTTP 503 up to 3 times', async () => {
      mockHttpsResponse(503, { errorCode: 150, message: 'Cluster unavailable', errorType: 'SYSTEM' });
      mockHttpsResponse(503, { errorCode: 150, message: 'Cluster unavailable', errorType: 'SYSTEM' });
      mockHttpsResponse(503, { errorCode: 150, message: 'Cluster unavailable', errorType: 'SYSTEM' });
      mockHttpsResponse(200, { ok: true });

      const promise = client.get('/test');

      // Advance through 3 retry delays (5s each)
      await vi.advanceTimersByTimeAsync(5000);
      await vi.advanceTimersByTimeAsync(5000);
      await vi.advanceTimersByTimeAsync(5000);

      const result = await promise;

      expect(result).toEqual({ ok: true });
      expect(https.request).toHaveBeenCalledTimes(4);
    });

    it('should fail after max retries exhausted', async () => {
      mockHttpsResponse(503, { errorCode: 150, message: 'Cluster unavailable', errorType: 'SYSTEM' });
      mockHttpsResponse(503, { errorCode: 150, message: 'Cluster unavailable', errorType: 'SYSTEM' });
      mockHttpsResponse(503, { errorCode: 150, message: 'Cluster unavailable', errorType: 'SYSTEM' });
      mockHttpsResponse(503, { errorCode: 150, message: 'Cluster unavailable', errorType: 'SYSTEM' });

      const promise = client.get('/test').catch((e: unknown) => e);

      await vi.advanceTimersByTimeAsync(5000);
      await vi.advanceTimersByTimeAsync(5000);
      await vi.advanceTimersByTimeAsync(5000);

      const err = await promise;
      expect(err).toBeInstanceOf(VszHttpError);
      expect(https.request).toHaveBeenCalledTimes(4);
    });

    it('should retry on Ruckus error 151 (node unavailable)', async () => {
      mockHttpsResponse(500, { errorCode: 151, message: 'Node unavailable', errorType: 'SYSTEM' });
      mockHttpsResponse(200, { ok: true });

      const promise = client.get('/test');

      await vi.advanceTimersByTimeAsync(5000);

      const result = await promise;

      expect(result).toEqual({ ok: true });
    });
  });

  describe('combined retry scenarios', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should handle session expired then transient error', async () => {
      // 401 -> re-auth -> 503 -> retry -> 200
      mockHttpsResponse(401, { errorCode: 201, message: 'Session expired', errorType: 'AUTH' });
      mockHttpsResponse(503, { errorCode: 150, message: 'Cluster unavailable', errorType: 'SYSTEM' });
      mockHttpsResponse(200, { ok: true });

      const promise = client.get('/test');

      await vi.advanceTimersByTimeAsync(5000);

      const result = await promise;

      expect(result).toEqual({ ok: true });
      expect(authManager.login).toHaveBeenCalledOnce();
      expect(https.request).toHaveBeenCalledTimes(3);
    });
  });
});
