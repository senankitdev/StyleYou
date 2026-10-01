import { Profile } from '../types';

/**
 * Returns a size estimate based on chest, waist, and hip measurements.
 * This is a standard size chart mapping and should always be treated as an estimate.
 */
export function estimateSize(profile: Profile): string {
  const { chestCm: c, waistCm: w, hipCm: h } = profile;

  // Simple scoring mechanism based on standard charts
  if (c < 82 && w < 62 && h < 86) return 'XS';
  if (c <= 88 && w <= 68 && h <= 92) return 'S';
  if (c <= 96 && w <= 76 && h <= 100) return 'M';
  if (c <= 104 && w <= 84 && h <= 108) return 'L';
  if (c <= 112 && w <= 92 && h <= 116) return 'XL';
  return 'XXL';
}

export function generateFitNotes(profile: Profile, estimatedSize: string): string {
  return `This is an estimated fit for size ${estimatedSize} based on your provided measurements. Results may vary by brand.`;
}
