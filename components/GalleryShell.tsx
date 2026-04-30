'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Gallery from '@/components/Gallery'
import type { UnsplashPhoto } from '@/lib/unsplash'

interface GalleryShellProps {
  username: string
  initialPhotos: UnsplashPhoto[]
  initialLikedIds: string[]
}

export default function GalleryShell({
  username,
  initialPhotos,
  initialLikedIds,
}: GalleryShellProps) {
  const [likeCount, setLikeCount] = useState(initialLikedIds.length)

  return (
    <>
      <Navbar username={username} likeCount={likeCount} />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 1.5rem 3rem' }}>
        {/* En-tete */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px' }}>
            Galerie d'images
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
            Decouvrez des photos inspirantes · Likez vos preferees
          </p>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
            Source des photos :{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent)', textDecoration: 'none' }}
            >
              Unsplash
            </a>
          </p>
        </div>

        <Gallery
          initialPhotos={initialPhotos}
          initialLikedIds={initialLikedIds}
          onLikeCountChange={setLikeCount}
        />
      </main>
    </>
  )
}
