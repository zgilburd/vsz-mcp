/**
 * vSZ Controller Verification Script
 *
 * Connects to a live Ruckus vSZ controller to verify critical assumptions
 * identified in docs/citation-verification-report.md:
 *
 * 1. API version string (E1: is it v12_0, v13_0, v13_1?)
 * 2. Error response JSON format (E4: which field names?)
 * 3. OpenAPI spec availability (U1)
 * 4. Which edition/base-path works
 *
 * Reads credentials from .env (VSZ_USER/VSZ_PASS or VSZ_USERNAME/VSZ_PASSWORD).
 * NEVER echoes credentials to stdout.
 *
 * Source: docs/citation-verification-report.md, Section 5.1
 */

import 'dotenv/config';
import https from 'node:https';
import { EDITION_DEFAULTS, type VszEdition } from '../src/types/config.js';

interface VerificationResult {
  step: string;
  status: 'VERIFIED' | 'FAILED' | 'SKIPPED';
  detail: string;
  raw?: unknown;
}

const results: VerificationResult[] = [];

/** Read env var with fallback aliases */
function env(key: string, ...aliases: string[]): string {
  const val = process.env[key] ?? aliases.reduce<string | undefined>((v, a) => v ?? process.env[a], undefined);
  if (!val) {
    console.error(`ERROR: ${key} is required (also checked: ${aliases.join(', ') || 'none'}).`);
    process.exit(1);
  }
  return val;
}

function envOptional(key: string, ...aliases: string[]): string | undefined {
  return process.env[key] ?? aliases.reduce<string | undefined>((v, a) => v ?? process.env[a], undefined);
}

