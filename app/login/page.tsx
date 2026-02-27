'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

function LoginForm() {
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError === 'auth_failed') {
      setError('인증에 실패했습니다. 다시 시도해주세요.');
    }
  }, [searchParams]);

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setSocialLoading(provider);
    setError('');

    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (error) {
        setError(error.message);
        setSocialLoading(null);
      }
    } catch {
      setError('소셜 로그인 중 오류가 발생했습니다.');
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary opacity-[0.03] blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-[480px] mx-4 p-10 sm:p-12 bg-card border border-card-border rounded-2xl flex flex-col items-center gap-8 shadow-lg shadow-black/5">
        {/* Logo */}
        <Link
          href="/"
          className="text-4xl font-bold text-primary hover:text-primary/80 transition-colors"
        >
          Jyo&apos;s Blog
        </Link>

        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            Welcome
          </h2>
          <p className="text-sm text-muted">
            소셜 계정으로 간편하게 로그인하세요
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="w-full flex items-center gap-2.5 bg-primary/10 border border-primary/20 text-primary p-3.5 rounded-xl text-body-sm font-medium">
            <svg
              className="w-4 h-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {error}
          </div>
        )}

        {/* Social Buttons */}
        <div className="w-full flex flex-col gap-3.5">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={socialLoading !== null}
            className="w-full flex items-center justify-center gap-3 py-4 px-5 rounded-xl bg-surface border border-card-border text-foreground hover:bg-card-border/30 hover:border-muted/30 transition-all duration-200 text-body-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {socialLoading === 'google' ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                연결 중...
              </span>
            ) : (
              'Google로 계속하기'
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('github')}
            disabled={socialLoading !== null}
            className="w-full flex items-center justify-center gap-3 py-4 px-5 rounded-xl bg-surface border border-card-border text-foreground hover:bg-card-border/30 hover:border-muted/30 transition-all duration-200 text-body-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {socialLoading === 'github' ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                연결 중...
              </span>
            ) : (
              'GitHub로 계속하기'
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px bg-card-border" />
          <span className="text-xs text-muted">or</span>
          <div className="flex-1 h-px bg-card-border" />
        </div>

        {/* Guest info */}
        <p className="text-xs text-muted text-center leading-relaxed">
          로그인하면 댓글 작성과 좋아요 기능을 이용할 수 있습니다.
          <br />
          <Link
            href="/"
            className="text-link hover:text-primary transition-colors font-medium"
          >
            로그인 없이 둘러보기 &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
