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

    const { data, error } = await supabase
      .from('try_on_results')
      .select(`
        *,
        dress_links (
          source_url,
          processed_image_url
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return createErrorResponse(ERROR_CODES.NOT_FOUND, 'Result not found', 404);
    }

    return NextResponse.json({
      data: {
        result: {
          resultId: data.id,
          resultUrl: data.result_url,
          estimatedSize: data.estimated_size,
          fitNotes: data.fit_notes,
          createdAt: data.created_at,
          dressItem: {
             id: data.dress_link_id || 'unknown',
             imageUrl: data.dress_links?.processed_image_url || '',
             name: 'Dress',
             source: data.dress_links?.source_url === 'upload' ? 'upload' : 'link',
             originalUrl: data.dress_links?.source_url
          }
        }
      },
      error: null
    });
  } catch (error) {
    console.error('TryOn GET error:', error);
    return createErrorResponse(ERROR_CODES.INTERNAL_ERROR, 'Internal Server Error', 500);
  }
}
