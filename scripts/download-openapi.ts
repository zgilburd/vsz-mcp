/**
 * Download the OpenAPI spec from a live vSZ controller.
 * Saves to docs/openapi-spec.json for offline parsing.
 *
 * NEVER echoes credentials. Loads from .env via dotenv.
 * Source: Verification results — spec at /wsg/apiDoc/openapi, 1.5MB, 688 paths.
 */

import 'dotenv/config';
import https from 'node:https';
import { writeFileSync } from 'node:fs';
import { EDITION_DEFAULTS } from '../src/types/config.js';

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
  const host = process.env.VSZ_HOST;
  const username = process.env.VSZ_USERNAME ?? process.env.VSZ_USER;
  const password = process.env.VSZ_PASSWORD ?? process.env.VSZ_PASS;

  if (!host || !username || !password) {
    console.error('Required: VSZ_HOST, VSZ_USERNAME/VSZ_USER, VSZ_PASSWORD/VSZ_PASS');
    process.exit(1);
  }

  const cfg = EDITION_DEFAULTS['vsz-h'];
  const port = process.env.VSZ_PORT ? parseInt(process.env.VSZ_PORT, 10) : cfg.port;
  const version = 'v13_1';

  const tlsBase: https.RequestOptions = { hostname: host, port, rejectUnauthorized: false };

  // Authenticate
  console.log('Authenticating...');
  const authRes = await httpsRequest(
    { ...tlsBase, path: `${cfg.basePath}/${version}${cfg.loginPath}`, method: 'POST', headers: { 'Content-Type': 'application/json;charset=UTF-8' } },
    JSON.stringify({ username, password }),
  );

  if (authRes.status !== 200) {
    console.error(`Auth failed: HTTP ${authRes.status}`);
    process.exit(1);
  }

  const { serviceTicket } = JSON.parse(authRes.body);
  console.log('Authenticated. Downloading OpenAPI spec...');

  // Download spec
  const specRes = await httpsRequest({
    ...tlsBase,
    path: `/wsg/apiDoc/openapi?serviceTicket=${serviceTicket}`,
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (specRes.status !== 200) {
    console.error(`Spec download failed: HTTP ${specRes.status}`);
    process.exit(1);
  }

  const spec = JSON.parse(specRes.body);
  const outPath = 'docs/openapi-spec.json';
  writeFileSync(outPath, JSON.stringify(spec, null, 2));
  console.log(`Saved to ${outPath} (${specRes.body.length} bytes)`);

  const paths = spec.paths ? Object.keys(spec.paths) : [];
  console.log(`Paths: ${paths.length}`);
  console.log(`Info: ${JSON.stringify(spec.info)}`);

  // Logout
  await httpsRequest({
    ...tlsBase,
    path: `${cfg.basePath}/${version}${cfg.logoutPath}?serviceTicket=${serviceTicket}`,
    method: 'DELETE',
  }).catch(() => { /* best effort */ });

  console.log('Done.');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
