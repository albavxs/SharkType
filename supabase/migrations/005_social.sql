-- 005_social.sql
-- Sistema de follow + feed de eventos.
-- follows: N:M entre usuarios
-- feed_events: log unificado de eventos (sessao, achievement, level up)

-- ── follows ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS follows (
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id <> following_id)
);

CREATE INDEX IF NOT EXISTS follows_following_idx ON follows(following_id);
CREATE INDEX IF NOT EXISTS follows_follower_idx ON follows(follower_id);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Qualquer um le contadores publicos (followers/following)
DROP POLICY IF EXISTS "Follows publicly readable" ON follows;
CREATE POLICY "Follows publicly readable"
  ON follows FOR SELECT TO public USING (true);

-- Usuario so cria/deleta proprios follows
DROP POLICY IF EXISTS "Users can follow others" ON follows;
CREATE POLICY "Users can follow others"
  ON follows FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can unfollow others" ON follows;
CREATE POLICY "Users can unfollow others"
  ON follows FOR DELETE TO authenticated
  USING (auth.uid() = follower_id);

-- ── feed_events ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feed_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('session', 'achievement', 'level_up')),
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS feed_events_user_created_idx ON feed_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS feed_events_created_idx ON feed_events(created_at DESC);

ALTER TABLE feed_events ENABLE ROW LEVEL SECURITY;

-- Feed publico: qualquer um le qualquer evento
DROP POLICY IF EXISTS "Feed events publicly readable" ON feed_events;
CREATE POLICY "Feed events publicly readable"
  ON feed_events FOR SELECT TO public USING (true);

-- INSERT so via service role (backend, em saveRemoteSession e checkUnlocks)
-- Sem WITH CHECK = nenhum cliente pode escrever direto
