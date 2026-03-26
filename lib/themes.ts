export interface ThemeSyntax {
  keyword: string
  string: string
  number: string
  comment: string
  type: string
}

export interface Theme {
  name: string
  bg: string
  main: string
  caret: string
  sub: string
  subAlt: string
  text: string
  error: string
  errorExtra: string
  syntax: ThemeSyntax
}

export const themes: Theme[] = [
  {
    name: 'serika dark', bg: '#323437', main: '#e2b714', caret: '#e2b714', sub: '#646669', subAlt: '#2c2e31', text: '#d1d0c5', error: '#ca4754', errorExtra: '#7e2a33',
    syntax: { keyword: '#e2b714', string: '#7ec699', number: '#d19a66', comment: '#4a4d52', type: '#56b6c2' },
  },
  {
    name: 'serika', bg: '#e1e1e3', main: '#e2b714', caret: '#e2b714', sub: '#aaaeb3', subAlt: '#d1d3d7', text: '#323437', error: '#da3333', errorExtra: '#791717',
    syntax: { keyword: '#c18401', string: '#50a14f', number: '#986801', comment: '#a0a1a7', type: '#0184bc' },
  },
  {
    name: 'dracula', bg: '#282a36', main: '#bd93f9', caret: '#f8f8f2', sub: '#6272a4', subAlt: '#20222c', text: '#f8f8f2', error: '#ff5555', errorExtra: '#bb2e2e',
    syntax: { keyword: '#ff79c6', string: '#f1fa8c', number: '#bd93f9', comment: '#6272a4', type: '#8be9fd' },
  },
  {
    name: 'nord', bg: '#2e3440', main: '#88c0d0', caret: '#88c0d0', sub: '#4c566a', subAlt: '#242933', text: '#d8dee9', error: '#bf616a', errorExtra: '#793e44',
    syntax: { keyword: '#81a1c1', string: '#a3be8c', number: '#b48ead', comment: '#4c566a', type: '#88c0d0' },
  },
  {
    name: 'nord light', bg: '#eceff4', main: '#5e81ac', caret: '#5e81ac', sub: '#9da7b5', subAlt: '#d8dee9', text: '#2e3440', error: '#bf616a', errorExtra: '#793e44',
    syntax: { keyword: '#5e81ac', string: '#a3be8c', number: '#b48ead', comment: '#9da7b5', type: '#88c0d0' },
  },
  {
    name: 'gruvbox dark', bg: '#1d2021', main: '#d79921', caret: '#fabd2f', sub: '#665c54', subAlt: '#282828', text: '#ebdbb2', error: '#fb4934', errorExtra: '#cc241d',
    syntax: { keyword: '#fb4934', string: '#b8bb26', number: '#d3869b', comment: '#665c54', type: '#83a598' },
  },
  {
    name: 'gruvbox light', bg: '#fbf1c7', main: '#d79921', caret: '#d79921', sub: '#a89984', subAlt: '#f2e5bc', text: '#3c3836', error: '#cc241d', errorExtra: '#9d0006',
    syntax: { keyword: '#cc241d', string: '#79740e', number: '#8f3f71', comment: '#a89984', type: '#076678' },
  },
  {
    name: 'monokai', bg: '#272822', main: '#f92672', caret: '#f8f8f2', sub: '#75715e', subAlt: '#1e1f1a', text: '#f8f8f2', error: '#f92672', errorExtra: '#9e1a47',
    syntax: { keyword: '#f92672', string: '#e6db74', number: '#ae81ff', comment: '#75715e', type: '#66d9ef' },
  },
  {
    name: 'catppuccin mocha', bg: '#1e1e2e', main: '#cba6f7', caret: '#f5e0dc', sub: '#585b70', subAlt: '#181825', text: '#cdd6f4', error: '#f38ba8', errorExtra: '#a6425c',
    syntax: { keyword: '#cba6f7', string: '#a6e3a1', number: '#fab387', comment: '#585b70', type: '#89dceb' },
  },
  {
    name: 'catppuccin latte', bg: '#eff1f5', main: '#8839ef', caret: '#dc8a78', sub: '#8c8fa1', subAlt: '#e6e9ef', text: '#4c4f69', error: '#d20f39', errorExtra: '#8c0a26',
    syntax: { keyword: '#8839ef', string: '#40a02b', number: '#fe640b', comment: '#8c8fa1', type: '#04a5e5' },
  },
  {
    name: 'catppuccin frappe', bg: '#303446', main: '#ca9ee6', caret: '#f2d5cf', sub: '#626880', subAlt: '#292c3c', text: '#c6d0f5', error: '#e78284', errorExtra: '#9e4f50',
    syntax: { keyword: '#ca9ee6', string: '#a6d189', number: '#ef9f76', comment: '#626880', type: '#85c1dc' },
  },
  {
    name: 'catppuccin macchiato', bg: '#24273a', main: '#c6a0f6', caret: '#f4dbd6', sub: '#5b6078', subAlt: '#1e2030', text: '#cad3f5', error: '#ed8796', errorExtra: '#a35562',
    syntax: { keyword: '#c6a0f6', string: '#a6da95', number: '#f5a97f', comment: '#5b6078', type: '#8bd5ca' },
  },
  {
    name: 'carbon', bg: '#313131', main: '#f66e0d', caret: '#f66e0d', sub: '#616161', subAlt: '#2a2a2a', text: '#f5e6c8', error: '#f55050', errorExtra: '#a33636',
    syntax: { keyword: '#f66e0d', string: '#a8cc7a', number: '#dca561', comment: '#616161', type: '#6eb4d7' },
  },
  {
    name: '8008', bg: '#333a45', main: '#f44c7f', caret: '#f44c7f', sub: '#535a65', subAlt: '#2c323b', text: '#e9e5cc', error: '#da3333', errorExtra: '#791717',
    syntax: { keyword: '#f44c7f', string: '#b8e986', number: '#d19a66', comment: '#535a65', type: '#7ec699' },
  },
  {
    name: '80s after dark', bg: '#1b1d36', main: '#fca6d1', caret: '#fca6d1', sub: '#99d6ea', subAlt: '#14152e', text: '#e1e7ec', error: '#ff6384', errorExtra: '#a33e54',
    syntax: { keyword: '#fca6d1', string: '#a2fca2', number: '#fcf5a2', comment: '#99d6ea', type: '#a2e4fc' },
  },
  {
    name: 'botanical', bg: '#7b9c98', main: '#eaf1f3', caret: '#eaf1f3', sub: '#495755', subAlt: '#6d8b87', text: '#eaf1f3', error: '#c75d5d', errorExtra: '#8a3d3d',
    syntax: { keyword: '#eaf1f3', string: '#c4e3c2', number: '#f0d9a0', comment: '#495755', type: '#a0d0e0' },
  },
  {
    name: 'cafe', bg: '#dbc1ac', main: '#6f4e37', caret: '#6f4e37', sub: '#a0846e', subAlt: '#d0b49a', text: '#4a3728', error: '#c74545', errorExtra: '#8a2e2e',
    syntax: { keyword: '#6f4e37', string: '#5a7a3e', number: '#a0653e', comment: '#a0846e', type: '#4a7a8a' },
  },
  {
    name: 'laser', bg: '#221b44', main: '#009eec', caret: '#33c6f6', sub: '#4a3e7a', subAlt: '#1b1538', text: '#dbe7ef', error: '#da3333', errorExtra: '#791717',
    syntax: { keyword: '#33c6f6', string: '#66e6ac', number: '#f9c74f', comment: '#4a3e7a', type: '#009eec' },
  },
  {
    name: 'matrix', bg: '#000000', main: '#15ff00', caret: '#15ff00', sub: '#003b00', subAlt: '#0a0a0a', text: '#15ff00', error: '#da3333', errorExtra: '#791717',
    syntax: { keyword: '#15ff00', string: '#00cc00', number: '#33ff33', comment: '#003b00', type: '#00ff88' },
  },
  {
    name: 'miami', bg: '#f4d1ae', main: '#e53985', caret: '#e53985', sub: '#c49b7e', subAlt: '#eac49d', text: '#382c25', error: '#da3333', errorExtra: '#791717',
    syntax: { keyword: '#e53985', string: '#2e994e', number: '#c47622', comment: '#c49b7e', type: '#398ec4' },
  },
  {
    name: 'midnight', bg: '#0b0e13', main: '#a08bce', caret: '#a08bce', sub: '#3c4252', subAlt: '#080a0e', text: '#c5c8d4', error: '#c75d5d', errorExtra: '#8a3d3d',
    syntax: { keyword: '#a08bce', string: '#7ec699', number: '#d19a66', comment: '#3c4252', type: '#6eb4d7' },
  },
  {
    name: 'nautilus', bg: '#132237', main: '#eb8a60', caret: '#eb8a60', sub: '#426388', subAlt: '#0e1a2b', text: '#cfd6e0', error: '#ff6b6b', errorExtra: '#a34444',
    syntax: { keyword: '#eb8a60', string: '#72c090', number: '#e0a070', comment: '#426388', type: '#60b0d0' },
  },
  {
    name: 'olive', bg: '#e9e5cc', main: '#92946f', caret: '#92946f', sub: '#b6b38a', subAlt: '#ddd9c0', text: '#373731', error: '#c74545', errorExtra: '#8a2e2e',
    syntax: { keyword: '#92946f', string: '#5a7a3e', number: '#a07a3e', comment: '#b6b38a', type: '#4a7a8a' },
  },
  {
    name: 'one dark', bg: '#282c34', main: '#61afef', caret: '#528bff', sub: '#5c6370', subAlt: '#21252b', text: '#abb2bf', error: '#e06c75', errorExtra: '#943740',
    syntax: { keyword: '#c678dd', string: '#98c379', number: '#d19a66', comment: '#5c6370', type: '#56b6c2' },
  },
  {
    name: 'rose pine', bg: '#191724', main: '#c4a7e7', caret: '#e0def4', sub: '#524f67', subAlt: '#1f1d2e', text: '#e0def4', error: '#eb6f92', errorExtra: '#9e4a61',
    syntax: { keyword: '#c4a7e7', string: '#9ccfd8', number: '#f6c177', comment: '#524f67', type: '#31748f' },
  },
  {
    name: 'rose pine moon', bg: '#232136', main: '#c4a7e7', caret: '#e0def4', sub: '#59546d', subAlt: '#2a273f', text: '#e0def4', error: '#eb6f92', errorExtra: '#9e4a61',
    syntax: { keyword: '#c4a7e7', string: '#9ccfd8', number: '#f6c177', comment: '#59546d', type: '#3e8fb0' },
  },
  {
    name: 'rose pine dawn', bg: '#faf4ed', main: '#907aa9', caret: '#575279', sub: '#9893a5', subAlt: '#f2e9e1', text: '#575279', error: '#b4637a', errorExtra: '#7a3f51',
    syntax: { keyword: '#907aa9', string: '#56949f', number: '#ea9d34', comment: '#9893a5', type: '#286983' },
  },
  {
    name: 'solarized dark', bg: '#002b36', main: '#268bd2', caret: '#268bd2', sub: '#586e75', subAlt: '#00212b', text: '#839496', error: '#dc322f', errorExtra: '#932220',
    syntax: { keyword: '#859900', string: '#2aa198', number: '#d33682', comment: '#586e75', type: '#268bd2' },
  },
  {
    name: 'solarized light', bg: '#fdf6e3', main: '#268bd2', caret: '#268bd2', sub: '#93a1a1', subAlt: '#eee8d5', text: '#657b83', error: '#dc322f', errorExtra: '#932220',
    syntax: { keyword: '#859900', string: '#2aa198', number: '#d33682', comment: '#93a1a1', type: '#268bd2' },
  },
  {
    name: 'terminal', bg: '#191a1b', main: '#79c836', caret: '#79c836', sub: '#454647', subAlt: '#131415', text: '#f2f2f2', error: '#e7322e', errorExtra: '#96201e',
    syntax: { keyword: '#79c836', string: '#e6db74', number: '#ae81ff', comment: '#454647', type: '#66d9ef' },
  },
  {
    name: 'vscode', bg: '#1e1e1e', main: '#007acc', caret: '#aeafad', sub: '#505050', subAlt: '#181818', text: '#d4d4d4', error: '#f44747', errorExtra: '#a32e2e',
    syntax: { keyword: '#569cd6', string: '#ce9178', number: '#b5cea8', comment: '#6a9955', type: '#4ec9b0' },
  },
  {
    name: 'viridescent', bg: '#394739', main: '#7db87d', caret: '#7db87d', sub: '#506650', subAlt: '#2f3d2f', text: '#d1d7c0', error: '#c74545', errorExtra: '#8a2e2e',
    syntax: { keyword: '#7db87d', string: '#b8d8a0', number: '#d7c080', comment: '#506650', type: '#80b0c0' },
  },
]

export const DEFAULT_THEME = 'serika dark'

export function getTheme(name: string): Theme {
  return themes.find(t => t.name === name) || themes[0]
}

export function getThemePref(): string {
  if (typeof window === 'undefined') return DEFAULT_THEME
  return localStorage.getItem('sharktype-theme') || DEFAULT_THEME
}

export function setThemePref(name: string) {
  localStorage.setItem('sharktype-theme', name)
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.style.setProperty('--bg', theme.bg)
  root.style.setProperty('--main', theme.main)
  root.style.setProperty('--caret', theme.caret)
  root.style.setProperty('--sub', theme.sub)
  root.style.setProperty('--sub-alt', theme.subAlt)
  root.style.setProperty('--text', theme.text)
  root.style.setProperty('--error', theme.error)
  root.style.setProperty('--error-extra', theme.errorExtra)
  root.style.setProperty('--syntax-keyword', theme.syntax.keyword)
  root.style.setProperty('--syntax-string', theme.syntax.string)
  root.style.setProperty('--syntax-number', theme.syntax.number)
  root.style.setProperty('--syntax-comment', theme.syntax.comment)
  root.style.setProperty('--syntax-type', theme.syntax.type)
}
