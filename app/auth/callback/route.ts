import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createSession } from '@/lib/auth';

const SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=no_code', request.url)
    );
  }

  // Collect Supabase auth cookies to apply to the final response
  const pendingCookies: Array<{
    name: string;
    value: string;
    options: Record<string, unknown>;
  }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          pendingCookies.push(...cookiesToSet);
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    return NextResponse.redirect(
      new URL('/login?error=auth_failed', request.url)
    );
  }

  const email = data.session.user.email;
  const adminEmails = (process.env.ADMIN_EMAIL || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const isAdmin = email && adminEmails.includes(email.toLowerCase());

  // Determine redirect destination from `next` query param
  const next = searchParams.get('next');
  // Security: only allow internal paths (starts with / but not //)
  const isValidNext = next && next.startsWith('/') && !next.startsWith('//');
  const defaultRedirect = isAdmin ? '/admin' : '/';
  const redirectUrl = isValidNext ? next : defaultRedirect;

  const response = NextResponse.redirect(
    new URL(redirectUrl, request.url)
  );

  // Apply Supabase auth cookies (keeps session alive)
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options as Record<string, string>);
  });

  if (isAdmin) {
    // Create admin session
    const token = await createSession();

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });

    // Non-httpOnly cookie for client-side admin detection
    response.cookies.set('is_admin', '1', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });
  }

  return response;
}
