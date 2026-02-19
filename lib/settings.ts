import { getSupabase } from './supabase';

export interface BlogSettings {
  id: string;
  blog_title: string;
  blog_description: string;
  profile_name: string;
  profile_subtitle: string;
  updated_at: string;
}

export async function getSettings(): Promise<BlogSettings | null> {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('blog_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching settings:', error);
      return null;
    }

    return data;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return null;
  }
}

export async function updateSettings(
  settings: Partial<Omit<BlogSettings, 'id' | 'updated_at'>>
): Promise<BlogSettings | null> {
  try {
    const supabase = getSupabase();

    const { data: existing, error: fetchError } = await supabase
      .from('blog_settings')
      .select('id')
      .limit(1)
      .single();

    if (fetchError || !existing) {
      console.error('Error fetching settings for update:', fetchError);
      return null;
    }

    const { data, error } = await supabase
      .from('blog_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating settings:', error);
      return null;
    }

    return data;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return null;
  }
}
