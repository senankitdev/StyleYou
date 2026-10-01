import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ERROR_CODES, createErrorResponse } from '@/lib/errors';
import { uploadImage, getDressDeliveryUrl } from '@/lib/cloudinary';
import { ACCEPTED_IMAGE_TYPES, PHOTO_MAX_SIZE_BYTES } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return createErrorResponse(ERROR_CODES.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const formData = await req.formData();
    const photo = formData.get('photo') as File | null;

    if (!photo) {
      return createErrorResponse(ERROR_CODES.VALIDATION_ERROR, 'Missing photo');
    }

    // Validate Photo File
    if (!ACCEPTED_IMAGE_TYPES.includes(photo.type)) {
      return createErrorResponse(ERROR_CODES.INVALID_FILE, 'Unsupported image type');
    }
    if (photo.size > PHOTO_MAX_SIZE_BYTES) {
      return createErrorResponse(ERROR_CODES.INVALID_FILE, 'Image too large');
    }

    const buffer = Buffer.from(await photo.arrayBuffer());
    
    // Upload to Cloudinary
    const folder = `styleyou/${user.id}/dresses`;
    const uploadResult = await uploadImage(buffer, folder);

    // Generate processed URL
    const processedUrl = getDressDeliveryUrl(uploadResult.public_id);

    // Save to database
    const { data: dbResult, error: dbError } = await supabase
      .from('dress_links')
      .insert({
        user_id: user.id,
        source_url: 'upload',
        dress_public_id: uploadResult.public_id,
        dress_image_url: uploadResult.secure_url,
        processed_image_url: processedUrl,
      })
      .select('id')
      .single();

    if (dbError || !dbResult) {
      console.error(dbError);
      return createErrorResponse(ERROR_CODES.INTERNAL_ERROR, 'Database error', 500);
    }

    return NextResponse.json({
      data: {
        dressId: dbResult.id,
        dressImageUrl: processedUrl,
      },
      error: null
    });

  } catch (error) {
    console.error('Dress upload error:', error);
    return createErrorResponse(ERROR_CODES.INTERNAL_ERROR, 'Internal Server Error', 500);
  }
}
