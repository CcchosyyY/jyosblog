import { NextResponse } from 'next/server';
import { incrementView, getViewCount } from '@/lib/views';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json(
      { error: 'postId is required' },
      { status: 400 }
    );
  }

  const count = await getViewCount(postId);
  return NextResponse.json({ count });
}

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { postId, viewerHash } = body;

  if (!postId || typeof postId !== 'string') {
    return NextResponse.json(
      { error: 'postId is required' },
      { status: 400 }
    );
  }

  if (!viewerHash || typeof viewerHash !== 'string') {
    return NextResponse.json(
      { error: 'viewerHash is required' },
      { status: 400 }
    );
  }

  await incrementView(postId, viewerHash);
  return NextResponse.json({ success: true });
}
