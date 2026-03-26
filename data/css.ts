import { Snippet } from '@/lib/types'

export const cssSnippets: Snippet[] = [
  {
    id: 'css-001',
    concept: 'Flexbox',
    difficulty: 'easy',
    prompt: 'Crie um container flexbox que centraliza os filhos horizontal e verticalmente com espaco entre eles.',
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
    prompt: 'Use CSS Grid com repeat e auto-fit para criar um layout responsivo de colunas com largura minima.',
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
    prompt: 'Defina variaveis CSS no :root para cor e border-radius e use-as em um componente botao.',
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
    prompt: 'Escreva uma media query para ocultar a sidebar e expandir o conteudo principal em telas pequenas.',
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
    prompt: 'Defina um @keyframes fadeIn com opacidade e translacao e aplique a animacao a um card.',
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
    prompt: 'Use ::before para adicionar um marcador circular colorido antes do conteudo de um label.',
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
    prompt: 'Use container queries para alterar o layout de um card com base no tamanho do container pai.',
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
    prompt: 'Use clamp() para definir um font-size fluido com valores minimo, preferido e maximo.',
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
    prompt: 'Adicione transicoes suaves de background e transform a um botao para o estado hover.',
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
    prompt: 'Use CSS nesting para estilizar links dentro de .nav incluindo o estado hover aninhado.',
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
