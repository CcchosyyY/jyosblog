import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Sign out from Supabase Auth
  await supabase.auth.signOut();

  // Delete is_admin cookie
  response.cookies.set('is_admin', '', {
    maxAge: 0,
    path: '/',
  });

  // Delete admin_session if exists
  const adminToken = request.cookies.get('admin_session')?.value;
  if (adminToken) {
    const db = getSupabase();
    await db.from('admin_sessions').delete().eq('token', adminToken);

    response.cookies.set('admin_session', '', {
      maxAge: 0,
      path: '/',
    });
  }

  return response;
}
