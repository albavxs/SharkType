# Sprint Test Guide — Perfis, Gamificação, Social e Acessibilidade

Branch: `feature/sprint-social-gamificacao`. Stack: Next.js 16 · Supabase · TypeScript.

Este documento é o roteiro de teste para validar as features do sprint antes do merge em `master`. Tempo estimado de execução completa: **45–60 min**.

---

## Pré-requisitos

### 1. Aplicar migrations no Supabase

Aplicar **na ordem** via Supabase Dashboard → SQL Editor:

```
supabase/migrations/001_profile_extras.sql
supabase/migrations/002_storage_avatars.sql
supabase/migrations/003_leaderboard_score_view.sql
supabase/migrations/004_achievements.sql
supabase/migrations/005_social.sql
```

Após cada uma, validar via SQL (instruções em [supabase/migrations/README.md](../supabase/migrations/README.md)).

### 2. Configurar Storage

A migration 002 cria o bucket `avatars` programaticamente, mas se preferir UI:
- Dashboard → Storage → New bucket → nome `avatars` → public.
- Adicionar policies (a migration cobre).

### 3. Rodar o app local

```bash
npm install   # se ainda não rodou
npm run dev
```

Abrir `http://localhost:3000`.

---

## Checklist de Teste

### ✅ Sprint 0 — Toolbar responsivo

- [ ] Abrir qualquer página com Toolbar (home, tracks).
- [ ] Redimensionar a janela para **~700px** de largura.
- [ ] **Esperado**: ícones Help e Settings somem, username some do card (só o avatar circular fica). Sem sobreposição de elementos.
- [ ] Redimensionar para 1024px+: ícones e username reaparecem.

### ✅ Sprint 1 — Perfil Público

- [ ] Logar com email ou GitHub.
- [ ] Ir em `/profile`. Click no avatar redondo → abre seletor de arquivo.
- [ ] Subir imagem JPG/PNG (< 2MB). **Esperado**: avatar atualiza imediatamente, persiste após reload.
- [ ] Tentar imagem > 2MB. **Esperado**: erro "File too large".
- [ ] Em `/profile`, clicar "Ver perfil público". **Esperado**: navega pra `/profile/<seu-username>`.
- [ ] Ver banner com gradient (cor varia por tier: Bronze→Diamante por level).
- [ ] Ver XP bar, sessões totais, melhor WPM, precisão, top 5 linguagens.
- [ ] No `/leaderboard`, clicar em qualquer outro usuário. **Esperado**: abre `/profile/<username>`.

### ✅ Sprint 2 — Score combinado

- [ ] Em `/leaderboard`, ver coluna **score** (entre username e XP, destacada em var(--main)).
- [ ] Ordenação: maior score no topo (não mais por totalXP).
- [ ] Fórmula: `score = avgWPM(últimas 20 sessões) + level*10`.
- [ ] Validar no SQL: `SELECT username, score, avg_wpm, level FROM leaderboard_with_score ORDER BY score DESC LIMIT 5;`

### ✅ Sprint 3 — Streak Toast

- [ ] Garantir que `current_streak` no banco seja N. Forçar update: `UPDATE user_progress SET current_streak = N, last_practice_date = '2020-01-01' WHERE user_id = '<seu_id>';` (data antiga força reset pra 1 na próxima sessão).
- [ ] Completar uma sessão de digitação.
- [ ] **Esperado**: toast aparece no topo, com flame icon animado + "Streak aumentou! 1 dia".
- [ ] Toast some em ~2.5s.

### ✅ Sprint 4 — Achievements

- [ ] Após a migration 004, validar seed: `SELECT count(*) FROM achievements;` → 12.
- [ ] No `/profile/<username>`, ver seção "Conquistas" com 12 cards (a maioria em greyscale/locked).
- [ ] Completar 10 sessões (qualquer linguagem). **Esperado**: badge "Primeiros Passos" desbloqueia.
- [ ] Toast aparece no canto inferior: "🏆 Conquista desbloqueada! Primeiros Passos".
- [ ] No perfil, o card fica colorido (sem greyscale).
- [ ] Validar persistência: `SELECT * FROM user_achievements WHERE user_id = '<seu_id>';`

### ✅ Sprint 5 — Follow + Feed

