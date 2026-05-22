-- 004_achievements.sql
-- Tabelas para sistema de badges/achievements.
-- achievements: catalogo (dados DB-driven, PO pode adicionar sem deploy)
-- user_achievements: relacao N:M, registra quando cada usuario desbloqueou cada badge

CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  threshold INT,
  icon TEXT NOT NULL,
  name_pt TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_pt TEXT NOT NULL,
  description_en TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS user_achievements_user_idx ON user_achievements(user_id);

-- RLS: achievements publicas para leitura
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Achievements publicly readable" ON achievements;
CREATE POLICY "Achievements publicly readable"
  ON achievements FOR SELECT TO public USING (true);

-- RLS: user_achievements publicas para leitura (perfil publico mostra badges de outros)
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "User achievements publicly readable" ON user_achievements;
CREATE POLICY "User achievements publicly readable"
  ON user_achievements FOR SELECT TO public USING (true);

-- INSERT/DELETE em user_achievements so via service role (backend)
-- Sem policy WITH CHECK = nenhum cliente pode escrever direto

-- ── Seed inicial: 12 badges ───────────────────────────────────────────────
INSERT INTO achievements (id, category, threshold, icon, name_pt, name_en, description_pt, description_en) VALUES
  ('sessions_10',  'sessions', 10,  'flag',     'Primeiros Passos',     'First Steps',        'Complete 10 sessoes',           'Complete 10 sessions'),
  ('sessions_50',  'sessions', 50,  'medal',    'Praticante',           'Practitioner',       'Complete 50 sessoes',           'Complete 50 sessions'),
  ('sessions_100', 'sessions', 100, 'trophy',   'Centuriao',            'Centurion',          'Complete 100 sessoes',          'Complete 100 sessions'),
  ('sessions_500', 'sessions', 500, 'crown',    'Mestre da Digitacao',  'Typing Master',      'Complete 500 sessoes',          'Complete 500 sessions'),
  ('streak_3',     'streak',   3,   'flame',    'Tres em Sequencia',    'Three in a Row',     'Mantenha streak de 3 dias',     'Maintain a 3-day streak'),
  ('streak_7',     'streak',   7,   'flame',    'Semana de Foco',       'Week of Focus',      'Mantenha streak de 7 dias',     'Maintain a 7-day streak'),
  ('streak_30',    'streak',   30,  'flame',    'Habito Forjado',       'Habit Forged',       'Mantenha streak de 30 dias',    'Maintain a 30-day streak'),
  ('xp_1k',        'xp',       1000,'star',     'Mil de XP',            'A Thousand XP',      'Acumule 1.000 XP',              'Accumulate 1,000 XP'),
  ('xp_10k',       'xp',       10000,'star',    'Dez Mil de XP',        'Ten Thousand XP',    'Acumule 10.000 XP',             'Accumulate 10,000 XP'),
  ('language_1',   'language', 1,   'book',     'Primeira Linguagem',   'First Language',     'Complete todos os snippets de uma linguagem', 'Complete all snippets in a language'),
  ('top_100',      'ranking',  100, 'trophy',   'Top 100',              'Top 100',            'Entre no top 100 do leaderboard','Reach top 100 in leaderboard'),
  ('top_10',       'ranking',  10,  'crown',    'Top 10',               'Top 10',             'Entre no top 10 do leaderboard', 'Reach top 10 in leaderboard')
ON CONFLICT (id) DO NOTHING;
