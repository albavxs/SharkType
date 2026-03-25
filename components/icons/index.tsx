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
