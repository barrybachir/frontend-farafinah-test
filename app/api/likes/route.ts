// app/api/likes/route.ts
// Endpoints pour lire et modifier les likes utilisateur (LevelDB)

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getUserLikes, toggleLike } from '@/lib/db'

// GET /api/likes → retourne tous les IDs likés par l'utilisateur connecté
export async function GET() {
  const username = getSession()
  if (!username) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const likedIds = await getUserLikes(username)
    return NextResponse.json({ likedIds })
  } catch (err) {
    console.error('Erreur GET likes:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/likes → toggle le like d'une photo
export async function POST(req: NextRequest) {
  const username = getSession()
  if (!username) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const { photoId } = await req.json()
    if (!photoId) {
      return NextResponse.json({ error: 'photoId manquant' }, { status: 400 })
    }

    const isNowLiked = await toggleLike(username, photoId)
    return NextResponse.json({ liked: isNowLiked, photoId })
  } catch (err) {
    console.error('Erreur POST likes:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
