import { Snippet } from '@/lib/types'

export const cssSnippets: Snippet[] = [
  {
    id: 'css-001',
    concept: { pt: 'Flexbox', en: 'Flexbox' },
    difficulty: 'easy',
    prompt: {
      pt: 'Flexbox distribui itens ao longo de um eixo com controle preciso de alinhamento. Crie .container com display:flex, centralize na direção principal com justify-content:center, no eixo transversal com align-items:center e defina gap.',
      en: 'Flexbox distributes items along an axis with precise alignment control. Create .container with display:flex, center on the main axis with justify-content:center, on the cross axis with align-items:center and set gap.',
    },
    code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}`,
  },
  {
    id: 'css-002',
    concept: { pt: 'Grid', en: 'Grid' },
    difficulty: 'medium',
    prompt: {
      pt: 'CSS Grid cria layouts bidimensionais responsivos sem media queries. Use grid-template-columns com repeat(auto-fit, minmax(250px, 1fr)) para que as colunas se criem e destruam automaticamente conforme o espaço disponível.',
      en: 'CSS Grid creates responsive two-dimensional layouts without media queries. Use grid-template-columns with repeat(auto-fit, minmax(250px, 1fr)) so columns auto-create and collapse based on available space.',
    },
    code: `.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}`,
  },
  {
    id: 'css-003',
    concept: { pt: 'Custom Properties', en: 'Custom Properties' },
    difficulty: 'easy',
    prompt: {
      pt: 'Variáveis CSS (custom properties) centralizam valores reutilizáveis. Declare --primary e --radius em :root (escopo global) e use-as em .button com var() — alterar a variável atualiza todos os usos automaticamente.',
      en: 'CSS variables (custom properties) centralize reusable values. Declare --primary and --radius in :root (global scope) and use them in .button with var() — changing the variable updates all usages automatically.',
    },
    code: `:root {
  --primary: #3b82f6;
  --radius: 0.5rem;
}

.button {
  background: var(--primary);
  border-radius: var(--radius);
}`,
  },
  {
    id: 'css-004',
    concept: { pt: 'Media Query', en: 'Media Query' },
    difficulty: 'easy',
    prompt: {
      pt: 'Media queries aplicam estilos condicionalmente com base nas características do dispositivo. Para viewports com largura máxima de 768px, oculte .sidebar com display:none e expanda .main para 100% da largura.',
      en: 'Media queries conditionally apply styles based on device characteristics. For viewports with max-width of 768px, hide .sidebar with display:none and expand .main to 100% width.',
    },
    code: `@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
  .main {
    width: 100%;
  }
}`,
  },
  {
    id: 'css-005',
    concept: { pt: 'Animação', en: 'Animation' },
    difficulty: 'medium',
    prompt: {
      pt: '@keyframes define os estados de uma animação CSS. Crie fadeIn indo de opacity:0 + translateY(10px) até opacity:1 + translateY(0) e aplique ao .card com duração de 0.3s e easing ease-out.',
      en: '@keyframes defines the states of a CSS animation. Create fadeIn going from opacity:0 + translateY(10px) to opacity:1 + translateY(0) and apply it to .card with 0.3s duration and ease-out easing.',
    },
    code: `@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  animation: fadeIn 0.3s ease-out;
}`,
  },
  {
    id: 'css-006',
    concept: { pt: 'Pseudo-elements', en: 'Pseudo-elements' },
    difficulty: 'medium',
    prompt: {
      pt: '::before insere um elemento virtual antes do conteúdo sem adicionar HTML. Use-o em .label para criar um ponto decorativo circular: content vazio, display inline-block, tamanho fixo, border-radius 50% e background currentColor.',
      en: '::before inserts a virtual element before the content without adding HTML. Use it on .label to create a decorative circular dot: empty content, display inline-block, fixed size, border-radius 50% and background currentColor.',
    },
    code: `.label::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  margin-right: 0.5rem;
}`,
  },
  {
    id: 'css-007',
    concept: { pt: 'Container Query', en: 'Container Query' },
    difficulty: 'hard',
    prompt: {
      pt: 'Container queries estilizam com base no tamanho do container pai — não da viewport. Marque .card-wrapper como container-type: inline-size e, quando atingir 400px, altere .card para um grid de duas colunas.',
      en: 'Container queries style based on the parent container size — not the viewport. Mark .card-wrapper as container-type: inline-size and, when it reaches 400px, change .card to a two-column grid.',
    },
    code: `.card-wrapper {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    grid-template-columns: 1fr 2fr;
  }
}`,
  },
  {
    id: 'css-008',
    concept: { pt: 'Clamp', en: 'Clamp' },
    difficulty: 'medium',
    prompt: {
      pt: 'clamp(min, preferred, max) cria valores fluidos que se adaptam ao viewport sem media queries. Use para font-size: mínimo de 1.5rem (em telas pequenas), preferido de 4vw e máximo de 3rem (em telas grandes).',
      en: 'clamp(min, preferred, max) creates fluid values that adapt to the viewport without media queries. Use it for font-size: minimum of 1.5rem (on small screens), preferred of 4vw and maximum of 3rem (on large screens).',
    },
    code: `.title {
  font-size: clamp(1.5rem, 4vw, 3rem);
  line-height: 1.2;
  letter-spacing: -0.02em;
}`,
  },
  {
    id: 'css-009',
    concept: { pt: 'Transições', en: 'Transitions' },
    difficulty: 'easy',
    prompt: {
      pt: 'Transitions animam mudanças de propriedade CSS de forma suave. Defina transition para background e transform em .button com duração de 150ms e easing ease, depois altere os dois valores no estado :hover.',
      en: 'Transitions smoothly animate CSS property changes. Set transition for background and transform on .button with 150ms duration and ease easing, then change both values on :hover state.',
    },
    code: `.button {
  background: #111;
  transition: background 150ms ease, transform 150ms ease;
}

.button:hover {
  background: #333;
  transform: translateY(-1px);
}`,
  },
  {
    id: 'css-010',
    concept: { pt: 'Nesting', en: 'Nesting' },
    difficulty: 'medium',
    prompt: {
      pt: 'CSS nesting (nível 1) permite aninhar seletores como em SASS/SCSS, sem pré-processador. Dentro de .nav, use "& a" para estilizar links e "& a:hover" para o estado de hover — sem repetir o seletor pai.',
      en: 'CSS nesting (level 1) lets you nest selectors like in SASS/SCSS, without a preprocessor. Inside .nav, use "& a" to style links and "& a:hover" for the hover state — without repeating the parent selector.',
    },
    code: `.nav {
  display: flex;
  gap: 1rem;

  & a {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}`,
  },
]