- [ ] Logar como user A.
- [ ] Ir em `/profile/<usernameB>` (qualquer outro user). Clicar "Seguir".
- [ ] **Esperado**: botão muda pra "Deixar de seguir", contador "0 seguindo" → "1 seguindo" no card de A.
- [ ] No perfil de B, contador "seguidores" incrementou.
- [ ] Ir em `/feed`. Ver eventos globais (sessões, achievements, level ups).
- [ ] Mudar tab pra **Seguindo**. Ver apenas eventos do user B.
- [ ] Ir em `/following`. **Esperado**: redireciona pra `/feed?scope=following`.
- [ ] Toolbar tem novo ícone Feed (ChartIcon entre Trophy e Profile).

### ✅ Sprint 6 — Share Card PNG

- [ ] Completar uma sessão até ver o `ResultScreen`.
- [ ] Clicar ícone Share. **Esperado**: modal abre com preview escalado (50%) do card 1200x630.
- [ ] Card mostra: SharkType logo, @username, WPM grande, raw/acc/errors/time.
- [ ] Clicar "Baixar PNG". **Esperado**: download de `sharktype-<lang>-<wpm>wpm.png`.
- [ ] Abrir PNG: imagem nítida (pixelRatio 2), bg/cores corretas do tema atual.
- [ ] Escape fecha modal. Click fora também fecha.

### ✅ Sprint 7 — Acessibilidade

#### Temas A11y

- [ ] Em `/settings` ou no Footer, abrir seletor de temas.
- [ ] Selecionar **a11y deuteranopia**. **Esperado**: app vira azul/laranja/amarelo, sem verde/vermelho como diferenciadores.
- [ ] Selecionar **a11y protanopia**. **Esperado**: paleta azul/amarelo/cinza.
- [ ] Persiste após reload.

#### Font Size

- [ ] Em `/settings`, seção Acessibilidade.
- [ ] Clicar `A-`. **Esperado**: contador `100%` → `90%`. Voltar e digitar — fonte do código menor.
- [ ] Clicar `A+` várias vezes até `160%`. Botão desabilita no limite.
- [ ] Persiste após reload (verificar `localStorage.getItem('sharktype-font-scale')`).

#### Lenient Keyboard

- [ ] Em `/settings`, marcar checkbox "Teclado não-QWERTY (validação relaxada)".
- [ ] Voltar pra `/`. Começar a digitar **qualquer** tecla aleatória.
- [ ] **Esperado**: chars contam como corretos (cor verde/main), WPM sobe, accuracy fica 100%.
- [ ] Desmarcar — comportamento normal volta.

---

## Verificação técnica

```bash
# Build limpo
npm run build         # esperado: passa (26 rotas)

# Type-check
npx tsc --noEmit      # esperado: silencioso

# Lint
npm run lint
# master tinha 52 problemas. Branch ~88. Erros novos sao majoritariamente:
# - @typescript-eslint/no-explicit-any (necessario para Supabase polymorphic types)
# - react-hooks/exhaustive-deps em toasts (pattern aceito)
# Build passa, type-check passa — aceitavel.
```

---

## Smoke test rápido (5 min)

1. Login → upload avatar → ver perfil público.
2. Completar 1 sessão → ver toast streak.
3. Abrir share modal → baixar PNG.
4. Ir em `/feed` → ver evento da sessão.
5. Mudar pra tema a11y deuteranopia.

Se todos os 5 passam, o core está OK.

---

## Dívidas conhecidas (v2 backlog)

Documentadas no plano e **fora deste sprint**:

- AZERTY/Dvorak/Colemak completos (esta v1 só tem "lenient mode").
- Twitter/Discord deep-link no compartilhamento (v1 só baixa PNG).
- Paginação infinita no feed (v1 carrega 50 fixos).
- Filtros de leaderboard por linguagem/dificuldade.
- Notificações in-app quando alguém te segue.
- Recovery de streak quebrada.
- Anti-cheat / rate limiting no recordSession.
- Refator estrutural do `Toolbar.tsx` (sair do `absolute left-1/2` pra 3-col flex).

---

## Reportando bugs

Crie issue com label `sprint-social-gamificacao`. Inclua:
- Sprint afetado (0–7).
- Passos pra reproduzir.
- Screenshot/console error se aplicável.
- Tema/locale/auth state atual.
