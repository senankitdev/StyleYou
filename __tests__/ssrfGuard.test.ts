import { describe, it, expect } from 'vitest';
import { validateUrlForSsrf } from '../lib/dress/ssrfGuard';

describe('ssrfGuard', () => {
  it('should allow valid public HTTP/HTTPS URLs', () => {
    expect(validateUrlForSsrf('https://example.com/dress.jpg')).toBe(true);
    expect(validateUrlForSsrf('http://zara.com/product/123')).toBe(true);
  });

  it('should block non-HTTP protocols', () => {
    expect(validateUrlForSsrf('ftp://example.com')).toBe(false);
    expect(validateUrlForSsrf('file:///etc/passwd')).toBe(false);
    expect(validateUrlForSsrf('data:text/html,test')).toBe(false);
  });

  it('should block localhost and local network hostnames', () => {
    expect(validateUrlForSsrf('http://localhost:3000')).toBe(false);
    expect(validateUrlForSsrf('http://127.0.0.1')).toBe(false);
    expect(validateUrlForSsrf('http://server.local')).toBe(false);
  });

  it('should block private IP ranges', () => {
    expect(validateUrlForSsrf('http://10.0.0.1')).toBe(false);
    expect(validateUrlForSsrf('http://192.168.1.1')).toBe(false);
    expect(validateUrlForSsrf('http://172.16.0.1')).toBe(false);
    expect(validateUrlForSsrf('http://169.254.169.254')).toBe(false);
  });

  it('should handle invalid URLs safely', () => {
    expect(validateUrlForSsrf('not-a-url')).toBe(false);
  });
});
