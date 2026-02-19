/**
 * Unit tests for system resource handlers.
 *
 * Verifies that resource read handlers correctly call the HTTP client
 * and return properly formatted MCP resource content.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSystemResourceDefinitions } from '../../../src/resources/system-resources.js';
import type { StaticResourceDefinition, TemplateResourceDefinition } from '../../../src/resources/resource-registry.js';

/** Minimal mock of VszHttpClient matching the interface used by resource handlers. */
function createMockHttpClient() {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  };
}

describe('System Resources', () => {
  let mockClient: ReturnType<typeof createMockHttpClient>;
  let definitions: ReturnType<typeof getSystemResourceDefinitions>;

  beforeEach(() => {
    mockClient = createMockHttpClient();
    // Cast is safe because resource handlers only use .get()
    definitions = getSystemResourceDefinitions(mockClient as never);
  });

  function findStatic(name: string): StaticResourceDefinition {
    const def = definitions.find((d) => d.name === name);
    if (!def || def.type !== 'static') throw new Error(`Static resource "${name}" not found`);
    return def;
  }

  function findTemplate(name: string): TemplateResourceDefinition {
    const def = definitions.find((d) => d.name === name);
    if (!def || def.type !== 'template') throw new Error(`Template resource "${name}" not found`);
    return def;
  }

  it('should define exactly 4 system resources', () => {
    expect(definitions).toHaveLength(4);
  });

  describe('vsz://system/summary', () => {
    it('should have correct metadata', () => {
      const def = findStatic('vsz-system-summary');
      expect(def.uri).toBe('vsz://system/summary');
      expect(def.metadata.mimeType).toBe('application/json');
      expect(def.metadata.description).toContain('system summary');
    });

    it('should call GET /system/summary and return JSON content', async () => {
      const summaryData = { clusterStatus: 'active', version: '7.1.1' };
      mockClient.get.mockResolvedValueOnce(summaryData);

      const def = findStatic('vsz-system-summary');
      const result = await def.readHandler(new URL('vsz://system/summary'));

      expect(mockClient.get).toHaveBeenCalledWith('/system/summary');
      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].uri).toBe('vsz://system/summary');
      expect(result.contents[0].mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text as string)).toEqual(summaryData);
    });

    it('should propagate HTTP errors', async () => {
      mockClient.get.mockRejectedValueOnce(new Error('Network error'));

      const def = findStatic('vsz-system-summary');
      await expect(def.readHandler(new URL('vsz://system/summary'))).rejects.toThrow('Network error');
    });
  });

  describe('vsz://controller', () => {
    it('should have correct metadata', () => {
      const def = findStatic('vsz-controller');
      expect(def.uri).toBe('vsz://controller');
      expect(def.metadata.mimeType).toBe('application/json');
    });

    it('should call GET /controller and return JSON content', async () => {
      const controllerData = { hostname: 'vsz01', role: 'leader' };
      mockClient.get.mockResolvedValueOnce(controllerData);

      const def = findStatic('vsz-controller');
      const result = await def.readHandler(new URL('vsz://controller'));

      expect(mockClient.get).toHaveBeenCalledWith('/controller');
      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].uri).toBe('vsz://controller');
      expect(JSON.parse(result.contents[0].text as string)).toEqual(controllerData);
    });
  });

  describe('vsz://domains', () => {
    it('should have correct metadata', () => {
      const def = findStatic('vsz-domains');
      expect(def.uri).toBe('vsz://domains');
      expect(def.metadata.mimeType).toBe('application/json');
    });

    it('should call GET /domains and return list response', async () => {
      const domainList = {
        totalCount: 2,
        hasMore: false,
        firstIndex: 0,
        list: [
          { id: 'd1', name: 'Default' },
          { id: 'd2', name: 'Branch' },
        ],
      };
      mockClient.get.mockResolvedValueOnce(domainList);

      const def = findStatic('vsz-domains');
      const result = await def.readHandler(new URL('vsz://domains'));

      expect(mockClient.get).toHaveBeenCalledWith('/domains');
      expect(result.contents).toHaveLength(1);
      const parsed = JSON.parse(result.contents[0].text as string);
      expect(parsed.totalCount).toBe(2);
      expect(parsed.list).toHaveLength(2);
    });
  });

  describe('vsz://domains/{domainId}', () => {
    it('should be a template resource', () => {
      const def = findTemplate('vsz-domain-by-id');
      expect(def.uriTemplate).toBe('vsz://domains/{domainId}');
      expect(def.metadata.mimeType).toBe('application/json');
    });

    it('should list all domains as concrete resources', async () => {
      const domainList = {
        totalCount: 2,
        hasMore: false,
        firstIndex: 0,
        list: [
          { id: 'd1', name: 'Default' },
          { id: 'd2', name: 'Branch' },
        ],
      };
      mockClient.get.mockResolvedValueOnce(domainList);

      const def = findTemplate('vsz-domain-by-id');
      const result = await def.listHandler!();

      expect(mockClient.get).toHaveBeenCalledWith('/domains');
      expect(result.resources).toHaveLength(2);
      expect(result.resources[0].uri).toBe('vsz://domains/d1');
      expect(result.resources[0].name).toBe('Default');
      expect(result.resources[1].uri).toBe('vsz://domains/d2');
    });

    it('should read a single domain by ID', async () => {
      const domainData = { id: 'd1', name: 'Default', parentDomainId: null };
      mockClient.get.mockResolvedValueOnce(domainData);

      const def = findTemplate('vsz-domain-by-id');
      const result = await def.readTemplateHandler(
        new URL('vsz://domains/d1'),
        { domainId: 'd1' },
      );

      expect(mockClient.get).toHaveBeenCalledWith('/domains/d1');
      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].uri).toBe('vsz://domains/d1');
      expect(JSON.parse(result.contents[0].text as string)).toEqual(domainData);
    });

    it('should URL-encode the domain ID', async () => {
      mockClient.get.mockResolvedValueOnce({ id: 'a/b', name: 'Test' });

      const def = findTemplate('vsz-domain-by-id');
      await def.readTemplateHandler(
        new URL('vsz://domains/a%2Fb'),
        { domainId: 'a/b' },
      );

      expect(mockClient.get).toHaveBeenCalledWith('/domains/a%2Fb');
    });
  });
});

