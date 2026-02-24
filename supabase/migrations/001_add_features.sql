-- Comments table
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  user_name text NOT NULL,
  user_avatar text,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_comments_post_id ON comments(post_id);

-- Post views table
CREATE TABLE post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  viewer_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, viewer_hash)
);

CREATE INDEX idx_post_views_post_id ON post_views(post_id);

-- Post likes table
CREATE TABLE post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);

-- Profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  nickname text,
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Comments: public read, authenticated write
CREATE POLICY "comments_select" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "comments_delete" ON comments FOR DELETE USING (true);

-- Post views: public read/write (anonymous views allowed)
CREATE POLICY "post_views_select" ON post_views FOR SELECT USING (true);
CREATE POLICY "post_views_insert" ON post_views FOR INSERT WITH CHECK (true);

-- Post likes: public read, authenticated write
CREATE POLICY "post_likes_select" ON post_likes FOR SELECT USING (true);
CREATE POLICY "post_likes_insert" ON post_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "post_likes_delete" ON post_likes FOR DELETE USING (true);

-- Profiles: public read, authenticated write
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (true);
