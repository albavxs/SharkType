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
  authSignInShort: { pt: 'entrar', en: 'sign in' },
  authSignIn: { pt: 'Entrar', en: 'Sign in' },
  authSignOut: { pt: 'Sair', en: 'Sign out' },

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
  codeSection:    { pt: 'Conceitos', en: 'Concepts' },
  codeTracksDesc: {
    pt: 'Aprenda conceitos fundamentais de programação passo a passo',
    en: 'Learn fundamental programming concepts step by step',
  },
  focusedSection:    { pt: 'Foco por Área', en: 'By Focus Area' },
  focusedTracksDesc: {
    pt: 'Trilhas temáticas por domínio ou stack de tecnologia',
    en: 'Themed tracks by domain or technology stack',
  },
  cyberdevopsSection:    { pt: 'Cybersegurança & DevOps', en: 'Cybersecurity & DevOps' },
  cyberdevopsTracksDesc: {
    pt: 'Git, Linux, Docker, segurança ofensiva e defensiva, e infraestrutura',
    en: 'Git, Linux, Docker, offensive and defensive security, and infrastructure',
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
  capsLock:      { pt: 'Caps Lock ativado', en: 'Caps Lock is on' },

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
  colXP:          { pt: 'xp',             en: 'xp' },
  colStreak:      { pt: 'streak',         en: 'streak' },
  globalPlayers:  { pt: 'Todos os jogadores, ordenados por XP total.', en: 'All players, ranked by total XP.' },
  noPlayers:      { pt: 'Nenhum jogador ainda.', en: 'No players yet.' },
  noPlayersHint:  { pt: 'Assim que as primeiras contas começarem a praticar, o ranking aparece aqui.', en: 'The leaderboard will appear here once players start practicing.' },
  rankingGuestHint: { pt: 'Entre para sincronizar seu progresso e aparecer no ranking global.', en: 'Sign in to sync your progress and appear on the global leaderboard.' },

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

  // ── Auth pages ──────────────────────────────────────────────────────────
  authLoginTitle: { pt: 'Entrar na sua conta', en: 'Sign in to your account' },
  authLoginSubtitle: { pt: 'Use GitHub ou email para sincronizar seu progresso, streak e ranking global.', en: 'Use GitHub or email to sync your progress, streak, and global leaderboard.' },
  authSignupTitle: { pt: 'Criar conta SharkType', en: 'Create your SharkType account' },
  authSignupSubtitle: { pt: 'Cadastre um username público para salvar XP, histórico e competir com todos os jogadores.', en: 'Pick a public username to save XP, history, and compete with every player.' },
  authVerifyTitle: { pt: 'Confirmar seu email', en: 'Verify your email' },
  authVerifySubtitle: { pt: 'Digite o código enviado para concluir a criação da conta e liberar sua sessão.', en: 'Enter the code we sent to finish creating your account and unlock your session.' },
  authNeedAccount: { pt: 'Ainda não tem conta? Criar agora', en: "Don't have an account? Create one" },
  authHaveAccount: { pt: 'Já tem conta? Entrar', en: 'Already have an account? Sign in' },
  authContinueGuest: { pt: 'Continuar como guest', en: 'Continue as guest' },
  authContinueGithub: { pt: 'Continuar com GitHub', en: 'Continue with GitHub' },
  authOr: { pt: 'ou', en: 'or' },
  authEmail: { pt: 'Email', en: 'Email' },
  authPassword: { pt: 'Senha', en: 'Password' },
  authConfirmPassword: { pt: 'Confirmar senha', en: 'Confirm password' },
  authUsername: { pt: 'Username', en: 'Username' },
  authUsernameHint: { pt: 'Use 3-20 caracteres: letras minúsculas, números e underscore. Esse nome aparece no ranking global.', en: 'Use 3-20 characters: lowercase letters, numbers, and underscores. This name appears on the global leaderboard.' },
  authCreateAccount: { pt: 'Criar conta', en: 'Create account' },
  authBackToLogin: { pt: 'Voltar para login', en: 'Back to login' },
  authVerifyHint: { pt: 'Se o código expirar, você pode reenviar abaixo.', en: 'If the code expires, you can resend it below.' },
  authVerificationCode: { pt: 'Código de confirmação', en: 'Verification code' },
  authVerifyButton: { pt: 'Confirmar código', en: 'Verify code' },
  authResendCode: { pt: 'Reenviar código', en: 'Resend code' },
  authVerificationSuccess: { pt: 'Email confirmado com sucesso.', en: 'Email verified successfully.' },
  authVerificationResent: { pt: 'Enviamos um novo código para seu email.', en: 'We sent a new code to your email.' },
  authEmailPlaceholder: { pt: 'email pendente', en: 'pending email' },
  authSupabaseMissing: { pt: 'As variáveis públicas do Supabase não entraram neste build, então login, ranking global e sincronização ficaram desativados.', en: 'The public Supabase variables are missing from this build, so sign-in, global leaderboard, and sync are disabled.' },
  authSupabaseMissingVars: { pt: 'Env ausentes:', en: 'Missing envs:' },
  authSupabaseRedeployHint: { pt: 'Depois de salvar as variáveis no Vercel, faça um novo deploy para publicar o bundle com os novos NEXT_PUBLIC_*.', en: 'After saving the variables in Vercel, redeploy so the new NEXT_PUBLIC_* values are included in the public bundle.' },
  authWorking: { pt: 'Processando...', en: 'Working...' },
  tracksGuestTitle: { pt: 'Trilhas bloqueadas', en: 'Tracks locked' },
  tracksGuestDesc: { pt: 'Entre ou crie uma conta para acessar as trilhas, salvar seu progresso e ganhar XP.', en: 'Sign in or create an account to access tracks, save your progress, and earn XP.' },
  tracksGuestButton: { pt: 'Entrar agora', en: 'Sign in now' },
  sectionProfile: { pt: 'Perfil', en: 'Profile' },
  profileUsername: { pt: 'Username', en: 'Username' },
  profileDisplayName: { pt: 'Nome de exibição', en: 'Display name' },
  profileAvatar: { pt: 'URL da Foto de perfil', en: 'Profile Picture URL' },
  profileSave: { pt: 'Salvar alterações', en: 'Save changes' },
  profileSuccess: { pt: 'Perfil atualizado com sucesso!', en: 'Profile updated successfully!' },
  profileError: { pt: 'Erro ao atualizar perfil.', en: 'Error updating profile.' },

  // ── Sprint social/gamificacao ──────────────────────────────────────────
  profileNotFound: { pt: 'Perfil não encontrado.', en: 'Profile not found.' },
  editProfile: { pt: 'Editar meu perfil', en: 'Edit my profile' },
  uploadAvatar: { pt: 'Trocar foto', en: 'Change picture' },
  uploadAvatarHint: { pt: 'JPEG, PNG ou WebP até 2MB', en: 'JPEG, PNG or WebP up to 2MB' },
  uploadAvatarError: { pt: 'Erro ao enviar foto.', en: 'Error uploading picture.' },
  follow: { pt: 'Seguir', en: 'Follow' },
  unfollow: { pt: 'Deixar de seguir', en: 'Unfollow' },
  followers: { pt: 'seguidores', en: 'followers' },
  following: { pt: 'seguindo', en: 'following' },
  topLanguages: { pt: 'Linguagens mais usadas', en: 'Top languages' },
  sessionsShort: { pt: 'sess.', en: 'sess.' },
  statsBestWPM: { pt: 'Melhor WPM', en: 'Best WPM' },
  statsTotalSessions: { pt: 'Sessões', en: 'Sessions' },
  statsBestAccuracy: { pt: 'Precisão', en: 'Accuracy' },
  achievements: { pt: 'Conquistas', en: 'Achievements' },
  achievementUnlocked: { pt: 'Conquista desbloqueada!', en: 'Achievement unlocked!' },
  streakIncreased: { pt: 'Streak aumentou!', en: 'Streak increased!' },
  dayStreak: { pt: 'dia', en: 'day' },
  daysStreak: { pt: 'dias', en: 'days' },
  navFeed: { pt: 'Feed', en: 'Feed' },
  feedGlobal: { pt: 'Global', en: 'Global' },
  feedFollowing: { pt: 'Seguindo', en: 'Following' },
  feedEmpty: { pt: 'Nenhuma atividade ainda.', en: 'No activity yet.' },
  feedEmptyFollowing: { pt: 'Siga jogadores para ver atividade aqui.', en: 'Follow players to see activity here.' },
  feedSessionTitle: { pt: 'completou uma sessão', en: 'completed a session' },
  feedAchievementTitle: { pt: 'desbloqueou uma conquista', en: 'unlocked an achievement' },
  feedLevelUpTitle: { pt: 'subiu para o level', en: 'reached level' },
  shareResult: { pt: 'Compartilhar resultado', en: 'Share result' },
  downloadCard: { pt: 'Baixar PNG', en: 'Download PNG' },
  shareCardSubtitle: { pt: 'Card pronto para Twitter / Discord', en: 'Card ready for Twitter / Discord' },
  fontSizeIncrease: { pt: 'Aumentar fonte', en: 'Increase font' },
  fontSizeDecrease: { pt: 'Diminuir fonte', en: 'Decrease font' },
  lenientKeyboard: { pt: 'Teclado não-QWERTY (validação relaxada)', en: 'Non-QWERTY keyboard (lenient validation)' },
  lenientKeyboardHint: {
    pt: 'Aceita qualquer tecla — suporte completo a AZERTY/Dvorak/Colemak virá em uma próxima versão.',
    en: 'Accepts any key — full AZERTY/Dvorak/Colemak support coming in a future version.',
  },
}

export function t(key: string, locale: Locale = 'en'): string {
  return dict[key]?.[locale] ?? key
}
