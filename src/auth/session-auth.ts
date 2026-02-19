/**
 * Session Authentication Manager for vSZ-E (port 7443, /api/public/).
 *
 * Login:  POST /{version}/session  with {username, password}
 * Logout: DELETE /{version}/session  with Cookie header
 * Auth:   Add Cookie: JSESSIONID={token} header to every request
 *
 * Source: docs/api-patterns-analysis.md, Section 2
 * Source: docs/mcp-architecture.md, Section 10
 */

import https from 'node:https';
import type { AuthManager, RequestConfig, SessionAuth } from '../types/auth.js';
import type { VszMcpConfig } from '../types/config.js';
import { EDITION_DEFAULTS } from '../types/config.js';
import { parseVszError } from '../types/errors.js';

interface HttpResponse {
  status: number;
  body: string;
  headers: Record<string, string | string[] | undefined>;
}

function httpsRequest(
  options: https.RequestOptions,
  body?: string,
): Promise<HttpResponse> {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode ?? 0,
          body: Buffer.concat(chunks).toString('utf-8'),
          headers: res.headers as Record<string, string | string[] | undefined>,
        });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

/**
 * Extract JSESSIONID from Set-Cookie header(s).
 */
function extractSessionId(headers: Record<string, string | string[] | undefined>): string | null {
  const setCookie = headers['set-cookie'];
  if (!setCookie) return null;

  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
  for (const cookie of cookies) {
    const match = cookie.match(/JSESSIONID=([^;]+)/);
    if (match) return match[1];
  }
  return null;
}

export class SessionAuthManager implements AuthManager {
  private state: SessionAuth | null = null;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly host: string;
  private readonly port: number;
  private readonly username: string;
  private readonly password: string;
  private readonly basePath: string;
  private readonly apiVersion: string;
  private readonly loginPath: string;
  private readonly logoutPath: string;
  private readonly rejectUnauthorized: boolean;
  private readonly refreshIntervalMs: number;

  constructor(config: Required<VszMcpConfig>) {
    const edition = EDITION_DEFAULTS[config.edition];
    this.host = config.host;
    this.port = config.port;
    this.username = config.username;
    this.password = config.password;
    this.basePath = edition.basePath;
    this.apiVersion = config.apiVersion;
    this.loginPath = edition.loginPath;
    this.logoutPath = edition.logoutPath;
    this.rejectUnauthorized = config.tlsRejectUnauthorized;
    this.refreshIntervalMs = config.tokenRefreshIntervalMs;
  }

  async login(): Promise<void> {
    const path = `${this.basePath}/${this.apiVersion}${this.loginPath}`;
    const payload = JSON.stringify({
      username: this.username,
      password: this.password,
    });

    const res = await httpsRequest(
      {
        hostname: this.host,
        port: this.port,
        path,
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        rejectUnauthorized: this.rejectUnauthorized,
      },
      payload,
    );

    if (res.status !== 200) {
      let message = `Login failed (HTTP ${res.status})`;
      try {
        const parsed = JSON.parse(res.body);
        const vszError = parseVszError(parsed);
        message = `Login failed: ${vszError.message} (HTTP ${res.status})`;
      } catch {
        // body not JSON, use default message
      }
      throw new Error(message);
    }

    // Extract session ID from Set-Cookie header
    const jsessionId = extractSessionId(res.headers);
    if (!jsessionId) {
      throw new Error('Login failed: no JSESSIONID in Set-Cookie header');
    }

    // Parse response body for session info
    let sessionInfo = { cpId: '', domainId: '', adminRoleId: '', adminId: '' };
    try {
      const parsed = JSON.parse(res.body);
      if (parsed && typeof parsed === 'object') {
        const body = parsed as Record<string, unknown>;
        sessionInfo = {
          cpId: typeof body.cpId === 'string' ? body.cpId : '',
          domainId: typeof body.domainId === 'string' ? body.domainId : '',
          adminRoleId: typeof body.adminRoleId === 'string' ? body.adminRoleId : '',
          adminId: typeof body.adminId === 'string' ? body.adminId : '',
        };
      }
    } catch {
      // Body may not be JSON; session ID from cookie is sufficient
    }

    this.state = {
      type: 'session',
      jsessionId,
      sessionInfo,
    };

    this.scheduleRefresh();
  }

  async logout(): Promise<void> {
    this.cancelRefresh();

    if (!this.state) {
      return;
    }

    const sessionId = this.state.jsessionId;
    this.state = null;

    const path = `${this.basePath}/${this.apiVersion}${this.logoutPath}`;

    try {
      await httpsRequest({
        hostname: this.host,
        port: this.port,
        path,
        method: 'DELETE',
        headers: { Cookie: `JSESSIONID=${sessionId}` },
        rejectUnauthorized: this.rejectUnauthorized,
      });
    } catch {
      // Best-effort logout -- swallow network errors
    }
  }

  applyAuth(config: RequestConfig): void {
    if (!this.state) {
      throw new Error('Not authenticated — call login() first');
    }

    config.headers['Cookie'] = `JSESSIONID=${this.state.jsessionId}`;
  }

  isAuthenticated(): boolean {
    return this.state !== null;
  }

  /** Exposed for testing -- returns the session ID without the full state. */
  getSessionId(): string | null {
    return this.state?.jsessionId ?? null;
  }

  private scheduleRefresh(): void {
    this.cancelRefresh();

    // Refresh at 90% of the interval to avoid edge-case expiration
    const delay = Math.floor(this.refreshIntervalMs * 0.9);
    this.refreshTimer = setTimeout(() => {
      void this.login().catch(() => {
        // Refresh failed -- session will expire naturally.
        // Next request will get an auth error and the caller can retry.
      });
    }, delay);

    // Allow the process to exit even if the timer is pending
    if (this.refreshTimer && typeof this.refreshTimer === 'object' && 'unref' in this.refreshTimer) {
      this.refreshTimer.unref();
    }
  }

  private cancelRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}
