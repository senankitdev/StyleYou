import { composeTryOnFallback } from '../tryon/compositor';

/**
 * Adapter for running virtual try-on given an avatar image and a dress image.
 */
export async function runTryOn(avatarImageUrl: string, dressImageUrl: string): Promise<string> {
  const useMock = process.env.USE_MOCK_AI === 'true';

  if (useMock) {
    // Delegate to the sharp-based fallback compositor
    return composeTryOnFallback(avatarImageUrl, dressImageUrl);
  }

  // TODO: Implement real AI model integration
  // if (process.env.TRYON_API_URL && process.env.TRYON_API_KEY) {
  //   const response = await fetch(process.env.TRYON_API_URL, { ... });
  //   return response.json().resultUrl;
  // }

  // Fallback if no real integration is implemented
  return composeTryOnFallback(avatarImageUrl, dressImageUrl);
}
