import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getProfile, upsertProfile } from '@/lib/profiles';

function createSupabaseFromRequest(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );
}

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
