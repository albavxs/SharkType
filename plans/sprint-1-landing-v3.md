# Sprint 1 — Landing V3, partículas globais e navegação Billing

## Objetivo

Refinar a home pública para que a composição tenha mais profundidade e identidade SharkType, corrigindo três pontos principais:

1. integrar o tubarão diretamente à marca `SharkType`;
2. alinhar corretamente o preview de código com o bloco textual do hero;
3. transformar as partículas do **fundo global da página inteira** em parte ativa do tema, com maior densidade na landing.

Além disso, a tela de Billing deve ter uma saída explícita para a home interna (`/home`), sem remover o acesso às Configurações.

---

## Landing V3

### Marca

- `SharkType` deve ter o tubarão ao lado do título;
- o tubarão usa uma cena Three.js própria e compacta;
- camadas da marca: sombra/accent, highlight, textura principal e partículas orbitais;
- movimento por cursor deve usar `damp`, com amplitude baixa;
- `Type` continua usando `var(--main)`;
- fallback estático deve existir quando WebGL não estiver disponível;
- `prefers-reduced-motion` mantém a marca visual, mas remove movimento contínuo.

### Hero

- manter duas colunas no desktop;
- esquerda: marca, tagline, texto e CTAs;
- direita: `CodePreview`;
- remover posicionamento `absolute bottom` do editor;
- editor deve ser um item normal do grid e alinhar verticalmente com o conteúdo esquerdo;
- manter parallax de scroll com amplitudes diferentes para texto e editor;
- manter `Plus` como CTA dominante no header usando `var(--main)`.

### CodePreview

- adicionar números de linha;
- manter código mock, sem usar snippets reais;
- adicionar caret e barra de progresso temática;
- estatísticas continuam demonstrativas (`WPM`, precisão, erros);
- borda/glow devem reagir a `var(--main)`;
- nenhuma chamada para catálogos Base/Mastery.

---

## Partículas globais — SceneWrapper

As partículas desta etapa são as partículas que ocupam o **fundo inteiro da página**, renderizadas pelo `SceneWrapper`.

### Regra de tema

Remover cor hardcoded do `ParticleField`.

O fundo deve ler:

```text
--main
```

em runtime e atualizar os materiais quando o tema mudar.

### Variantes

```tsx
<SceneWrapper variant="default" />
<SceneWrapper variant="landing" />
```

#### default

- densidade normal usada nas demais telas;
- mantém comportamento visual discreto.

#### landing

- duas camadas de profundidade;
- camada distante: menor, mais transparente, movimento lento;
- camada próxima: partículas maiores, mais opacas, parallax mais perceptível;
- maior concentração próxima ao centro do viewport;
- quantidade significativamente maior que a experiência padrão;
- cursor desloca as camadas em intensidades diferentes;
- cor sempre segue o tema ativo.

### Performance

- continuar usando `InstancedMesh`/BufferGeometry;
- evitar centenas de componentes React individuais;
- DPR limitado;
- pausar comportamento visual quando a página estiver oculta;
- reduzir movimento com `prefers-reduced-motion`;
- landing pode ter mais partículas, mas outras telas não devem herdar essa densidade.

---

## Billing

Na rota:

```text
/settings/billing
```

o topo deve oferecer dois destinos distintos:

```text
← Configurações
Ir para a home →
```

### Regras

- `Configurações` continua levando a `/settings`;
- `Ir para a home` leva explicitamente a `/home`;
- não usar `/` porque `/` agora é a landing pública;
- botão de home usa acento do tema sem competir com o conteúdo principal;
- PT/EN deve ser mantido.

---

## Ordem de execução

1. tornar `ParticleField` configurável por tema, densidade e camada;
2. adicionar variantes `default` e `landing` ao `SceneWrapper`;
3. sincronizar partículas globais com `var(--main)`;
4. aumentar densidade do fundo apenas na landing;
5. criar `SharkTitleMark` Three.js;
6. colocar o tubarão ao lado do título `SharkType`;
7. remover o tubarão isolado da coluna direita;
8. alinhar `CodePreview` como item normal do grid;
9. melhorar preview com line numbers/progress/caret;
10. adicionar botão `/home` em Billing;
11. revisar desktop/mobile/reduced-motion;
12. rodar typecheck/build/checks da separação Mastery.

---

## Critérios de aceite

- [ ] tubarão aparece ao lado de `SharkType`;
- [ ] título e logo formam uma única marca visual;
- [ ] código está verticalmente alinhado ao hero e não preso ao bottom;
- [ ] landing usa partículas do fundo global em maior densidade;
- [ ] partículas do fundo seguem `var(--main)`;
- [ ] mudar tema atualiza visual do fundo sem cor hardcoded;
- [ ] outras páginas mantêm densidade padrão;
- [ ] `prefers-reduced-motion` é respeitado;
- [ ] Billing possui acesso explícito a `/home`;
- [ ] link de Billing para Configurações continua existindo;
- [ ] landing continua sem carregar snippets/catálogos premium;
- [ ] mobile permanece utilizável;
- [ ] `npx tsc --noEmit` passa;
- [ ] `npm run build` passa;
- [ ] `npm run check:mastery-separation` passa;
- [ ] `git diff --check` não aponta whitespace errors.
