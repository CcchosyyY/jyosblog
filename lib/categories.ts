import { getSupabaseAdmin } from './supabase';

export const CATEGORIES = [
  { id: 'daily', name: '일상' },
  { id: 'dev', name: '개발' },
  { id: 'cooking', name: '요리' },
  { id: 'study', name: '공부' },
  { id: 'exercise', name: '운동' },
  { id: 'invest', name: '투자' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export function getCategoryName(categoryId: string): string {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  return category?.name || categoryId;
}

export interface Category {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  } catch (e) {
    console.error('Supabase not configured:', e);
    return [];
  }
}

export async function createCategory(
  id: string,
  name: string,
  sortOrder?: number
): Promise<Category | null> {
  try {
    const supabase = getSupabaseAdmin();

    const insertData: Record<string, unknown> = { id, name };
    if (sortOrder !== undefined) {
      insertData.sort_order = sortOrder;
    }

    const { data, error } = await supabase
      .from('categories')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return null;
    }

    return data;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return null;
  }
}

export async function updateCategory(
  id: string,
  name: string
): Promise<Category | null> {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return null;
    }

    return data;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return null;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return false;
  }
}
