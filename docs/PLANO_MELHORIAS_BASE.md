# Plano de Implementacao — feature/melhorias-base

Branch unica com 4 temas integrados. Objetivo: subir hoje, estagiario testa golden path + edge cases.

Stack confirmada: Next.js 16 + React 19 + TS 5 + Tailwind 4 + Supabase + Three.js. Sem Jest/Vitest hoje.

---

## Tema 1 — Discovery automatizado de snippets

### Diagnostico (verdade do codigo, nao do plano original)

- `data/index.ts` (97 linhas) importa 41 arquivos manualmente
- Metadata (id, label, color) hardcoded ao lado do import — re-escrever toda vez
- `data/cybersec.ts` exporta 6 arrays (`nmapSnippets`, `webReconSnippets`, etc.) num so arquivo — quebra o padrao "1 arquivo = 1 linguagem"
- Snippets ja seguem schema previsivel (`Snippet[]` exportado nomeado)

### Abordagem escolhida

**Manifesto + builder estatico** (nao runtime fs scan — Next.js 16 + React Server Components nao gosta de fs em client bundle).

1. Criar `data/manifest.ts` — array de objetos `{ id, label, color, type: 'code'|'text', module: string, exportName?: string }`
2. Criar `data/build-index.ts` (ou manter em `index.ts`) que itera o manifesto e importa via mapa estatico (imports continuam top-level — TS exige)
3. Resultado: para adicionar linguagem, mexer em **2 lugares** (criar arquivo + 1 linha no manifesto) em vez de 3 (arquivo + import + entry no array)

**Alternativa rejeitada:** glob runtime via `import.meta.glob` (Vite-only, Next/webpack nao tem equivalente nativo limpo). Esforco > beneficio.

### Mudancas

- **NOVO** `data/manifest.ts` — fonte unica de verdade pra metadata
- **EDIT** `data/index.ts` — refatora pra consumir manifesto, mantem API publica (`languages`, `codeLanguages`, `textLanguages`, `getLanguageById`)
- **Tratamento especial cybersec:** manifesto suporta `exportName` opcional pra arquivos multi-export. Mantem 1 entry por linguagem mesmo no arquivo compartilhado.

### Risco

Baixo. API publica preservada. Imports continuam estaticos (sem perda de tree-shaking).

### Como o estagiario testa

1. `npm run dev`
2. Acessa `/tracks` — todas as linguagens listadas
3. Pratica uma de cada tipo: code (`javascript`), text (`text-ptbr`), cybersec (`nmap`)
4. Adiciona uma linguagem nova de teste seguindo o novo fluxo (instrucao no CONTRIBUTING) e ve aparecer

---

## Tema 2 — Validacao Zod dos snippets

### Diagnostico

- Sem validacao runtime. Snippet malformado quebra so quando renderiza
- Schema atual em `lib/types.ts:9-16` (`Snippet`) + `:18-23` (`Language`)
- Sem dependencia Zod ainda (`package.json` confirma)

### Abordagem

1. Adicionar `zod` como dependencia
2. Criar `lib/schemas.ts` com `SnippetSchema` e `LanguageSchema` espelhando os tipos
3. Validar **uma vez no boot** (em `data/index.ts`, ao construir o array final) — `process.env.NODE_ENV === 'development'` faz `.parse()` (throw); producao faz `.safeParse()` e loga warning
4. Tipo derivado: `export type Snippet = z.infer<typeof SnippetSchema>` substitui declaracao manual em `lib/types.ts`

### Risco

Baixo-medio. Pode revelar snippets ja malformados no codebase (bom — corrigimos). Aumenta bundle em ~12kb (zod core).

### Como o estagiario testa

1. Build deve passar sem erros novos
2. Quebrar de proposito 1 snippet (remover `difficulty`) → confirmar que console mostra erro claro em dev

---

## Tema 3 — Refatoracao da [track]/page.tsx

### Diagnostico

