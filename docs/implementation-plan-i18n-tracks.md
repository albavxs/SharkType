# Implementation Plan: SharkType i18n + New Tracks + Localization

## Summary

Three interconnected changes to the SharkType code typing practice app:
1. Add new snippet data (expand Git, Linux; add DevOps and Cybersec tracks)
2. Fix i18n so the PT/EN toggle translates everything (UI, data, prompts)
3. Ensure English translations are natural (localized), not literal

---

## Architecture Decisions

### Decision 1: Bilingual snippet prompts and concepts

**Chosen approach: Change `prompt` to `{ pt: string; en: string }` and `concept` to `{ pt: string; en: string }`.**

Rationale:
- A separate translation lookup dictionary would decouple data from translations, making it harder to add/modify snippets (you would need to update two places).
- Co-locating translations in the data files follows the existing pattern where all snippet information lives in one place.
- The type change is mechanical and enforced by TypeScript -- the compiler will flag every consumer that needs updating.

The `Snippet` type becomes:
```ts
export type I18nString = { pt: string; en: string }

export interface Snippet {
  id: string
  code: string
  concept: I18nString
  difficulty: Difficulty
  prompt?: I18nString
}
```

### Decision 2: Bilingual track metadata

**Chosen approach: Same pattern -- change `name` and `description` to `{ pt: string; en: string }`.**

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

### Decision 3: DevOps data organization

**Chosen approach: Create individual files per tool -- `data/kubernetes.ts`, `data/terraform.ts`, `data/ansible.ts`, `data/cicd.ts`.**

Rationale:
- Consistent with the existing pattern (docker.ts, git.ts, linux.ts are each standalone).
- Each tool is a distinct domain with its own snippets, concepts, and difficulty curve.
- Easier to expand individual tool coverage later.
- The DevOps track in `tracks.ts` already cross-references snippet IDs from multiple data files; this continues that pattern.

### Decision 4: Snippet concept language

**Chosen approach: Concepts become bilingual objects.**

Current concepts are inconsistent (some English like "Basic Workflow", some Portuguese like "Build Otimizado"). Making them `{ pt: string; en: string }` objects normalizes this and lets each locale display the right text.

### Decision 5: i18n dictionary expansion strategy

**Chosen approach: Expand the existing `lib/i18n.ts` dictionary for all UI strings. Do NOT use the dictionary for data strings (prompts/concepts/track metadata) -- those are bilingual objects accessed directly.**

The dictionary handles:
- Component UI text (buttons, labels, headings, section titles)
- Page structural text (page titles, descriptions, empty states)
- Settings labels, sound event names
- The LanguageDropdown section headers ("Code" / "Text")

This keeps the two concerns cleanly separated:
- `t(key, locale)` for UI chrome
- `data.prompt[locale]` for content

---

## Phase 1: Type System and i18n Infrastructure

### Step 1.1: Update `lib/types.ts`

File: `lib/types.ts`

Change `Snippet.concept` from `string` to `I18nString`.
Change `Snippet.prompt` from `string | undefined` to `I18nString | undefined`.

Add the helper type:
```ts
export type I18nString = { pt: string; en: string }
```

### Step 1.2: Update `data/tracks.ts`

File: `data/tracks.ts`

Change `Track.name` and `Track.description` from `string` to `I18nString`.

Update all 28 existing track definitions. Example:
```ts
{
  id: 'variables',
  name: { pt: 'Variaveis', en: 'Variables' },
  description: {
    pt: 'Declaracao e uso de variaveis, constantes e tipos basicos',
    en: 'Declaration and usage of variables, constants, and basic types'
  },
  ...
}
```

### Step 1.3: Expand `lib/i18n.ts` dictionary

File: `lib/i18n.ts`

Add ~80-90 new keys covering every hardcoded Portuguese string in components and pages. Full inventory:

**Toolbar.tsx (5 keys):**
- `navTracks`: "Trilhas" / "Tracks"
- `navRanking`: "Ranking" / "Leaderboard"
- `navHelp`: "Ajuda" / "Help"
- `navSettings`: "Configuracoes" / "Settings"
- `toggleLocale`: "Alternar idioma da interface" / "Toggle interface language"

