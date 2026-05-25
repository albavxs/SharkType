'use client'

import Link from 'next/link'
import type { Like } from '@/hooks/useFeedLikes'

interface LikesModalProps {
  likes: Like[]
  onClose: () => void
}

export default function LikesModal({ likes, onClose }: LikesModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-4"
        style={{
          borderColor: 'color-mix(in srgb, var(--sub) 18%, transparent)',
          backgroundColor: 'var(--bg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
            ❤️ Likes ({likes.length})
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 transition-colors hover:bg-opacity-50"
            style={{ backgroundColor: 'color-mix(in srgb, var(--sub) 10%, transparent)' }}
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {likes.length === 0 ? (
            <p className="text-center text-sm" style={{ color: 'var(--sub)' }}>
              No likes yet
            </p>
          ) : (
            likes.map((like) => (
              <Link
                key={like.userId}
                href={`/profile/${like.username}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-opacity-50"
                style={{ backgroundColor: 'color-mix(in srgb, var(--sub-alt) 40%, transparent)' }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--main) 16%, transparent)', color: 'var(--main)' }}
                >
                  {like.avatarUrl ? (
                    <img src={like.avatarUrl} alt={like.username} className="h-full w-full object-cover" />
                  ) : (
                    like.username.slice(0, 1).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                    {like.username}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--sub)' }}>
                    {new Date(like.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
