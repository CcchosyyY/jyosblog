import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';
import SearchModal from '@/components/SearchModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://myblog.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MyBlog - 나만의 블로그',
    template: '%s | MyBlog',
  },
  description: '여러 일들의 과정이나 내가 했던 일들을 정리하는 개인 블로그',
  keywords: ['블로그', '개발', '일상', '기록'],
  authors: [{ name: 'Blog Owner' }],
  creator: 'Blog Owner',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    title: 'MyBlog - 나만의 블로그',
    description: '여러 일들의 과정이나 내가 했던 일들을 정리하는 개인 블로그',
    siteName: 'MyBlog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyBlog - 나만의 블로그',
    description: '여러 일들의 과정이나 내가 했던 일들을 정리하는 개인 블로그',
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': `${SITE_URL}/feed.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="MyBlog RSS Feed"
          href="/feed.xml"
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <SearchModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
