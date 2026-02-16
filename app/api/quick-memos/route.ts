import { NextResponse } from 'next/server';
import {
  getQuickMemos,
  getQuickMemosByFilter,
  createQuickMemo,
  updateQuickMemo,
  deleteQuickMemo,
} from '@/lib/quick-memos';
import { isAuthenticated } from '@/lib/auth';

const LIMIT_DEFAULT = 10;
const LIMIT_MIN = 1;
const LIMIT_MAX = 50;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get('category');
  const isProcessed = searchParams.get('is_processed');
  const id = searchParams.get('id');

  const hasFilter = category || isProcessed !== null || id;

  if (hasFilter) {
    const filter: {
      category?: string;
      is_processed?: boolean;
      id?: string;
    } = {};

    if (category) filter.category = category;
    if (isProcessed !== null) filter.is_processed = isProcessed === 'true';
    if (id) filter.id = id;

    const memos = await getQuickMemosByFilter(filter);
    return NextResponse.json(memos);
  }

  const parsed = parseInt(
    searchParams.get('limit') || String(LIMIT_DEFAULT),
    10
  );
  const limit = Math.min(
    Math.max(parsed || LIMIT_DEFAULT, LIMIT_MIN),
    LIMIT_MAX
  );

  const memos = await getQuickMemos(limit);
  return NextResponse.json(memos);
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

  const { content, title, category, tags } = body;

  if (!content || typeof content !== 'string' || content.trim() === '') {
    return NextResponse.json(
      { error: 'Content is required' },
      { status: 400 }
    );
  }

  const memo = await createQuickMemo({
    content: content.trim(),
    title: title?.trim() || undefined,
    category: category || undefined,
    tags: Array.isArray(tags) ? tags : undefined,
  });

  if (!memo) {
    return NextResponse.json(
      { error: 'Failed to create memo' },
      { status: 500 }
    );
  }

  return NextResponse.json(memo);
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { id, ...fields } = body;

  if (!id || typeof id !== 'string') {
    return NextResponse.json(
      { error: 'Memo ID is required' },
      { status: 400 }
    );
  }

  const allowedFields = [
    'content',
    'title',
    'category',
    'tags',
    'is_processed',
  ];
  const updateFields: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (fields[key] !== undefined) {
      updateFields[key] = fields[key];
    }
  }

  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json(
      { error: 'No valid fields to update' },
      { status: 400 }
    );
  }

  const memo = await updateQuickMemo(id, updateFields);

  if (!memo) {
    return NextResponse.json(
      { error: 'Failed to update memo' },
      { status: 500 }
    );
  }

  return NextResponse.json(memo);
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Memo ID required' },
      { status: 400 }
    );
  }

  const success = await deleteQuickMemo(id);

  if (!success) {
    return NextResponse.json(
      { error: 'Failed to delete memo' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
