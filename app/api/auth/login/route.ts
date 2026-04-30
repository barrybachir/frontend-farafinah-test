// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { authenticate, createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Champs manquants.' },
        { status: 400 }
      )
    }

    const result = authenticate(username, password)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      )
    }

    // Créer la session (cookie HTTP-only)
    createSession(result.username)

    return NextResponse.json({ success: true, username: result.username })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Erreur serveur.' },
      { status: 500 }
    )
  }
}
