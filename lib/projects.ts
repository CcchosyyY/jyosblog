import { getSupabase, Project } from './supabase';

export type ProjectStatus = Project['status'];

export async function getProjects(
  status?: ProjectStatus
): Promise<Project[]> {
  try {
    const supabase = getSupabase();
    let query = supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return data || [];
  } catch (e) {
    console.error('Supabase not configured:', e);
    return [];
  }
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', slug)
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

export async function getDevlogCountByProject(): Promise<
  Record<string, number>
> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('posts')
      .select('project_id')
      .eq('status', 'published')
      .not('project_id', 'is', null);

    if (error || !data) return {};

    const counts: Record<string, number> = {};
    data.forEach((row: { project_id: string }) => {
      counts[row.project_id] = (counts[row.project_id] || 0) + 1;
    });

    return counts;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return {};
  }
}

export async function getLatestDevlogDate(
  projectId: string
): Promise<string | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('posts')
      .select('published_at')
      .eq('project_id', projectId)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    return data.published_at;
  } catch (e) {
    console.error('Supabase not configured:', e);
    return null;
  }
}
