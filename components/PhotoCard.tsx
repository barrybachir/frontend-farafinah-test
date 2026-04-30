'use client'
// components/PhotoCard.tsx
// Carte image avec bouton like

import Image from 'next/image'
import { useState } from 'react'
import type { UnsplashPhoto } from '@/lib/unsplash'

interface PhotoCardProps {
  photo: UnsplashPhoto
  initialLiked: boolean
  onLikeChange?: (liked: boolean) => void
}

export default function PhotoCard({ photo, initialLiked, onLikeChange }: PhotoCardProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [loading, setLoading] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  async function handleLike(e: React.MouseEvent) {
    e.stopPropagation()
    if (loading) return
    setLoading(true)

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId: photo.id }),
      })
      const data = await res.json()
      setLiked(data.liked)
      onLikeChange?.(data.liked)
    } catch (err) {
      console.error('Erreur like:', err)
    } finally {
      setLoading(false)
    }
  }

  const alt = photo.alt_description || photo.description || 'Photo Unsplash'

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      overflow: 'hidden',
      transition: 'transform 0.2s, border-color 0.2s',
      cursor: 'pointer',
    }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-4px)'
        el.style.borderColor = 'rgba(108,99,255,0.4)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(0)'
        el.style.borderColor = 'var(--border)'
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: photo.color || 'var(--surface2)' }}>
        {/* Skeleton */}
        {!imgLoaded && (
          <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />
        )}
        <Image
          src={photo.urls.small}
          alt={alt}
          fill
          style={{ objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onLoad={() => setImgLoaded(true)}
        />
      </div>

      {/* Infos */}
      <div style={{
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}>
        {/* Auteur */}
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontSize: 12,
            color: 'var(--muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {photo.user.name}
          </p>
        </div>

        {/* Bouton like */}
        <button
          onClick={handleLike}
          disabled={loading}
          title={liked ? 'Retirer le like' : 'Liker cette photo'}
          style={{
            background: 'none',
            border: 'none',
            cursor: loading ? 'wait' : 'pointer',
            padding: '4px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            color: liked ? 'var(--accent2)' : 'var(--muted)',
            fontSize: 12,
            borderRadius: 6,
            transition: 'color 0.15s',
            flexShrink: 0,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={16} height={16}
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={2}
            style={{
              transition: 'transform 0.15s',
              transform: liked ? 'scale(1.2)' : 'scale(1)',
            }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