**HelpModal.tsx (~20 keys):**
- `helpTitle`: "Como usar o SharkType" / "How to use SharkType"
- `helpShortcuts`: "Atalhos de teclado" / "Keyboard shortcuts"
- `helpShiftTab`: "reiniciar snippet (funciona durante a digitacao)" / "restart snippet (works while typing)"
- `helpTab`: "reiniciar teste / proximo snippet" / "restart test / next snippet"
- `helpEnter`: "nova linha (no codigo)" / "new line (in code)"
- `helpBackspace`: "apagar caractere" / "delete character"
- `helpEsc`: "fechar modais" / "close modals"
- `helpDifficulty`: "Dificuldade" / "Difficulty"
- `helpDefault`: "Todos os snippets, sem cronometro" / "All snippets, no timer"
- `helpEasy`: "Variaveis, declaracoes simples, one-liners (60s)" / "Variables, simple declarations, one-liners (60s)"
- `helpMedium`: "Funcoes, loops, tratamento de erros (45s)" / "Functions, loops, error handling (45s)"
- `helpHard`: "Patterns avancados, generics, closures (30s)" / "Advanced patterns, generics, closures (30s)"
- `helpTracks`: "Trilhas" / "Tracks"
- `helpTracksDesc`: full paragraph localized
- `helpXP`: "XP e Niveis" / "XP and Levels"
- `helpXPDesc`: full paragraph localized
- `helpThemes`: "Temas" / "Themes"
- `helpThemesDesc`: full paragraph localized

**SnippetInfo.tsx (2 keys):**
- `hide`: "ocultar" / "hide"
- `show`: "mostrar" / "show"

**Footer.tsx (2 keys):**
- `settings`: "configuracoes" / "settings"
- `settingsShort`: "config" / "config"

**KeyboardHints.tsx (1 key):**
- `hintNewline`: "enter = nova linha" / "enter = new line"

**LanguageDropdown.tsx (2 keys):**
- `sectionCode`: "Codigo" / "Code"
- `sectionText`: "Texto" / "Text"

**tracks/page.tsx (~7 keys):**
- `pageTracks`: "Trilhas" / "Tracks"
- `tracksSubtitle`: "Escolha uma trilha de conceitos..." / "Choose a concept track..."
- `codeTracksDesc`: "Trilhas tematicas por conceito ou linguagem de programacao" / "Themed tracks by concept or programming language"
- `completed`: "concluidos" / "completed"
- `sectionIdioms`: "Idiomas" / "Languages"
- `idiomsDesc`: "Treine digitacao com textos em portugues, ingles, espanhol e frances" / "Practice typing with texts in Portuguese, English, Spanish, and French"

**tracks/[track]/page.tsx (~4 keys):**
- `trackNotFound`: "Trilha nao encontrada." / "Track not found."
- `loading`: "Carregando..." / "Loading..."
- `hintShiftTab`: "shift + tab -- reiniciar" / "shift + tab -- restart"

**leaderboard/page.tsx (~12 keys):**
- `pageRanking`: "Ranking" / "Leaderboard"
- `globalSoon`: "ranking global em breve" / "global leaderboard coming soon"
- `bestSessions`: "Suas melhores sessoes, ordenadas por WPM." / "Your best sessions, ranked by WPM."
- `bestWpm`: "melhor wpm" / "best wpm"
- `sessions`: "sessoes" / "sessions"
- `allFilter`: "Todas" / "All"
- `noSessions`: "Nenhuma sessao ainda." / "No sessions yet."
- `noSessionsHint`: "Complete alguns treinos para ver seu historico aqui." / "Complete some practices to see your history here."
- `colLanguage`: "linguagem" / "language"
- `colAccuracy`: "precisao" / "accuracy"
- `colErrors`: "erros" / "errors"
- `colTime`: "tempo" / "time"
- `colDate`: "data" / "date"

