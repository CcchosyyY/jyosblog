import { getSupabase } from './supabase';

export async function incrementView(
  postId: string,
  viewerHash: string
): Promise<void> {
  try {
    const supabase = getSupabase();
    // upsert with onConflict to avoid duplicate counting
    await supabase
      .from('post_views')
      .upsert(
        { post_id: postId, viewer_hash: viewerHash },
        { onConflict: 'post_id,viewer_hash', ignoreDuplicates: true }
      );
  } catch (e) {
    console.error('Error incrementing view:', e);
  }
}

export async function getViewCount(
  postId: string
): Promise<number> {
  try {
    const supabase = getSupabase();
    const { count, error } = await supabase
      .from('post_views')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (error) {
      console.error('Error fetching view count:', error);
      return 0;
    }

    return count || 0;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return 0;
  }
}

export async function getViewCounts(
  postIds: string[]
): Promise<Record<string, number>> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('post_views')
      .select('post_id')
      .in('post_id', postIds);

    if (error) {
      console.error('Error fetching view counts:', error);
      return {};
    }

    const counts: Record<string, number> = {};
    for (const id of postIds) {
      counts[id] = 0;
    }
    for (const row of data || []) {
      counts[row.post_id] = (counts[row.post_id] || 0) + 1;
    }

    return counts;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return {};
  }
}
