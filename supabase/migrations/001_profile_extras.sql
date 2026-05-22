-- 001_profile_extras.sql
-- Adiciona index case-insensitive em profiles.username para lookup em /profile/[username]
-- Nao adiciona colunas (avatar_url, username, display_name ja existem)

CREATE INDEX IF NOT EXISTS profiles_username_lower_idx
  ON profiles (lower(username));

-- Garante que a busca case-insensitive seja ainda mais rapida
COMMENT ON INDEX profiles_username_lower_idx IS
  'Lookup case-insensitive para rota publica /profile/[username]';
