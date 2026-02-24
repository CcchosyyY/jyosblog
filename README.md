# MyBlog

Next.js 15 + Supabase + MDX 기반 개인 블로그

- **배포**: https://jyos-blog.vercel.app/
- **GitHub**: https://github.com/CcchosyyY/MyBlog

## 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| Framework | Next.js (App Router) | 15.5.x |
| Language | TypeScript | 5.x (strict) |
| Styling | Tailwind CSS | 3.x |
| Database | Supabase | - |
| Deployment | Vercel | - |

### 주요 라이브러리
- `next-themes`: 다크모드
- `next-mdx-remote`: MDX 렌더링
- `rehype-highlight`: 코드 하이라이팅

## 주요 기능

- 블로그 글 작성/수정/삭제 (Admin UI + 마크다운 툴바)
- OAuth 로그인 (Google, GitHub) + 관리자 역할 분리
- 5개 카테고리 (일상/개발/요리/공부/운동) + 태그 시스템
- AI 카테고리 자동 추천
- CSS 변수 기반 다크/라이트 모드
- 검색 기능 + 목차(TOC) 자동 생성
- Quick Memo 위젯 + /memos 페이지
- /projects 페이지
- 이미지 업로드 (Supabase Storage)
- RSS 피드 + Sitemap + SEO 최적화

## 시작하기

```bash
npm install

# 환경 변수 설정
cp .env.local.example .env.local

npm run dev        # 개발 서버 (localhost:3000)
npm run build      # 프로덕션 빌드
npm run lint       # ESLint
```

## 환경 변수

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_admin_password
```

## 배포

main 브랜치 푸시 → Vercel 자동 배포
