import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getSettings, updateSettings } from '@/lib/settings';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await getSettings();
  if (!settings) {
    return NextResponse.json(
      { error: 'Settings not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { blog_title, blog_description, profile_name, profile_subtitle } =
    body;

  const updates: Record<string, string> = {};
  if (typeof blog_title === 'string') updates.blog_title = blog_title;
  if (typeof blog_description === 'string')
    updates.blog_description = blog_description;
  if (typeof profile_name === 'string') updates.profile_name = profile_name;
  if (typeof profile_subtitle === 'string')
    updates.profile_subtitle = profile_subtitle;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: 'No valid fields to update' },
      { status: 400 }
    );
  }

  const settings = await updateSettings(updates);
  if (!settings) {
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }

  return NextResponse.json(settings);
}