- `app/tracks/[track]/page.tsx`: **389 linhas** (confirmado)
- 11 useState + 6 useEffect + 5 useMemo + 7 handlers + 1 ref + JSX longo
- Mistura: setup de sessao, calculo de XP, render de breadcrumb, render de tabs, render de typing area, render de result, render de footer

### Abordagem (escopo conservador — nao quebrar o que funciona)

**Extrair APENAS componentes de apresentacao** (mexer em hooks de estado é arriscado pra subir hoje):

1. **NOVO** `components/typing/TrackBreadcrumb.tsx` — Link tracks > nome > contador (linhas 286-295)
2. **NOVO** `components/typing/LanguageTabs.tsx` — botoes redondos coloridos de linguagem (linhas 298-315)
3. **NOVO** `components/typing/PracticeNavButtons.tsx` — prev/restart/next icon buttons (linhas 348-372)

**NAO mexer agora:**
- Hooks de estado da pagina (useSessionManager fica pra depois — risco alto)
- Logica de `useEffect` de finalizacao de snippet (linhas 158-203) — fluxo critico
- `useTimer` / `useTypingEngine` — ja sao hooks isolados

Pagina cai de 389 pra ~280 linhas. Resto do plano original (`PracticeContainer`, `useSessionManager`) fica como TODO documentado.

### Risco

Baixo. Pura extracao de JSX com props.

### Como o estagiario testa

1. Abrir 3 trilhas diferentes (uma de code, uma de text, uma slot-based como JS fundamentals)
2. Trocar idioma na tab — deve funcionar igual
3. Clicar prev/restart/next durante e fora de digitacao
4. Completar trilha inteira — result screen aparece
5. Mobile (devtools 375px) — breadcrumb e tabs nao quebram

---

## Tema 4 — Limpeza de docs (codigo-sombra)

### Diagnostico

- `docs/contributing/` tem 5 arquivos duplicados do codigo real:
  - `useTypingEngine.ts`, `i18n.ts`, `types.ts`, `utils.ts`, `package.json`
- Causam drift garantido. Confirmado pelo plano original e existencia fisica dos arquivos

### Abordagem

1. **DELETE** os 5 arquivos duplicados em `docs/contributing/`
2. **EDIT** `docs/contributing/CONTRIBUTING.pt-br.md` e `CONTRIBUTING.en.md` — substituir referencias "veja arquivo X copiado" por **links relativos** apontando o codigo real (`../../hooks/useTypingEngine.ts`, etc.)
3. Adicionar secao no CONTRIBUTING explicando o **novo fluxo** de adicionar linguagem (Tema 1) — fluxo: criar arquivo em `data/` + adicionar entry no `manifest.ts`

### Risco

Zero. Documentacao apenas.

### Como o estagiario testa

1. Ler CONTRIBUTING e seguir os links — todos abrem o codigo real
2. Adicionar uma linguagem fake seguindo so o que o CONTRIBUTING manda — deve dar certo na 1a tentativa

---

## Ordem de execucao

1. **Tema 4** primeiro (zero risco, esquenta o terreno)
2. **Tema 1** (manifesto) — base pra todo o resto
3. **Tema 2** (zod) — pluga no manifesto/index
4. **Tema 3** (refatoracao componentes) — independente, deixa por ultimo pra nao bloquear outros

Cada tema sera 1 commit gitmoji separado dentro da branch `feature/melhorias-base`. PR unico no final.

## Checklist final antes do PR

- [ ] `npm run build` passa
- [ ] `npm run lint` sem warnings novos
- [ ] Smoke test manual: home → tracks → 1 trilha de cada tipo (code, text, cybersec)
- [ ] CONTRIBUTING atualizado com novo fluxo
- [ ] CHANGELOG ou nota no README mencionando manifesto (opcional)

## Fora de escopo (TODOs documentados pra depois)

- `useSessionManager` hook (Tema 2 plano original)
- `PracticeContainer` componente container
- Testes unitarios (Vitest setup) — projeto nao tem infra de teste hoje
- Centralizacao completa de i18n strings — ja existe `lib/i18n.ts`, expandir gradualmente
- TypeDoc / documentacao auto-gerada