**stats/page.tsx (~6 keys):**
- `back`: "Voltar" / "Back"
- `pageStats`: "Estatisticas" / "Statistics"
- `perLanguage`: "Por linguagem" / "Per language"
- `noSessionYet`: "Nenhuma sessao ainda. Comece a praticar!" / "No sessions yet. Start practicing!"
- `recentHistory`: "Historico recente" / "Recent history"
- `viewStats`: "Ver estatisticas" / "View statistics"

**settings/page.tsx (~12 keys):**
- `pageSettings`: "Configuracoes" / "Settings"
- `soundAll`: "Som -- todos" / "Sound -- all"
- `soundAllDesc`: "Aplica o mesmo perfil para tecla, espaco, erro e completo" / "Apply the same profile to key, space, error, and complete"
- `soundKey`: "Tecla" / "Key"
- `soundSpace`: "Espaco" / "Space"
- `soundError`: "Erro" / "Error"
- `soundComplete`: "Completo" / "Complete"
- `soundPrefix`: "Som --" / "Sound --"
- `resetProgress`: "Reset progresso" / "Reset progress"
- `confirm`: "Confirmar" / "Confirm"
- `cancel`: "Cancelar" / "Cancel"
- `resetBtn`: "Resetar" / "Reset"

**sounds.ts (1 key):**
- `soundOff`: "Desligado" / "Off"

Total: ~80-90 new dictionary keys (some reused across pages).

### Step 1.4: Pass `locale` to all components that need it

Components that currently lack a `locale` prop and need one:
- `HelpModal` -- add `locale: Locale` prop
- `Footer` -- add `locale: Locale` prop
- `LanguageDropdown` -- add `locale: Locale` prop
- `KeyboardHints` -- add `locale: Locale` prop

Update all call sites to pass `locale`.

---

## Phase 2: Update All 19 Existing Data Files

### Step 2.1: Convert all 190 snippet `prompt` fields to bilingual objects

Each of the 19 data files needs every snippet updated:

From:
```ts
prompt: 'Desfaca o ultimo commit mantendo as mudancas staged...'
```
To:
```ts
prompt: {
  pt: 'Desfaca o ultimo commit mantendo as mudancas staged, sincronize forcadamente com o remoto e crie um commit de reversao seguro.',
  en: 'Soft-reset the last commit so changes remain staged for re-commit, force-sync with the remote, and create a safe revert commit.'
}
```

**Critical: English prompts must be localized, not literal translations.** Each English prompt should use idiomatic developer language. Examples:

| Portuguese | Bad English | Good English |
|-----------|-------------|-------------|
| Reaplique os commits da sua branch de feature sobre a ponta da branch main para manter um historico linear. | Reapply the commits of your feature branch on top of the tip of the main branch to maintain a linear history. | Rebase your feature branch onto main so your commits sit on top of the latest changes, keeping a clean linear history. |
| Salve temporariamente seu trabalho em andamento sem criar um commit | Temporarily save your work in progress without creating a commit | Stash your work-in-progress so you can switch branches without committing half-done changes. |

### Step 2.2: Convert all 190+ snippet `concept` fields to bilingual objects

From:
```ts
concept: 'Basic Workflow',
```
To:
```ts
concept: { pt: 'Fluxo Basico', en: 'Basic Workflow' },
```

Current concepts are mixed-language. Normalize each to have both PT and EN versions. Examples:
- `'Build Otimizado'` becomes `{ pt: 'Build Otimizado', en: 'Optimized Build' }`
- `'FROM e CMD'` becomes `{ pt: 'FROM e CMD', en: 'FROM & CMD' }`
- `'Arrow Function'` stays `{ pt: 'Arrow Function', en: 'Arrow Function' }` (tech terms stay the same)

### Step 2.3: Files impacted (full list of 19 code data files)

1. `data/javascript.ts` (10 snippets)
2. `data/typescript.ts` (10 snippets)
3. `data/python.ts` (10 snippets)
4. `data/rust.ts` (10 snippets)
5. `data/go.ts` (10 snippets)
6. `data/java.ts` (10 snippets)
7. `data/sql.ts` (10 snippets)
8. `data/bash.ts` (10 snippets)
9. `data/css.ts` (10 snippets)
10. `data/cpp.ts` (10 snippets)
11. `data/swift.ts` (10 snippets)
12. `data/scala.ts` (10 snippets)
13. `data/ruby.ts` (10 snippets)
14. `data/lua.ts` (10 snippets)
15. `data/html.ts` (10 snippets)
16. `data/kotlin.ts` (10 snippets)
17. `data/docker.ts` (10 snippets)
18. `data/git.ts` (10 snippets)
19. `data/linux.ts` (10 snippets)

