/**
 * Tiers visuais por level. Usado em ProfileHeader, BadgeGrid, FeedItem.
 *
 * Bronze    1-5
 * Silver    6-10
 * Gold      11-15
 * Platinum  16-20
 * Diamond   21+
 */

export type TierId = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'

export interface Tier {
  id: TierId
  name: { pt: string; en: string }
  /** Cor principal (borda, accent) */
  color: string
  /** Gradient pro banner do perfil */
  gradient: string
}

const TIERS: Tier[] = [
  {
    id: 'bronze',
    name: { pt: 'Bronze', en: 'Bronze' },
    color: '#cd7f32',
    gradient: 'linear-gradient(135deg, #8b4513 0%, #cd7f32 100%)',
  },
  {
    id: 'silver',
    name: { pt: 'Prata', en: 'Silver' },
    color: '#c0c0c0',
    gradient: 'linear-gradient(135deg, #707070 0%, #c0c0c0 100%)',
  },
  {
    id: 'gold',
    name: { pt: 'Ouro', en: 'Gold' },
    color: '#ffd700',
    gradient: 'linear-gradient(135deg, #b8860b 0%, #ffd700 100%)',
  },
  {
    id: 'platinum',
    name: { pt: 'Platina', en: 'Platinum' },
    color: '#7fffd4',
    gradient: 'linear-gradient(135deg, #2e8b8b 0%, #7fffd4 100%)',
  },
  {
    id: 'diamond',
    name: { pt: 'Diamante', en: 'Diamond' },
    color: '#b9f2ff',
    gradient: 'linear-gradient(135deg, #4682b4 0%, #b9f2ff 100%)',
  },
]

export function getTierByLevel(level: number): Tier {
  if (level >= 21) return TIERS[4]
  if (level >= 16) return TIERS[3]
  if (level >= 11) return TIERS[2]
  if (level >= 6) return TIERS[1]
  return TIERS[0]
}
