import { NextResponse } from 'next/server';
import { getQuickMemos, createQuickMemo, deleteQuickMemo } from '@/lib/quick-memos';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const memos = await getQuickMemos(limit);
  return NextResponse.json(memos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { content } = body;

  if (!content || typeof content !== 'string' || content.trim() === '') {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const memo = await createQuickMemo(content.trim());

  if (!memo) {
    return NextResponse.json({ error: 'Failed to create memo' }, { status: 500 });
  }

  return NextResponse.json(memo);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Memo ID required' }, { status: 400 });
  }

  const success = await deleteQuickMemo(id);

  if (!success) {
    return NextResponse.json({ error: 'Failed to delete memo' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
