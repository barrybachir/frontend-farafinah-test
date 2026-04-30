'use client'
// components/Gallery.tsx
// Grille de photos avec infinite scroll et recherche

import { useState, useEffect, useRef, useCallback } from 'react'
import PhotoCard from './PhotoCard'
import type { UnsplashPhoto } from '@/lib/unsplash'

interface GalleryProps {
  initialPhotos: UnsplashPhoto[]
  initialLikedIds: string[]
  onLikeCountChange?: (count: number) => void
}

export default function Gallery({ initialPhotos, initialLikedIds, onLikeCountChange }: GalleryProps) {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>(initialPhotos)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set(initialLikedIds))
  const [page, setPage] = useState(2)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [query, setQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [orientationFilter, setOrientationFilter] = useState<'all' | 'landscape' | 'portrait' | 'squarish'>('all')
  const [sortFilter, setSortFilter] = useState<'popular' | 'latest' | 'oldest'>('popular')
  const [error, setError] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const firstSearchEffectRef = useRef(true)

  // Compte de likes courant
  const likeCount = likedIds.size

  // Notifier le parent quand le compteur change
  useEffect(() => {
    onLikeCountChange?.(likeCount)
  }, [likeCount, onLikeCountChange])

  function applyLocalFilters(list: UnsplashPhoto[]) {
    if (orientationFilter === 'all') return list

    return list.filter(photo => {
      if (orientationFilter === 'landscape') return photo.width > photo.height
      if (orientationFilter === 'portrait') return photo.height > photo.width
      return photo.width === photo.height
    })
  }

  const fetchPhotos = useCallback(
    async (nextPage: number, nextQuery: string) => {
      const params = new URLSearchParams({
        page: String(nextPage),
        per_page: '12',
        sort: sortFilter,
      })
      if (nextQuery) params.set('query', nextQuery)
      if (orientationFilter !== 'all') params.set('orientation', orientationFilter)

      const res = await fetch(`/api/photos?${params}`)
      if (!res.ok) throw new Error('Erreur chargement')

      const data = await res.json()
      const rawPhotos: UnsplashPhoto[] = nextQuery ? data.results : data
      return nextQuery ? rawPhotos : applyLocalFilters(rawPhotos)
    },
    [orientationFilter, sortFilter]
  )

  // Charger plus de photos
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    setError(null)

    try {
      const newPhotos = await fetchPhotos(page, query)
      if (!newPhotos || newPhotos.length === 0) {
        setHasMore(false)
      } else {
        setPhotos(prev => [...prev, ...newPhotos])
        setPage(prev => prev + 1)
        if (newPhotos.length < 12) setHasMore(false)
      }
    } catch {
      setError('Impossible de charger plus de photos.')
    } finally {
      setLoading(false)
    }
  }, [fetchPhotos, hasMore, loading, page, query])

  // Infinite scroll: Intersection Observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) loadMore()
      },
      { threshold: 0.1 }
    )

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [loadMore])

  async function runSearch(nextQuery: string) {
    setQuery(nextQuery)
    setPage(2)
    setHasMore(true)
    setError(null)
    setLoading(true)

    try {
      const newPhotos = await fetchPhotos(1, nextQuery)
      setPhotos(newPhotos || [])
      if (!newPhotos || newPhotos.length < 12) setHasMore(false)
    } catch {
      setError('Erreur lors de la recherche.')
    } finally {
      setLoading(false)
    }
  }

  // Recherche automatique (debounce)
  useEffect(() => {
    if (firstSearchEffectRef.current) {
      firstSearchEffectRef.current = false
      return
    }

    const trimmed = searchInput.trim()
    const timeout = setTimeout(() => {
      void runSearch(trimmed)
    }, 350)

    return () => clearTimeout(timeout)
  }, [searchInput, orientationFilter, sortFilter, fetchPhotos])

  // Toggle like local
  function handleLikeChange(photoId: string, liked: boolean) {
    setLikedIds(prev => {
      const next = new Set(prev)
      if (liked) next.add(photoId)
      else next.delete(photoId)
      return next
    })
  }

  return (
    <div>
      {/* Barre de recherche */}
      <form onSubmit={e => e.preventDefault()} style={{ marginBottom: '1.5rem', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Rechercher des photos ..."
          style={{
            flex: '1 1 280px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '10px 16px',
            color: 'var(--text)',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <select
          value={orientationFilter}
          onChange={e => setOrientationFilter(e.target.value as 'all' | 'landscape' | 'portrait' | 'squarish')}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '10px 12px',
            color: 'var(--text)',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          <option value="all">Orientation: Toutes</option>
          <option value="landscape">Paysage</option>
          <option value="portrait">Portrait</option>
          <option value="squarish">Carre</option>
        </select>
        <select
          value={sortFilter}
          onChange={e => setSortFilter(e.target.value as 'popular' | 'latest' | 'oldest')}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '10px 12px',
            color: 'var(--text)',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          <option value="popular">Tri: Populaire</option>
          <option value="latest">Recent</option>
          <option value="oldest">Ancien</option>
        </select>
        {query && (
          <button
            type="button"
            onClick={() => setSearchInput('')}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '10px 14px',
              color: 'var(--muted)',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            ✕ Effacer
          </button>
        )}
      </form>

      {/* Résultat de recherche */}
      {query && (
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '1rem' }}>
          Résultats pour : <strong style={{ color: 'var(--text)' }}>{query}</strong>
          {' '}— {photos.length} photos
        </p>
      )}

      {/* Message d'erreur */}
      {error && (
        <div style={{
          background: 'rgba(255,101,132,0.1)',
          border: '1px solid rgba(255,101,132,0.3)',
          borderRadius: 10,
          padding: '12px 16px',
          fontSize: 13,
          color: '#ff8fa5',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

      {/* Grille de photos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 16,
      }}>
        {photos.map((photo, i) => (
          <div key={photo.id} className="animate-fade-in" style={{ animationDelay: `${(i % 12) * 30}ms` }}>
            <PhotoCard
              photo={photo}
              initialLiked={likedIds.has(photo.id)}
              onLikeChange={liked => handleLikeChange(photo.id, liked)}
            />
          </div>
        ))}
      </div>

      {/* Skeletons de chargement */}
      {loading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
          marginTop: 16,
        }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              overflow: 'hidden',
            }}>
              <div className="skeleton" style={{ aspectRatio: '4/3' }} />
              <div style={{ padding: 12 }}>
                <div className="skeleton" style={{ height: 14, borderRadius: 4, width: '60%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sentinelle pour infinite scroll */}
      <div ref={sentinelRef} style={{ height: 40, marginTop: 16 }} />

      {/* Fin de liste */}
      {!hasMore && photos.length > 0 && (
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', padding: '1rem' }}>
          — Toutes les photos ont été chargées —
        </p>
      )}

      {/* Aucun résultat */}
      {!loading && photos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          <div style={{ fontSize: 40, marginBottom: '1rem' }}>🔍</div>
          <p>Aucune photo trouvée pour "{query}"</p>
        </div>
      )}
    </div>
  )
}
