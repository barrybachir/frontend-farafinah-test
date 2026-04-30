// lib/unsplash.ts
// Client léger pour l'API Unsplash

const BASE_URL = 'https://api.unsplash.com'

export interface UnsplashPhoto {
  id: string
  description: string | null
  alt_description: string | null
  urls: {
    regular: string
    small: string
    thumb: string
  }
  user: {
    name: string
    username: string
    profile_image: { small: string }
  }
  width: number
  height: number
  color: string | null
  likes: number
}

export interface UnsplashSearchResult {
  total: number
  total_pages: number
  results: UnsplashPhoto[]
}

type UnsplashPhotoOrder = 'latest' | 'oldest' | 'popular'
type UnsplashSearchOrder = 'relevant' | 'latest'
type UnsplashOrientation = 'landscape' | 'portrait' | 'squarish'

/**
 * Récupère une liste de photos depuis la page d'accueil Unsplash
 */
export async function getPhotos(
  page = 1,
  perPage = 12,
  orderBy: UnsplashPhotoOrder = 'popular'
): Promise<UnsplashPhoto[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY
  if (!key) throw new Error('UNSPLASH_ACCESS_KEY manquant dans .env.local')

  const url = `${BASE_URL}/photos?page=${page}&per_page=${perPage}&order_by=${orderBy}`

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}` },
    next: { revalidate: 300 }, // Cache 5 minutes côté serveur
  })

  if (!res.ok) {
    throw new Error(`Erreur Unsplash: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

/**
 * Recherche des photos par mot-clé
 */
export async function searchPhotos(
  query: string,
  page = 1,
  perPage = 12,
  orientation?: UnsplashOrientation,
  orderBy: UnsplashSearchOrder = 'relevant'
): Promise<UnsplashSearchResult> {
  const key = process.env.UNSPLASH_ACCESS_KEY
  if (!key) throw new Error('UNSPLASH_ACCESS_KEY manquant dans .env.local')

  const params = new URLSearchParams({
    query,
    page: String(page),
    per_page: String(perPage),
    order_by: orderBy,
  })
  if (orientation) params.set('orientation', orientation)

  const url = `${BASE_URL}/search/photos?${params.toString()}`

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}` },
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`Erreur Unsplash: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
