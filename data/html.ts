import { Snippet } from '@/lib/types'

export const htmlSnippets: Snippet[] = [
  {
    id: 'html-001',
    concept: { pt: 'Estrutura Básica', en: 'Basic Structure' },
    difficulty: 'easy',
    prompt: {
      pt: 'O <header> é onde fica a identidade da página e a navegação principal. Monta um header semântico com <h1> pro título do app e <nav> com dois <a> pra navegação -- nada de div sem necessidade.',
      en: 'The <header> element contains the page\'s identity and main navigation. Write a semantic header with <h1> for the app title and <nav> with two navigation <a> links -- no unnecessary divs.',
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
      pt: 'Pra um form funcionar direito, você precisa de action, method e o label associado ao input. Faz um form de login com POST, um <input type="email"> com required e id, o <label> linkado pelo "for" e um <button type="submit">.',
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
      pt: '<figure> e <figcaption> dão contexto semântico pra imagens. Coloca a <img> dentro de um <figure>, bota um alt descritivo e adiciona um <figcaption> logo abaixo com o texto da legenda.',
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
      pt: '<ul> é o elemento certo quando a ordem dos itens não importa. Cria uma lista não ordenada com três <li>, cada um com um <a> linkando pra uma página de linguagem diferente.',
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
      pt: '<article> serve pra conteúdo independente que faz sentido sozinho. Estrutura o artigo com um <header> interno (h2 + time com datetime), um parágrafo de conteúdo e um <footer> com link de tag usando rel="tag".',
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
      pt: 'No <head> você configura como o browser vai interpretar e indexar a página. Adiciona meta charset pra codificação, viewport pra responsividade mobile, meta description pro SEO, o link do CSS e o <title>.',
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
]
