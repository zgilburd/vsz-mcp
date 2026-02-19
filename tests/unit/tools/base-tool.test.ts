/**
 * Tests for base-tool infrastructure and domain tool creation.
 *
 * Uses a mock HTTP client to verify that action→endpoint mapping,
 * path resolution, pagination params, and error handling work correctly.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDomainTool } from '../../../src/tools/base-tool.js';
import type { ToolDefinition, DomainToolConfig } from '../../../src/tools/base-tool.js';
import type { VszHttpClient } from '../../../src/http/client.js';

/** Minimal mock of VszHttpClient for testing. */
function createMockHttpClient(): {
  client: VszHttpClient;
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
  del: ReturnType<typeof vi.fn>;
} {
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

const testConfig: DomainToolConfig = {
  name: 'vsz_test',
  description: 'Test tool for unit tests.',
  actions: {
    list: {
      method: 'GET',
      path: '/things',
      description: 'List all things.',
      paginatable: true,
    },
    get: {
      method: 'GET',
      path: '/things/{id}',
      description: 'Get a specific thing.',
    },
    create: {
      method: 'POST',
      path: '/things',
      description: 'Create a new thing.',
    },
    update: {
      method: 'PATCH',
      path: '/things/{id}',
      description: 'Update a thing.',
    },
    delete: {
      method: 'DELETE',
      path: '/things/{id}',
      description: 'Delete a thing.',
    },
    replace: {
      method: 'PUT',
      path: '/things/{id}',
      description: 'Replace a thing entirely.',
    },
    nested: {
      method: 'GET',
      path: '/parents/{parentId}/children/{id}',
      description: 'Get a nested resource.',
    },
    with_resource: {
      method: 'GET',
      path: '/things/{id}/sub/{resource}',
      description: 'Get a sub-resource by type.',
    },
    no_body_post: {
      method: 'POST',
      path: '/things/action',
      description: 'A POST that sends no body.',
      hasBody: false,
    },
  },
};

describe('createDomainTool', () => {
  let mock: ReturnType<typeof createMockHttpClient>;
  let tool: ToolDefinition;

  beforeEach(() => {
    mock = createMockHttpClient();
    tool = createDomainTool(testConfig, mock.client);
  });

  // ── Tool metadata ─────────────────────────────────────────

  it('should have correct name', () => {
    expect(tool.name).toBe('vsz_test');
  });

  it('should include action descriptions in the description', () => {
    expect(tool.description).toContain('List all things');
    expect(tool.description).toContain('Get a specific thing');
    expect(tool.description).toContain('Create a new thing');
  });

  it('should generate input schema with action enum', () => {
    const schema = tool.inputSchema as Record<string, unknown>;
    const props = schema.properties as Record<string, Record<string, unknown>>;
    expect(props.action.enum).toEqual(Object.keys(testConfig.actions));
    expect(schema.required).toEqual(['action']);
  });

  // ── GET requests ──────────────────────────────────────────

  it('should map "list" action to GET /things', async () => {
    mock.get.mockResolvedValue({ list: [], totalCount: 0 });

    const result = await tool.handler({ action: 'list' });

    expect(mock.get).toHaveBeenCalledWith('/things', undefined);
    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.totalCount).toBe(0);
  });

  it('should map "get" action to GET /things/{id}', async () => {
    mock.get.mockResolvedValue({ id: 'abc', name: 'Test' });

    const result = await tool.handler({ action: 'get', id: 'abc' });

    expect(mock.get).toHaveBeenCalledWith('/things/abc', undefined);
    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.id).toBe('abc');
  });

  it('should pass pagination params for paginatable GET lists', async () => {
    mock.get.mockResolvedValue({ list: [], totalCount: 0 });

    await tool.handler({ action: 'list', page: 10, limit: 50 });

    expect(mock.get).toHaveBeenCalledWith('/things', { index: 10, listSize: 50 });
  });

  it('should NOT pass pagination params for non-paginatable GET', async () => {
    mock.get.mockResolvedValue({ id: 'abc' });

    await tool.handler({ action: 'get', id: 'abc', page: 0, limit: 100 });

    expect(mock.get).toHaveBeenCalledWith('/things/abc', undefined);
  });

  // ── POST requests ─────────────────────────────────────────

  it('should map "create" to POST /things with body', async () => {
    mock.post.mockResolvedValue({ id: 'new-id' });

    const data = { name: 'New Thing', value: 42 };
    const result = await tool.handler({ action: 'create', data });

    expect(mock.post).toHaveBeenCalledWith('/things', data);
    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.id).toBe('new-id');
  });

  it('should send no body when hasBody is false', async () => {
    mock.post.mockResolvedValue({ success: true });

    await tool.handler({ action: 'no_body_post' });

    expect(mock.post).toHaveBeenCalledWith('/things/action', undefined);
  });

  // ── PATCH requests ────────────────────────────────────────

  it('should map "update" to PATCH /things/{id} with body', async () => {
    mock.patch.mockResolvedValue(undefined);

    const data = { name: 'Updated' };
    await tool.handler({ action: 'update', id: 'xyz', data });

    expect(mock.patch).toHaveBeenCalledWith('/things/xyz', data);
  });

  // ── PUT requests ──────────────────────────────────────────

  it('should map "replace" to PUT /things/{id} with body', async () => {
    mock.put.mockResolvedValue(undefined);

    const data = { name: 'Replaced', full: true };
    await tool.handler({ action: 'replace', id: 'xyz', data });

    expect(mock.put).toHaveBeenCalledWith('/things/xyz', data);
  });

  // ── DELETE requests ───────────────────────────────────────

  it('should map "delete" to DELETE /things/{id}', async () => {
    mock.del.mockResolvedValue(undefined);

    await tool.handler({ action: 'delete', id: 'xyz' });

    expect(mock.del).toHaveBeenCalledWith('/things/xyz');
  });

  // ── Path resolution ───────────────────────────────────────

  it('should resolve nested paths with parentId and id', async () => {
    mock.get.mockResolvedValue({ id: 'child1' });

    await tool.handler({ action: 'nested', parentId: 'parent1', id: 'child1' });

    expect(mock.get).toHaveBeenCalledWith('/parents/parent1/children/child1', undefined);
  });

  it('should resolve {resource} placeholder', async () => {
    mock.get.mockResolvedValue({ type: 'settings' });

    await tool.handler({ action: 'with_resource', id: 'abc', resource: 'settings' });

    expect(mock.get).toHaveBeenCalledWith('/things/abc/sub/settings', undefined);
  });

  it('should URL-encode path parameters', async () => {
    mock.get.mockResolvedValue({});

    await tool.handler({ action: 'get', id: 'has/slash' });

    expect(mock.get).toHaveBeenCalledWith('/things/has%2Fslash', undefined);
  });

  // ── Error handling ────────────────────────────────────────

  it('should return error for unknown action', async () => {
    const result = await tool.handler({ action: 'nonexistent' });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('Unknown action');
    expect(parsed.error).toContain('nonexistent');
    expect(parsed.error).toContain('list');
  });

  it('should return error for missing action', async () => {
    const result = await tool.handler({});

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('action');
  });

  it('should return error when id is required but missing', async () => {
    const result = await tool.handler({ action: 'get' });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('id');
  });

  it('should return error when parentId is required but missing', async () => {
    const result = await tool.handler({ action: 'nested', id: 'child1' });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('parentId');
  });

  it('should return error when resource is required but missing', async () => {
    const result = await tool.handler({ action: 'with_resource', id: 'abc' });

    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('resource');
  });

  it('should catch and wrap HTTP client errors', async () => {
    mock.get.mockRejectedValue(new Error('Network timeout'));

    const result = await tool.handler({ action: 'list' });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Network timeout');
  });

  // ── Output format ─────────────────────────────────────────

  it('should return JSON stringified content', async () => {
    mock.get.mockResolvedValue({ id: '123', name: 'Zone A' });

    const result = await tool.handler({ action: 'get', id: '123' });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed).toEqual({ id: '123', name: 'Zone A' });
  });

  it('should pretty-print JSON output', async () => {
    mock.get.mockResolvedValue({ id: '1' });

    const result = await tool.handler({ action: 'get', id: '1' });

    expect(result.content[0].text).toContain('\n');
  });
});