Plus 5 text data files (text-typing.ts, text-ptbr.ts, text-en.ts, text-es.ts, text-fr.ts) which also have concept fields that should be converted for type consistency.

---

## Phase 3: Add New Snippet Data

### Step 3.1: Expand `data/git.ts` -- add 10 new snippets (git-011 to git-020)

New concepts to cover:
- Global identity configuration (git config)
- SSH key generation and setup
- Interactive rebase (git rebase -i scenarios)
- Signed commits (GPG/SSH signing)
- Git worktrees
- Reflog recovery
- Submodules
- Git hooks (pre-commit, etc.)
- Sparse checkout
- Advanced workflows (filter-branch, rerere, etc.)

All written bilingual from inception.

### Step 3.2: Expand `data/linux.ts` -- add 7 new snippets (linux-011 to linux-017)

New concepts:
- Cron jobs and scheduling
- Systemd unit files and service management
- Disk management (fdisk, mount, fstab)
- SSH tunnels and remote access
- iptables/nftables firewall rules
- User and group management
- Kernel modules and sysctl

### Step 3.3: Create `data/kubernetes.ts` -- 6 new snippets (k8s-001 to k8s-006)

New file exporting `kubernetesSnippets`. Concepts:
- Pod manifests (YAML)
- Deployments with rolling updates
- Services (ClusterIP, NodePort, LoadBalancer)
- ConfigMaps and Secrets
- Ingress rules
- Horizontal Pod Autoscaler

### Step 3.4: Create `data/terraform.ts` -- 4 new snippets (tf-001 to tf-004)

New file exporting `terraformSnippets`. Concepts:
- Provider configuration
- Resource definitions (aws_instance, etc.)
- Variables and outputs
- Modules

### Step 3.5: Create `data/ansible.ts` -- 3 new snippets (ans-001 to ans-003)

New file exporting `ansibleSnippets`. Concepts:
- Playbook structure
- Roles
- Handlers and notifications

### Step 3.6: Create `data/cicd.ts` -- 2 new snippets (cicd-001 to cicd-002)

New file exporting `cicdSnippets`. Concepts:
- GitHub Actions workflow YAML
- GitLab CI pipeline YAML

### Step 3.7: Create `data/cybersec.ts` -- 18 new snippets (sec-001 to sec-018)

New file exporting `cybersecSnippets`. Concepts organized by sub-domain:
- **Nmap** (3 snippets): Basic scan, service detection, script scanning
- **Firewall** (3 snippets): iptables rules, ufw setup, nftables
- **Network Analysis** (3 snippets): tcpdump captures, Wireshark filters, netstat/ss
- **Crypto** (3 snippets): OpenSSL certificates, GPG keys, hashing
- **Hardening** (3 snippets): SSH hardening, sysctl tuning, audit logging
- **Web Security** (3 snippets): OWASP headers, CSP policies, SQL injection testing

---

## Phase 4: Wire New Data Into the App

### Step 4.1: Update `data/index.ts`

File: `data/index.ts`

Import 5 new data files and add them to `codeLanguages`:
```ts
import { kubernetesSnippets } from './kubernetes'
import { terraformSnippets } from './terraform'
import { ansibleSnippets } from './ansible'
import { cicdSnippets } from './cicd'
import { cybersecSnippets } from './cybersec'

// Add to codeLanguages array:
{ id: 'kubernetes', label: 'Kubernetes', color: '#326ce5', snippets: kubernetesSnippets },
{ id: 'terraform',  label: 'Terraform',  color: '#7b42bc', snippets: terraformSnippets },
{ id: 'ansible',    label: 'Ansible',    color: '#ee0000', snippets: ansibleSnippets },
{ id: 'cicd',       label: 'CI/CD',      color: '#fc6d26', snippets: cicdSnippets },
{ id: 'cybersec',   label: 'Cybersecurity', color: '#00d4aa', snippets: cybersecSnippets },
```

