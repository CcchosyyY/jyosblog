import { NextResponse } from 'next/server';
import { markMemosAsProcessed } from '@/lib/quick-memos';
import { isAuthenticated } from '@/lib/auth';

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

  const { ids } = body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { error: 'ids must be a non-empty array' },
      { status: 400 }
    );
  }

  if (!ids.every((id: unknown) => typeof id === 'string')) {
    return NextResponse.json(
      { error: 'All ids must be strings' },
      { status: 400 }
    );
  }

  const success = await markMemosAsProcessed(ids);

  if (!success) {
    return NextResponse.json(
      { error: 'Failed to mark memos as processed' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