describe('vsz_system tool actions', () => {
  it('should create a tool with name vsz_system', async () => {
    const { createVszSystemTool } = await import('../../../src/tools/vsz-system.js');
    const mock = createMockHttpClient();
    const tool = createVszSystemTool(mock.client);

    expect(tool.name).toBe('vsz_system');
  });

  it('should map get_controller to GET /controller', async () => {
    const { createVszSystemTool } = await import('../../../src/tools/vsz-system.js');
    const mock = createMockHttpClient();
    const tool = createVszSystemTool(mock.client);

    mock.get.mockResolvedValue({ controllerVersion: '7.1.1' });
    const result = await tool.handler({ action: 'get_controller' });

    expect(mock.get).toHaveBeenCalledWith('/controller', undefined);
    expect(result.isError).toBeUndefined();
  });

  it('should map get_inventory to GET /system/inventory', async () => {
    const { createVszSystemTool } = await import('../../../src/tools/vsz-system.js');
    const mock = createMockHttpClient();
    const tool = createVszSystemTool(mock.client);

    mock.get.mockResolvedValue({ totalAPs: 50 });
    await tool.handler({ action: 'get_inventory' });

    expect(mock.get).toHaveBeenCalledWith('/system/inventory', undefined);
  });

  it('should map get_syslog to GET /system/syslog', async () => {
    const { createVszSystemTool } = await import('../../../src/tools/vsz-system.js');
    const mock = createMockHttpClient();
    const tool = createVszSystemTool(mock.client);

    mock.get.mockResolvedValue({ enabled: true });
    await tool.handler({ action: 'get_syslog' });

    expect(mock.get).toHaveBeenCalledWith('/system/syslog', undefined);
  });

  it('should map get_snmp to GET /system/snmpAgent', async () => {
    const { createVszSystemTool } = await import('../../../src/tools/vsz-system.js');
    const mock = createMockHttpClient();
    const tool = createVszSystemTool(mock.client);

    mock.get.mockResolvedValue({ version: 'v3' });
    await tool.handler({ action: 'get_snmp' });

    expect(mock.get).toHaveBeenCalledWith('/system/snmpAgent', undefined);
  });

  it('should map update_system to PATCH /system with body', async () => {
    const { createVszSystemTool } = await import('../../../src/tools/vsz-system.js');
    const mock = createMockHttpClient();
    const tool = createVszSystemTool(mock.client);

    mock.patch.mockResolvedValue(undefined);
    const data = { setting: 'value' };
    await tool.handler({ action: 'update_system', data });

    expect(mock.patch).toHaveBeenCalledWith('/system', data);
  });
});

