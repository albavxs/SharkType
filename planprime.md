# SharkType — Sprint 1 Revisada: Estabilização, Home Pública e Separação Free/Plus

## Objetivo da sprint

Transformar a Sprint 1 em uma sprint de **estabilização + reorganização da entrada do produto**, corrigindo a exposição indevida de conteúdo premium na prática da home atual e separando claramente:

- **Home pública / institucional** → primeira tela de entrada do SharkType.
- **Home interna / prática rápida** → área operacional onde o usuário realmente pratica.
- **Comunidade** → deixa de ser uma página isolada e passa a fazer parte da nova home pública.
- **Conteúdo Base x Plus/Mastery** → nenhuma superfície pública ou prática rápida pode carregar snippets premium fora da camada de entitlement.

A prioridade é não apenas “esconder” premium visualmente, mas garantir que ele **não seja entregue ao cliente** quando não deve.

---

## 1. Problema crítico — snippets Plus aparentemente disponíveis na home atual

### Situação atual

A rota `/` hoje funciona como prática rápida e carrega linguagens diretamente no client por `loadLanguageById(...)`.

Isso é diferente da arquitetura das trilhas, que já possuem rotas server-side responsáveis por entregar conteúdo Base ou Mastery conforme a regra de acesso.

O risco é:

```text
Home atual
→ client carrega pacote da linguagem
→ pacote contém todos os snippets
→ generateChallengeSequence(...)
→ snippets premium podem entrar na sequência
```

Mesmo que a UI tente esconder alguma coisa depois, se o snippet já chegou ao bundle/browser, a separação Free/Plus falhou.

### Regra nova obrigatória

```text
Free
→ recebe APENAS snippets Base

Plus
→ prática normal continua recebendo APENAS Base
→ Mastery continua separado na rota Mastery
```

O Plus não deve alterar silenciosamente a prática Base.

A regra arquitetural continua sendo:

```text
Base Practice ≠ Mastery Practice
```

Isso evita:
- mistura de progressão;
- dificuldade imprevisível;
- vazamento de conteúdo premium;
- catálogo Base diferente para Free e Plus;
- lógica especial espalhada pelo client.

---

## 2. Correção arquitetural da prática rápida

### Remover carregamento direto de catálogo completo no client

A home interna/prática rápida não deve mais depender de:

```ts
loadLanguageById(...)
```

para decidir quais snippets podem ser usados.

Criar endpoint server-side específico, por exemplo:

```text
GET /api/practice/quick?languageId=javascript
```

Resposta:

```ts
{
  availableLanguages,
  selectedLanguage,
  snippets
}
```

### Fonte dos snippets

O endpoint deve utilizar a mesma fonte segura usada para o conteúdo Base:

```text
freeTrackSnippetRegistry
```

ou um helper server-side compartilhado extraído dessa mesma regra.

Nunca:

```text
all snippets
→ filtrar premium no navegador
```

Sempre:

```text
servidor seleciona conteúdo permitido
→ navegador recebe somente conteúdo permitido
```

---

## 3. Criar uma fonte única de verdade para conteúdo Base

Extrair helper server-side, conceitualmente:

```ts
getBaseSnippetsForLanguage(languageId)
```

ou:

```ts
buildBasePracticeCatalog(...)
```

Esse helper poderá alimentar:

- prática rápida;
- `/tracks/[track]/practice`;
- catálogo público seguro;
- contagem de exercícios Base;
- futuras previews.

### Critério

Um snippet premium/Mastery não pode aparecer em:

- payload de prática rápida Free;
- HTML;
- React Server payload;
- JSON de endpoint Free;
- bundle estático utilizado pela página pública.

---

## 4. Nova arquitetura de navegação

### Rotas propostas

```text
/                 → nova home pública / landing
/home             → home interna / prática rápida
/tracks           → catálogo de trilhas
/tracks/...       → prática Base
/tracks/.../mastery
/feed
/activity         → futuro Feed v2
/leaderboard
/profile
/settings
/plus
```

`/home` pode receber outro nome no futuro (`/practice`, por exemplo), mas nesta sprint é importante separar a função da rota `/`.

---

## 5. Nova Home pública

A nova `/` será a **primeira tela que qualquer visitante abre**.

Não deve ser uma landing genérica de SaaS. Ela deve apresentar o produto usando a identidade visual real do SharkType.

### Hero

```text
SharkType

Aprenda. Digite. Domine.

Treine programação através de prática de digitação,
trilhas estruturadas e desafios avançados Mastery.

[ Começar agora ] [ Explorar trilhas ]
```

### Visitante

```text
Começar agora
→ /login ou /signup
```

Pode existir CTA secundária de experimentação caso decidamos manter guest practice Base.

### Usuário autenticado

```text
Continuar praticando
→ /home
```

---

## 6. Demonstração do produto na landing

### Como funciona

```text
1. Escolha uma linguagem/trilha
2. Digite código real
3. Ganhe XP e conquistas
4. Evolua para Mastery
```

### Trilhas

Preview de algumas categorias:

```text
JavaScript
Python
Linux
TypeScript
React
...
```

Sem entregar snippets completos premium.

