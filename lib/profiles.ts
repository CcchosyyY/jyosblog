import { getSupabase } from './supabase';

export interface Profile {
  id: string;
  user_id: string;
  nickname: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export async function getProfile(
  userId: string
): Promise<Profile | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return null;
  }
}

export async function upsertProfile(
  userId: string,
  fields: { nickname?: string; avatar_url?: string; bio?: string }
): Promise<Profile | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          user_id: userId,
          ...fields,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Error upserting profile:', error);
      return null;
    }

    return data;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return null;
  }
}
