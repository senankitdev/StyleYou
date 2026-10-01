import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ERROR_CODES, createErrorResponse } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return createErrorResponse(ERROR_CODES.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('try_on_results')
      .select(`
        *,
        dress_links (
          source_url,
          processed_image_url
        )
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .eq('is_saved', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return createErrorResponse(ERROR_CODES.INTERNAL_ERROR, 'Database error', 500);
    }

    const looks = data.map(d => ({
        resultId: d.id,
        resultUrl: d.result_url,
        estimatedSize: d.estimated_size,
        fitNotes: d.fit_notes,
        createdAt: d.created_at,
        dressItem: {
            id: d.dress_link_id || 'unknown',
            imageUrl: d.dress_links?.processed_image_url || '',
            name: 'Dress',
            source: d.dress_links?.source_url === 'upload' ? 'upload' : 'link',
            originalUrl: d.dress_links?.source_url
        }
    }));

    return NextResponse.json({
      data: { looks, total: count, page },
      error: null
    });
  } catch (error) {
    console.error('Looks GET error:', error);
    return createErrorResponse(ERROR_CODES.INTERNAL_ERROR, 'Internal Server Error', 500);
  }
}
