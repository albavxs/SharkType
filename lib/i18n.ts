export type Locale = 'pt' | 'en'

const LOCALE_KEY = 'sharktype-locale'

export function getLocalePref(): Locale {
  if (typeof window === 'undefined') return 'en'
  return (localStorage.getItem(LOCALE_KEY) as Locale) || 'en'
}

export function setLocalePref(l: Locale) {
  localStorage.setItem(LOCALE_KEY, l)
}

const dict: Record<string, Record<Locale, string>> = {
  // ── Metrics ─────────────────────────────────────────────────────────────
  netWpm:      { pt: 'wpm líquido', en: 'net wpm' },
  rawWpm:      { pt: 'wpm bruto',   en: 'raw wpm' },
  accuracy:    { pt: 'precisão',    en: 'accuracy' },
  consistency: { pt: 'consistência',en: 'consistency' },
  errors:      { pt: 'erros',       en: 'errors' },
  time:        { pt: 'tempo',       en: 'time' },

  // ── Difficulty ──────────────────────────────────────────────────────────
  easy:   { pt: 'fácil',   en: 'easy' },
  medium: { pt: 'médio',   en: 'medium' },
  hard:   { pt: 'difícil', en: 'hard' },

  // ── General UI ──────────────────────────────────────────────────────────
  levelUp:     { pt: 'Subiu de Nível!', en: 'Level Up!' },
  share:       { pt: 'Compartilhar', en: 'Share' },
  copied:      { pt: 'Copiado!',    en: 'Copied!' },
  next:        { pt: 'Próximo',     en: 'Next' },
  all:         { pt: 'default',     en: 'default' },
  timeLabel:   { pt: 'tempo',       en: 'time' },
  prev:        { pt: 'Anterior',    en: 'Previous' },
  restart:     { pt: 'Reiniciar',   en: 'Restart' },
  startTyping: { pt: 'Comece a digitar...', en: 'Start typing...' },
  back:        { pt: 'Voltar',      en: 'Back' },
  loading:     { pt: 'Carregando...', en: 'Loading...' },

  // ── Toolbar ─────────────────────────────────────────────────────────────
  navTracks:    { pt: 'Trilhas',       en: 'Tracks' },
  navRanking:   { pt: 'Ranking',       en: 'Leaderboard' },
  navHelp:      { pt: 'Ajuda',         en: 'Help' },
  navSettings:  { pt: 'Configurações', en: 'Settings' },
  toggleLocale: { pt: 'Alternar idioma da interface', en: 'Toggle interface language' },

  // ── SnippetInfo ─────────────────────────────────────────────────────────
  hide: { pt: 'ocultar', en: 'hide' },
  show: { pt: 'mostrar', en: 'show' },

  // ── Footer ──────────────────────────────────────────────────────────────
  settings:      { pt: 'configurações', en: 'settings' },
  settingsShort: { pt: 'config',        en: 'config' },

  // ── LanguageDropdown ────────────────────────────────────────────────────
  sectionCode: { pt: 'Código', en: 'Code' },
  sectionText: { pt: 'Texto',  en: 'Text' },

  // ── HelpModal ───────────────────────────────────────────────────────────
  helpTitle:      { pt: 'Como usar o SharkType',       en: 'How to use SharkType' },
  helpShortcuts:  { pt: 'Atalhos de teclado',          en: 'Keyboard shortcuts' },
  helpShiftTab:   { pt: 'reiniciar snippet (funciona durante a digitação)', en: 'restart snippet (works while typing)' },
  helpTab:        { pt: 'reiniciar teste / próximo snippet', en: 'restart test / next snippet' },
  helpEnter:      { pt: 'nova linha (no código)',       en: 'new line (in code)' },
  helpBackspace:  { pt: 'apagar caractere',             en: 'delete character' },
  helpEsc:        { pt: 'fechar modais',                en: 'close modals' },
  helpDifficulty: { pt: 'Dificuldade',                  en: 'Difficulty' },
  helpDefault:    { pt: 'Todos os snippets, sem cronômetro', en: 'All snippets, no timer' },
  helpEasy:       { pt: 'Variáveis, declarações simples, one-liners (60s)', en: 'Variables, simple declarations, one-liners (60s)' },
  helpMedium:     { pt: 'Funções, loops, tratamento de erros (45s)',        en: 'Functions, loops, error handling (45s)' },
  helpHard:       { pt: 'Patterns avançados, generics, closures (30s)',     en: 'Advanced patterns, generics, closures (30s)' },
  helpTracks:     { pt: 'Trilhas',  en: 'Tracks' },
  helpTracksDesc: {
    pt: 'Acesse as trilhas educacionais pelo ícone de livro no header. Pratique conceitos específicos como Variáveis, Funções, Objetos e mais, em qualquer linguagem.',
    en: 'Open the educational tracks from the book icon in the header. Practice specific concepts like Variables, Functions, Objects and more, in any language.',
  },
  helpXP:     { pt: 'XP e Níveis', en: 'XP and Levels' },
  helpXPDesc: {
    pt: 'Ganhe XP ao completar snippets. Quanto maior o WPM e accuracy, mais XP. Snippets difíceis dão bônus multiplicador. Mantenha um streak diário para motivação.',
    en: 'Earn XP by completing snippets. Higher WPM and accuracy mean more XP. Hard snippets give a bonus multiplier. Keep a daily streak going for motivation.',
  },
  helpThemes:     { pt: 'Temas', en: 'Themes' },
  helpThemesDesc: {
    pt: 'Clique no nome do tema no canto inferior direito para trocar. Mais de 30 temas disponíveis. As cores do tema também afetam o syntax highlighting do código.',
    en: 'Click the theme name in the bottom-right corner to switch. Over 30 themes available. Theme colors also affect code syntax highlighting.',
  },

  // ── Tracks page ─────────────────────────────────────────────────────────
  pageTracks:    { pt: 'Trilhas', en: 'Tracks' },
  tracksSubtitle: {
    pt: 'Escolha uma trilha de conceitos. Em seguida, escolha a linguagem para praticar.',
    en: 'Pick a concept track, then choose the language you want to practice in.',
  },
  codeSection:    { pt: 'Código', en: 'Code' },
  codeTracksDesc: {
    pt: 'Trilhas temáticas por conceito ou linguagem de programação',
    en: 'Themed tracks by concept or programming language',
  },
  completed:    { pt: 'concluídos', en: 'completed' },
  sectionIdioms: { pt: 'Digitação', en: 'Typing' },
  idiomsDesc: {
    pt: 'Treine digitação com textos em português, inglês, espanhol e francês',
    en: 'Practice typing with texts in Portuguese, English, Spanish, and French',
  },

  // ── Track practice page ─────────────────────────────────────────────────
  trackNotFound: { pt: 'Trilha não encontrada.', en: 'Track not found.' },
  hintShiftTab:  { pt: 'shift + tab — reiniciar', en: 'shift + tab — restart' },

  // ── Leaderboard page ────────────────────────────────────────────────────
  pageRanking:    { pt: 'Ranking',        en: 'Leaderboard' },
  globalSoon:     { pt: 'ranking global em breve', en: 'global leaderboard coming soon' },
  bestSessions:   { pt: 'Suas melhores sessões, ordenadas por WPM.', en: 'Your best sessions, ranked by WPM.' },
  bestWpm:        { pt: 'melhor wpm',     en: 'best wpm' },
  sessions:       { pt: 'sessões',        en: 'sessions' },
  allFilter:      { pt: 'Todas',          en: 'All' },
  noSessions:     { pt: 'Nenhuma sessão ainda.', en: 'No sessions yet.' },
  noSessionsHint: { pt: 'Complete alguns treinos para ver seu histórico aqui.', en: 'Complete some practices to see your history here.' },
  colLanguage:    { pt: 'linguagem',      en: 'language' },
  colAccuracy:    { pt: 'precisão',       en: 'accuracy' },
  colErrors:      { pt: 'erros',          en: 'errors' },
  colTime:        { pt: 'tempo',          en: 'time' },
  colDate:        { pt: 'data',           en: 'date' },

  // ── Stats page ──────────────────────────────────────────────────────────
  pageStats:     { pt: 'Estatísticas',    en: 'Statistics' },
  perLanguage:   { pt: 'Por linguagem',   en: 'Per language' },
  noSessionYet:  { pt: 'Nenhuma sessão ainda. Comece a praticar!', en: 'No sessions yet. Start practicing!' },
  recentHistory: { pt: 'Histórico recente', en: 'Recent history' },
  viewStats:     { pt: 'Ver estatísticas', en: 'View statistics' },

  // ── Settings page ───────────────────────────────────────────────────────
  pageSettings:  { pt: 'Configurações',   en: 'Settings' },
  soundAll:      { pt: 'Som — todos',     en: 'Sound — all' },
  soundAllDesc:  { pt: 'Aplica o mesmo perfil para tecla, espaço, erro e completo', en: 'Apply the same profile to key, space, error, and complete' },
  soundKey:      { pt: 'Tecla',           en: 'Key' },
  soundSpace:    { pt: 'Espaço',          en: 'Space' },
  soundError:    { pt: 'Erro',            en: 'Error' },
  soundComplete: { pt: 'Completo',        en: 'Complete' },
  soundPrefix:   { pt: 'Som',             en: 'Sound' },
  resetProgress: { pt: 'Reset progresso', en: 'Reset progress' },
  confirm:       { pt: 'Confirmar',       en: 'Confirm' },
  cancel:        { pt: 'Cancelar',        en: 'Cancel' },
  resetBtn:      { pt: 'Resetar',         en: 'Reset' },
  soundOff:      { pt: 'Desligado',       en: 'Off' },
}

export function t(key: string, locale: Locale = 'en'): string {
  return dict[key]?.[locale] ?? key
}