### Step 4.2: Update `data/tracks.ts`

**Update the existing `git` track** to include git-011 through git-020.

**Update the existing `linux` (Linux CLI) track** to include linux-011 through linux-017.

**Update the existing `devops` track** to include new tool snippet IDs:
```ts
{
  id: 'devops',
  name: { pt: 'DevOps', en: 'DevOps' },
  description: {
    pt: 'Docker, Kubernetes, Terraform, Ansible e CI/CD para infraestrutura e automacao',
    en: 'Docker, Kubernetes, Terraform, Ansible, and CI/CD for infrastructure and automation'
  },
  snippetIds: [
    'docker-001', 'docker-002', 'docker-003', 'docker-004', 'docker-005',
    'k8s-001', 'k8s-002', 'k8s-003', 'k8s-004', 'k8s-005', 'k8s-006',
    'tf-001', 'tf-002', 'tf-003', 'tf-004',
    'ans-001', 'ans-002', 'ans-003',
    'cicd-001', 'cicd-002',
    'linux-004', 'linux-005', 'linux-006', 'linux-007', 'linux-008',
    'git-001', 'git-004', 'git-005', 'git-006',
    'bash-006', 'bash-007',
  ],
}
```

**Add a new `cybersec` track:**
```ts
{
  id: 'cybersec',
  name: { pt: 'Ciberseguranca', en: 'Cybersecurity' },
  description: {
    pt: 'Nmap, firewalls, analise de rede, criptografia, hardening e seguranca web',
    en: 'Nmap, firewalls, network analysis, cryptography, hardening, and web security'
  },
  snippetIds: ['sec-001', 'sec-002', ..., 'sec-018'],
}
```

### Step 4.3: Add keywords for new languages

File: `data/keywords.ts`

Add keyword arrays for syntax highlighting:
- `kubernetes`: apiVersion, kind, metadata, spec, containers, replicas, selector, template, ports, image, name, namespace, labels, matchLabels
- `terraform`: resource, provider, variable, output, module, data, locals, terraform, required_providers, default, type, value, source, version
- `ansible`: hosts, tasks, name, become, handlers, roles, vars, when, notify, register, with_items, template, service, copy
- `cicd`: name, on, jobs, runs-on, steps, uses, with, run, stage, script, image, services, before_script, artifacts
- `cybersec`: nmap, iptables, tcpdump, openssl, ssh, ufw, gpg, chmod, chown, audit, hash, encrypt, decrypt, firewall, scan

---

## Phase 5: Update All Components to Use i18n

### Step 5.1: Update `components/typing/SnippetInfo.tsx`

- Add `locale: Locale` prop (import from `lib/i18n`)
- Change `snippet.concept` to `snippet.concept[locale]`
- Change `snippet.prompt` to `snippet.prompt?.[locale]`
- Replace hardcoded Facil/Medio/Dificil with `t('easy'/'medium'/'hard', locale)` (already in dict)
- Replace ocultar/mostrar with `t('hide'/'show', locale)`

### Step 5.2: Update `components/typing/Toolbar.tsx`

- Import `t` from `lib/i18n` (already has `Locale` imported)
- Replace title="Trilhas" with `title={t('navTracks', locale)}`
- Replace title="Ranking" with `title={t('navRanking', locale)}`
- Replace title="Ajuda" with `title={t('navHelp', locale)}`
- Replace title="Configuracoes" with `title={t('navSettings', locale)}`
- Replace title="Alternar idioma da interface" with `title={t('toggleLocale', locale)}`

### Step 5.3: Update `components/typing/HelpModal.tsx`

- Add `locale: Locale` prop
- Import `t` from `lib/i18n`
- Replace every Portuguese heading and paragraph with `t(key, locale)` calls
- All parent call sites must pass locale

### Step 5.4: Update `components/typing/Footer.tsx`

