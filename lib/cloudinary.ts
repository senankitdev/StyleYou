import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const cloudinaryConfig = cloudinary.config();

export interface UploadResult {
  public_id: string;
  secure_url: string;
}

/**
 * Upload an image buffer to Cloudinary using a signed server-side upload.
 */
export async function uploadImage(
  buffer: Buffer,
  folder: string,
  options: UploadApiOptions = {}
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('No result from Cloudinary upload'));
        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
        });
      }
    );
    stream.end(buffer);
  });
}

/**
 * Build a transformation URL. We use this to deliver optimal formats (f_auto, q_auto)
 * and perform background removal on the fly if enabled.
 */
export function buildTransformUrl(publicId: string, options: any = {}): string {
  // Always apply f_auto, q_auto for delivery optimization
  const baseOptions = { fetch_format: 'auto', quality: 'auto', ...options };
  return cloudinary.url(publicId, baseOptions);
}

/**
 * Perform background removal if the add-on is enabled, otherwise fallback to standard delivery.
 */
export function getDressDeliveryUrl(publicId: string): string {
  const bgRemovalEnabled = process.env.CLOUDINARY_BG_REMOVAL_ENABLED === 'true';
  const transformations: any[] = [];
  
  if (bgRemovalEnabled) {
    // Cloudinary AI Background Removal add-on (must be enabled in dashboard)
    transformations.push({ effect: 'background_removal' });
  }
  
  return cloudinary.url(publicId, {
    transformation: transformations,
    fetch_format: 'auto',
    quality: 'auto',
  });
}

/**
 * Delete a list of assets by their public_ids.
 */
export async function deleteAssets(publicIds: string[]): Promise<void> {
  if (publicIds.length === 0) return;
  // Use destroy for single, delete_resources for multiple.
  try {
    if (publicIds.length === 1) {
       await cloudinary.uploader.destroy(publicIds[0]);
    } else {
       await cloudinary.api.delete_resources(publicIds);
    }
  } catch (error) {
    console.error('Failed to delete assets from Cloudinary', error);
  }
}

/**
 * Delete an entire user folder.
 */
export async function deleteFolder(folderPath: string): Promise<void> {
  try {
    await cloudinary.api.delete_resources_by_prefix(folderPath);
    await cloudinary.api.delete_folder(folderPath);
  } catch (error) {
    console.error('Failed to delete folder from Cloudinary', error);
  }
}
