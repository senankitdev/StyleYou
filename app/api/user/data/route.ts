import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { deleteFolder } from '@/lib/cloudinary';
import { ERROR_CODES, createErrorResponse } from '@/lib/errors';

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return createErrorResponse(ERROR_CODES.UNAUTHORIZED, 'Unauthorized', 401);
    }

    // 1. Delete all Cloudinary assets in the user's folder
    const folderPath = `styleyou/${user.id}`;
    await deleteFolder(folderPath);

    // 2. Delete all DB rows (Cascade deletion from profiles will handle avatars, dress_links, try_on_results)
    // Wait, the foreign keys are on auth.users, but we can't easily delete the auth.users row from the client.
    // So we manually delete the user-owned data from our tables.
    // Due to cascading, deleting the profile and avatars and dress links might be enough, 
    // but it's safest to just delete from the top level tables directly.
    const adminSupabase = createAdminClient();

    // Since we set ON DELETE CASCADE from auth.users, deleting the auth user would be ideal.
    // However, if we just want to clear data:
    const [res1, res2, res3, res4] = await Promise.all([
      adminSupabase.from('profiles').delete().eq('user_id', user.id),
      adminSupabase.from('avatars').delete().eq('user_id', user.id),
      adminSupabase.from('dress_links').delete().eq('user_id', user.id),
      adminSupabase.from('try_on_results').delete().eq('user_id', user.id),
    ]);

    let deletedRows = 0;
    if (res1.count) deletedRows += res1.count;
    if (res2.count) deletedRows += res2.count;
    if (res3.count) deletedRows += res3.count;
    if (res4.count) deletedRows += res4.count;

    return NextResponse.json({
      data: {
        success: true,
        deletedAssets: 'All user folder assets queued for deletion',
        deletedRows
      },
      error: null
    });
  } catch (error) {
    console.error('Delete User Data error:', error);
    return createErrorResponse(ERROR_CODES.INTERNAL_ERROR, 'Internal Server Error', 500);
  }
}
