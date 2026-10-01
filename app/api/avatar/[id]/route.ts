import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ERROR_CODES, createErrorResponse } from '@/lib/errors';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return createErrorResponse(ERROR_CODES.UNAUTHORIZED, 'Unauthorized', 401);
    }

    // Fetch avatar
    const { data: avatar, error: avatarError } = await supabase
      .from('avatars')
      .select('*')
      .eq('id', id)
      .single();

    if (avatarError || !avatar) {
      return createErrorResponse(ERROR_CODES.NOT_FOUND, 'Avatar not found', 404);
    }

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return createErrorResponse(ERROR_CODES.NOT_FOUND, 'Profile not found', 404);
    }

    // Map back to frontend expected shape
    return NextResponse.json({
      data: {
        avatar: {
          avatarId: avatar.id,
          faceUrl: avatar.face_url,
          bodyUrl: avatar.body_url,
          createdAt: avatar.created_at,
          photoUrl: profile.photo_url,
          profile: {
            name: profile.name,
            age: profile.age,
            gender: profile.gender,
            heightCm: profile.height_cm,
            weightKg: profile.weight_kg,
            shoulderCm: profile.shoulder_cm,
            chestCm: profile.chest_cm,
            waistCm: profile.waist_cm,
            hipCm: profile.hip_cm,
          }
        }
      },
      error: null
    });
  } catch (error) {
    console.error('Avatar get error:', error);
    return createErrorResponse(ERROR_CODES.INTERNAL_ERROR, 'Internal Server Error', 500);
  }
}
