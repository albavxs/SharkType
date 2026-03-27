type IconProps = {
  size?: number
  className?: string
}

export const SunIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <circle cx="8" cy="8" r="2.5" />
    <line x1="8" y1="1.5" x2="8" y2="3" />
    <line x1="8" y1="13" x2="8" y2="14.5" />
    <line x1="1.5" y1="8" x2="3" y2="8" />
    <line x1="13" y1="8" x2="14.5" y2="8" />
    <line x1="3.4" y1="3.4" x2="4.4" y2="4.4" />
    <line x1="11.6" y1="11.6" x2="12.6" y2="12.6" />
    <line x1="12.6" y1="3.4" x2="11.6" y2="4.4" />
    <line x1="4.4" y1="11.6" x2="3.4" y2="12.6" />
  </svg>
)

export const MoonIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d="M13.5 10.5A6 6 0 0 1 5.5 2.5a6 6 0 1 0 8 8z" />
  </svg>
)

export const ArrowLeftIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <line x1="13" y1="8" x2="3" y2="8" />
    <polyline points="7,4 3,8 7,12" />
  </svg>
)

export const ArrowRightIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <line x1="3" y1="8" x2="13" y2="8" />
    <polyline points="9,4 13,8 9,12" />
  </svg>
)

export const RefreshIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <polyline points="2,4.5 2,2 4.5,2" />
    <path d="M2 2 C4 0.5 8 0.5 11 3 C13.5 5 14 8 13.5 10.5" />
    <path d="M13.5 10.5 A6 6 0 0 1 2.5 11.5" />
  </svg>
)

export const CheckIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <polyline points="2.5,8.5 6.5,12.5 13.5,4.5" />
  </svg>
)

export const ClockIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <circle cx="8" cy="8" r="6" />
    <polyline points="8,5 8,8 10.5,10.5" />
  </svg>
)

export const DiamondIcon = ({ size = 8, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 8 8" fill="currentColor"
    className={className}>
    <polygon points="4,0.5 7.5,4 4,7.5 0.5,4" />
  </svg>
)

export const FlameIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d="M8 1.5C8 1.5 3 6 3 9.5C3 12.3 5.2 14.5 8 14.5C10.8 14.5 13 12.3 13 9.5C13 6 8 1.5 8 1.5Z" />
    <path d="M8 14.5C6.9 14.5 6 13.6 6 12.5C6 11 8 9 8 9C8 9 10 11 10 12.5C10 13.6 9.1 14.5 8 14.5Z" />
  </svg>
)

export const ShareIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d="M4 8V13H12V8" />
    <polyline points="5.5,4.5 8,2 10.5,4.5" />
    <line x1="8" y1="2" x2="8" y2="10" />
  </svg>
)

export const GearIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <circle cx="8" cy="8" r="2" />
    <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" />
  </svg>
)

export const ChartIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <polyline points="2,12 6,6 10,9 14,3" />
    <polyline points="11,3 14,3 14,6" />
  </svg>
)

export const SlidersIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <line x1="4" y1="3" x2="4" y2="13" />
    <circle cx="4" cy="5" r="1.5" />
    <line x1="8" y1="3" x2="8" y2="13" />
    <circle cx="8" cy="10" r="1.5" />
    <line x1="12" y1="3" x2="12" y2="13" />
    <circle cx="12" cy="7" r="1.5" />
  </svg>
)

export const HelpIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <circle cx="8" cy="8" r="6" />
    <path d="M6.5 6.5a1.5 1.5 0 0 1 2.8.5c0 1-1.3 1.5-1.3 1.5" />
    <circle cx="8" cy="11" r="0.5" fill="currentColor" />
  </svg>
)

export const BookIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d="M2 3h4.5c1 0 1.5.5 1.5 1.5v9L6.5 12H2V3z" />
    <path d="M14 3H9.5C8.5 3 8 3.5 8 4.5v9l1.5-1.5H14V3z" />
  </svg>
)

export const HomeIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d="M3 6.5L8 2.5L13 6.5V13H10V9.5H6V13H3V6.5Z" />
  </svg>
)

