import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ERROR_CODES, createErrorResponse } from '@/lib/errors';
import { checkRateLimit } from '@/lib/rateLimit';
import { dressImportSchema } from '@/lib/server-validators';
import { scrapeDressImage } from '@/lib/dress/linkScraper';
import { uploadImage, getDressDeliveryUrl } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return createErrorResponse(ERROR_CODES.UNAUTHORIZED, 'Unauthorized', 401);
    }

    if (!checkRateLimit(`dress_import:${user.id}`, 10, 3600 * 1000)) {
      return createErrorResponse(ERROR_CODES.RATE_LIMITED, 'Rate limit exceeded', 429);
    }

    const body = await req.json();
    const validationResult = dressImportSchema.safeParse(body);
    
    if (!validationResult.success) {
      return createErrorResponse(ERROR_CODES.INVALID_URL, 'Invalid URL');
    }

    const { url } = validationResult.data;

    // 1. Scrape image URL
    let imageUrl: string;
    try {
      imageUrl = await scrapeDressImage(url);
    } catch (e: any) {
      return createErrorResponse(e.message as typeof ERROR_CODES[keyof typeof ERROR_CODES] || ERROR_CODES.DRESS_IMAGE_NOT_FOUND, 'Failed to extract dress image', 400);
    }

    // 2. Download the image to a buffer
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
       return createErrorResponse(ERROR_CODES.DRESS_IMAGE_NOT_FOUND, 'Failed to download dress image', 400);
    }
    const buffer = Buffer.from(await imgRes.arrayBuffer());

    // 3. Upload to Cloudinary
    const folder = `styleyou/${user.id}/dresses`;
    const uploadResult = await uploadImage(buffer, folder);

    // 4. Generate the processed URL (includes BG removal if enabled)
    const processedUrl = getDressDeliveryUrl(uploadResult.public_id);

    // 5. Save to database
    const { data: dbResult, error: dbError } = await supabase
      .from('dress_links')
      .insert({
        user_id: user.id,
        source_url: url,
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
    console.error('Dress import error:', error);
    return createErrorResponse(ERROR_CODES.INTERNAL_ERROR, 'Internal Server Error', 500);
  }
}
