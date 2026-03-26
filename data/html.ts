import { Snippet } from '@/lib/types'

export const htmlSnippets: Snippet[] = [
  {
    id: 'html-001',
    concept: 'Estrutura Basica',
    difficulty: 'easy',
    prompt: 'O elemento <header> contem a identidade e navegacao principal da pagina. Escreva um header semantico com <h1> para o titulo da aplicacao e <nav> com dois <a> de navegacao — sem divs desnecessarias.',
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
    prompt: 'Formularios HTML exigem action, method e associacao correta de label/input. Crie um form de login com POST, um <input type="email"> com required e id, seu <label> associado via "for" e um <button type="submit">.',
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
    prompt: '<figure> e <figcaption> fornecem contexto semantico para imagens. Envolva a <img> em um <figure>, inclua um alt descritivo no atributo alt e adicione uma <figcaption> logo abaixo com o texto da legenda.',
    code: `<figure>
  <img src="/logo.png" alt="SharkType logo" width="200" />
  <figcaption>Logo do SharkType</figcaption>
</figure>`,
  },
  {
    id: 'html-004',
    concept: 'Lista',
    difficulty: 'easy',
    prompt: '<ul> e semanticamente correto para conjuntos de itens sem ordem obrigatoria. Crie uma lista nao ordenada com tres <li>, cada um contendo um <a> para uma pagina diferente de linguagem de programacao.',
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
    prompt: '<article> envolve conteudo independente e autocontido. Estruture o artigo com <header> interno (h2 + time com datetime), um paragrafo de conteudo e <footer> com link de tag usando rel="tag".',
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
    prompt: 'O <head> configura como o browser interpreta e indexa a pagina. Adicione meta charset para codificacao, viewport para responsividade mobile, meta description para SEO, link para o CSS e o <title>.',
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
    prompt: '<optgroup> organiza opcoes de um <select> em grupos logicos com um rotulo. Crie um campo de selecao de linguagem com dois grupos (JVM e Script), cada um contendo duas <option> com value e texto.',
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
    prompt: 'Tabelas acessiveis usam <thead>/<tbody>, <th> com atributo scope e <td> para dados. Construa uma tabela de resultados com tres colunas no cabecalho (scope="col") e uma linha de dados no corpo.',
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
    prompt: '<details>/<summary> criam um widget de divulgacao colapsavel nativo, sem JavaScript. Dentro do <details>, use <summary> como titulo clicavel e adicione um <fieldset> com <legend> e duas opcoes de <input type="radio">.',
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
    prompt: 'SVG inline permite graficos vetoriais acessiveis diretamente no HTML. Crie um <svg> com viewBox, aria-label e role="img" para acessibilidade, <title> interno e um <polyline> com cinco pontos definindo a curva.',
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
