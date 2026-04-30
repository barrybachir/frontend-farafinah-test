// app/api/photos/route.ts
// Proxy pour l'API Unsplash (masque la clé API côté serveur)

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getPhotos, searchPhotos } from '@/lib/unsplash'

export async function GET(req: NextRequest) {
  // Vérifier l'authentification
  const username = getSession()
  if (!username) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const perPage = parseInt(searchParams.get('per_page') ?? '12', 10)
  const query = searchParams.get('query')
  const orientation = searchParams.get('orientation')
  const sort = searchParams.get('sort')

  const safeOrientation =
    orientation === 'landscape' || orientation === 'portrait' || orientation === 'squarish'
      ? orientation
      : undefined
  const safePhotoSort = sort === 'latest' || sort === 'oldest' || sort === 'popular' ? sort : 'popular'
  const safeSearchSort = sort === 'latest' ? 'latest' : 'relevant'

  try {
    if (query) {
      const data = await searchPhotos(query, page, perPage, safeOrientation, safeSearchSort)
      return NextResponse.json(data)
    } else {
      const photos = await getPhotos(page, perPage, safePhotoSort)
      return NextResponse.json(photos)
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
