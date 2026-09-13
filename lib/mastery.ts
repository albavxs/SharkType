import type { Track } from '@/data/tracks'
import type { I18nString } from '@/lib/types'

export type MasteryAvailability = 'locked' | 'available' | 'comingSoon' | 'inProgress'

export type TrackMasterySummary = {
  eligible: boolean
  available: boolean
  challengeCount: number
  totalStars: number
}

export type TrackBaseUnit = {
  key: string
  snippetIds: string[]
}

export type TrackBaseSummary = {
  totalUnits: number
  units: TrackBaseUnit[]
}

export interface MasteryTrack {
  id: string
  slug: string
  title: I18nString
  description: I18nString
  categoryId: string
  masteryLevel?: number
  challengeCount: number
  totalStars?: number
  earnedStars?: number
  progress?: number
  availability: MasteryAvailability
}

export interface TrackCategory {
  id: string
  title: I18nString
  description: I18nString
  tracks: Track[]
  mastery?: {
    eligible: boolean
    tracks: MasteryTrack[]
    totalChallenges: number
    totalStars?: number
  }
}

export function isMasteryEligible(summary?: TrackMasterySummary): boolean {
  return summary?.eligible === true
}

export function toMasteryTrack(input: {
  track: Track
  categoryId: string
  masterySummary?: TrackMasterySummary
  isPlus: boolean
  level: number
}): MasteryTrack {
  const { track, categoryId, masterySummary, isPlus, level } = input
  const challengeCount = masterySummary?.challengeCount ?? 0
  const hasMasteryNow = masterySummary?.available === true && challengeCount > 0
  const availability: MasteryAvailability = hasMasteryNow
    ? isPlus
      ? 'available'
      : 'locked'
    : 'comingSoon'

  return {
    id: `${track.id}-mastery`,
    slug: track.id,
    title: track.name,
    description: track.description,
    categoryId,
    masteryLevel: level,
    challengeCount,
    totalStars: masterySummary?.totalStars ?? 0,
    earnedStars: 0,
    availability,
  }
}
