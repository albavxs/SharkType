# Supabase Migrations

Migrations SQL versionadas. **Aplicar manualmente no Supabase dashboard** (SQL Editor) na ordem numerica.

## Ordem de aplicacao

1. `001_profile_extras.sql` — index case-insensitive em profiles.username
2. `002_storage_avatars.sql` — bucket `avatars` + policies de upload/leitura
3. `003_leaderboard_score_view.sql` — view `leaderboard_with_score` com score combinado
4. `004_achievements.sql` — tabelas `achievements` + `user_achievements` + seed de 12 badges
5. `005_social.sql` — tabelas `follows` + `feed_events` + policies RLS

## Validacao pos-aplicacao

Apos rodar cada migration, validar no SQL Editor:

```sql
-- Apos 001
SELECT indexname FROM pg_indexes WHERE tablename = 'profiles' AND indexname = 'profiles_username_lower_idx';

-- Apos 002
SELECT id, public FROM storage.buckets WHERE id = 'avatars';

-- Apos 003
SELECT * FROM leaderboard_with_score LIMIT 5;

-- Apos 004
SELECT count(*) FROM achievements;  -- deve retornar 12

-- Apos 005
SELECT tablename FROM pg_tables WHERE tablename IN ('follows', 'feed_events');
```

## Rollback

Migrations sao **forward-only**. Para reverter, criar nova migration `<n>_rollback_<nome>.sql`.

## Notas

- Todas as migrations usam `IF NOT EXISTS` / `ON CONFLICT DO NOTHING` — sao idempotentes.
- RLS habilitado em todas as tabelas novas. Tipos de policy: SELECT publico, INSERT/UPDATE/DELETE restritos por dono ou apenas via service role.
- Migration 003 cria funcao `compute_level(xp)` que **espelha** `getLevel()` em `lib/gamification.ts`. Se a curva mudar la, atualizar a funcao SQL tambem.
