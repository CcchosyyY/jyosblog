import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are not configured');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseKey);
  return supabaseInstance;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (supabaseAdminInstance) {
    return supabaseAdminInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase service role key is not configured');
  }

  supabaseAdminInstance = createClient(supabaseUrl, serviceRoleKey);
  return supabaseAdminInstance;
}

export const supabase = {
  get client() {
    return getSupabase();
  }
};

export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  description: string | null;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  suggested_category: string | null;
  thumbnail: string | null;
  project_id: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  long_description: string | null;
  tags: string[];
  status: 'active' | 'completed' | 'archived';
  github_url: string | null;
  live_url: string | null;
  gradient: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
