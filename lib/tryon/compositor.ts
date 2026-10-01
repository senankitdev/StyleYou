import sharp from 'sharp';
import { uploadImage } from '../cloudinary';

/**
 * Fallback compositor for virtual try-on.
 * Scales the dress to the avatar's body width and overlays it.
 * This is a visual approximation fallback, not AI-powered try-on.
 */
export async function composeTryOnFallback(avatarUrl: string, dressUrl: string): Promise<string> {
  try {
    // 1. Fetch images
    const [avatarRes, dressRes] = await Promise.all([
      fetch(avatarUrl),
      fetch(dressUrl)
    ]);

    if (!avatarRes.ok || !dressRes.ok) {
      throw new Error('Failed to fetch source images for composition');
    }

    const avatarBuffer = Buffer.from(await avatarRes.arrayBuffer());
    const dressBuffer = Buffer.from(await dressRes.arrayBuffer());

    // 2. Process dress: resize to fit torso width (~180px)
    const targetDressWidth = 180;
    const processedDress = await sharp(dressBuffer)
      .resize(targetDressWidth, null, { fit: 'inside' })
      .toBuffer();

    // 3. Composite dress onto avatar (avatar is 400x800, center is x=200, shoulders at ~y=120)
    // The exact y offset would depend on the dress image, using a fixed offset for fallback
    const compositeBuffer = await sharp(avatarBuffer)
      .composite([
        {
          input: processedDress,
          top: 150, // Approximate chest/torso start Y
          left: Math.round(200 - (targetDressWidth / 2)),
        }
      ])
      .png()
      .toBuffer();

    // 4. Upload result to Cloudinary
    const result = await uploadImage(compositeBuffer, 'styleyou/fallback_results', {
      resource_type: 'image',
    });

    return result.secure_url;
  } catch (error) {
    console.error('Fallback compositor failed:', error);
    // If even fallback fails, just return the avatar body
    return avatarUrl;
  }
}
