import { getSupabase } from './supabase';

export interface QuickMemo {
  id: string;
  content: string;
  created_at: string;
  is_processed: boolean;
  title?: string;
  category?: string;
  tags?: string[];
}

export interface CreateQuickMemoInput {
  content: string;
  title?: string;
  category?: string;
  tags?: string[];
}

export interface QuickMemoFilter {
  category?: string;
  is_processed?: boolean;
  id?: string;
}

export async function getQuickMemos(
  limit: number = 10
): Promise<QuickMemo[]> {
  try {
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
  } catch (e) {
    console.error('Supabase not configured:', e);
    return [];
  }
}

export async function getQuickMemosByFilter(
  filter: QuickMemoFilter,
  limit: number = 50
): Promise<QuickMemo[]> {
  try {
    const supabase = getSupabase();

    let query = supabase
      .from('quick_memos')
      .select('*');

    if (filter.id) {
      query = query.eq('id', filter.id);
    }
    if (filter.category) {
      query = query.eq('category', filter.category);
    }
    if (filter.is_processed !== undefined) {
      query = query.eq('is_processed', filter.is_processed);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching quick memos by filter:', error);
      return [];
    }

    return data || [];
  } catch (e) {
    console.error('Supabase not configured:', e);
    return [];
  }
}

export async function createQuickMemo(
  input: CreateQuickMemoInput
): Promise<QuickMemo | null> {
  try {
    const supabase = getSupabase();

    const insertData: Record<string, unknown> = {
      content: input.content,
    };
    if (input.title !== undefined) insertData.title = input.title;
    if (input.category !== undefined) insertData.category = input.category;
    if (input.tags !== undefined) insertData.tags = input.tags;

    const { data, error } = await supabase
      .from('quick_memos')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating quick memo:', error);
      return null;
    }

    return data;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return null;
  }
}

export async function updateQuickMemo(
  id: string,
  fields: Partial<Pick<QuickMemo, 'content' | 'title' | 'category' | 'tags' | 'is_processed'>>
): Promise<QuickMemo | null> {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('quick_memos')
      .update(fields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating quick memo:', error);
      return null;
    }

    return data;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return null;
  }
}

export async function markMemosAsProcessed(
  ids: string[]
): Promise<boolean> {
  try {
    const supabase = getSupabase();

    const { error } = await supabase
      .from('quick_memos')
      .update({ is_processed: true })
      .in('id', ids);

    if (error) {
      console.error('Error marking memos as processed:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return false;
  }
}

export async function deleteQuickMemo(id: string): Promise<boolean> {
  try {
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
  } catch (e) {
    console.error('Supabase not configured:', e);
    return false;
  }
}
