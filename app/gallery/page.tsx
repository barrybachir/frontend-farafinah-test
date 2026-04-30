// app/gallery/page.tsx
// Page galerie - protégée par requireAuth()

import { requireAuth } from '@/lib/auth'
import { getPhotos } from '@/lib/unsplash'
import type { UnsplashPhoto } from '@/lib/unsplash'
import { getUserLikes } from '@/lib/db'
import GalleryShell from '@/components/GalleryShell'

export default async function GalleryPage() {
  // Protection de la route: redirige vers /login si non connecté
  const username = requireAuth()

  // Chargement initial en parallèle 
  let initialPhotos: UnsplashPhoto[] = []
  let initialLikedIds: string[] = []
  let loadError = ''

  try {
    const [photos, likedIds] = await Promise.all([
      getPhotos(1, 12),
      getUserLikes(username),
    ])
    initialPhotos = photos
    initialLikedIds = likedIds
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Erreur de chargement'
    console.error('Erreur galerie:', err)
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <GalleryShell
        username={username}
        initialPhotos={initialPhotos}
        initialLikedIds={initialLikedIds}
      />
    </div>
  )
}
