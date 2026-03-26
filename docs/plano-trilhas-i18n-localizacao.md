# Plano: Novas Trilhas + i18n Completo + Localização

## Contexto

O app SharkType tem um toggle PT/EN que hoje só traduz ~19 strings. A maioria da interface (títulos, descrições, prompts de snippets, nomes de trilhas, labels de botões) permanece em português mesmo quando o usuário troca para EN. Além disso, o usuário quer expandir o conteúdo com trilhas novas (DevOps completo e Cybersec) e mais snippets nas trilhas Git e Linux.

**Quatro problemas resolvidos de uma vez:**
1. Adicionar trilhas novas (expandir Git/Linux, criar K8s/Terraform/Ansible/CI-CD/Cybersec)
2. Fazer o toggle PT/EN traduzir TUDO (UI + dados)
3. Garantir que o inglês seja idiomático (localizado), não tradução literal
4. Garantir que o português também seja localizado — os textos atuais em PT muitas vezes são genéricos ou técnicos demais. Reescrever prompts em PT-BR com linguagem natural de dev brasileiro (ex: "Guarde suas mudanças no stash pra trocar de branch sem perder nada" em vez de "Salve temporariamente seu trabalho em andamento sem criar um commit")

---

## Decisões de Arquitetura

### 1. Prompts e concepts viram objetos bilíngues

```ts
export type I18nString = { pt: string; en: string }

export interface Snippet {
  id: string
  code: string
  concept: I18nString      // era string
  difficulty: Difficulty
  prompt?: I18nString      // era string
}
```

**Por quê:** Co-localizar traduções nos arquivos de dados evita manter dois lugares sincronizados. TypeScript pega todos os consumidores que precisam de update.

### 2. Track.name e Track.description também viram I18nString

```ts
export interface Track {
  id: string
  name: I18nString
  description: I18nString
  snippetIds: string[]
  textLanguages?: true
  difficultyFilter?: Difficulty
}
```

### 3. Dicionário i18n expandido para UI chrome (~80-90 keys novas)

O `lib/i18n.ts` cresce de 19 para ~100 keys cobrindo toda string hardcoded em componentes e páginas. Dados (prompts/concepts/track metadata) são acessados direto via `data.field[locale]`.

### 4. DevOps: um arquivo por ferramenta

Seguindo o padrão existente (docker.ts, git.ts, linux.ts), criar: `kubernetes.ts`, `terraform.ts`, `ansible.ts`, `cicd.ts`.

### 5. Inglês idiomático nos prompts

Ambos os idiomas devem usar linguagem natural de desenvolvedor, não texto genérico ou tradução literal.

**Inglês — idiomático, não literal:**

| PT atual | EN ruim | EN bom |
|---|---|---|
| Reaplique os commits da sua branch de feature sobre a ponta da main | Reapply the commits of your feature branch on top of the tip of main | Rebase your feature branch onto main so your commits sit on top of the latest changes |
| Salve temporariamente seu trabalho em andamento | Temporarily save your work in progress | Stash your WIP so you can switch branches without committing half-done changes |

**Português — reescrever com tom natural de dev BR:**

| PT atual (genérico) | PT bom (localizado) |
|---|---|
| Salve temporariamente seu trabalho em andamento sem criar um commit, liste os stashes e recupere o mais recente | Guarde suas mudanças no stash pra trocar de branch sem perder nada, confira o que tem guardado e restaure o mais recente |
| Reaplique os commits da sua branch de feature sobre a ponta da branch main para manter um histórico linear | Faça rebase da sua feature em cima da main pra manter o histórico limpo e linear |
| Integre uma branch de feature na branch principal preservando o histórico com um merge commit explícito | Traga as mudanças da feature pra main com merge, mantendo o histórico completo |
| Desfaça o último commit mantendo as mudanças staged, sincronize forçadamente com o remoto e crie um commit de reversão seguro | Desfaça o último commit sem perder as mudanças (soft reset), force sync com o remoto e crie um revert seguro |
| Visualize o histórico de commits em formato compacto com grafo | Veja o histórico de commits num formato enxuto com grafo visual |

