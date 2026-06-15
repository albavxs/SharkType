'use client'

import { useEffect, useRef, useState } from 'react'
import { UserIcon } from '@/components/icons'
import { t, type Locale } from '@/lib/i18n'
import { useAuth } from '@/hooks/useAuth'
import type { PublicProfile } from '@/lib/server/profile-store'
import { sanitizeUsername } from '@/lib/usernames'

interface ProfileEditorCardProps {
  profile: PublicProfile
  locale: Locale
  onAvatarUpdated: (avatarUrl: string | null) => void
  onSaved: (payload: {
    username: string
    displayName: string | null
    avatarUrl: string | null
    bio: string | null
  }) => void
}

export default function ProfileEditorCard({
  profile,
  locale,
  onAvatarUpdated,
  onSaved,
}: ProfileEditorCardProps) {
  const { updateProfile } = useAuth()
  const [username, setUsername] = useState(profile.username)
  const [displayName, setDisplayName] = useState(profile.displayName ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setUsername(profile.username)
    setDisplayName(profile.displayName ?? '')
    setAvatarUrl(profile.avatarUrl ?? '')
    setBio(profile.bio ?? '')
  }, [profile])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setIsSaving(true)

    const normalizedUsername = sanitizeUsername(username)
    const nextPayload = {
      username: normalizedUsername,
      displayName: displayName || null,
      avatarUrl: avatarUrl || null,
      bio: bio || null,
    }

    const result = await updateProfile(nextPayload)
    setIsSaving(false)

    if (result.error) {
      setError(result.error)
      return
    }

    onSaved(nextPayload)
    setMessage(t('profileSuccess', locale))
  }

  async function compressImage(file: File, maxBytes: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(objectUrl)
        const canvas = document.createElement('canvas')
        const MAX_DIM = 512
        let { width, height } = img
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) { height = Math.round(height * MAX_DIM / width); width = MAX_DIM }
          else { width = Math.round(width * MAX_DIM / height); height = MAX_DIM }
        }
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
        let quality = 0.9
        const attempt = () => {
          canvas.toBlob(blob => {
            if (!blob) { reject(new Error('Compression failed')); return }
            if (blob.size <= maxBytes || quality <= 0.3) { resolve(blob); return }
            quality -= 0.1
            attempt()
          }, 'image/jpeg', quality)
        }
        attempt()
      }
      img.onerror = () => reject(new Error('Could not load image'))
      img.src = objectUrl
    })
  }

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    setMessage(null)
    setIsUploading(true)

    try {
      const compressed = await compressImage(file, 1.5 * 1024 * 1024)
      const compressedFile = new File([compressed], 'avatar.jpg', { type: 'image/jpeg' })

      const formData = new FormData()
      formData.append('file', compressedFile)
      const response = await fetch('/api/me/avatar', { method: 'POST', body: formData })

      const text = await response.text()
      let payload: { avatarUrl?: string; error?: string }
      try {
        payload = JSON.parse(text)
      } catch {
        setError('Erro inesperado no servidor.')
        return
      }

      if (!response.ok || !payload.avatarUrl) {
        setError(payload.error ?? t('uploadAvatarError', locale))
        return
      }

      setAvatarUrl(payload.avatarUrl)
      onAvatarUpdated(payload.avatarUrl)
      setMessage(locale === 'pt' ? 'Foto atualizada.' : 'Picture updated.')
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : t('uploadAvatarError', locale))
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <form
      className="space-y-4 rounded-[2rem] border p-5 sm:p-7"
      onSubmit={handleSubmit}
      style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sub-alt) 70%, transparent)' }}
    >
      <div className="flex items-center gap-2">
        <UserIcon size={18} />
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
          {t('profileEditing', locale)}
        </h2>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full text-2xl font-semibold transition-all duration-150 hover:brightness-110 disabled:opacity-50"
            style={{ backgroundColor: 'color-mix(in srgb, var(--main) 16%, transparent)', color: 'var(--main)' }}
            title={t('uploadAvatar', locale)}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={username} className="h-full w-full object-cover" />
            ) : (
              username.slice(0, 1).toUpperCase()
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarUpload}
            className="hidden"
          />
          <span className="text-[10px]" style={{ color: 'var(--sub)' }}>
            {isUploading ? t('authWorking', locale) : t('uploadAvatarHint', locale)}
          </span>
        </div>

        <div className="flex-1 space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
              {t('authUsername', locale)}
            </span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
              style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--bg) 42%, transparent)', color: 'var(--text)' }}
            />
            <p className="text-xs leading-6" style={{ color: 'var(--sub)' }}>
              {t('authUsernameHint', locale)}
            </p>
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
              {t('profileDisplayName', locale)}
            </span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
              style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--bg) 42%, transparent)', color: 'var(--text)' }}
            />
          </label>
        </div>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
          {t('profileBio', locale)}
        </span>
        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          rows={4}
          placeholder={t('profileBioPlaceholder', locale)}
          className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
          style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--bg) 42%, transparent)', color: 'var(--text)' }}
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
          {t('profileAvatar', locale)}
        </span>
        <input
          value={avatarUrl}
          onChange={(event) => setAvatarUrl(event.target.value)}
          placeholder="https://example.com/avatar.png"
          className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
          style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--bg) 42%, transparent)', color: 'var(--text)' }}
        />
        <p className="text-xs" style={{ color: 'var(--sub)' }}>
          {locale === 'pt' ? 'Ou use o upload acima como fallback manual.' : 'Or use the upload above as the manual fallback.'}
        </p>
      </label>

      {error ? (
        <div className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 14%, transparent)', color: 'var(--error)' }}>
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)', color: 'var(--main)' }}>
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSaving}
        className="rounded-2xl px-5 py-3 text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50"
        style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
      >
        {isSaving ? t('authWorking', locale) : t('profileSave', locale)}
      </button>
    </form>
  )
}