describe('vsz_zones tool actions', () => {
  it('should create a tool with name vsz_zones', async () => {
    const { createVszZonesTool } = await import('../../../src/tools/vsz-zones.js');
    const mock = createMockHttpClient();
    const tool = createVszZonesTool(mock.client);

    expect(tool.name).toBe('vsz_zones');
  });

  it('should map "list" to GET /rkszones', async () => {
    const { createVszZonesTool } = await import('../../../src/tools/vsz-zones.js');
    const mock = createMockHttpClient();
    const tool = createVszZonesTool(mock.client);

    mock.get.mockResolvedValue({ list: [], totalCount: 0 });
    await tool.handler({ action: 'list' });

    expect(mock.get).toHaveBeenCalledWith('/rkszones', undefined);
  });

  it('should map "get" to GET /rkszones/{id}', async () => {
    const { createVszZonesTool } = await import('../../../src/tools/vsz-zones.js');
    const mock = createMockHttpClient();
    const tool = createVszZonesTool(mock.client);

    mock.get.mockResolvedValue({ id: 'zone1', name: 'My Zone' });
    await tool.handler({ action: 'get', id: 'zone1' });

    expect(mock.get).toHaveBeenCalledWith('/rkszones/zone1', undefined);
  });

  it('should map "create" to POST /rkszones', async () => {
    const { createVszZonesTool } = await import('../../../src/tools/vsz-zones.js');
    const mock = createMockHttpClient();
    const tool = createVszZonesTool(mock.client);

    mock.post.mockResolvedValue({ id: 'new-zone' });
    const data = { name: 'New Zone', countryCode: 'US' };
    await tool.handler({ action: 'create', data });

    expect(mock.post).toHaveBeenCalledWith('/rkszones', data);
  });

  it('should map "update" to PATCH /rkszones/{id}', async () => {
    const { createVszZonesTool } = await import('../../../src/tools/vsz-zones.js');
    const mock = createMockHttpClient();
    const tool = createVszZonesTool(mock.client);

    mock.patch.mockResolvedValue(undefined);
    await tool.handler({ action: 'update', id: 'zone1', data: { name: 'Renamed' } });

    expect(mock.patch).toHaveBeenCalledWith('/rkszones/zone1', { name: 'Renamed' });
  });

  it('should map "delete" to DELETE /rkszones/{id}', async () => {
    const { createVszZonesTool } = await import('../../../src/tools/vsz-zones.js');
    const mock = createMockHttpClient();
    const tool = createVszZonesTool(mock.client);

    mock.del.mockResolvedValue(undefined);
    await tool.handler({ action: 'delete', id: 'zone1' });

    expect(mock.del).toHaveBeenCalledWith('/rkszones/zone1');
  });

  it('should map "list_aaa_radius" to GET /rkszones/{parentId}/aaa/radius', async () => {
    const { createVszZonesTool } = await import('../../../src/tools/vsz-zones.js');
    const mock = createMockHttpClient();
    const tool = createVszZonesTool(mock.client);

    mock.get.mockResolvedValue({ list: [] });
    await tool.handler({ action: 'list_aaa_radius', parentId: 'zone1' });

    expect(mock.get).toHaveBeenCalledWith('/rkszones/zone1/aaa/radius', undefined);
  });

  it('should map "list_wlans" to GET /rkszones/{parentId}/wlans', async () => {
    const { createVszZonesTool } = await import('../../../src/tools/vsz-zones.js');
    const mock = createMockHttpClient();
    const tool = createVszZonesTool(mock.client);

    mock.get.mockResolvedValue({ list: [], totalCount: 0 });
    await tool.handler({ action: 'list_wlans', parentId: 'zone1' });

    expect(mock.get).toHaveBeenCalledWith('/rkszones/zone1/wlans', undefined);
  });

  it('should map "list_domains" to GET /domains', async () => {
    const { createVszZonesTool } = await import('../../../src/tools/vsz-zones.js');
    const mock = createMockHttpClient();
    const tool = createVszZonesTool(mock.client);

    mock.get.mockResolvedValue({ list: [] });
    await tool.handler({ action: 'list_domains' });

    expect(mock.get).toHaveBeenCalledWith('/domains', undefined);
  });

  it('should map "get_domain" to GET /domains/{id}', async () => {
    const { createVszZonesTool } = await import('../../../src/tools/vsz-zones.js');
    const mock = createMockHttpClient();
    const tool = createVszZonesTool(mock.client);

    mock.get.mockResolvedValue({ id: 'dom1', name: 'Default' });
    await tool.handler({ action: 'get_domain', id: 'dom1' });

    expect(mock.get).toHaveBeenCalledWith('/domains/dom1', undefined);
  });

  it('should support pagination for zone list', async () => {
    const { createVszZonesTool } = await import('../../../src/tools/vsz-zones.js');
    const mock = createMockHttpClient();
    const tool = createVszZonesTool(mock.client);

    mock.get.mockResolvedValue({ list: [], totalCount: 100 });
    await tool.handler({ action: 'list', page: 0, limit: 25 });

    expect(mock.get).toHaveBeenCalledWith('/rkszones', { index: 0, listSize: 25 });
  });
});

