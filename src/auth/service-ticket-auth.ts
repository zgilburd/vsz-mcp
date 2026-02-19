/**
 * Service Ticket Authentication Manager for vSZ-H (port 8443, /wsg/api/public/).
 *
 * Login:  POST /{version}/serviceTicket  with {username, password}
 * Logout: DELETE /{version}/serviceTicket?serviceTicket={token}
 * Auth:   Append ?serviceTicket={token} to every request URL
 *
 * VERIFIED against live vSZ 7.1.1.0.872 controller.
 *
 * Source: docs/api-patterns-analysis.md, Section 2
 * Source: scripts/verify-controller.ts (same HTTP pattern)
 */

import https from 'node:https';
import type { AuthManager, RequestConfig, ServiceTicketAuth } from '../types/auth.js';
import type { VszMcpConfig } from '../types/config.js';
import { EDITION_DEFAULTS } from '../types/config.js';
import { parseVszError } from '../types/errors.js';

interface HttpResponse {
  status: number;
  body: string;
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
        });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

export class ServiceTicketAuthManager implements AuthManager {
  private state: ServiceTicketAuth | null = null;
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

    let parsed: unknown;
    try {
      parsed = JSON.parse(res.body);
    } catch {
      throw new Error('Login failed: response body is not valid JSON');
    }

    const body = parsed as Record<string, unknown>;
    const ticket = body.serviceTicket;
    const controllerVersion = body.controllerVersion;

    if (typeof ticket !== 'string' || ticket.length === 0) {
      throw new Error('Login failed: no serviceTicket in response');
    }

    this.state = {
      type: 'service-ticket',
      serviceTicket: ticket,
      controllerVersion: typeof controllerVersion === 'string' ? controllerVersion : 'unknown',
      expiresAt: Date.now() + this.refreshIntervalMs,
    };

    this.scheduleRefresh();
  }

  async logout(): Promise<void> {
    this.cancelRefresh();

    if (!this.state) {
      return;
    }

    const token = this.state.serviceTicket;
    this.state = null;

    const path = `${this.basePath}/${this.apiVersion}${this.logoutPath}?serviceTicket=${encodeURIComponent(token)}`;

    try {
      await httpsRequest({
        hostname: this.host,
        port: this.port,
        path,
        method: 'DELETE',
        rejectUnauthorized: this.rejectUnauthorized,
      });
    } catch {
      // Best-effort logout — swallow network errors
    }
  }

  applyAuth(config: RequestConfig): void {
    if (!this.state) {
      throw new Error('Not authenticated — call login() first');
    }

    const token = this.state.serviceTicket;
    const separator = config.url.includes('?') ? '&' : '?';
    config.url = `${config.url}${separator}serviceTicket=${encodeURIComponent(token)}`;
  }

  isAuthenticated(): boolean {
    if (!this.state) return false;
    return Date.now() < this.state.expiresAt;
  }

  /** Exposed for testing — returns a copy without the actual token. */
  getControllerVersion(): string | null {
    return this.state?.controllerVersion ?? null;
  }

  private scheduleRefresh(): void {
    this.cancelRefresh();

    // Refresh at 90% of the interval to avoid edge-case expiration
    const delay = Math.floor(this.refreshIntervalMs * 0.9);
    this.refreshTimer = setTimeout(() => {
      void this.login().catch(() => {
        // Refresh failed — token will expire naturally.
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
