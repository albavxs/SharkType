-- Keep the leaderboard helper on invoker privileges even if it evolves later.
-- The function is currently pure/immutable; this makes the privilege model explicit.

CREATE OR REPLACE FUNCTION public.compute_level(xp INT)
RETURNS INT
SECURITY INVOKER
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
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
$$;