describe('Zone Resources', () => {
  let mockClient: ReturnType<typeof createMockHttpClient>;

  beforeEach(() => {
    mockClient = createMockHttpClient();
  });

  it('should be importable and return definitions', async () => {
    const { getZoneResourceDefinitions } = await import('../../../src/resources/zone-resources.js');
    const defs = getZoneResourceDefinitions(mockClient as never);
    expect(defs).toHaveLength(3);
    expect(defs.map((d) => d.name)).toEqual([
      'vsz-zones',
      'vsz-zone-by-id',
      'vsz-zone-wlans',
    ]);
  });

  it('should read zone list from GET /rkszones', async () => {
    const { getZoneResourceDefinitions } = await import('../../../src/resources/zone-resources.js');
    const zoneList = {
      totalCount: 1,
      hasMore: false,
      firstIndex: 0,
      list: [{ id: 'z1', name: 'HQ Zone' }],
    };
    mockClient.get.mockResolvedValueOnce(zoneList);

    const defs = getZoneResourceDefinitions(mockClient as never);
    const zonesDef = defs.find((d) => d.name === 'vsz-zones')!;
    if (zonesDef.type !== 'static') throw new Error('Expected static');

    const result = await zonesDef.readHandler(new URL('vsz://zones'));
    expect(mockClient.get).toHaveBeenCalledWith('/rkszones');
    expect(result.contents).toHaveLength(1);
    const parsed = JSON.parse(result.contents[0].text as string);
    expect(parsed.list[0].name).toBe('HQ Zone');
  });

  it('should read single zone from GET /rkszones/{id}', async () => {
    const { getZoneResourceDefinitions } = await import('../../../src/resources/zone-resources.js');
    const zoneData = { id: 'z1', name: 'HQ Zone', countryCode: 'US' };
    mockClient.get.mockResolvedValueOnce(zoneData);

    const defs = getZoneResourceDefinitions(mockClient as never);
    const zoneDef = defs.find((d) => d.name === 'vsz-zone-by-id')!;
    if (zoneDef.type !== 'template') throw new Error('Expected template');

    const result = await zoneDef.readTemplateHandler(
      new URL('vsz://zones/z1'),
      { zoneId: 'z1' },
    );
    expect(mockClient.get).toHaveBeenCalledWith('/rkszones/z1');
    expect(JSON.parse(result.contents[0].text as string)).toEqual(zoneData);
  });

  it('should read zone WLANs from GET /rkszones/{zoneId}/wlans', async () => {
    const { getZoneResourceDefinitions } = await import('../../../src/resources/zone-resources.js');
    const wlanList = {
      totalCount: 2,
      hasMore: false,
      firstIndex: 0,
      list: [
        { id: 'w1', name: 'Corp', ssid: 'Corp-WiFi', zoneId: 'z1', type: 'standardOpen' },
        { id: 'w2', name: 'Guest', ssid: 'Guest-WiFi', zoneId: 'z1', type: 'guestAccess' },
      ],
    };
    mockClient.get.mockResolvedValueOnce(wlanList);

    const defs = getZoneResourceDefinitions(mockClient as never);
    const wlanDef = defs.find((d) => d.name === 'vsz-zone-wlans')!;
    if (wlanDef.type !== 'template') throw new Error('Expected template');

    const result = await wlanDef.readTemplateHandler(
      new URL('vsz://zones/z1/wlans'),
      { zoneId: 'z1' },
    );
    expect(mockClient.get).toHaveBeenCalledWith('/rkszones/z1/wlans');
    const parsed = JSON.parse(result.contents[0].text as string);
    expect(parsed.list).toHaveLength(2);
    expect(parsed.list[0].ssid).toBe('Corp-WiFi');
  });

  it('should list zones for zone-by-id template', async () => {
    const { getZoneResourceDefinitions } = await import('../../../src/resources/zone-resources.js');
    const zoneList = {
      totalCount: 2,
      hasMore: false,
      firstIndex: 0,
      list: [
        { id: 'z1', name: 'HQ', description: 'Headquarters' },
        { id: 'z2', name: 'Branch' },
      ],
    };
    mockClient.get.mockResolvedValueOnce(zoneList);

    const defs = getZoneResourceDefinitions(mockClient as never);
    const zoneDef = defs.find((d) => d.name === 'vsz-zone-by-id')!;
    if (zoneDef.type !== 'template') throw new Error('Expected template');

    const result = await zoneDef.listHandler!();
    expect(result.resources).toHaveLength(2);
    expect(result.resources[0].uri).toBe('vsz://zones/z1');
    expect(result.resources[0].name).toBe('HQ');
    expect(result.resources[0].description).toBe('Headquarters');
    expect(result.resources[1].description).toBe('Zone: Branch');
  });
});

describe('Resource Registry', () => {
  it('should aggregate all resource definitions', async () => {
    const { getResourceDefinitions } = await import('../../../src/resources/resource-registry.js');
    const mockClient = createMockHttpClient();
    const defs = getResourceDefinitions(mockClient as never);

    // 4 system + 3 zone = 7 total
    expect(defs).toHaveLength(7);
  });

  it('should export registerResources function', async () => {
    const mod = await import('../../../src/resources/resource-registry.js');
    expect(typeof mod.registerResources).toBe('function');
  });
});
