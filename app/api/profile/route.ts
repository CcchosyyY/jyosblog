import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseFromRequest } from '@/lib/supabase-server';
import { getProfile, upsertProfile } from '@/lib/profiles';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'userId is required' },
      { status: 400 }
    );
  }

  const profile = await getProfile(userId);

  if (!profile) {
    return NextResponse.json(
      { error: 'Profile not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(profile);
}

export async function PUT(request: NextRequest) {
  const supabase = createSupabaseFromRequest(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
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

  const { nickname, avatar_url, bio } = body;

  if (nickname !== undefined) {
    if (typeof nickname !== 'string' || nickname.length > 50) {
      return NextResponse.json(
        { error: 'nickname must be a string with max 50 characters' },
        { status: 400 }
      );
    }
  }

  if (bio !== undefined) {
    if (typeof bio !== 'string' || bio.length > 500) {
      return NextResponse.json(
        { error: 'bio must be a string with max 500 characters' },
        { status: 400 }
      );
    }
  }

  if (avatar_url !== undefined && avatar_url !== null) {
    if (
      typeof avatar_url !== 'string' ||
      !avatar_url.startsWith('http')
    ) {
      return NextResponse.json(
        { error: 'avatar_url must be a valid URL starting with http' },
        { status: 400 }
      );
    }
  }

  const profile = await upsertProfile(user.id, {
    nickname,
    avatar_url,
    bio,
  });

  if (!profile) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }

  return NextResponse.json(profile);
}
