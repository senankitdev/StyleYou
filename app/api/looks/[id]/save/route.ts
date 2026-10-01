import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ERROR_CODES, createErrorResponse } from '@/lib/errors';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return createErrorResponse(ERROR_CODES.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const { error } = await supabase
      .from('try_on_results')
      .update({ is_saved: true })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return createErrorResponse(ERROR_CODES.NOT_FOUND, 'Result not found or error updating', 404);
    }

    return NextResponse.json({ data: { success: true }, error: null });
  } catch (error) {
    console.error('Looks Save POST error:', error);
    return createErrorResponse(ERROR_CODES.INTERNAL_ERROR, 'Internal Server Error', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return createErrorResponse(ERROR_CODES.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const { error } = await supabase
      .from('try_on_results')
      .update({ is_saved: false })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return createErrorResponse(ERROR_CODES.NOT_FOUND, 'Result not found or error updating', 404);
    }

    return NextResponse.json({ data: { success: true }, error: null });
  } catch (error) {
    console.error('Looks Save DELETE error:', error);
    return createErrorResponse(ERROR_CODES.INTERNAL_ERROR, 'Internal Server Error', 500);
  }
}