**Princípio geral PT-BR:** Usar linguagem direta, como um dev explicaria pro colega. Evitar formalidade excessiva ("execute o workflow", "adicione todos os arquivos") e preferir tom prático ("rode o fluxo básico", "adicione tudo e commite").

---

## Fase 1: Tipos e Infraestrutura i18n

### 1.1 Atualizar `lib/types.ts`
- Adicionar `export type I18nString = { pt: string; en: string }`
- `Snippet.concept`: `string` → `I18nString`
- `Snippet.prompt`: `string | undefined` → `I18nString | undefined`

### 1.2 Atualizar `data/tracks.ts`
- `Track.name` e `Track.description`: `string` → `I18nString`
- Converter as 28 trilhas existentes para formato bilíngue

### 1.3 Expandir `lib/i18n.ts`
Adicionar ~80-90 keys novas. Lista completa:

- **Toolbar.tsx** (5): navTracks, navRanking, navHelp, navSettings, toggleLocale
- **HelpModal.tsx** (~20): helpTitle, helpShortcuts, helpShiftTab, helpTab, helpEnter, helpBackspace, helpEsc, helpDifficulty, helpDefault, helpEasy, helpMedium, helpHard, helpTracks, helpTracksDesc, helpXP, helpXPDesc, helpThemes, helpThemesDesc
- **SnippetInfo.tsx** (2): hide, show
- **Footer.tsx** (2): settings, settingsShort
- **LanguageDropdown.tsx** (2): sectionCode, sectionText
- **tracks/page.tsx** (7): pageTracks, tracksSubtitle, codeTracksDesc, completed, sectionIdioms, idiomsDesc, sectionCode
- **tracks/[track]/page.tsx** (4): trackNotFound, loading, hintShiftTab, breadcrumbTracks
- **leaderboard/page.tsx** (12): pageRanking, globalSoon, bestSessions, bestWpm, sessions, allFilter, noSessions, noSessionsHint, colLanguage, colAccuracy, colErrors, colDate
- **stats/page.tsx** (6): back, pageStats, perLanguage, noSessionYet, recentHistory, viewStats
- **settings/page.tsx** (12): pageSettings, soundAll, soundAllDesc, soundKey, soundSpace, soundError, soundComplete, soundPrefix, resetProgress, confirm, cancel, resetBtn

### 1.4 Adicionar prop `locale` nos componentes que faltam
- `HelpModal` — adicionar `locale: Locale`
- `Footer` — adicionar `locale: Locale`
- `LanguageDropdown` — adicionar `locale: Locale`
- `KeyboardHints` — adicionar `locale: Locale`
- Atualizar call sites para passar `locale`

---

## Fase 2: Converter 19 Arquivos de Dados Existentes

Converter `concept` e `prompt` de string para `I18nString` em todos os snippets existentes (~190 snippets).

**Importante:** Não é só embrulhar o texto PT existente num objeto — os prompts em PT-BR devem ser revisados e reescritos com tom natural de dev brasileiro (ver exemplos na seção de Decisões). Criar o EN idiomático ao mesmo tempo.

1. `data/javascript.ts` (10 snippets)
2. `data/typescript.ts` (10)
3. `data/python.ts` (10)
4. `data/rust.ts` (10)
5. `data/go.ts` (10)
6. `data/java.ts` (10)
7. `data/sql.ts` (10)
8. `data/bash.ts` (10)
9. `data/css.ts` (10)
10. `data/cpp.ts` (10)
11. `data/swift.ts` (10)
12. `data/scala.ts` (10)
13. `data/ruby.ts` (10)
14. `data/lua.ts` (10)
15. `data/html.ts` (10)
16. `data/kotlin.ts` (10)
17. `data/docker.ts` (10)
18. `data/git.ts` (10)
19. `data/linux.ts` (10)
+ 5 arquivos text-*.ts (converter concepts para consistência de tipo)

---

## Fase 3: Adicionar Dados Novos