- Add `locale: Locale` prop
- Import `t` from `lib/i18n`
- Replace "configuracoes" with `t('settings', locale)`
- Replace "config" with `t('settingsShort', locale)`

### Step 5.5: Update `components/typing/LanguageDropdown.tsx`

- Add `locale: Locale` prop
- Import `t` from `lib/i18n`
- Replace "Codigo" with `t('sectionCode', locale)`
- Replace "Texto" with `t('sectionText', locale)`

### Step 5.6: Update `components/typing/KeyboardHints.tsx`

- Add `locale: Locale` prop
- Import `t` from `lib/i18n`
- Replace "enter = nova linha" with `t('hintNewline', locale)`

### Step 5.7: Update `components/typing/ResultScreen.tsx`

- Already receives `locale` prop
- Change `snippet.concept` to `snippet.concept[locale ?? 'pt']`

### Step 5.8: Update `app/page.tsx` (main page)

- Replace "shift + tab -- reiniciar" with `t('hintShiftTab', locale)`
- Pass `locale` to HelpModal, Footer, LanguageDropdown (Toolbar already receives it)
- All snippet concept/prompt accesses need `[locale]`

### Step 5.9: Update `app/tracks/page.tsx`

- Replace "Trilhas" heading with `t('pageTracks', locale)`
- Replace subtitle with `t('tracksSubtitle', locale)`
- Replace "Codigo" section heading with `t('sectionCode', locale)`
- Replace code tracks description with `t('codeTracksDesc', locale)`
- Replace "concluidos" with `t('completed', locale)`
- Replace "Idiomas" with `t('sectionIdioms', locale)`
- Replace idioms description with `t('idiomsDesc', locale)`
- Change `track.name` to `track.name[locale]`
- Change `track.description` to `track.description[locale]`

### Step 5.10: Update `app/tracks/[track]/page.tsx`

- Replace "Trilha nao encontrada." with `t('trackNotFound', locale)`
- Replace "Carregando..." with `t('loading', locale)`
- Replace "shift + tab -- reiniciar" with `t('hintShiftTab', locale)`
- Replace "Trilhas" breadcrumb with `t('pageTracks', locale)`
- Change `track.name` to `track.name[locale]`
- Pass locale to SnippetInfo, Footer

### Step 5.11: Update `app/leaderboard/page.tsx`

- Replace "Ranking" with `t('pageRanking', locale)`
- Replace "ranking global em breve" with `t('globalSoon', locale)`
- Replace "Suas melhores sessoes..." with `t('bestSessions', locale)`
- Replace "melhor wpm" / "sessoes" with `t()` calls
- Replace "Todas" filter label with `t('allFilter', locale)`
- Replace empty state messages with `t()` calls
- Replace table headers with `t()` calls
- Pass locale to Footer

### Step 5.12: Update `app/stats/page.tsx`

- Import `useLocale` hook (currently not imported)
- Add `const { locale } = useLocale()`
- Replace "Voltar" with `t('back', locale)`
- Replace "Estatisticas" with `t('pageStats', locale)`
- Replace "Por linguagem" with `t('perLanguage', locale)`
- Replace empty state message with `t()` call
- Replace "Historico recente" with `t('recentHistory', locale)`

### Step 5.13: Update `app/settings/page.tsx`

- Import `useLocale` hook
- Add `const { locale } = useLocale()`
- Replace "Voltar" with `t('back', locale)`
- Replace "Configuracoes" with `t('pageSettings', locale)`
- Replace sound section labels with `t()` calls
- Replace sound event labels (Tecla, Espaco, Erro, Completo) with `t()` calls
- Replace Confirmar, Cancelar, Resetar with `t()` calls
- Replace "Reset progresso" with `t('resetProgress', locale)`
- Replace "Ver estatisticas" with `t('viewStats', locale)`

### Step 5.14: Update `lib/sounds.ts` sound profile label

Only "Desligado" needs localization (other labels are English brand names). Best approach: handle it in the settings page render loop rather than modifying sounds.ts. The settings page would check `if (o.key === 'off') t('soundOff', locale) else o.label`.

---

## Phase 6: Verification

### Step 6.1: TypeScript compilation check

