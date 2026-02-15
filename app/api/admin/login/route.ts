import { NextResponse } from 'next/server';
import {
  createSession,
  setSessionCookie,
  deleteSession,
  isAuthenticated,
} from '@/lib/auth';
import crypto from 'crypto';

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, Buffer.alloc(bufA.length));
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
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

  const { password } = body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (
    !adminPassword ||
    typeof password !== 'string' ||
    !safeCompare(password, adminPassword)
  ) {
    return NextResponse.json(
      { success: false, error: '비밀번호가 틀렸습니다.' },
      { status: 401 }
    );
  }

  try {
    const token = await createSession();
    await setSessionCookie(token);
  } catch {
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await deleteSession();
  return NextResponse.json({ success: true });
}
