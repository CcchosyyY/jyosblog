-- Create projects table
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'in-progress',
  github_url TEXT,
  live_url TEXT,
  gradient TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON projects FOR SELECT USING (true);

-- Add project_id to posts
ALTER TABLE posts ADD COLUMN project_id TEXT REFERENCES projects(id);
CREATE INDEX idx_posts_project_id ON posts(project_id);

-- Initial data
INSERT INTO projects (id, title, description, long_description, tags, status, github_url, live_url, gradient, sort_order) VALUES
  ('jyos-blog', 'Jyo''s Blog', 'Next.js 15 App Router와 Supabase를 기반으로 직접 설계하고 만든 개인 블로그.', 'Next.js 15 App Router와 Supabase를 기반으로 직접 설계하고 만든 개인 블로그. Pencil 디자인 툴로 UI를 먼저 그리고, Claude Code와 함께 코드로 옮기는 방식으로 개발하고 있습니다.', ARRAY['Next.js 15', 'Supabase', 'MDX', 'Tailwind'], 'active', 'https://github.com/CcchosyyY/MyBlog', 'https://jyos-blog.vercel.app', 'from-[#B3001B] via-[#135E90] to-[#FAA916]', 1),
  ('side-project-1', 'Side Project', 'Coming soon — 새로운 프로젝트를 준비하고 있습니다.', '', ARRAY['TBD'], 'in-progress', NULL, NULL, 'from-[#135E90] to-[#22C55E]', 2),
  ('side-project-2', 'Another Project', 'Coming soon — 아이디어를 구체화하는 중입니다.', '', ARRAY['TBD'], 'in-progress', NULL, NULL, 'from-[#FAA916] to-[#B3001B]', 3);
