import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { scrapeDressImage } from '../lib/dress/linkScraper';
import { ERROR_CODES } from '../lib/errors';

describe('linkScraper', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should extract og:image', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-length': '1000' }),
      text: async () => '<html><head><meta property="og:image" content="https://example.com/dress.jpg"></head></html>'
    } as any);

    const url = await scrapeDressImage('https://example.com/product');
    expect(url).toBe('https://example.com/dress.jpg');
  });

  it('should fallback to JSON-LD if og:image is missing', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-length': '1000' }),
      text: async () => '<html><head><script type="application/ld+json">{"@type":"Product","image":"https://example.com/json.jpg"}</script></head></html>'
    } as any);

    const url = await scrapeDressImage('https://example.com/product');
    expect(url).toBe('https://example.com/json.jpg');
  });

  it('should throw if SSRF guard fails on extracted url', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-length': '1000' }),
      text: async () => '<html><head><meta property="og:image" content="http://127.0.0.1/local.jpg"></head></html>'
    } as any);

    await expect(scrapeDressImage('https://example.com/product')).rejects.toThrow(ERROR_CODES.DRESS_IMAGE_NOT_FOUND);
  });
});
