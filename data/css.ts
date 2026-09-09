import { Snippet } from '@/lib/types'

export const cssSnippets: Snippet[] = [
  {
    id: 'css-001',
    concept: { pt: 'Flexbox', en: 'Flexbox' },
    difficulty: 'easy',
    prompt: {
      pt: 'Flexbox distribui itens num eixo com controle fino de alinhamento. Cria .container com display:flex, centraliza no eixo principal com justify-content:center, no cruzado com align-items:center e define o gap.',
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
      pt: 'CSS Grid faz layouts 2D responsivos sem precisar de media query. Usa grid-template-columns com repeat(auto-fit, minmax(250px, 1fr)) pras colunas se criarem e sumirem sozinhas conforme o espaço disponível.',
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
    concept: { pt: 'Propriedades Customizadas', en: 'Custom Properties' },
    difficulty: 'easy',
    prompt: {
      pt: 'Variáveis CSS (custom properties) centralizam valores que você reutiliza no projeto todo. Declara --primary e --radius em :root (escopo global) e usa em .button com var() -- mudou a variável, atualiza tudo automaticamente.',
      en: 'CSS variables (custom properties) centralize reusable values. Declare --primary and --radius in :root (global scope) and use them in .button with var() -- changing the variable updates all usages automatically.',
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
    concept: { pt: 'Consulta de Mídia', en: 'Media Query' },
    difficulty: 'easy',
    prompt: {
      pt: 'Media queries aplicam estilos de acordo com as características do dispositivo. Pra viewports de até 768px, esconde a .sidebar com display:none e expande .main pra ocupar 100% da largura.',
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
      pt: '@keyframes define os estados de uma animação CSS. Cria um fadeIn saindo de opacity:0 + translateY(10px) até opacity:1 + translateY(0) e aplica no .card com 0.3s de duração e ease-out.',
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
    concept: { pt: 'Pseudoelementos', en: 'Pseudo-elements' },
    difficulty: 'medium',
    prompt: {
      pt: '::before insere um pseudo-elemento antes do conteúdo sem mexer no HTML. Usa no .label pra criar um ponto decorativo redondo: content vazio, display inline-block, tamanho fixo, border-radius 50% e background currentColor.',
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
]