Run `npx tsc --noEmit` to catch any remaining `string` vs `I18nString` mismatches. The compiler will flag every location where old-style access patterns are still used.

### Step 6.2: Manual testing checklist

- Toggle to EN: verify every visible string has changed on ALL pages
- Toggle to PT: verify nothing is broken, all existing Portuguese text displays correctly
- Main page: snippet prompts and concepts display in correct locale
- Tracks listing: all track names and descriptions translate
- Track practice: breadcrumb, snippet info, prompts, nav hints translate
- Leaderboard: title, table headers, empty states, filter labels translate
- Stats page: all labels and empty states translate
- Settings page: all labels, button text translate
- Help modal: all content translates
- Language dropdown: section headers (Code/Text) translate
- New Git snippets (git-011 to git-020) appear in Git track
- New Linux snippets (linux-011 to linux-017) appear in Linux CLI track
- DevOps track includes Kubernetes, Terraform, Ansible, CI/CD snippets
- New Cybersecurity track appears with 18 snippets
- Syntax highlighting works for new languages (keywords render correctly)

---

## Implementation Sequencing

The recommended order minimizes broken states:

1. **Phase 1** (types + i18n dict + infrastructure) -- establishes the new type contracts
2. **Phase 2** (update existing 19 data files) -- satisfies the new types for existing data
3. **Phase 3** (add new data files) -- new data written to the new types from the start
4. **Phase 4** (wire data into index/tracks) -- makes new data accessible
5. **Phase 5** (update all components/pages) -- consumes the new types everywhere
6. **Phase 6** (verify) -- end-to-end check

Phases 2 and 3 can be done in parallel since they touch different files.
Phase 5 steps are all independent and can be done in any order.

**Important:** Do not deploy between Phase 1 and Phase 5 completion -- the app will have TypeScript compilation errors until all consumers are updated.

---

## Risk Factors and Mitigations

1. **190 prompts need quality English localization**: This is the largest effort. Each English prompt should be reviewed for natural developer language. Batch by language file to maintain consistency within each domain.

2. **Breaking existing functionality during type migration**: The TypeScript compiler is the safety net. Update the type first, then fix all compilation errors. The `tsc --noEmit` command reveals all remaining issues.

3. **Missing locale prop propagation**: Some components currently do not accept `locale`. The fix is mechanical -- add the prop and thread it through from the nearest parent that has it. All pages already use `useLocale()`.

4. **Text-mode data files** (text-ptbr.ts, text-en.ts, text-es.ts, text-fr.ts, text-typing.ts): These are typing practice texts, not code snippets. Their concepts should also be converted to `I18nString` for type consistency, but the effort is lower-priority since their prompts are less meaningful.

5. **Snippet ID conflicts**: New snippet IDs (k8s-*, tf-*, ans-*, cicd-*, sec-*) must not collide with existing IDs. The chosen prefixes are unique across the codebase.

---

## File Change Summary

| Category | Files | Changes |
|----------|-------|---------|
| Types | 1 (lib/types.ts) | Add I18nString, update Snippet interface |
| i18n | 1 (lib/i18n.ts) | Add ~80-90 dictionary keys |
| Track config | 1 (data/tracks.ts) | Update Track interface, update 28 tracks, add 1 new track |
| Existing data | 19 files (data/*.ts) | Convert 190 prompt + 190 concept to bilingual objects |
| Text data | 5 files (data/text-*.ts) | Convert concept fields to bilingual objects |
| New data | 5 new files (kubernetes, terraform, ansible, cicd, cybersec) | ~33 new snippets total |
| Expanded data | 2 files (git.ts, linux.ts) | +10 and +7 snippets |
| Data index | 1 (data/index.ts) | Import and register 5 new languages |
| Keywords | 1 (data/keywords.ts) | Add keyword arrays for 5 new languages |
| Components | 7 files | Add locale prop, use t() and [locale] accessors |
| Pages | 6 files | Use t() for all UI text, [locale] for data display |
| Sounds | 1 (lib/sounds.ts) | Minor: localize Desligado label |
| **Total** | **~50 files** | |
