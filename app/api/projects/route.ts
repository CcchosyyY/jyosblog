import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';

const VALID_STATUSES = ['active', 'completed', 'archived'];
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validateProject(
  body: Record<string, unknown>,
  requireId: boolean
): string | null {
  if (requireId) {
    if (!body.id || typeof body.id !== 'string' || body.id.trim() === '') {
      return 'id is required';
    }
  } else {
    if (!body.id || typeof body.id !== 'string' || !SLUG_REGEX.test(body.id)) {
      return 'id is required and must be URL-safe (lowercase letters, numbers, hyphens)';
    }
  }
  if (
    body.title !== undefined &&
    (typeof body.title !== 'string' || body.title.trim() === '')
  ) {
    return 'title must be a non-empty string';
  }
  if (!requireId && (!body.title || typeof body.title !== 'string')) {
    return 'title is required';
  }
  if (
    body.status !== undefined &&
    !VALID_STATUSES.includes(body.status as string)
  ) {
    return 'status must be "active", "completed", or "archived"';
  }
  if (
    body.tags !== undefined &&
    (!Array.isArray(body.tags) ||
      !body.tags.every((t: unknown) => typeof t === 'string'))
  ) {
    return 'tags must be an array of strings';
  }
  return null;
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validationError = validateProject(body, false);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('projects')
      .insert({
        id: body.id,
        title: body.title,
        description: body.description || null,
        long_description: body.long_description || null,
        tags: body.tags || [],
        status: body.status || 'active',
        github_url: body.github_url || null,
        live_url: body.live_url || null,
        gradient: body.gradient || null,
        sort_order: body.sort_order ?? 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Error creating project:', e);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validationError = validateProject(body, true);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.long_description !== undefined)
      updateData.long_description = body.long_description;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.github_url !== undefined)
      updateData.github_url = body.github_url;
    if (body.live_url !== undefined) updateData.live_url = body.live_url;
    if (body.gradient !== undefined) updateData.gradient = body.gradient;
    if (body.sort_order !== undefined)
      updateData.sort_order = body.sort_order;

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Error updating project:', e);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Project ID required' },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Error deleting project:', e);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
