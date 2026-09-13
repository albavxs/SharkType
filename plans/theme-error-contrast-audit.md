# SharkType — Plano de Auditoria de Contraste de Erros por Tema

## Objetivo

Garantir que o estado de erro durante a digitação seja visualmente inequívoco em todos os temas, sem depender da cor dominante do tema e sem competir com cores normais de sintaxe.

Regra principal:

> `error` nunca pode ser igual, quase igual ou perceptualmente próxima de `main`, `syntax.keyword`, `syntax.string`, `syntax.number`, `syntax.type` ou da cor normal do texto.

O usuário deve distinguir imediatamente:

- caractere correto;
- caractere pendente;
- caractere incorreto;
- caret;
- sintaxe normal.

---

## Problema atual

Temas como Monokai usam uma paleta em que a cor dominante e/ou algumas cores de sintaxe podem ficar visualmente próximas da cor usada para erro.

Isso cria situações em que:

```text
keyword correto
≈
caractere incorreto
```

ou:

```text
main/accent
≈
error
```

O resultado é perda de feedback imediato durante a digitação.

---

## Estratégia

### 1. Auditar todos os temas de `lib/themes.ts`

Para cada tema coletar:

```ts
{
  bg,
  main,
  caret,
  sub,
  text,
  error,
  syntax: {
    keyword,
    string,
    number,
    comment,
    type,
  }
}
```

Comparar `error` contra:

- `main`;
- `text`;
- `syntax.keyword`;
- `syntax.string`;
- `syntax.number`;
- `syntax.type`;
- `caret`.

---

## 2. Criar validação automática de distância de cor

Não usar apenas comparação RGB simples.

Converter cores para espaço perceptual, preferencialmente:

```text
sRGB
→ OKLab / OKLCH
→ diferença perceptual
```

Critério inicial recomendado:

```text
ΔE / distância perceptual mínima entre error e main >= limite seguro
ΔE mínima entre error e syntax.* >= limite seguro
```

Se uma cor cair abaixo do limite, o tema deve falhar no teste.

---

## 3. Validar contraste do erro contra o fundo

Além de ser diferente das outras cores, `error` precisa ser legível sobre `bg`.

Critério:

```text
contrast(error, bg) >= 4.5:1
```

Para texto grande podemos aceitar 3:1, mas o typing normal deve mirar 4.5:1.

---

## 4. Criar fallback semântico para erro

Não depender exclusivamente da cor do tema.

Adicionar possibilidade de derivar uma cor segura quando o `error` fornecido pelo tema for inadequado.

Exemplo conceitual:

```ts
resolveThemeErrorColor(theme)
```

Fluxo:

```text
error definido pelo tema
→ valida contraste com bg
→ valida distância de main/syntax
→ se falhar, gera fallback perceptualmente distante
```

O fallback deve priorizar:

1. vermelho perceptualmente seguro;
2. laranja/vermelho em temas com conflito de vermelho;
3. magenta apenas quando não conflitar com `main`;
4. amarelo forte apenas para temas especiais/a11y.

---

## 5. Criar `--error-safe`

Em vez de `TypingArea` usar diretamente:

```css
var(--error)
```

passar a usar:

```css
var(--error-safe)
```

`applyTheme()` será responsável por resolver e publicar essa variável.

Exemplo:

```ts
root.style.setProperty('--error-safe', resolvedError)
```

`--error` continua existindo para componentes semânticos gerais, mas o typing usa `--error-safe`.

---

## 6. Separar erro de typing de erro de interface

Hoje `error` serve para várias situações.

Ideal:

```text
error        → erro de UI / formulário / API
errorTyping  → caractere digitado incorretamente
```

Se não quisermos alterar a interface `Theme` imediatamente, começar com `--error-safe` calculado.

Depois podemos evoluir para:

```ts
Theme {
  error: string
  typingError?: string
}
```

---

## 7. Monokai — correção prioritária

No Monokai atual:

```text
main    = #f92672
keyword = #f92672
error   = #f92672
```

Isso é um conflito direto.

Esse tema deve ser o primeiro teste de regressão.

Proposta:

```text
main/keyword continuam rosa
errorTyping muda para vermelho/laranja claramente distinto
```

Exemplo visual aproximado:

```text
main        #f92672
errorTyping #ff4b3e ou equivalente com contraste validado
```

O valor final deve ser escolhido por teste perceptual e contraste, não apenas manualmente.

---

## 8. Temas de acessibilidade

Os temas:

- `a11y deuteranopia`;
- `a11y protanopia`;

não devem depender de vermelho/verde para diferenciação.

Para eles, validar separadamente:

```text
correct / pending / incorrect
```

com simulação de deficiência de cor.

Possível estratégia:

```text
incorrect = laranja/amarelo forte
+ underline/background sutil opcional
```

---

## 9. Adicionar segundo canal visual para erro

Mesmo com cor correta, erro pode ganhar um marcador adicional discreto.

Opções:

```text
underline fino
background de 6–10% de opacidade
text-decoration
```

Preferência:

```css
color: var(--error-safe);
text-decoration: underline;
text-decoration-color: color-mix(...);
text-underline-offset: 0.12em;
```

Isso melhora acessibilidade sem poluir o código.

---

## 10. Testes automatizados

Criar script, por exemplo:

```text
scripts/check-theme-contrast.mjs
```

Executar:

```bash
npm run check:themes
```

O script deve falhar se:

```text
error muito próximo de main
error muito próximo de syntax.keyword
error muito próximo de syntax.string
error muito próximo de syntax.number
error muito próximo de syntax.type
error sem contraste suficiente com bg
```

Saída esperada:

```text
✓ dracula
✗ monokai: error too close to main
✗ tema-x: error contrast against bg = 3.1
```

---

## 11. Testes visuais

Criar uma pequena matriz de QA:

```text
Theme
├ idle
├ typing correct
├ typing incorrect
├ mixed syntax + error
├ light mode
└ mobile
```

Casos obrigatórios:

- erro em keyword;
- erro dentro de string;
- erro em número;
- erro ao lado do caret;
- vários erros consecutivos.

---

## 12. Ordem de implementação

```text
1. criar utilitário de cor (hex → OKLab/OKLCH)
2. criar função de distância perceptual
3. criar função de contraste WCAG
4. auditar temas existentes
5. corrigir Monokai primeiro
6. criar resolveThemeErrorColor(theme)
7. publicar --error-safe em applyTheme()
8. trocar TypingArea para --error-safe
9. adicionar underline sutil opcional
10. criar scripts/check-theme-contrast.mjs
11. adicionar npm run check:themes
12. corrigir todos os temas que falharem
13. QA manual nos temas claros, escuros e a11y
```

---

## Definition of Done

- [ ] Monokai não usa mais a mesma cor para `main`, keyword e erro de typing.
- [ ] Nenhum tema possui erro perceptualmente próximo da cor dominante.
- [ ] Nenhum tema possui erro perceptualmente próximo das principais cores de sintaxe.
- [ ] Todo `typingError` possui contraste suficiente contra o fundo.
- [ ] `TypingArea` usa uma variável de erro segura.
- [ ] Temas a11y não dependem somente de vermelho/verde.
- [ ] Existe teste automático para impedir regressões futuras.
- [ ] Tema novo que viole essas regras falha no CI/check local.

---

## Resultado esperado

O usuário nunca deve precisar pensar:

> “isso está rosa porque é keyword ou porque eu errei?”

A leitura deve ser instantânea:

```text
sintaxe = identidade do tema
erro    = estado semântico inequívoco
```
