import { Snippet } from '@/lib/types'

export const htmlSnippets: Snippet[] = [
  {
    id: 'html-001',
    concept: 'Estrutura Basica',
    difficulty: 'easy',
    prompt: 'Escreva um header semantico com titulo h1 e nav com links de navegacao.',
    code: `<header>
  <h1>SharkType</h1>
  <nav>
    <a href="/">Inicio</a>
    <a href="/tracks">Trilhas</a>
  </nav>
</header>`,
  },
  {
    id: 'html-002',
    concept: 'Formulario',
    difficulty: 'easy',
    prompt: 'Crie um formulario de login com campo de email validado, label associado e botao de submit.',
    code: `<form action="/login" method="POST">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />
  <button type="submit">Entrar</button>
</form>`,
  },
  {
    id: 'html-003',
    concept: 'Imagem e Link',
    difficulty: 'easy',
    prompt: 'Use figure, img com alt descritivo e figcaption para exibir uma imagem com legenda acessivel.',
    code: `<figure>
  <img src="/logo.png" alt="SharkType logo" width="200" />
  <figcaption>Logo do SharkType</figcaption>
</figure>`,
  },
  {
    id: 'html-004',
    concept: 'Lista',
    difficulty: 'easy',
    prompt: 'Crie uma lista nao ordenada com itens que contem links de navegacao.',
    code: `<ul>
  <li><a href="/swift">Swift</a></li>
  <li><a href="/kotlin">Kotlin</a></li>
  <li><a href="/ruby">Ruby</a></li>
</ul>`,
  },
  {
    id: 'html-005',
    concept: 'Artigo Semantico',
    difficulty: 'medium',
    prompt: 'Estruture um artigo com header, time com datetime, paragrafo de conteudo e footer com tag.',
    code: `<article>
  <header>
    <h2>Introducao ao Lua</h2>
    <time datetime="2024-01-15">15 Jan 2024</time>
  </header>
  <p>Lua e uma linguagem leve e embutivel.</p>
  <footer>
    <a href="/tags/lua" rel="tag">lua</a>
  </footer>
</article>`,
  },
  {
    id: 'html-006',
    concept: 'Meta e Link',
    difficulty: 'medium',
    prompt: 'Configure o head com meta charset, viewport, description e link para folha de estilos.',
    code: `<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Practice typing code syntax." />
  <link rel="stylesheet" href="/styles.css" />
  <title>SharkType</title>
</head>`,
  },
  {
    id: 'html-007',
    concept: 'Select e Option',
    difficulty: 'medium',
    prompt: 'Crie um campo select agrupando opcoes de linguagem com optgroup por categoria.',
    code: `<select name="language" id="lang">
  <optgroup label="JVM">
    <option value="kotlin">Kotlin</option>
    <option value="scala">Scala</option>
  </optgroup>
  <optgroup label="Script">
    <option value="ruby">Ruby</option>
    <option value="lua">Lua</option>
  </optgroup>
</select>`,
  },
  {
    id: 'html-008',
    concept: 'Tabela',
    difficulty: 'medium',
    prompt: 'Construa uma tabela acessivel com thead, tbody, cabecalhos th com scope e linhas de dados.',
    code: `<table>
  <thead>
    <tr>
      <th scope="col">Linguagem</th>
      <th scope="col">WPM</th>
      <th scope="col">Precisao</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Swift</td>
      <td>72</td>
      <td>98%</td>
    </tr>
  </tbody>
</table>`,
  },
  {
    id: 'html-009',
    concept: 'Details e Summary',
    difficulty: 'hard',
    prompt: 'Use details/summary para criar um accordion colapsavel com fieldset de opcoes radio.',
    code: `<details>
  <summary>Configuracoes avancadas</summary>
  <fieldset>
    <legend>Som</legend>
    <label>
      <input type="radio" name="sound" value="click" /> Click
    </label>
    <label>
      <input type="radio" name="sound" value="pop" checked /> Pop
    </label>
  </fieldset>
</details>`,
  },
  {
    id: 'html-010',
    concept: 'SVG Inline',
    difficulty: 'hard',
    prompt: 'Incorpore um SVG inline acessivel com viewBox, title, role img e polyline para um grafico de linhas.',
    code: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
     aria-label="Score chart" role="img">
  <title>Score chart</title>
  <polyline
    points="0,80 25,60 50,40 75,20 100,10"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  />
</svg>`,
  },
]
