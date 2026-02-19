/**
 * Tests for vsz_backup tool.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VszHttpClient } from '../../../src/http/client.js';
import type { ToolDefinition } from '../../../src/tools/base-tool.js';

function createMockHttpClient() {
  const get = vi.fn();
  const post = vi.fn();
  const put = vi.fn();
  const patch = vi.fn();
  const del = vi.fn();

  return {
    client: { get, post, put, patch, delete: del } as unknown as VszHttpClient,
    get,
    post,
    put,
    patch,
    del,
  };
}

describe('vsz_backup tool', () => {
  let mock: ReturnType<typeof createMockHttpClient>;
  let tool: ToolDefinition;

  beforeEach(async () => {
    mock = createMockHttpClient();
    const { createVszBackupTool } = await import('../../../src/tools/vsz-backup.js');
    tool = createVszBackupTool(mock.client);
  });

  it('should have correct name', () => {
    expect(tool.name).toBe('vsz_backup');
  });

  it('should map list_cluster_backups to GET /cluster', async () => {
    mock.get.mockResolvedValue({ list: [], totalCount: 0 });
    const result = await tool.handler({ action: 'list_cluster_backups' });

    expect(mock.get).toHaveBeenCalledWith('/cluster', undefined);
    expect(result.isError).toBeUndefined();
  });

  it('should map backup_cluster to POST /cluster/backup', async () => {
    mock.post.mockResolvedValue({ success: true });
    await tool.handler({ action: 'backup_cluster' });

    expect(mock.post).toHaveBeenCalledWith('/cluster/backup', undefined);
  });

  it('should map delete_cluster_backup to DELETE /cluster/{id}', async () => {
    mock.del.mockResolvedValue(undefined);
    await tool.handler({ action: 'delete_cluster_backup', id: 'backup-1' });

    expect(mock.del).toHaveBeenCalledWith('/cluster/backup-1');
  });

  it('should map get_cluster_state to GET /cluster/state', async () => {
    mock.get.mockResolvedValue({ state: 'healthy' });
    await tool.handler({ action: 'get_cluster_state' });

    expect(mock.get).toHaveBeenCalledWith('/cluster/state', undefined);
  });

  it('should map update_schedule_backup to PATCH /configurationSettings/scheduleBackup', async () => {
    mock.patch.mockResolvedValue(undefined);
    const data = { enabled: true, time: '02:00' };
    await tool.handler({ action: 'update_schedule_backup', data });

    expect(mock.patch).toHaveBeenCalledWith('/configurationSettings/scheduleBackup', data);
  });
});