### Mastery

Apresentar:

```text
Base
→ fundamentos

Mastery
→ desafios avançados
→ estrelas
→ progressão premium
```

Free vê CTA Plus.

Plus autenticado vê:

```text
Abrir Mastery
```

e nunca anúncio de assinatura.

---

## 7. Unificação com a página Comunidade

A atual `/community` já apresenta:

- Discord;
- GitHub;
- website/ecossistema;
- contribuição.

Em vez de manter uma página inteira separada apenas para isso, incorporar essa experiência na parte inferior da nova `/`.

### Seção Comunidade na Home

```text
Comunidade SharkType

Aprender é melhor quando não acontece sozinho.

[ Discord ]
Converse, peça ajuda e compartilhe progresso.

[ GitHub ]
Acompanhe desenvolvimento e contribua.

[ Projeto ]
Conheça o ecossistema do SharkType.
```

### Destino de `/community`

Preferência:

```text
/community
→ redirect para /#community
```

Isso preserva links existentes.

---

## 8. Home interna / prática rápida

Mover a experiência atual de `/` para:

```text
/home
```

A experiência continua tendo:

- Toolbar;
- linguagem;
- dificuldade;
- snippet;
- typing;
- resultado;
- XP;
- navegação.

Mas agora usando **API server-side segura de Base snippets**.

---

## 9. Comportamento da logo

Regra solicitada:

> O botão/logo deve levar para a home interna.

Portanto, nas áreas internas:

```text
clicar SharkType logo
→ /home
```

Inclui:

- prática rápida;
- trilhas;
- Mastery;
- feed;
- activity;
- leaderboard;
- profile;
- settings;
- billing.

### Exceção

Na landing pública `/`, clicar na própria logo:

```text
→ /
```

---

## 10. Corrigir `Toolbar`

Hoje vários lugares passam manualmente:

```ts
onHomeClick={() => router.push('/')}
```

ou usam a logo como reset.

Isso precisa parar de representar duas coisas diferentes:

```text
Logo
≠ Reset
```

### Nova regra

Logo:

```text
router.push('/home')
```

Reiniciar exercício:

```text
botão próprio / atalho próprio
```

---

## 11. Redirects e autenticação

### Visitante em `/`

Permitido.

### Visitante em `/home`

Se prática exigir conta:

```text
/home
→ /login?next=/home
```

Se guest practice for mantida:

```text
/home
→ Base Guest
```

Decidir uma política e aplicá-la consistentemente.

### Usuário autenticado em `/`

Não redirecionar automaticamente.

A landing continua útil para compartilhamento e apresentação, mas CTAs mudam para:

```text
Continuar praticando
```

---

## 12. Navegação principal proposta

Áreas internas:

```text
Logo → Home interna

Trilhas
Ranking
Feed
Comunidade/Feed social
Perfil
Plus/Billing
Configurações
```

Após Feed v2:

```text
Comunidade
├── Feed
└── Atividade
```

A landing pública é institucional e não precisa aparecer como item principal da navegação autenticada.

---

## 13. Sprint 1 — backlog revisado

### P0 — vazamento/separação de conteúdo

- [ ] auditar `app/page.tsx`;
- [ ] identificar se `loadLanguageById` entrega Mastery/premium;
- [ ] criar Quick Practice API server-side;
- [ ] usar catálogo Base seguro;
- [ ] garantir que Free nunca receba Mastery;
- [ ] garantir que prática Base do Plus também continue Base;
- [ ] adicionar teste de regressão;
- [ ] auditar outros imports client-side de catálogos completos.

### P0 — regressões atuais

- [ ] validar novo layout Mastery;
- [ ] validar badges de linguagem Mastery;
- [ ] validar focus mode;
- [ ] corrigir bugs de navegação Plus/Billing;
- [ ] revisar links `/plus` para usuários já Plus;
- [ ] revisar mobile.

### P1 — nova landing

- [ ] mover prática atual `/` → `/home`;
- [ ] criar nova `/`;
- [ ] hero;
- [ ] seção “como funciona”;
- [ ] preview de trilhas;
- [ ] seção Mastery;
- [ ] CTA Free/Plus;
- [ ] seção comunidade;
- [ ] CTA Discord/GitHub;
- [ ] footer institucional;
- [ ] i18n PT/EN;
- [ ] responsividade.

### P1 — comunidade

- [ ] reaproveitar conteúdo útil de `/community`;
- [ ] mover cards para componentes reutilizáveis;
- [ ] inserir na landing;
- [ ] `/community` → `/#community`;
- [ ] revisar links antigos.

### P1 — navegação

- [ ] logo interna → `/home`;
- [ ] logo pública → `/`;
- [ ] remover semântica de “logo = reset”;
- [ ] revisar `Toolbar`;
- [ ] revisar breadcrumbs;
- [ ] revisar redirects de login;
- [ ] preservar `next` após autenticação quando aplicável.

### P2 — polish

- [ ] skeletons;
- [ ] loading states;
- [ ] empty states;
- [ ] keyboard navigation;
- [ ] focus-visible;
- [ ] contraste;
- [ ] acessibilidade básica;
- [ ] metadata/SEO da landing;
- [ ] OpenGraph;
- [ ] favicon/manifest consistency.