describe('registerTools', () => {
  it('should register all 16 MCP tools on the server', async () => {
    const { registerTools } = await import('../../../src/tools/tool-registry.js');
    const mock = createMockHttpClient();
    const toolFn = vi.fn();
    const server = { tool: toolFn };

    registerTools(server as never, mock.client);

    expect(toolFn).toHaveBeenCalledTimes(16);
    const names = toolFn.mock.calls.map((c: unknown[]) => c[0]);
    expect(names).toContain('vsz_system');
    expect(names).toContain('vsz_zones');
    expect(names).toContain('vsz_ap');
    expect(names).toContain('vsz_wlan');
    expect(names).toContain('vsz_client');
    expect(names).toContain('vsz_auth_services');
    expect(names).toContain('vsz_hotspot');
    expect(names).toContain('vsz_security');
    expect(names).toContain('vsz_network');
    expect(names).toContain('vsz_monitoring');
    expect(names).toContain('vsz_backup');
    expect(names).toContain('vsz_certificate');
    expect(names).toContain('vsz_identity');
    expect(names).toContain('vsz_query');
    expect(names).toContain('vsz_indoor_map');
    expect(names).toContain('vsz_raw_request');
  });

  it('should register tools with valid inputSchema', async () => {
    // Test the underlying tool definitions directly instead of going through
    // the registry, since the registry signature depends on McpServer
    const { createVszSystemTool } = await import('../../../src/tools/vsz-system.js');
    const { createVszZonesTool } = await import('../../../src/tools/vsz-zones.js');
    const mock = createMockHttpClient();

    const tools = [
      createVszSystemTool(mock.client),
      createVszZonesTool(mock.client),
    ];

    for (const tool of tools) {
      const schema = tool.inputSchema as Record<string, unknown>;
      expect(schema.type).toBe('object');
      expect(schema.required).toEqual(['action']);
      const props = schema.properties as Record<string, unknown>;
      expect(props.action).toBeDefined();
    }
  });
});
