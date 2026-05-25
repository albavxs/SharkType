'use client'

import { useState, useCallback, useEffect } from 'react'

export interface Like {
  userId: string
  username: string
  avatarUrl: string | null
  createdAt: string
}

interface UseFeedLikesState {
  likes: Like[]
  count: number
  isLiked: boolean
  isLoading: boolean
  error: string | null
}

export function useFeedLikes(feedEventId: number, currentUserId: string | null) {
  const [state, setState] = useState<UseFeedLikesState>({
    likes: [],
    count: 0,
    isLiked: false,
    isLoading: false,
    error: null,
  })

  // Buscar likes ao montar
  useEffect(() => {
    if (!feedEventId) return

    const fetchLikes = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }))
        const res = await fetch(`/api/feed/${feedEventId}/likes`)
        if (!res.ok) throw new Error('Failed to fetch likes')

        const data = await res.json()
        const isLiked = currentUserId
          ? data.likes.some((like: Like) => like.userId === currentUserId)
          : false

        setState(prev => ({
          ...prev,
          likes: data.likes,
          count: data.count,
          isLiked,
          isLoading: false,
        }))
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Failed to fetch likes',
          isLoading: false,
        }))
      }
    }

    fetchLikes()
  }, [feedEventId, currentUserId])

  // Toggle like com optimistic update
  const toggleLike = useCallback(async () => {
    if (!currentUserId) {
      setState(prev => ({ ...prev, error: 'Authentication required' }))
      return
    }

    const wasLiked = state.isLiked
    const previousCount = state.count

    // Optimistic update
    setState(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      count: !prev.isLiked ? prev.count + 1 : Math.max(0, prev.count - 1),
    }))

    try {
      const method = wasLiked ? 'DELETE' : 'POST'
      const res = await fetch(`/api/feed/${feedEventId}/like`, { method })

      if (!res.ok) {
        // Reverter optimistic update em caso de erro
        setState(prev => ({
          ...prev,
          isLiked: wasLiked,
          count: previousCount,
          error: 'Failed to update like',
        }))
        return
      }

      // Refetch likes para sincronizar
      const likesRes = await fetch(`/api/feed/${feedEventId}/likes`)
      if (likesRes.ok) {
        const data = await likesRes.json()
        setState(prev => ({
          ...prev,
          likes: data.likes,
          count: data.count,
          isLiked: data.likes.some((like: Like) => like.userId === currentUserId),
          error: null,
        }))
      }
    } catch (err) {
      // Reverter optimistic update em caso de erro
      setState(prev => ({
        ...prev,
        isLiked: wasLiked,
        count: previousCount,
        error: err instanceof Error ? err.message : 'Failed to update like',
      }))
    }
  }, [feedEventId, currentUserId, state.isLiked, state.count])

  return {
    ...state,
    toggleLike,
  }
}
