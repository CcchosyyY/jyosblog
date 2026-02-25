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

// CSS variable name for each category color (defined in globals.css)
export function getCategoryColor(categoryId: string): string {
  const map: Record<string, string> = {
    dev: 'var(--cat-dev)',
    cooking: 'var(--cat-cooking)',
    daily: 'var(--cat-daily)',
    study: 'var(--cat-study)',
    exercise: 'var(--cat-exercise)',
    invest: 'var(--cat-invest)',
  };
  return map[categoryId] || 'var(--muted)';
}

// SVG path (Heroicons outline, 24x24 viewBox) for each category
export function getCategoryIcon(categoryId: string): string {
  const map: Record<string, string> = {
    // daily: sun
    daily: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z',
    // dev: code bracket
    dev: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
    // cooking: frying pan
    cooking: 'M15 11a6 6 0 11-12 0 6 6 0 0112 0z M14.5 14.5L21 21',
    // study: academic cap
    study: 'M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
    // exercise: dumbbell
    exercise: 'M6.5 6.5v11M17.5 6.5v11M6.5 12h11M4 8v8a1 1 0 001 1h1.5V7H5a1 1 0 00-1 1zM20 8v8a1 1 0 01-1 1h-1.5V7H19a1 1 0 011 1z',
    // invest: trending up
    invest: 'M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941',
  };
  return map[categoryId] || 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z';
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
