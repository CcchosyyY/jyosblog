import { getSupabase } from './supabase';

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export async function getCommentsByPostId(
  postId: string
): Promise<Comment[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }

    return data || [];
  } catch (e) {
    console.error('Supabase not configured:', e);
    return [];
  }
}

export async function createComment(
  postId: string,
  userId: string,
  userName: string,
  userAvatar: string | null,
  content: string
): Promise<Comment | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: userId,
        user_name: userName,
        user_avatar: userAvatar,
        content,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      return null;
    }

    return data;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return null;
  }
}

export async function deleteComment(
  commentId: string,
  userId: string
): Promise<boolean> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting comment:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return false;
  }
}

export async function getCommentCount(
  postId: string
): Promise<number> {
  try {
    const supabase = getSupabase();
    const { count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (error) {
      console.error('Error fetching comment count:', error);
      return 0;
    }

    return count || 0;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return 0;
  }
}