export const XIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <line x1="4" y1="4" x2="12" y2="12" />
    <line x1="12" y1="4" x2="4" y2="12" />
  </svg>
)

export const ChevronDownIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <polyline points="4,6 8,10 12,6" />
  </svg>
)

export const TrophyIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d="M5 2h6v5a3 3 0 0 1-6 0V2z" />
    <path d="M2 2h3v3a1.5 1.5 0 0 1-3 0V2z" />
    <path d="M11 2h3v3a1.5 1.5 0 0 1-3 0V2z" />
    <line x1="8" y1="10" x2="8" y2="13" />
    <line x1="5" y1="13" x2="11" y2="13" />
  </svg>
)

export const MailIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <rect x="1.5" y="3" width="13" height="10" rx="1.5" />
    <path d="M1.5 4.5L8 9l6.5-4.5" />
  </svg>
)

export const CodeBranchIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <circle cx="5" cy="3.5" r="1.5" />
    <circle cx="5" cy="12.5" r="1.5" />
    <circle cx="11" cy="6" r="1.5" />
    <path d="M5 5v6M5 5c0 2 1 3.5 6 1" />
  </svg>
)

export const DiscordIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M13.07 3.26a12.2 12.2 0 0 0-3.02-.94.05.05 0 0 0-.05.02c-.13.23-.27.53-.37.77a11.28 11.28 0 0 0-3.26 0 7.4 7.4 0 0 0-.38-.77.05.05 0 0 0-.05-.02 12.18 12.18 0 0 0-3.02.94.04.04 0 0 0-.02.02C1.03 6.04.54 8.73.8 11.38a.05.05 0 0 0 .02.04 12.3 12.3 0 0 0 3.7 1.87.05.05 0 0 0 .05-.02c.28-.4.54-.81.76-1.25a.05.05 0 0 0-.03-.07 8.1 8.1 0 0 1-1.15-.55.05.05 0 0 1 0-.08c.08-.06.15-.12.23-.17a.05.05 0 0 1 .05 0 8.78 8.78 0 0 0 7.54 0 .05.05 0 0 1 .05 0c.07.06.15.12.23.18a.05.05 0 0 1 0 .08c-.37.21-.75.4-1.15.55a.05.05 0 0 0-.03.07c.22.44.48.85.76 1.24a.05.05 0 0 0 .06.02 12.26 12.26 0 0 0 3.7-1.87.05.05 0 0 0 .02-.03c.3-3.13-.51-5.8-2.14-8.12a.04.04 0 0 0-.02-.02zM5.68 9.8c-.7 0-1.28-.65-1.28-1.44s.57-1.44 1.28-1.44c.72 0 1.3.65 1.28 1.44 0 .8-.57 1.44-1.28 1.44zm4.64 0c-.7 0-1.28-.65-1.28-1.44s.57-1.44 1.28-1.44c.72 0 1.3.65 1.28 1.44 0 .8-.56 1.44-1.28 1.44z" />
  </svg>
)

export const TwitterIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M9.33 6.93L14.25 1H13l-4.27 4.97L5.08 1H.25L5.44 8.78.25 15h1.26l4.54-5.28L9.92 15h4.83L9.33 6.93zM6.66 9.02l-.53-.75L2 2.04h1.8l3.38 4.84.53.75L13 14.02h-1.8L6.66 9.03z" />
  </svg>
)

export const ShieldIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d="M8 1.5L2.5 4v4c0 3.5 2.5 5.5 5.5 6.5 3-1 5.5-3 5.5-6.5V4L8 1.5z" />
  </svg>
)

export const LockIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <rect x="3.5" y="7" width="9" height="7" rx="1" />
    <path d="M5 7V5a3 3 0 0 1 6 0v2" />
  </svg>
)

export const FileTextIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d="M9.5 1.5H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5L9.5 1.5z" />
    <polyline points="9.5,1.5 9.5,5 13,5" />
    <line x1="5.5" y1="8.5" x2="10.5" y2="8.5" />
    <line x1="5.5" y1="11" x2="8.5" y2="11" />
  </svg>
)
