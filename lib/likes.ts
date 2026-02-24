import { getSupabase } from './supabase';

export async function toggleLike(
  postId: string,
  userId: string
): Promise<{ liked: boolean; count: number }> {
  try {
    const supabase = getSupabase();

    // Check if already liked
    const { data: existing } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      // Unlike
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
    } else {
      // Like
      await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: userId });
    }

    const count = await getLikeCount(postId);
    return { liked: !existing, count };
  } catch (e) {
    console.error('Error toggling like:', e);
    return { liked: false, count: 0 };
  }
}

export async function getLikeCount(
  postId: string
): Promise<number> {
  try {
    const supabase = getSupabase();
    const { count, error } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (error) {
      console.error('Error fetching like count:', error);
      return 0;
    }

    return count || 0;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return 0;
  }
}

export async function isLikedByUser(
  postId: string,
  userId: string
): Promise<boolean> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return false;
    }

    return true;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return false;
  }
}

export async function getLikeCounts(
  postIds: string[]
): Promise<Record<string, number>> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('post_likes')
      .select('post_id')
      .in('post_id', postIds);

    if (error) {
      console.error('Error fetching like counts:', error);
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
