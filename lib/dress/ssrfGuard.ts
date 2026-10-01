import { URL } from 'url';

/**
 * Validates a URL against common SSRF vectors (localhost, private IPs, non-http).
 * This is a basic implementation for the MVP.
 */
export function validateUrlForSsrf(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    
    // Only allow HTTP/HTTPS
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    const hostname = url.hostname;

    // Block obvious localhost / local network hostnames
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.local') ||
      hostname === '127.0.0.1' ||
      hostname === '::1'
    ) {
      return false;
    }

    // Basic regex for IPv4 private ranges:
    // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16
    const isPrivateIp = 
      /^(10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|169\.254\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)$/.test(hostname);
    
    if (isPrivateIp) {
      return false;
    }

    // Note: A robust SSRF guard would perform DNS resolution on the hostname 
    // and check the resolved IP against private ranges to prevent DNS rebinding.
    // For this scope, the basic check above suffices.
    return true;
  } catch {
    return false;
  }
}
