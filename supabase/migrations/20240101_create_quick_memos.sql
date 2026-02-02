-- Quick Memos 테이블 생성
CREATE TABLE quick_memos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_processed BOOLEAN DEFAULT FALSE
);

-- 인덱스 추가 (최신순 정렬 최적화)
CREATE INDEX idx_quick_memos_created_at ON quick_memos(created_at DESC);

-- RLS (Row Level Security) 활성화
ALTER TABLE quick_memos ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기/쓰기 가능 (공개 메모)
CREATE POLICY "Allow all operations on quick_memos" ON quick_memos
  FOR ALL
  USING (true)
  WITH CHECK (true);
