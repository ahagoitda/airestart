-- Regressor — Supabase 스키마
-- Supabase SQL Editor에서 실행

-- user_profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '회귀자',
  persona TEXT NOT NULL,
  regret TEXT NOT NULL,
  return_era TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- story_sessions
CREATE TABLE story_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  profile JSONB NOT NULL,            -- UserProfile snapshot
  current_episode INT DEFAULT 1,
  total_episodes INT DEFAULT 10,
  summary TEXT DEFAULT '',           -- 계층적 요약
  is_premium BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'in_progress', -- 'in_progress' | 'completed' | 'abandoned'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- story_events (RAG용 벡터 DB)
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE story_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES story_sessions(id) ON DELETE CASCADE,
  episode INT NOT NULL,
  event_type TEXT NOT NULL,          -- 'choice' | 'death' | 'betrayal' | 'romance' | 'success'
  description TEXT NOT NULL,
  embedding VECTOR(1536),
  importance FLOAT DEFAULT 0.5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (기본값: 차단 → 명시 허용)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can read own sessions" ON story_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON story_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON story_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- choice_stats (선택지 통계 — "회귀자의 73%가 이 선택을 했다")
CREATE TABLE choice_stats (
  preset_id TEXT NOT NULL,
  node_id TEXT NOT NULL,
  choice_id TEXT NOT NULL,
  picks BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (preset_id, node_id, choice_id)
);

ALTER TABLE choice_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read choice stats" ON choice_stats
  FOR SELECT USING (true);

-- 익명 유저도 집계만 올릴 수 있도록 SECURITY DEFINER RPC 사용 (직접 INSERT/UPDATE는 차단)
CREATE OR REPLACE FUNCTION record_choice(p_preset TEXT, p_node TEXT, p_choice TEXT)
RETURNS void
LANGUAGE sql SECURITY DEFINER AS $$
  INSERT INTO choice_stats (preset_id, node_id, choice_id, picks)
  VALUES (p_preset, p_node, p_choice, 1)
  ON CONFLICT (preset_id, node_id, choice_id)
  DO UPDATE SET picks = choice_stats.picks + 1;
$$;

-- RAG: 세션 내에서 질의 임베딩과 가까운 사건 상위 k개
CREATE OR REPLACE FUNCTION match_story_events(
  p_session_id UUID,
  query_embedding VECTOR(1536),
  match_count INT DEFAULT 5
)
RETURNS TABLE (description TEXT, episode INT, importance FLOAT, similarity FLOAT)
LANGUAGE sql STABLE AS $$
  SELECT
    description,
    episode,
    importance,
    1 - (embedding <=> query_embedding) AS similarity
  FROM story_events
  WHERE session_id = p_session_id AND embedding IS NOT NULL
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

CREATE POLICY "Users can read own events" ON story_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM story_sessions s
      WHERE s.id = story_events.session_id AND s.user_id = auth.uid()
    )
  );
