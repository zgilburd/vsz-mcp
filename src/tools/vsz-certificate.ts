/**
 * vsz_certificate Tool
 *
 * Certificate and Dynamic PSK management: SSL certificates, trusted CA chains,
 * CSR generation, client certificates, and Dynamic PSK settings.
 *
 * Source: docs/mcp-architecture.md, Section 4
 * Source: docs/openapi-parsed-endpoints.md (Certificate, Dynamic PSK)
 */

import type { VszHttpClient } from '../http/client.js';
import type { ToolDefinition, ActionDefinition } from './base-tool.js';
import { createDomainTool } from './base-tool.js';

const actions: Record<string, ActionDefinition> = {
  // ── Installed Certificates ─────────────────────────────────
  list_certificates: {
    method: 'GET',
    path: '/certstore/certificate',
    description: 'Retrieve list of installed certificates.',
  },
  create_certificate: {
    method: 'POST',
    path: '/certstore/certificate',
    description: 'Create an installed certificate.',
  },
  get_certificate: {
    method: 'GET',
    path: '/certstore/certificate/{id}',
    description: 'Retrieve an installed certificate.',
  },
  delete_certificate: {
    method: 'DELETE',
    path: '/certstore/certificate/{id}',
    description: 'Delete an installed certificate.',
  },

  // ── Client Certificates ────────────────────────────────────
  list_client_certs: {
    method: 'GET',
    path: '/certstore/clientCert',
    description: 'Retrieve list of client certificates.',
  },
  create_client_cert: {
    method: 'POST',
    path: '/certstore/clientCert',
    description: 'Create a client certificate.',
  },
  get_client_cert: {
    method: 'GET',
    path: '/certstore/clientCert/{id}',
    description: 'Retrieve a client certificate.',
  },
  delete_client_cert: {
    method: 'DELETE',
    path: '/certstore/clientCert/{id}',
    description: 'Delete a client certificate.',
  },

  // ── Certificate Signing Requests ───────────────────────────
  list_csrs: {
    method: 'GET',
    path: '/certstore/csr',
    description: 'Retrieve list of certificate signing requests.',
  },
  create_csr: {
    method: 'POST',
    path: '/certstore/csr',
    description: 'Create a certificate signing request.',
  },
  get_csr: {
    method: 'GET',
    path: '/certstore/csr/{id}',
    description: 'Retrieve a certificate signing request.',
  },
  delete_csr: {
    method: 'DELETE',
    path: '/certstore/csr/{id}',
    description: 'Delete a certificate signing request.',
  },

  // ── Default CA Certificates ────────────────────────────────
  get_default_ca_certs: {
    method: 'GET',
    path: '/certstore/defaultCACerts',
    description: 'Retrieve the default CA certificates.',
  },

  // ── Certificate Settings ───────────────────────────────────
  get_cert_setting: {
    method: 'GET',
    path: '/certstore/setting',
    description: 'Retrieve certificate setting.',
  },
  update_cert_setting: {
    method: 'PATCH',
    path: '/certstore/setting',
    description: 'Modify the certificate setting.',
  },
  update_service_certificates: {
    method: 'PATCH',
    path: '/certstore/setting/serviceCertificates',
    description: 'Modify serviceCertificates of the certificate setting.',
  },

  // ── Trusted CA Chain Certificates ──────────────────────────
  list_trusted_ca_chain: {
    method: 'GET',
    path: '/certstore/trustedCAChainCert',
    description: 'Retrieve list of trusted CA chain certificates.',
  },
  create_trusted_ca_chain: {
    method: 'POST',
    path: '/certstore/trustedCAChainCert',
    description: 'Create trusted CA chain certificates.',
  },
  bulk_delete_trusted_ca_chain: {
    method: 'DELETE',
    path: '/certstore/trustedCAChainCert',
    description: 'Bulk delete trusted CA chain certificates.',
    hasBody: false,
  },
  get_trusted_ca_chain: {
    method: 'GET',
    path: '/certstore/trustedCAChainCert/{id}',
    description: 'Retrieve a trusted CA chain certificate.',
  },
  delete_trusted_ca_chain: {
    method: 'DELETE',
    path: '/certstore/trustedCAChainCert/{id}',
    description: 'Delete a trusted CA chain certificate.',
  },
  update_trusted_ca_chain: {
    method: 'PATCH',
    path: '/certstore/trustedCAChainCert/{id}',
    description: 'Modify a trusted CA chain certificate.',
  },

  // ── Dynamic PSK ────────────────────────────────────────────
  query_dpsk: {
    method: 'POST',
    path: '/query/dpsk',
    description: 'Query DPSKs with specified filters.',
  },
  get_delete_expired_dpsk: {
    method: 'GET',
    path: '/rkszones/{parentId}/deleteExpiredDpsk',
    description: 'Retrieve interval of delete expired DPSK of a zone.',
  },
  update_delete_expired_dpsk: {
    method: 'PUT',
    path: '/rkszones/{parentId}/deleteExpiredDpsk',
    description: 'Modify interval of delete expired DPSK of a zone.',
  },
  get_zone_dpsk: {
    method: 'GET',
    path: '/rkszones/{parentId}/dpsk',
    description: 'Retrieve DPSK info of a zone.',
  },
  get_dpsk_enabled_wlans: {
    method: 'GET',
    path: '/rkszones/{parentId}/dpskEnabledWlans',
    description: 'Retrieve DPSK-enabled WLAN info of a zone.',
  },
  get_wlan_dpsk: {
    method: 'GET',
    path: '/rkszones/{parentId}/wlans/{id}/dpsk',
    description: 'Retrieve DPSK info of a WLAN.',
  },
  delete_wlan_dpsks: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlans/{id}/dpsk',
    description: 'Delete DPSKs of a WLAN.',
  },
  get_dpsk: {
    method: 'GET',
    path: '/rkszones/{parentId}/wlans/{id}/dpsk/{resource}',
    description: 'Retrieve a specific DPSK info by dpskId (pass dpskId as resource).',
  },
  update_dpsk: {
    method: 'PATCH',
    path: '/rkszones/{parentId}/wlans/{id}/dpsk/{resource}',
    description: 'Update a specific DPSK info (pass dpskId as resource).',
  },
  batch_generate_dpsk: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlans/{id}/dpsk/batchGenUnbound',
    description: 'Batch generate unbound DPSKs of a WLAN.',
  },
  upload_dpsk: {
    method: 'POST',
    path: '/rkszones/{parentId}/wlans/{id}/dpsk/upload',
    description: 'Upload DPSK CSV file for a WLAN.',
  },
  download_dpsk_sample: {
    method: 'GET',
    path: '/rkszones/downloadDpskCsvSample',
    description: 'Download DPSK CSV sample file.',
  },
};

export function createVszCertificateTool(httpClient: VszHttpClient): ToolDefinition {
  return createDomainTool(
    {
      name: 'vsz_certificate',
      description:
        'Ruckus vSZ certificate and Dynamic PSK management. Manage SSL certificates, ' +
        'trusted CA chains, CSR generation, and Dynamic PSK settings.',
      actions,
    },
    httpClient,
  );
}
