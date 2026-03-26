export type Locale = 'pt' | 'en'

const LOCALE_KEY = 'sharktype-locale'

export function getLocalePref(): Locale {
  if (typeof window === 'undefined') return 'pt'
  return (localStorage.getItem(LOCALE_KEY) as Locale) || 'pt'
}

export function setLocalePref(l: Locale) {
  localStorage.setItem(LOCALE_KEY, l)
}

const dict: Record<string, Record<Locale, string>> = {
  netWpm:      { pt: 'wpm líquido', en: 'net wpm' },
  rawWpm:      { pt: 'wpm bruto',   en: 'raw wpm' },
  accuracy:    { pt: 'precisão',    en: 'accuracy' },
  consistency: { pt: 'consistência',en: 'consistency' },
  errors:      { pt: 'erros',       en: 'errors' },
  time:        { pt: 'tempo',       en: 'time' },
  easy:        { pt: 'fácil',       en: 'easy' },
  medium:      { pt: 'médio',       en: 'medium' },
  hard:        { pt: 'difícil',     en: 'hard' },
  levelUp:     { pt: 'Subiu de Nível!', en: 'Level Up!' },
  share:       { pt: 'Compartilhar', en: 'Share' },
  copied:      { pt: 'Copiado!',    en: 'Copied!' },
  next:        { pt: 'Próximo',     en: 'Next' },
  // UI labels
  all:         { pt: 'todos',       en: 'all' },
  timeLabel:   { pt: 'tempo',       en: 'time' },
  prev:        { pt: 'Anterior',    en: 'Previous' },
  restart:     { pt: 'Reiniciar',   en: 'Restart' },
  startTyping: { pt: 'Comece a digitar...', en: 'Start typing...' },
}

export function t(key: string, locale: Locale): string {
  return dict[key]?.[locale] ?? key
}
