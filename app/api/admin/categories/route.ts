import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/categories';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
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

  const { id, name, sort_order } = body;

  if (typeof id !== 'string' || typeof name !== 'string') {
    return NextResponse.json(
      { error: 'id and name are required strings' },
      { status: 400 }
    );
  }

  const category = await createCategory(
    id,
    name,
    typeof sort_order === 'number' ? sort_order : undefined
  );

  if (!category) {
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }

  return NextResponse.json(category, { status: 201 });
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

  const { id, name } = body;

  if (typeof id !== 'string' || typeof name !== 'string') {
    return NextResponse.json(
      { error: 'id and name are required strings' },
      { status: 400 }
    );
  }

  const category = await updateCategory(id, name);
  if (!category) {
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }

  return NextResponse.json(category);
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json(
      { error: 'id query parameter is required' },
      { status: 400 }
    );
  }

  const success = await deleteCategory(id);
  if (!success) {
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
