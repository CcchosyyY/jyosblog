import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseFromRequest } from '@/lib/supabase-server';
import { toggleLike, getLikeCount, isLikedByUser } from '@/lib/likes';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');
  const userId = searchParams.get('userId');

  if (!postId) {
    return NextResponse.json(
      { error: 'postId is required' },
      { status: 400 }
    );
  }

  const count = await getLikeCount(postId);
  const liked = userId ? await isLikedByUser(postId, userId) : false;

  return NextResponse.json({ count, liked });
}

export async function POST(request: NextRequest) {
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

  const { postId } = body;

  if (!postId || typeof postId !== 'string') {
    return NextResponse.json(
      { error: 'postId is required' },
      { status: 400 }
    );
  }

  const result = await toggleLike(postId, user.id);
  return NextResponse.json(result);
}
