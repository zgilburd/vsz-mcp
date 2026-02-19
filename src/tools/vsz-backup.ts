/**
 * vsz_backup Tool
 *
 * Cluster and backup management: cluster configuration, backup/restore,
 * firmware upgrades, AP patching, node management, and geo-redundancy.
 *
 * Source: docs/mcp-architecture.md, Section 4
 * Source: docs/openapi-parsed-endpoints.md (Cluster Management)
 */

import type { VszHttpClient } from '../http/client.js';
import type { ToolDefinition, ActionDefinition } from './base-tool.js';
import { createDomainTool } from './base-tool.js';

const actions: Record<string, ActionDefinition> = {
  // ── AP Patching ────────────────────────────────────────────
  get_ap_patch: {
    method: 'GET',
    path: '/apPatch',
    description: 'Retrieve uploaded AP patch file info.',
  },
  apply_ap_patch: {
    method: 'POST',
    path: '/apPatch',
    description: 'Apply an AP patch.',
  },
  upload_ap_patch: {
    method: 'POST',
    path: '/apPatch/file',
    description: 'Upload an AP Patch file.',
  },
  get_ap_patch_history: {
    method: 'GET',
    path: '/apPatch/history',
    description: 'Retrieve AP patch history.',
  },
  get_ap_patch_status: {
    method: 'GET',
    path: '/apPatch/status',
    description: 'Retrieve cluster AP patch progress status.',
  },

  // ── Cluster backup/restore ─────────────────────────────────
  list_cluster_backups: {
    method: 'GET',
    path: '/cluster',
    description: 'Retrieve cluster backup list.',
  },
  delete_cluster_backup: {
    method: 'DELETE',
    path: '/cluster/{id}',
    description: 'Delete a cluster backup by ID.',
  },
  backup_cluster: {
    method: 'POST',
    path: '/cluster/backup',
    description: 'Backup the cluster.',
    hasBody: false,
  },
  get_geo_redundancy: {
    method: 'GET',
    path: '/cluster/geoRedundancy',
    description: 'Get cluster geo-redundancy settings.',
  },
  restore_cluster: {
    method: 'POST',
    path: '/cluster/restore/{id}',
    description: 'Restore a cluster backup by ID.',
    hasBody: false,
  },
  get_cluster_state: {
    method: 'GET',
    path: '/cluster/state',
    description: 'Get current cluster, blade, and management service state.',
  },

  // ── System configuration backup/restore ────────────────────
  list_configurations: {
    method: 'GET',
    path: '/configuration',
    description: 'Retrieve system configuration backup list.',
  },
  delete_configuration: {
    method: 'DELETE',
    path: '/configuration/{id}',
    description: 'Delete a system configuration backup.',
  },
  backup_configuration: {
    method: 'POST',
    path: '/configuration/backup',
    description: 'Backup system configuration.',
    hasBody: false,
  },
  download_configuration: {
    method: 'GET',
    path: '/configuration/download',
    description: 'Download system configuration file.',
  },
  restore_configuration: {
    method: 'POST',
    path: '/configuration/restore/{id}',
    description: 'Restore system configuration with specified backup UUID.',
    hasBody: false,
  },
  upload_configuration: {
    method: 'POST',
    path: '/configuration/upload',
    description: 'Upload a system configuration file.',
  },

  // ── Configuration settings ─────────────────────────────────
  get_auto_export_backup: {
    method: 'GET',
    path: '/configurationSettings/autoExportBackup',
    description: 'Get Auto Export Backup settings.',
  },
  update_auto_export_backup: {
    method: 'PATCH',
    path: '/configurationSettings/autoExportBackup',
    description: 'Modify Auto Export Backup settings.',
  },
  get_schedule_backup: {
    method: 'GET',
    path: '/configurationSettings/scheduleBackup',
    description: 'Get Schedule Backup settings.',
  },
  update_schedule_backup: {
    method: 'PATCH',
    path: '/configurationSettings/scheduleBackup',
    description: 'Modify Schedule Backup settings.',
  },

  // ── Upgrade ────────────────────────────────────────────────
  start_upgrade: {
    method: 'POST',
    path: '/upgrade',
    description: 'Start a system upgrade.',
  },
  get_upgrade_history: {
    method: 'GET',
    path: '/upgrade/history',
    description: 'Retrieve upgrade history.',
  },
  get_upgrade_patch: {
    method: 'GET',
    path: '/upgrade/patch',
    description: 'Retrieve uploaded upgrade file info.',
  },
  get_upgrade_status: {
    method: 'GET',
    path: '/upgrade/status',
    description: 'Retrieve cluster upgrade progress status.',
  },
  upload_upgrade: {
    method: 'POST',
    path: '/upgrade/upload',
    description: 'Upload a firmware patch file for upgrade.',
  },
};

export function createVszBackupTool(httpClient: VszHttpClient): ToolDefinition {
  return createDomainTool(
    {
      name: 'vsz_backup',
      description:
        'Ruckus vSZ cluster and backup management. Manage cluster configuration, ' +
        'backup/restore, firmware upgrades, node management, and geo-redundancy.',
      actions,
    },
    httpClient,
  );
}
