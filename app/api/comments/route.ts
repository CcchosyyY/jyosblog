import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseFromRequest } from '@/lib/supabase-server';
import {
  getCommentsByPostId,
  createComment,
  deleteComment,
} from '@/lib/comments';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json(
      { error: 'postId is required' },
      { status: 400 }
    );
  }

  const comments = await getCommentsByPostId(postId);
  return NextResponse.json(comments);
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

  const { postId, content } = body;

  if (!postId || typeof postId !== 'string') {
    return NextResponse.json(
      { error: 'postId is required' },
      { status: 400 }
    );
  }

  if (!content || typeof content !== 'string' || content.trim() === '') {
    return NextResponse.json(
      { error: 'content is required' },
      { status: 400 }
    );
  }

  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    'Anonymous';
  const userAvatar =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    null;

  const comment = await createComment(
    postId,
    user.id,
    userName,
    userAvatar,
    content.trim()
  );

  if (!comment) {
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }

  return NextResponse.json(comment);
}

export async function DELETE(request: NextRequest) {
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

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Comment ID required' },
      { status: 400 }
    );
  }

  const success = await deleteComment(id, user.id);

  if (!success) {
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
