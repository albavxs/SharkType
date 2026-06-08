import type { I18nString } from '@/lib/types'

export type RankTierId =
  | 'unranked'
  | 'iron'
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond'
  | 'ascendant'
  | 'immortal'
  | 'radiant'

export interface RankTierDefinition {
  id: RankTierId
  name: I18nString
  color: string
  gradient: string
  divisions: number
}

export interface RankState {
  tierId: RankTierId
  tierName: I18nString
  color: string
  gradient: string
  division: number | null
  score: number
  minScore: number
  maxScore: number | null
  progressPercent: number
  label: I18nString
}

const DIVISION_SCORE_SPAN = 100

const RANK_TIERS: RankTierDefinition[] = [
  {
    id: 'unranked',
    name: { pt: 'Sem rank', en: 'Unranked' },
    color: '#6b7280',
    gradient: 'linear-gradient(135deg, #1f2937 0%, #6b7280 100%)',
    divisions: 0,
  },
  {
    id: 'iron',
    name: { pt: 'Ferro', en: 'Iron' },
    color: '#7c6f64',
    gradient: 'linear-gradient(135deg, #2f241f 0%, #7c6f64 100%)',
    divisions: 3,
  },
  {
    id: 'bronze',
    name: { pt: 'Bronze', en: 'Bronze' },
    color: '#c17a45',
    gradient: 'linear-gradient(135deg, #4a2b1d 0%, #c17a45 100%)',
    divisions: 3,
  },
  {
    id: 'silver',
    name: { pt: 'Prata', en: 'Silver' },
    color: '#b8c0cc',
    gradient: 'linear-gradient(135deg, #3f4958 0%, #b8c0cc 100%)',
    divisions: 3,
  },
  {
    id: 'gold',
    name: { pt: 'Ouro', en: 'Gold' },
    color: '#f5c65c',
    gradient: 'linear-gradient(135deg, #6d5019 0%, #f5c65c 100%)',
    divisions: 3,
  },
  {
    id: 'platinum',
    name: { pt: 'Platina', en: 'Platinum' },
    color: '#54d4c8',
    gradient: 'linear-gradient(135deg, #0f5254 0%, #54d4c8 100%)',
    divisions: 3,
  },
  {
    id: 'diamond',
    name: { pt: 'Diamante', en: 'Diamond' },
    color: '#7ec4ff',
    gradient: 'linear-gradient(135deg, #19416f 0%, #7ec4ff 100%)',
    divisions: 3,
  },
  {
    id: 'ascendant',
    name: { pt: 'Ascendente', en: 'Ascendant' },
    color: '#5edc96',
    gradient: 'linear-gradient(135deg, #174d2d 0%, #5edc96 100%)',
    divisions: 3,
  },
  {
    id: 'immortal',
    name: { pt: 'Imortal', en: 'Immortal' },
    color: '#ff4fa3',
    gradient: 'linear-gradient(135deg, #5e163d 0%, #ff4fa3 100%)',
    divisions: 3,
  },
  {
    id: 'radiant',
    name: { pt: 'Radiante', en: 'Radiant' },
    color: '#ffd86b',
    gradient: 'linear-gradient(135deg, #7d4d00 0%, #ffd86b 100%)',
    divisions: 0,
  },
]

const DIVISIONAL_TIERS = RANK_TIERS.filter((tier) => tier.divisions > 0)
const MAX_DIVISIONAL_SCORE = DIVISIONAL_TIERS.reduce(
  (total, tier) => total + tier.divisions * DIVISION_SCORE_SPAN,
  0
)

function buildLabel(tier: RankTierDefinition, division: number | null): I18nString {
  if (division === null) return tier.name
  return {
    pt: `${tier.name.pt} ${division}`,
    en: `${tier.name.en} ${division}`,
  }
}

export function getRankFromScore(score: number, totalSessions = 0): RankState {
  if (totalSessions <= 0 || score <= 0) {
    const tier = RANK_TIERS[0]
    const normalizedScore = Math.max(0, score)
    return {
      tierId: tier.id,
      tierName: tier.name,
      color: tier.color,
      gradient: tier.gradient,
      division: null,
      score: normalizedScore,
      minScore: 0,
      maxScore: DIVISION_SCORE_SPAN,
      progressPercent: Math.min(100, Math.max(0, Math.round((normalizedScore / DIVISION_SCORE_SPAN) * 100))),
      label: tier.name,
    }
  }

  if (score > MAX_DIVISIONAL_SCORE) {
    const tier = RANK_TIERS[RANK_TIERS.length - 1]
    return {
      tierId: tier.id,
      tierName: tier.name,
      color: tier.color,
      gradient: tier.gradient,
      division: null,
      score,
      minScore: MAX_DIVISIONAL_SCORE + 1,
      maxScore: null,
      progressPercent: 100,
      label: tier.name,
    }
  }

  let cursor = 1

  for (const tier of DIVISIONAL_TIERS) {
    for (let division = 1; division <= tier.divisions; division++) {
      const minScore = cursor
      const maxScore = cursor + DIVISION_SCORE_SPAN - 1
      if (score >= minScore && score <= maxScore) {
        const span = Math.max(1, maxScore - minScore)
        const progressPercent = Math.min(
          100,
          Math.max(0, Math.round(((score - minScore) / span) * 100))
        )

        return {
          tierId: tier.id,
          tierName: tier.name,
          color: tier.color,
          gradient: tier.gradient,
          division,
          score,
          minScore,
          maxScore,
          progressPercent,
          label: buildLabel(tier, division),
        }
      }
      cursor += DIVISION_SCORE_SPAN
    }
  }

  const tier = RANK_TIERS[RANK_TIERS.length - 1]
  return {
    tierId: tier.id,
    tierName: tier.name,
    color: tier.color,
    gradient: tier.gradient,
    division: null,
    score,
    minScore: MAX_DIVISIONAL_SCORE + 1,
    maxScore: null,
    progressPercent: 100,
    label: tier.name,
  }
}
