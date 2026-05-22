-- 003_leaderboard_score_view.sql
-- View leaderboard_with_score: agrega avgWPM (ultimas 20 sessoes) e calcula score.
-- Substitui ordenacao do global_leaderboard pela formula combinada: avgWPM + level*10.
-- Calculo de level espelha lib/gamification.ts (curva floor(25 * n^1.6), max 21).

-- Funcao auxiliar: calcula level a partir do XP total (replica de lib/gamification.ts)
CREATE OR REPLACE FUNCTION compute_level(xp INT) RETURNS INT AS $$
DECLARE
  threshold INT;
  lvl INT := 1;
BEGIN
  FOR i IN 1..20 LOOP
    threshold := floor(25 * power(i, 1.6));
    IF xp >= threshold THEN
      lvl := i + 1;
    ELSE
      EXIT;
    END IF;
  END LOOP;
  RETURN lvl;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- View: ranking com score combinado
CREATE OR REPLACE VIEW leaderboard_with_score AS
WITH recent_sessions AS (
  -- Ultimas 20 sessoes de cada usuario
  SELECT
    user_id,
    wpm,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
  FROM typing_sessions
),
avg_wpm_per_user AS (
  SELECT
    user_id,
    ROUND(AVG(wpm))::INT AS avg_wpm
  FROM recent_sessions
  WHERE rn <= 20
  GROUP BY user_id
)
SELECT
  p.id AS user_id,
  p.username,
  p.display_name,
  p.avatar_url,
  COALESCE(up.total_xp, 0) AS total_xp,
  COALESCE(up.best_wpm, 0) AS best_wpm,
  COALESCE(awpm.avg_wpm, 0) AS avg_wpm,
  COALESCE(up.current_streak, 0) AS current_streak,
  COALESCE(up.total_sessions, 0) AS total_sessions,
  compute_level(COALESCE(up.total_xp, 0)) AS level,
  ROUND(COALESCE(awpm.avg_wpm, 0) + compute_level(COALESCE(up.total_xp, 0)) * 10)::INT AS score
FROM profiles p
LEFT JOIN user_progress up ON up.user_id = p.id
LEFT JOIN avg_wpm_per_user awpm ON awpm.user_id = p.id
WHERE COALESCE(up.total_sessions, 0) > 0 OR COALESCE(up.total_xp, 0) > 0;

COMMENT ON VIEW leaderboard_with_score IS
  'Leaderboard com score combinado: avg dos ultimos 20 WPM + level*10. Substitui global_leaderboard para ranking publico.';
