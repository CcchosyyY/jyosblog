import { getSupabase } from './supabase';

export interface QuickMemo {
  id: string;
  content: string;
  created_at: string;
  is_processed: boolean;
}

export async function getQuickMemos(limit: number = 10): Promise<QuickMemo[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('quick_memos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching quick memos:', error);
    return [];
  }

  return data || [];
}

export async function createQuickMemo(content: string): Promise<QuickMemo | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('quick_memos')
    .insert({ content })
    .select()
    .single();

  if (error) {
    console.error('Error creating quick memo:', error);
    return null;
  }

  return data;
}

export async function deleteQuickMemo(id: string): Promise<boolean> {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('quick_memos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting quick memo:', error);
    return false;
  }

  return true;
}
