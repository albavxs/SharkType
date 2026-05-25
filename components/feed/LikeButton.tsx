'use client'

import { useState } from 'react'
import { useFeedLikes } from '@/hooks/useFeedLikes'
import LikesModal from './LikesModal'

interface LikeButtonProps {
  feedEventId: number
  currentUserId: string | null
}

export default function LikeButton({ feedEventId, currentUserId }: LikeButtonProps) {
  const [showLikesModal, setShowLikesModal] = useState(false)
  const { isLiked, count, toggleLike, likes, error } = useFeedLikes(feedEventId, currentUserId)

  const handleLikeClick = async () => {
    await toggleLike()
  }

  return (
    <>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={handleLikeClick}
          disabled={!currentUserId}
          className="flex items-center gap-1 rounded-lg px-2 py-1 transition-colors"
          style={{
            backgroundColor: isLiked ? 'color-mix(in srgb, var(--main) 16%, transparent)' : 'transparent',
            color: isLiked ? 'var(--main)' : 'var(--sub)',
          }}
          title={!currentUserId ? 'Login to like' : ''}
        >
          <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
          <span className="text-sm font-medium">{count}</span>
        </button>

        {count > 0 && (
          <button
            onClick={() => setShowLikesModal(true)}
            className="text-xs transition-colors hover:underline"
            style={{ color: 'var(--sub)' }}
          >
            {count === 1 ? '1 like' : `${count} likes`}
          </button>
        )}

        {error && (
          <span className="text-xs" style={{ color: 'var(--error, #ff6b6b)' }}>
            {error}
          </span>
        )}
      </div>

      {showLikesModal && (
        <LikesModal
          likes={likes}
          onClose={() => setShowLikesModal(false)}
        />
      )}
    </>
  )
}
