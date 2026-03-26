import { Snippet } from '@/lib/types'

export const htmlSnippets: Snippet[] = [
  {
    id: 'html-001',
    concept: { pt: 'Estrutura Básica', en: 'Basic Structure' },
    difficulty: 'easy',
    prompt: {
      pt: 'O elemento <header> contém a identidade e navegação principal da página. Escreva um header semântico com <h1> para o título da aplicação e <nav> com dois <a> de navegação — sem divs desnecessárias.',
      en: 'The <header> element contains the page\'s identity and main navigation. Write a semantic header with <h1> for the app title and <nav> with two navigation <a> links — no unnecessary divs.',
    },
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
    concept: { pt: 'Formulário', en: 'Form' },
    difficulty: 'easy',
    prompt: {
      pt: 'Formulários HTML exigem action, method e associação correta de label/input. Crie um form de login com POST, um <input type="email"> com required e id, seu <label> associado via "for" e um <button type="submit">.',
      en: 'HTML forms require action, method and proper label/input association. Create a login form with POST, an <input type="email"> with required and id, its <label> linked via "for" and a <button type="submit">.',
    },
    code: `<form action="/login" method="POST">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />
  <button type="submit">Entrar</button>
</form>`,
  },
  {
    id: 'html-003',
    concept: { pt: 'Imagem e Link', en: 'Image and Link' },
    difficulty: 'easy',
    prompt: {
      pt: '<figure> e <figcaption> fornecem contexto semântico para imagens. Envolva a <img> em um <figure>, inclua um alt descritivo no atributo alt e adicione uma <figcaption> logo abaixo com o texto da legenda.',
      en: '<figure> and <figcaption> provide semantic context for images. Wrap the <img> in a <figure>, include a descriptive alt attribute and add a <figcaption> right below with the caption text.',
    },
    code: `<figure>
  <img src="/logo.png" alt="SharkType logo" width="200" />
  <figcaption>Logo do SharkType</figcaption>
</figure>`,
  },
  {
    id: 'html-004',
    concept: { pt: 'Lista', en: 'List' },
    difficulty: 'easy',
    prompt: {
      pt: '<ul> é semanticamente correto para conjuntos de itens sem ordem obrigatória. Crie uma lista não ordenada com três <li>, cada um contendo um <a> para uma página diferente de linguagem de programação.',
      en: '<ul> is semantically correct for unordered sets of items. Create an unordered list with three <li> elements, each containing an <a> linking to a different programming language page.',
    },
    code: `<ul>
  <li><a href="/swift">Swift</a></li>
  <li><a href="/kotlin">Kotlin</a></li>
  <li><a href="/ruby">Ruby</a></li>
</ul>`,
  },
  {
    id: 'html-005',
    concept: { pt: 'Artigo Semântico', en: 'Semantic Article' },
    difficulty: 'medium',
    prompt: {
      pt: '<article> envolve conteúdo independente e autocontido. Estruture o artigo com <header> interno (h2 + time com datetime), um parágrafo de conteúdo e <footer> com link de tag usando rel="tag".',
      en: '<article> wraps independent, self-contained content. Structure the article with an inner <header> (h2 + time with datetime), a content paragraph and <footer> with a tag link using rel="tag".',
    },
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
    concept: { pt: 'Meta e Link', en: 'Meta and Link' },
    difficulty: 'medium',
    prompt: {
      pt: 'O <head> configura como o browser interpreta e indexa a página. Adicione meta charset para codificação, viewport para responsividade mobile, meta description para SEO, link para o CSS e o <title>.',
      en: 'The <head> configures how the browser interprets and indexes the page. Add meta charset for encoding, viewport for mobile responsiveness, meta description for SEO, link to the CSS and the <title>.',
    },
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
    concept: { pt: 'Select e Option', en: 'Select and Option' },
    difficulty: 'medium',
    prompt: {
      pt: '<optgroup> organiza opções de um <select> em grupos lógicos com um rótulo. Crie um campo de seleção de linguagem com dois grupos (JVM e Script), cada um contendo duas <option> com value e texto.',
      en: '<optgroup> organizes <select> options into logical groups with a label. Create a language select field with two groups (JVM and Script), each containing two <option> elements with value and text.',
    },
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
    concept: { pt: 'Tabela', en: 'Table' },
    difficulty: 'medium',
    prompt: {
      pt: 'Tabelas acessíveis usam <thead>/<tbody>, <th> com atributo scope e <td> para dados. Construa uma tabela de resultados com três colunas no cabeçalho (scope="col") e uma linha de dados no corpo.',
      en: 'Accessible tables use <thead>/<tbody>, <th> with scope attribute and <td> for data. Build a results table with three header columns (scope="col") and one data row in the body.',
    },
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
    concept: { pt: 'Details e Summary', en: 'Details and Summary' },
    difficulty: 'hard',
    prompt: {
      pt: '<details>/<summary> criam um widget de divulgação colapsável nativo, sem JavaScript. Dentro do <details>, use <summary> como título clicável e adicione um <fieldset> com <legend> e duas opções de <input type="radio">.',
      en: '<details>/<summary> create a native collapsible disclosure widget, no JavaScript needed. Inside <details>, use <summary> as the clickable title and add a <fieldset> with <legend> and two <input type="radio"> options.',
    },
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
    concept: { pt: 'SVG Inline', en: 'Inline SVG' },
    difficulty: 'hard',
    prompt: {
      pt: 'SVG inline permite gráficos vetoriais acessíveis diretamente no HTML. Crie um <svg> com viewBox, aria-label e role="img" para acessibilidade, <title> interno e um <polyline> com cinco pontos definindo a curva.',
      en: 'Inline SVG allows accessible vector graphics directly in HTML. Create an <svg> with viewBox, aria-label and role="img" for accessibility, an inner <title> and a <polyline> with five points defining the curve.',
    },
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
