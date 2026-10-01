import * as cheerio from 'cheerio';
import { validateUrlForSsrf } from './ssrfGuard';
import { ERROR_CODES, createErrorResponse } from '../errors';

/**
 * Scrapes a given URL to find the main product image.
 * Uses cheerio to parse HTML and look for og:image, JSON-LD, or large img tags.
 */
export async function scrapeDressImage(targetUrl: string): Promise<string> {
  if (!validateUrlForSsrf(targetUrl)) {
    throw new Error(ERROR_CODES.SSRF_BLOCKED);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'StyleYouBot/1.0',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });

    if (!response.ok) {
      throw new Error(ERROR_CODES.DRESS_IMAGE_NOT_FOUND);
    }

    // Check size cap (10MB)
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 10 * 1024 * 1024) {
       throw new Error(ERROR_CODES.DRESS_IMAGE_NOT_FOUND);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 1. Check og:image
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage && validateUrlForSsrf(ogImage)) {
      return ogImage.startsWith('//') ? `https:${ogImage}` : ogImage;
    }

    // 2. Check JSON-LD
    let jsonLdImage: string | null = null;
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).html() || '{}');
        if (data['@type'] === 'Product' || data['@type'] === 'ProductGroup') {
          if (data.image) {
            if (typeof data.image === 'string') jsonLdImage = data.image;
            if (Array.isArray(data.image)) jsonLdImage = data.image[0];
            if (data.image.url) jsonLdImage = data.image.url;
          }
        }
      } catch {
        // ignore parse errors
      }
    });

    if (jsonLdImage && validateUrlForSsrf(jsonLdImage as string)) {
      return (jsonLdImage as string).startsWith('//') ? `https:${jsonLdImage}` : (jsonLdImage as string);
    }

    // 3. Fallback: find largest/most relevant img tag
    let bestImg: string | null = null;
    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      const alt = $(el).attr('alt') || '';
      const classes = $(el).attr('class') || '';
      
      if (src && !src.includes('logo') && !src.includes('icon') && !src.includes('spinner')) {
         if (classes.includes('product') || alt.length > 5) {
             bestImg = src;
             return false; // break loop
         }
      }
    });

    if (bestImg) {
      // Resolve relative URLs
      if ((bestImg as string).startsWith('/')) {
        const baseUrl = new URL(targetUrl);
        bestImg = `${baseUrl.origin}${bestImg}`;
      } else if ((bestImg as string).startsWith('//')) {
        bestImg = `https:${bestImg}`;
      }
      
      if (validateUrlForSsrf(bestImg as string)) {
        return bestImg as string;
      }
    }

    throw new Error(ERROR_CODES.DRESS_IMAGE_NOT_FOUND);

  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error(ERROR_CODES.DRESS_IMAGE_NOT_FOUND);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
