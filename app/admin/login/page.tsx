'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlError = params.get('error');
    if (urlError === 'unauthorized') {
      setError('허용되지 않은 계정입니다.');
    } else if (urlError === 'auth_failed') {
      setError('인증에 실패했습니다. 다시 시도해주세요.');
    }
  }, []);

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setSocialLoading(provider);
    setError('');

    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || '로그인에 실패했습니다.');
      }
    } catch {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-[#08080F] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#B3001B] opacity-[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#5B21B6] opacity-[0.03] blur-[100px] pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-[440px] p-11 bg-[#111118] border border-[#FFFFFF0D] rounded-3xl flex flex-col items-center gap-7 shadow-2xl shadow-black/40 animate-login-card">
        {/* Icon Circle */}
        <div className="w-[72px] h-[72px] rounded-full bg-[#B3001B20] border-[1.5px] border-[#B3001B33] flex items-center justify-center">
          <svg
            className="w-8 h-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>

        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <h2 className="text-[30px] font-bold text-white tracking-tight">
            Admin Login
          </h2>
          <p className="text-sm text-[#FFFFFF59]">
            관리자 계정으로 로그인하세요
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="w-full flex items-center gap-2 bg-[#B3001B15] border border-[#B3001B33] text-[#FF6B7A] p-3 rounded-xl text-[13px] font-medium animate-login-card">
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
        <div className="w-full flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={socialLoading !== null}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-[10px] bg-[#1A1A24] border border-[#FFFFFF0D] text-[#FFFFFFCC] hover:bg-[#22222E] hover:border-[#FFFFFF1A] transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
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
            {socialLoading === 'google' ? '연결 중...' : 'Google로 로그인'}
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin('github')}
            disabled={socialLoading !== null}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-[10px] bg-[#1A1A24] border border-[#FFFFFF0D] text-[#FFFFFFCC] hover:bg-[#22222E] hover:border-[#FFFFFF1A] transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-[18px] h-[18px]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {socialLoading === 'github' ? '연결 중...' : 'GitHub로 로그인'}
          </button>
        </div>

        {/* Password fallback */}
        <div className="w-full">
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-[#FFFFFF33] hover:text-[#FFFFFF59] transition-colors"
          >
            <svg
              className={`w-3 h-3 transition-transform ${showPassword ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            비밀번호로 로그인
          </button>

          {showPassword && (
            <form
              onSubmit={handlePasswordLogin}
              className="mt-3 flex gap-2"
            >
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-[#FFFFFF0D] rounded-[10px] bg-[#1A1A24] text-white placeholder-[#FFFFFF4D] focus:outline-none focus:ring-2 focus:ring-[#B3001B]/40 focus:border-[#B3001B]/50 text-sm transition-all duration-200"
                placeholder="관리자 비밀번호"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 text-sm font-semibold rounded-[10px] text-white bg-primary hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? '...' : '확인'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
