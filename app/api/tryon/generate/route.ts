import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ERROR_CODES, createErrorResponse } from '@/lib/errors';
import { checkRateLimit } from '@/lib/rateLimit';
import { tryOnGenerateSchema } from '@/lib/server-validators';
import { runTryOn } from '@/lib/ai/tryOn';
import { estimateSize, generateFitNotes } from '@/lib/avatar/sizeEstimate';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return createErrorResponse(ERROR_CODES.UNAUTHORIZED, 'Unauthorized', 401);
    }

    if (!checkRateLimit(`tryon:${user.id}`, 10, 3600 * 1000)) {
      return createErrorResponse(ERROR_CODES.RATE_LIMITED, 'Rate limit exceeded', 429);
    }

    const body = await req.json();
    const validationResult = tryOnGenerateSchema.safeParse(body);
    
    if (!validationResult.success) {
      return createErrorResponse(ERROR_CODES.VALIDATION_ERROR, 'Invalid input');
    }

    const { avatarId, dressImageUrl } = validationResult.data;

    // 1. Fetch avatar and verify ownership
    const { data: avatar, error: avatarError } = await supabase
      .from('avatars')
      .select('body_url')
      .eq('id', avatarId)
      .eq('user_id', user.id)
      .single();

    if (avatarError || !avatar) {
       return createErrorResponse(ERROR_CODES.NOT_FOUND, 'Avatar not found', 404);
    }

    // 2. Fetch profile for size estimation
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
       return createErrorResponse(ERROR_CODES.NOT_FOUND, 'Profile not found', 404);
    }

    // 3. Find associated dress link id (if available based on URL)
    const { data: dressLink } = await supabase
      .from('dress_links')
      .select('id')
      .eq('processed_image_url', dressImageUrl)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // 4. Run Try-On (AI or fallback)
    let resultUrl: string;
    try {
      resultUrl = await runTryOn(avatar.body_url, dressImageUrl);
    } catch (e) {
      console.error('TryOn generation failed:', e);
      return createErrorResponse(ERROR_CODES.TRYON_FAILED, 'Failed to generate try-on result', 500);
    }

    // 5. Size Estimation
    const estSize = estimateSize({
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        heightCm: profile.height_cm,
        weightKg: profile.weight_kg,
        shoulderCm: profile.shoulder_cm,
        chestCm: profile.chest_cm,
        waistCm: profile.waist_cm,
        hipCm: profile.hip_cm,
    });
    const fitNotes = generateFitNotes(null as any, estSize); // Profile isn't actually used by the current generator

    // 6. Save Result
    const { data: dbResult, error: dbError } = await supabase
      .from('try_on_results')
      .insert({
        user_id: user.id,
        avatar_id: avatarId,
        dress_link_id: dressLink?.id || null,
        result_url: resultUrl,
        estimated_size: estSize,
        fit_notes: fitNotes,
      })
      .select('id')
      .single();

    if (dbError || !dbResult) {
      console.error(dbError);
      return createErrorResponse(ERROR_CODES.INTERNAL_ERROR, 'Database error', 500);
    }

    return NextResponse.json({
      data: {
        resultId: dbResult.id,
        resultUrl,
        estimatedSize: estSize,
      },
      error: null
    });

  } catch (error) {
    console.error('TryOn POST error:', error);
    return createErrorResponse(ERROR_CODES.INTERNAL_ERROR, 'Internal Server Error', 500);
  }
}
