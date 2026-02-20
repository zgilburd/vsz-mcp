/**
 * vSZ HTTP Client
 *
 * Transport layer for all vSZ API communication.
 * Handles TLS, auth injection, error parsing, and retry logic.
 *
 * Source: docs/mcp-architecture.md, Section 4
 * Source: docs/api-patterns-analysis.md, Sections 2-3
 */

import https from 'node:https';
import type { VszMcpConfig } from '../types/config.js';
import { EDITION_DEFAULTS } from '../types/config.js';
import type { AuthManager, RequestConfig } from '../types/auth.js';
import { parseVszError, isSessionExpiredError, isRetryableError } from '../types/errors.js';

/** HTTP methods supported by the client. */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Options for a single HTTP request. */
interface HttpRequestOptions {
  method: HttpMethod;
  path: string;
  params?: Record<string, string | number>;
  body?: unknown;
}

/** Error thrown when a vSZ API request fails after all retries. */
export class VszHttpError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly vszError: ReturnType<typeof parseVszError>,
  ) {
    super(message);
    this.name = 'VszHttpError';
  }
}

const RETRY_DELAY_MS = 5000;
const MAX_RETRIES = 3;

export class VszHttpClient {
  private readonly baseUrl: string;
  private readonly rejectUnauthorized: boolean;

  constructor(
    config: Required<VszMcpConfig>,
    private readonly authManager: AuthManager,
  ) {
    const editionDefaults = EDITION_DEFAULTS[config.edition];
    this.baseUrl = `https://${config.host}:${config.port}${editionDefaults.basePath}/${config.apiVersion}`;
    this.rejectUnauthorized = config.tlsRejectUnauthorized;
  }

  async get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
    return this.request<T>({ method: 'GET', path, params });
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>({ method: 'POST', path, body });
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>({ method: 'PUT', path, body });
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>({ method: 'PATCH', path, body });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>({ method: 'DELETE', path });
  }

  /**
   * Execute an HTTP request with auth injection, error parsing, and retry logic.
   *
   * Retry strategy:
   * - HTTP 401 or Ruckus error 201 (session expired): re-auth then retry once
   * - HTTP 503 or Ruckus error 150/151 (cluster unavailable): retry up to 3 times with 5s delay
   */
  private async request<T>(opts: HttpRequestOptions): Promise<T> {
    // Lazy login: if startup auth failed or token expired, authenticate now
    if (!this.authManager.isAuthenticated()) {
      await this.authManager.login();
    }

    let lastError: VszHttpError | undefined;
    let retriesLeft = MAX_RETRIES;
    let hasReauthed = false;

    while (true) {
      try {
        return await this.executeRequest<T>(opts);
      } catch (err) {
        if (!(err instanceof VszHttpError)) throw err;
        lastError = err;

        // Session expired: re-auth and retry once
        const isSessionExpired =
          err.statusCode === 401 || isSessionExpiredError(err.vszError.code);
        if (isSessionExpired && !hasReauthed) {
          hasReauthed = true;
          await this.authManager.login();
          continue;
        }
        // Session expired after re-auth already attempted: fail immediately
        if (isSessionExpired) {
          throw err;
        }

        // Cluster unavailable: retry with delay
        const isTransient =
          err.statusCode === 503 ||
          isRetryableError(err.vszError.code);
        if (isTransient && retriesLeft > 0) {
          retriesLeft--;
          await delay(RETRY_DELAY_MS);
          continue;
        }

        throw err;
      }
    }

    // TypeScript needs this even though the loop always returns or throws
    throw lastError;
  }

  /** Execute a single HTTP request (no retry). */
  private executeRequest<T>(opts: HttpRequestOptions): Promise<T> {
    return new Promise((resolve, reject) => {
      // Build URL with query params
      let url = `${this.baseUrl}${opts.path}`;
      const queryParams = new URLSearchParams();

      if (opts.params) {
        for (const [key, value] of Object.entries(opts.params)) {
          queryParams.set(key, String(value));
        }
      }

      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      // Apply auth (mutates url and/or headers)
      const requestConfig: RequestConfig = {
        url,
        headers: {
          'Accept': 'application/json',
        },
      };

      if (opts.body !== undefined) {
        requestConfig.headers['Content-Type'] = 'application/json;charset=UTF-8';
      }

      this.authManager.applyAuth(requestConfig);

      // Parse the (possibly mutated) URL
      const parsed = new URL(requestConfig.url);

      const requestOptions: https.RequestOptions = {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        method: opts.method,
        headers: requestConfig.headers,
        rejectUnauthorized: this.rejectUnauthorized,
      };

      const req = https.request(requestOptions, (res) => {
        const chunks: Buffer[] = [];

        res.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf-8');
          const statusCode = res.statusCode ?? 0;

          // Parse response body
          let body: unknown;
          try {
            body = raw.length > 0 ? JSON.parse(raw) : undefined;
          } catch {
            body = raw;
          }

          // 2xx responses are success
          if (statusCode >= 200 && statusCode < 300) {
            resolve(body as T);
            return;
          }

          // Non-2xx: parse through error handler
          const vszError = parseVszError(body);
          reject(
            new VszHttpError(
              `vSZ API error ${statusCode}: ${vszError.message}`,
              statusCode,
              vszError,
            ),
          );
        });
      });

      req.on('error', (err: Error) => {
        reject(
          new VszHttpError(
            `Network error: ${err.message}`,
            0,
            parseVszError(null),
          ),
        );
      });

      if (opts.body !== undefined) {
        req.write(JSON.stringify(opts.body));
      }

      req.end();
    });
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
