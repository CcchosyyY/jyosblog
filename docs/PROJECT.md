# 프로젝트 기본 정보

## 개요
- **프로젝트명**: MyBlog
- **목적**: 개인 블로그 (일상, 개발, 공부 등 기록)
- **GitHub**: https://github.com/CcchosyyY/MyBlog

---

## 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| Framework | Next.js (App Router) | 14.2.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.4.x |
| Database | Supabase | - |
| Deployment | Vercel | - |

### 주요 라이브러리
- `next-themes`: 다크모드
- `next-mdx-remote`: MDX 렌더링
- `rehype-highlight`: 코드 하이라이팅
- `gray-matter`: 메타데이터 파싱
- `reading-time`: 읽기 시간 계산

---

## 아키텍처

### 폴더 구조
```
MyBlog/
├── app/                  # Next.js App Router
│   ├── page.tsx          # 홈페이지
│   ├── layout.tsx        # 루트 레이아웃
│   ├── blog/             # 블로그 페이지
│   │   ├── page.tsx      # 글 목록
│   │   ├── [slug]/       # 글 상세
│   │   ├── category/     # 카테고리별
│   │   └── tag/          # 태그별
│   ├── admin/            # 관리자 페이지
│   │   ├── page.tsx      # 대시보드
│   │   ├── write/        # 글 작성
│   │   ├── edit/         # 글 수정
│   │   └── login/        # 로그인
│   ├── api/              # API 라우트
│   │   ├── posts/        # 글 CRUD
│   │   ├── quick-memos/  # 메모
│   │   └── admin/        # 인증
│   └── about/            # 소개 페이지
├── components/           # UI 컴포넌트
├── lib/                  # 유틸리티 함수
├── docs/                 # 프로젝트 문서
└── supabase/             # DB 마이그레이션
```

### 데이터 흐름
```
[Supabase DB] ← API Routes ← [Next.js] → [Vercel CDN] → 사용자
```

### 주요 테이블 (Supabase)
- `posts`: 블로그 글
- `quick_memos`: 빠른 메모

---

## 개발 방법

### 로컬 개발
```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일 수정

# 개발 서버 실행
npm run dev
```

### 환경 변수
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ADMIN_PASSWORD=비밀번호
```

### 배포
- main 브랜치에 푸시하면 Vercel 자동 배포

### 코드 스타일
- ESLint + Prettier 적용
- 설정 파일: `.eslintrc.json`, `.prettierrc`

---

## 주요 경로

| 경로 | 설명 |
|------|------|
| `/` | 홈페이지 |
| `/blog` | 글 목록 |
| `/blog/[slug]` | 글 상세 |
| `/blog/category/[category]` | 카테고리별 글 |
| `/blog/tag/[tag]` | 태그별 글 |
| `/about` | 소개 페이지 |
| `/admin` | 관리자 대시보드 |
| `/admin/write` | 글 작성 |
| `/admin/login` | 관리자 로그인 |