### 3.1 Expandir `data/git.ts` — +10 snippets (git-011 a git-020)
Novos conceitos: config global, aliases, clone profundo, tags de versão, gerenciar remotos, log avançado, blame, bisect, restore moderno, stash avançado

### 3.2 Expandir `data/linux.ts` — +7 snippets (linux-011 a linux-017)
Novos conceitos: systemctl, variáveis de ambiente, cron, ssh/scp, curl para APIs, disco/memória, grep avançado

### 3.3 Criar `data/kubernetes.ts` — 6 snippets (k8s-001 a k8s-006)
Conceitos: kubectl básico, Deployment YAML, Service/Ingress, apply/rollback, ConfigMap/Secret, autoscaler

### 3.4 Criar `data/terraform.ts` — 4 snippets (tf-001 a tf-004)
Conceitos: init/plan/apply, provider + resource AWS, variáveis/outputs, workspaces

### 3.5 Criar `data/ansible.ts` — 3 snippets (ans-001 a ans-003)
Conceitos: playbook básico, inventário/variáveis, comandos ansible-playbook

### 3.6 Criar `data/cicd.ts` — 2 snippets (cicd-001 a cicd-002)
Conceitos: GitHub Actions workflow, deploy com Actions

### 3.7 Criar `data/cybersec.ts` — 18 snippets (sec-001 a sec-018)
Subdomínios: Nmap (6), Firewall (2), Análise de Rede (2), Criptografia (3), Hardening (3), Web (2)

---

## Fase 4: Integrar Dados Novos

### 4.1 Atualizar `data/index.ts`
- Importar 5 novos arquivos
- Adicionar ao `codeLanguages`:
  - `{ id: 'kubernetes', label: 'Kubernetes', color: '#326ce5', snippets: kubernetesSnippets }`
  - `{ id: 'terraform', label: 'Terraform', color: '#7b42bc', snippets: terraformSnippets }`
  - `{ id: 'ansible', label: 'Ansible', color: '#ee0000', snippets: ansibleSnippets }`
  - `{ id: 'cicd', label: 'CI/CD', color: '#fc6d26', snippets: cicdSnippets }`
  - `{ id: 'cybersec', label: 'Cybersecurity', color: '#00d4aa', snippets: cybersecSnippets }`

### 4.2 Atualizar `data/tracks.ts`
- Trilha `git`: adicionar git-011 a git-020 nos snippetIds
- Trilha `linux`: adicionar linux-011 a linux-017
- Trilha `devops`: adicionar k8s-*, tf-*, ans-*, cicd-* nos snippetIds
- Nova trilha `cybersec` com sec-001 a sec-018

### 4.3 Adicionar keywords para syntax highlighting
Arquivo: `components/typing/TypingArea.tsx` (mapa `languageKeywords`)
- kubernetes, terraform, ansible, cicd, cybersec

---

## Fase 5: Atualizar Componentes e Páginas

### 5.1 `components/typing/SnippetInfo.tsx`
- Adicionar prop `locale`
- `snippet.concept` → `snippet.concept[locale]`
- `snippet.prompt` → `snippet.prompt?.[locale]`
- `'Fácil'/'Médio'/'Difícil'` → `t('easy'/'medium'/'hard', locale)`
- `'ocultar'/'mostrar'` → `t('hide'/'show', locale)`

### 5.2 `components/typing/Toolbar.tsx`
- `title="Trilhas"` → `title={t('navTracks', locale)}`
- Idem para Ranking, Ajuda, Configurações, toggle locale

### 5.3 `components/typing/HelpModal.tsx`
- Adicionar prop `locale`, usar `t()` em todo o conteúdo

### 5.4 `components/typing/Footer.tsx`
- Adicionar prop `locale`, traduzir "configurações"/"config"

### 5.5 `components/typing/LanguageDropdown.tsx`
- Adicionar prop `locale`, traduzir "Código"/"Texto"

### 5.6 `app/tracks/page.tsx`
- `"Trilhas"` → `t('pageTracks', locale)`
- `track.name` → `track.name[locale]`
- `track.description` → `track.description[locale]`
- Traduzir subtítulo, seções "Código"/"Idiomas", "concluídos"