---

## 14. Componentização sugerida

```text
app/
├── page.tsx                         # landing pública
├── home/
│   └── page.tsx                    # prática rápida interna
└── community/
    └── page.tsx                    # redirect/compatibilidade
```

```text
components/
├── landing/
│   ├── LandingHero.tsx
│   ├── ProductDemo.tsx
│   ├── TrackPreview.tsx
│   ├── MasteryPreview.tsx
│   ├── CommunitySection.tsx
│   └── LandingFooter.tsx
├── community/
│   └── CommunityCards.tsx
└── typing/
    └── Toolbar.tsx
```

Server:

```text
app/api/practice/quick/route.ts
```

Helpers:

```text
lib/server/base-practice.ts
```

---

## 15. Testes obrigatórios

### Segurança de conteúdo

Usuário Free:

```text
GET /api/practice/quick
```

deve retornar somente IDs presentes no catálogo Base.

Teste sugerido:

```ts
expect(
  response.snippets.every(snippet => freeIds.has(snippet.id))
).toBe(true)
```

Também testar explicitamente:

```text
mastery ID conhecido
→ não aparece no payload
```

### Plus

```text
Quick Practice
→ Base

Mastery endpoint
→ Mastery
```

Nunca misturar.

### Navegação

```text
/
→ landing

/home
→ prática

logo interna
→ /home

/community
→ /#community
```

---

## 16. Não fazer nesta sprint

Para não explodir o escopo:

- não implementar Feed v2 ainda;
- não criar badges SVG ainda;
- não fazer pesquisa completa de preços ainda;
- não completar todas as tracks Mastery ainda;
- não redesenhar gamification;
- não criar engine nova de billing;
- não migrar stack.

Essas tarefas permanecem nas sprints seguintes.

---

## 17. Ordem de execução

```text
1. Auditar vazamento de snippets
2. Criar fonte server-side Base
3. Criar Quick Practice API
4. Migrar prática atual / → /home
5. Validar prática Free e Plus
6. Criar shell da nova landing /
7. Extrair conteúdo visual da /community
8. Inserir comunidade na landing
9. Ajustar /community → /#community
10. Atualizar logo interna → /home
11. Revisar Toolbar e redirects
12. Corrigir bugs Mastery/Billing pendentes
13. Mobile + i18n + accessibility
14. Testes de regressão
15. Build e smoke test
```

---

## 18. Estratégia para Codex / subagentes

### Agente A — auditoria de conteúdo/segurança

- mapear todos os loaders de snippets;
- identificar premium no client;
- mapear Base/Mastery registries;
- propor fonte única de verdade;
- criar testes anti-vazamento.

### Agente B — routing + prática rápida

- `/home`;
- Quick Practice API;
- migração da prática;
- redirects;
- logo.

### Agente C — landing pública

- hero;
- apresentação;
- trilhas;
- Mastery preview;
- CTA;
- responsividade.

### Agente D — comunidade

- extrair cards atuais;
- `CommunitySection`;
- anchor `#community`;
- redirect `/community`.

### Agente E — QA/regressão

- Free x Plus;
- desktop/mobile;
- PT/EN;
- auth;
- links;
- teclado;
- build/typecheck/lint.

Nenhum agente deve modificar `master`.

Trabalhar sobre `dev`.

---

## 19. Definition of Done — Sprint 1

A sprint só termina quando:

- [ ] `/` é uma landing real do SharkType;
- [ ] `/home` é a prática rápida;
- [ ] a comunidade faz parte da landing;
- [ ] `/community` continua compatível via redirect;
- [ ] clicar na logo dentro do produto vai para `/home`;
- [ ] prática rápida não importa catálogo premium diretamente;
- [ ] usuário Free não consegue receber snippets Mastery pelo endpoint;
- [ ] usuário Plus não recebe Mastery na prática Base;
- [ ] Mastery continua isolado;
- [ ] navegação Billing/Plus não possui loops óbvios;
- [ ] layout Mastery revisado funciona em desktop/mobile;
- [ ] lint/typecheck/build estão verdes;
- [ ] smoke test manual principal foi executado.

---

## 20. Resultado da nova arquitetura

```text
                         SHARKTYPE

Visitante
   │
   ▼
┌─────────────────────────────────┐
│ /                               │
│ Landing pública                 │
│                                 │
│ produto                         │
│ trilhas                         │
│ mastery                         │
│ comunidade                      │
│ CTA                             │
└─────────────────────────────────┘
              │
              ▼
          login/signup
              │
              ▼
┌─────────────────────────────────┐
│ /home                           │
│ prática rápida BASE             │
└─────────────────────────────────┘
        │                  │
        ▼                  ▼
     /tracks           Feed/Profile/etc
        │
        ├── Base
        │
        └── Mastery → entitlement Plus
```

O ponto central da sprint passa a ser:

> **A página pública vende e apresenta o SharkType. A home interna é onde o usuário pratica. O servidor decide qual conteúdo pode ser entregue. Mastery nunca vaza para a prática Base.**
