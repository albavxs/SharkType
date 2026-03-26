import { Snippet } from '@/lib/types'

export const cssSnippets: Snippet[] = [
  {
    id: 'css-001',
    concept: 'Flexbox',
    difficulty: 'easy',
    prompt: 'Flexbox distribui itens ao longo de um eixo com controle preciso de alinhamento. Crie .container com display:flex, centralize na direcao principal com justify-content:center, no eixo transversal com align-items:center e defina gap.',
    code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}`,
  },
  {
    id: 'css-002',
    concept: 'Grid',
    difficulty: 'medium',
    prompt: 'CSS Grid cria layouts bidimensionais responsivos sem media queries. Use grid-template-columns com repeat(auto-fit, minmax(250px, 1fr)) para que as colunas se criem e destruam automaticamente conforme o espaco disponivel.',
    code: `.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}`,
  },
  {
    id: 'css-003',
    concept: 'Custom Properties',
    difficulty: 'easy',
    prompt: 'Variaveis CSS (custom properties) centralizam valores reutilizaveis. Declare --primary e --radius em :root (escopo global) e use-as em .button com var() — alterar a variavel atualiza todos os usos automaticamente.',
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
    concept: 'Media Query',
    difficulty: 'easy',
    prompt: 'Media queries aplicam estilos condicionalmente com base nas caracteristicas do dispositivo. Para viewports com largura maxima de 768px, oculte .sidebar com display:none e expanda .main para 100% da largura.',
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
    concept: 'Animation',
    difficulty: 'medium',
    prompt: '@keyframes define os estados de uma animacao CSS. Crie fadeIn indo de opacity:0 + translateY(10px) ate opacity:1 + translateY(0) e aplique ao .card com duracao de 0.3s e easing ease-out.',
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
    concept: 'Pseudo-elements',
    difficulty: 'medium',
    prompt: '::before insere um elemento virtual antes do conteudo sem adicionar HTML. Use-o em .label para criar um ponto decorativo circular: content vazio, display inline-block, tamanho fixo, border-radius 50% e background currentColor.',
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
    concept: 'Container Query',
    difficulty: 'hard',
    prompt: 'Container queries estilizam com base no tamanho do container pai — nao da viewport. Marque .card-wrapper como container-type: inline-size e, quando atingir 400px, altere .card para um grid de duas colunas.',
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
    concept: 'Clamp',
    difficulty: 'medium',
    prompt: 'clamp(min, preferred, max) cria valores fluidos que se adaptam ao viewport sem media queries. Use para font-size: minimo de 1.5rem (em telas pequenas), preferido de 4vw e maximo de 3rem (em telas grandes).',
    code: `.title {
  font-size: clamp(1.5rem, 4vw, 3rem);
  line-height: 1.2;
  letter-spacing: -0.02em;
}`,
  },
  {
    id: 'css-009',
    concept: 'Transitions',
    difficulty: 'easy',
    prompt: 'Transitions animam mudancas de propriedade CSS de forma suave. Defina transition para background e transform em .button com duracao de 150ms e easing ease, depois altere os dois valores no estado :hover.',
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
    concept: 'Nesting',
    difficulty: 'medium',
    prompt: 'CSS nesting (nivel 1) permite aninhar seletores como em SASS/SCSS, sem pre-processador. Dentro de .nav, use "& a" para estilizar links e "& a:hover" para o estado de hover — sem repetir o seletor pai.',
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
