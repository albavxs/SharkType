import type { Track } from '@/data/tracks'
import type { I18nString } from '@/lib/types'

export type MasteryAvailability = 'locked' | 'available' | 'comingSoon' | 'inProgress'

export type TrackAccessSummary = {
  plusEligible: boolean
  hasPremiumNow: boolean
  freeCount: number
  totalCount: number
  premiumCount: number
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

const ALWAYS_MASTERY_CONCEPTS = new Set([
  'conditionals',
  'variables',
  'functions',
  'objects',
  'loops',
  'types',
  'errors',
  'classes',
  'advanced',
])

function localTrackCount(track: Track): number {
  if (track.slots?.length) return track.slots.length
  return track.snippetIds.length
}

export function isMasteryEligible(track: Track, accessSummary?: TrackAccessSummary): boolean {
  if (track.textLanguages) return false
  if (track.section === 'concept') return ALWAYS_MASTERY_CONCEPTS.has(track.id)
  if (track.section === 'focused' || track.section === 'cyberdevops') {
    return (accessSummary?.totalCount ?? 0) > 4
  }

  return false
}

export function toMasteryTrack(input: {
  track: Track
  categoryId: string
  accessSummary?: TrackAccessSummary
  isPlus: boolean
  level: number
}): MasteryTrack {
  const { track, categoryId, accessSummary, isPlus, level } = input
  const challengeCount = Math.max(accessSummary?.premiumCount ?? 0, track.section === 'concept' ? localTrackCount(track) : 0)
  const hasPremiumNow = accessSummary?.hasPremiumNow === true || (track.section === 'concept' && challengeCount > 0)
  const availability: MasteryAvailability = hasPremiumNow
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
    totalStars: challengeCount > 0 ? challengeCount * 3 : undefined,
    earnedStars: 0,
    availability,
  }
}