function httpsRequest(
  options: https.RequestOptions,
  body?: string,
): Promise<{ status: number; headers: Record<string, string>; body: string }> {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode ?? 0,
          headers: res.headers as Record<string, string>,
          body: Buffer.concat(chunks).toString('utf-8'),
        });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  const host = env('VSZ_HOST');
  const username = env('VSZ_USERNAME', 'VSZ_USER');
  const password = env('VSZ_PASSWORD', 'VSZ_PASS');
  const editionOverride = envOptional('VSZ_EDITION') as VszEdition | undefined;
  const portOverride = envOptional('VSZ_PORT');

  // Try both editions if not specified (vsz-h first — matches port 8443 + /wsg)
  const editionsToTry: VszEdition[] = editionOverride ? [editionOverride] : ['vsz-h', 'vsz-e'];
  const versionsToTry = ['v13_1', 'v13_0', 'v12_0', 'v11_1', 'v11_0', 'v10_0', 'v9_1', 'v9_0'];

  console.log('=== vSZ Controller Verification ===');
  console.log(`Host: ${host}`);
  console.log(`Port override: ${portOverride ?? 'auto per edition'}`);
  console.log(`Editions to try: ${editionsToTry.join(', ')}`);
  console.log('');

  let workingEdition: VszEdition | null = null;
  let workingVersion: string | null = null;
  let authToken: string | null = null;
  let editionConfig = EDITION_DEFAULTS[editionsToTry[0]];

  // Step 1: Discover working edition + API version
  console.log('--- Step 1: Discover edition and API version ---');

  for (const edition of editionsToTry) {
    const cfg = EDITION_DEFAULTS[edition];
    const port = portOverride ? parseInt(portOverride, 10) : cfg.port;

    const tlsBase: https.RequestOptions = {
      hostname: host,
      port,
      rejectUnauthorized: false,
    };

    console.log(`\n  Trying edition: ${edition} (port ${port}, path ${cfg.basePath})`);

    for (const version of versionsToTry) {
      const loginPath = `${cfg.basePath}/${version}${cfg.loginPath}`;
      console.log(`    ${version}: POST ${loginPath}`);

      try {
        const res = await httpsRequest(
          {
            ...tlsBase,
            path: loginPath,
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          },
          JSON.stringify({ username, password }),
        );

        if (res.status === 200) {
          workingEdition = edition;
          workingVersion = version;
          editionConfig = cfg;
          console.log(`    SUCCESS: ${edition} / ${version} (HTTP 200)`);

          try {
            const parsed = JSON.parse(res.body);

            if (cfg.authMethod === 'service-ticket' && parsed.serviceTicket) {
              authToken = parsed.serviceTicket;
              console.log(`    Service ticket obtained. Controller version: ${parsed.controllerVersion ?? 'unknown'}`);
              results.push({
                step: 'Controller version',
                status: 'VERIFIED',
                detail: `controllerVersion: ${parsed.controllerVersion}`,
                raw: parsed,
              });
            } else if (cfg.authMethod === 'session') {
              const setCookie = res.headers['set-cookie'];
              const jsessionMatch = setCookie?.toString().match(/JSESSIONID=([^;]+)/);
              if (jsessionMatch) {
                authToken = jsessionMatch[1];
                console.log(`    JSESSIONID obtained`);
              }
            }

            results.push({
              step: 'Edition + API version',
              status: 'VERIFIED',
              detail: `Edition: ${edition}, API version: ${version}, Auth: ${cfg.authMethod}`,
              raw: { edition, version, authMethod: cfg.authMethod, controllerVersion: parsed.controllerVersion },
            });
          } catch {
            results.push({
              step: 'Edition + API version',
              status: 'VERIFIED',
              detail: `Edition: ${edition}, API version: ${version} (response not JSON)`,
            });
          }
          break;
        } else if (res.status === 401 || res.status === 403) {
          // Version exists but credentials might be wrong — still confirms the edition/version
          console.log(`    Version ${version} exists but auth failed (HTTP ${res.status})`);
          workingEdition = edition;
          workingVersion = version;
          editionConfig = cfg;
          results.push({
            step: 'Edition + API version',
            status: 'VERIFIED',
            detail: `Edition: ${edition}, Version: ${version} exists (auth failed — check credentials)`,
          });

          try {
            const errorBody = JSON.parse(res.body);
            console.log(`    Error response fields: ${Object.keys(errorBody).join(', ')}`);
            results.push({
              step: 'Error format (auth failure)',
              status: 'VERIFIED',
              detail: `Fields: ${Object.keys(errorBody).join(', ')}`,
              raw: errorBody,
            });
          } catch {
            /* not JSON */
          }
          break;
        } else {
          console.log(`    HTTP ${res.status} — trying next version`);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('ECONNREFUSED') || msg.includes('ETIMEDOUT') || msg.includes('ENOTFOUND')) {
          console.log(`    Connection failed (${msg}) — skipping edition ${edition}`);
          break;
        }
        console.log(`    Error: ${msg}`);
      }
    }

    if (workingVersion) break;
  }

  if (!workingVersion || !workingEdition) {
    results.push({ step: 'Discovery', status: 'FAILED', detail: 'No working edition/version found' });
    printSummary();
    return;
  }

  const port = portOverride ? parseInt(portOverride, 10) : editionConfig.port;
  const tlsOptions: https.RequestOptions = {
    hostname: host,
    port,
    rejectUnauthorized: false,
  };

  // Step 2: Capture error response format
  if (authToken) {
    console.log('\n--- Step 2: Capture error response format ---');

    const badPath = `${editionConfig.basePath}/${workingVersion}/nonexistent_resource_12345`;
    const authParam = editionConfig.authMethod === 'service-ticket' ? `?serviceTicket=${authToken}` : '';
    const authHeaders: Record<string, string> =
      editionConfig.authMethod === 'session' ? { Cookie: `JSESSIONID=${authToken}` } : {};

    try {
      const res = await httpsRequest({
        ...tlsOptions,
        path: `${badPath}${authParam}`,
        method: 'GET',
        headers: { ...authHeaders, 'Content-Type': 'application/json;charset=UTF-8' },
      });

      console.log(`  GET ${badPath} -> HTTP ${res.status}`);
      try {
        const errorBody = JSON.parse(res.body);
        console.log(`  Error response body: ${JSON.stringify(errorBody, null, 2)}`);
        console.log(`  Fields present: ${Object.keys(errorBody).join(', ')}`);
        results.push({
          step: 'Error format (404)',
          status: 'VERIFIED',
          detail: `Fields: ${Object.keys(errorBody).join(', ')}`,
          raw: errorBody,
        });
      } catch {
        console.log(`  Response is not JSON: ${res.body.substring(0, 200)}`);
        results.push({
          step: 'Error format (404)',
          status: 'VERIFIED',
          detail: 'Response is not JSON',
          raw: res.body.substring(0, 200),
        });
      }
    } catch (err) {
      results.push({ step: 'Error format', status: 'FAILED', detail: String(err) });
    }
  }

  // Step 3: Check OpenAPI spec endpoint
  if (authToken) {
    console.log('\n--- Step 3: Check OpenAPI spec endpoint ---');

    const specPaths = ['/wsg/apiDoc/openapi', `${editionConfig.basePath}/${workingVersion}/apiDoc`, '/api/apiDoc/openapi'];
    let specFound = false;

    for (const specPath of specPaths) {
      const authParam = editionConfig.authMethod === 'service-ticket' ? `?serviceTicket=${authToken}` : '';
      const authHeaders: Record<string, string> =
        editionConfig.authMethod === 'session' ? { Cookie: `JSESSIONID=${authToken}` } : {};

      try {
        const res = await httpsRequest({
          ...tlsOptions,
          path: `${specPath}${authParam}`,
          method: 'GET',
          headers: { ...authHeaders, Accept: 'application/json' },
        });

        console.log(`  GET ${specPath} -> HTTP ${res.status}`);
        if (res.status === 200) {
          try {
            const spec = JSON.parse(res.body);
            const info = spec.info ?? {};
            console.log(`  OpenAPI spec found! Version: ${info.version ?? 'unknown'}, Title: ${info.title ?? 'unknown'}`);
            console.log(`  Spec size: ${res.body.length} bytes`);

            const paths = spec.paths ? Object.keys(spec.paths) : [];
            console.log(`  Paths defined: ${paths.length}`);

            results.push({
              step: 'OpenAPI spec',
              status: 'VERIFIED',
              detail: `Found at ${specPath}. API version: ${info.version}. Paths: ${paths.length}`,
              raw: { info, pathCount: paths.length, firstPaths: paths.slice(0, 15) },
            });
            specFound = true;
            break;
          } catch {
            console.log(`  Got HTTP 200 but response is not valid JSON (${res.body.length} bytes)`);
          }
        }
      } catch (err) {
        console.log(`  Error: ${err instanceof Error ? err.message : err}`);
      }
    }

    if (!specFound) {
      results.push({ step: 'OpenAPI spec', status: 'FAILED', detail: 'Not found at any known path' });
    }
  }

  // Step 4: Probe all API versions for backward compatibility
  if (authToken) {
    console.log('\n--- Step 4: Probe all API versions ---');
    const supportedVersions: string[] = [];

    for (const version of versionsToTry) {
      if (version === workingVersion) {
        console.log(`  ${version}: WORKS (already verified)`);
        supportedVersions.push(version);
        continue;
      }

      const testPath = `${editionConfig.basePath}/${version}/system/summary`;
      const authParam = editionConfig.authMethod === 'service-ticket' ? `?serviceTicket=${authToken}` : '';
      const authHeaders: Record<string, string> =
        editionConfig.authMethod === 'session' ? { Cookie: `JSESSIONID=${authToken}` } : {};

      try {
        const res = await httpsRequest({
          ...tlsOptions,
          path: `${testPath}${authParam}`,
          method: 'GET',
          headers: { ...authHeaders, 'Content-Type': 'application/json;charset=UTF-8' },
        });

        if (res.status === 200) {
          console.log(`  ${version}: SUPPORTED (HTTP 200)`);
          supportedVersions.push(version);
        } else if (res.status === 404 || res.status === 400) {
          console.log(`  ${version}: NOT SUPPORTED (HTTP ${res.status})`);
        } else {
          console.log(`  ${version}: UNKNOWN (HTTP ${res.status})`);
        }
      } catch {
        console.log(`  ${version}: ERROR`);
      }
    }

    results.push({
      step: 'Supported API versions',
      status: 'VERIFIED',
      detail: `Supported: ${supportedVersions.join(', ')}`,
    });
  }

  // Step 5: Logout
  if (authToken) {
    console.log('\n--- Cleanup: Logout ---');
    const logoutPath = `${editionConfig.basePath}/${workingVersion}${editionConfig.logoutPath}`;
    const authParam = editionConfig.authMethod === 'service-ticket' ? `?serviceTicket=${authToken}` : '';
    const authHeaders: Record<string, string> =
      editionConfig.authMethod === 'session' ? { Cookie: `JSESSIONID=${authToken}` } : {};

    try {
      const res = await httpsRequest({
        ...tlsOptions,
        path: `${logoutPath}${authParam}`,
        method: 'DELETE',
        headers: authHeaders,
      });
      console.log(`  DELETE ${logoutPath} -> HTTP ${res.status}`);
    } catch (err) {
      console.log(`  Logout error: ${err instanceof Error ? err.message : err}`);
    }
  }

  printSummary();
}

function printSummary() {
  console.log('\n=== VERIFICATION SUMMARY ===');
  for (const r of results) {
    const icon = r.status === 'VERIFIED' ? '[OK]' : r.status === 'FAILED' ? '[FAIL]' : '[SKIP]';
    console.log(`  ${icon} ${r.step}: ${r.detail}`);
  }

  console.log('\n=== RAW RESULTS (for updating docs) ===');
  // Sanitize: strip auth tokens and credentials from raw output
  const sanitized = results.map((r) => {
    if (!r.raw || typeof r.raw !== 'object') return r;
    const clean = { ...(r.raw as Record<string, unknown>) };
    delete clean.serviceTicket;
    delete clean.JSESSIONID;
    delete clean.password;
    delete clean.username;
    return { ...r, raw: clean };
  });
  console.log(JSON.stringify(sanitized, null, 2));
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