### 5.7 `app/tracks/[track]/page.tsx`
- `"Trilha não encontrada."` → `t('trackNotFound', locale)`
- `"Carregando..."` → `t('loading', locale)`
- `track.name` → `track.name[locale]`
- `"shift + tab — reiniciar"` → `t('hintShiftTab', locale)`
- Breadcrumb "Trilhas" → `t('pageTracks', locale)`
- Passar `locale` para SnippetInfo e Footer

### 5.8 `app/page.tsx`
- Passar `locale` para HelpModal, Footer, LanguageDropdown
- Traduzir hints de teclado
- Snippet concept/prompt: usar `[locale]`

### 5.9 `app/leaderboard/page.tsx`
- Traduzir todos os títulos, labels de tabela, estados vazios

### 5.10 `app/stats/page.tsx`
- Importar `useLocale`, traduzir tudo

### 5.11 `app/settings/page.tsx`
- Importar `useLocale`, traduzir labels de som, botões, seções

---

## Fase 6: Verificação

### 6.1 Compilação TypeScript
```bash
npx tsc --noEmit
```
Vai pegar qualquer `string` vs `I18nString` remanescente.

### 6.2 Checklist manual
- [ ] Toggle para EN: toda string visível mudou em TODAS as páginas
- [ ] Toggle para PT: tudo funciona, nenhum texto quebrado
- [ ] Página principal: prompts e concepts no idioma correto
- [ ] Lista de trilhas: nomes e descrições traduzem
- [ ] Prática de trilha: breadcrumb, snippet info, hints traduzem
- [ ] Leaderboard: título, headers, estados vazios traduzem
- [ ] Stats: todos os labels traduzem
- [ ] Settings: labels, botões traduzem
- [ ] Help modal: conteúdo inteiro traduz
- [ ] Novos snippets Git (git-011 a git-020) aparecem na trilha Git
- [ ] Novos snippets Linux (linux-011 a linux-017) aparecem na trilha Linux CLI
- [ ] Trilha DevOps inclui K8s, Terraform, Ansible, CI/CD
- [ ] Nova trilha Cybersecurity aparece com 18 snippets
- [ ] Syntax highlighting funciona para novas linguagens

---

## Resumo de Arquivos

| Categoria | Arquivos | Mudanças |
|-----------|----------|----------|
| Tipos | 1 (`lib/types.ts`) | Adicionar I18nString, atualizar Snippet |
| i18n | 1 (`lib/i18n.ts`) | +80-90 keys no dicionário |
| Tracks | 1 (`data/tracks.ts`) | Interface + 28 trilhas bilíngues + 1 nova |
| Dados existentes | 19+5 (`data/*.ts`) | Converter ~190 prompts + concepts |
| Dados novos | 5 novos (`kubernetes.ts`, `terraform.ts`, `ansible.ts`, `cicd.ts`, `cybersec.ts`) | ~33 snippets novos |
| Dados expandidos | 2 (`git.ts`, `linux.ts`) | +10 e +7 snippets |
| Index | 1 (`data/index.ts`) | Importar e registrar 5 linguagens novas |
| Componentes | ~7 (`SnippetInfo`, `Toolbar`, `HelpModal`, `Footer`, `LanguageDropdown`, etc.) | Adicionar locale, usar t() e [locale] |
| Páginas | ~6 (`page.tsx`, `tracks/*`, `leaderboard`, `stats`, `settings`) | Usar t() em todo texto |
| **Total** | **~50 arquivos** | |

---

## Ordem de Execução

1. **Fase 1** (tipos + dicionário) — estabelece contratos
2. **Fase 2 + 3** (dados existentes + novos) — podem ser paralelas
3. **Fase 4** (integração index/tracks) — conecta tudo
4. **Fase 5** (componentes/páginas) — consome os novos tipos
5. **Fase 6** (verificação) — check final

**Importante:** Não fazer deploy entre Fase 1 e fim da Fase 5 — o app vai ter erros de compilação até todos os consumidores serem atualizados.
