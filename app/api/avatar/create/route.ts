import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { uploadImage } from '@/lib/cloudinary';
import { ERROR_CODES, createErrorResponse } from '@/lib/errors';
import { checkRateLimit } from '@/lib/rateLimit';
import { ACCEPTED_IMAGE_TYPES, PHOTO_MAX_SIZE_BYTES } from '@/lib/constants';
import { avatarCreateSchema } from '@/lib/server-validators';
import { mapMeasurementsToParameters } from '@/lib/avatar/measurementMapper';
import { createFaceAvatar } from '@/lib/ai/avatarModel';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return createErrorResponse(ERROR_CODES.UNAUTHORIZED, 'Unauthorized', 401);
    }

    // Rate Limit: 3 per hour
    if (!checkRateLimit(`avatar:${user.id}`, 3, 3600 * 1000)) {
      return createErrorResponse(ERROR_CODES.RATE_LIMITED, 'Rate limit exceeded', 429);
    }

    const formData = await req.formData();
    const photo = formData.get('photo') as File | null;
    const profileDataStr = formData.get('profile') as string | null;

    if (!photo || !profileDataStr) {
      return createErrorResponse(ERROR_CODES.VALIDATION_ERROR, 'Missing photo or profile data');
    }

    // Validate Profile Data
    let profileData;
    try {
      profileData = JSON.parse(profileDataStr);
    } catch {
      return createErrorResponse(ERROR_CODES.VALIDATION_ERROR, 'Invalid profile JSON');
    }

    const validationResult = avatarCreateSchema.safeParse({ profile: profileData });
    if (!validationResult.success) {
      return createErrorResponse(ERROR_CODES.VALIDATION_ERROR, 'Invalid profile data');
    }

    const { profile } = validationResult.data;

    if (!profile.consent) {
      return createErrorResponse(ERROR_CODES.CONSENT_REQUIRED, 'Consent required');
    }

    // Validate Photo File
    if (!ACCEPTED_IMAGE_TYPES.includes(photo.type)) {
      return createErrorResponse(ERROR_CODES.INVALID_FILE, 'Unsupported image type');
    }
    if (photo.size > PHOTO_MAX_SIZE_BYTES) {
      return createErrorResponse(ERROR_CODES.INVALID_FILE, 'Image too large');
    }

    // Upload Photo to Cloudinary (with face crop)
    const buffer = Buffer.from(await photo.arrayBuffer());
    const folder = `styleyou/${user.id}/avatars`;

    const photoUpload = await uploadImage(buffer, folder, {
      gravity: 'face',
      crop: 'thumb',
      width: 400,
      height: 400,
    });

    // Generate Face Avatar
    const faceAvatarUrl = await createFaceAvatar(photoUpload.secure_url);

    // Generate Body Avatar
    const { renderAvatarBody: renderBody } = await import('@/lib/avatar/bodyRenderer');
    const bodyParams = mapMeasurementsToParameters(profile);
    const bodyBuffer = await renderBody(buffer, bodyParams, profile.gender);
    
    const bodyUpload = await uploadImage(bodyBuffer, folder);

    // Save to Supabase (using admin client since we are inserting into multiple tables, 
    // or just the regular client since RLS allows own inserts)
    // Actually, RLS allows user to insert into their own profile/avatar.
    
    // Upsert Profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        height_cm: profile.heightCm,
        weight_kg: profile.weightKg,
        shoulder_cm: profile.shoulderCm,
        chest_cm: profile.chestCm,
        waist_cm: profile.waistCm,
        hip_cm: profile.hipCm,
        photo_public_id: photoUpload.public_id,
        photo_url: faceAvatarUrl,
        consent_given: profile.consent,
        consent_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (profileError) {
      console.error(profileError);
      return createErrorResponse(ERROR_CODES.INTERNAL_ERROR, 'Database error (profile)', 500);
    }

    // Insert Avatar
    const { data: avatarRow, error: avatarError } = await supabase
      .from('avatars')
      .insert({
        user_id: user.id,
        face_public_id: photoUpload.public_id,
        face_url: faceAvatarUrl,
        body_public_id: bodyUpload.public_id,
        body_url: bodyUpload.secure_url,
        body_parameters: bodyParams,
      })
      .select('id')
      .single();

    if (avatarError || !avatarRow) {
       console.error(avatarError);
       return createErrorResponse(ERROR_CODES.INTERNAL_ERROR, 'Database error (avatar)', 500);
    }

    return NextResponse.json({
      data: {
        avatarId: avatarRow.id,
        faceUrl: faceAvatarUrl,
        bodyUrl: bodyUpload.secure_url,
      },
      error: null
    });
  } catch (error) {
    console.error('Avatar create error:', error);
    return createErrorResponse(ERROR_CODES.INTERNAL_ERROR, 'Internal Server Error', 500);
  }
}
