// lib/auth.ts
// Gestion des utilisateurs et sessions

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Base d'utilisateurs (en production: utiliser une vraie DB + mots de passe hashés)
const USERS: Record<string, { password: string; active: boolean }> = {
  muser1: { password: 'mpassword1', active: true },
  muser2: { password: 'mpassword2', active: true },
  muser3: { password: 'mpassword3', active: false }, // compte bloqué
}

export type AuthResult =
  | { success: true; username: string }
  | { success: false; error: string }

/**
 * Vérifie les identifiants et retourne le résultat
 */
export function authenticate(username: string, password: string): AuthResult {
  const user = USERS[username]

  if (!user || user.password !== password) {
    return { success: false, error: 'Informations de connexion invalides.' }
  }

  if (!user.active) {
    return { success: false, error: 'Ce compte a été bloqué.' }
  }

  return { success: true, username }
}

/**
 * Crée une session en stockant l'utilisateur dans un cookie HTTP-only
 */
export function createSession(username: string) {
  // En production: utiliser un token JWT signé avec SESSION_SECRET
  // Ici on encode simplement en base64 pour la démo
  const sessionToken = Buffer.from(
    JSON.stringify({ username, createdAt: Date.now() })
  ).toString('base64')

  cookies().set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: '/',
  })
}

/**
 * Supprime la session (déconnexion)
 */
export function destroySession() {
  cookies().delete('session')
}

/**
 * Retourne l'utilisateur connecté ou null
 */
export function getSession(): string | null {
  try {
    const cookie = cookies().get('session')
    if (!cookie) return null

    const decoded = JSON.parse(Buffer.from(cookie.value, 'base64').toString())
    return decoded.username ?? null
  } catch {
    return null
  }
}

/**
 * Middleware de protection: redirige vers /login si non connecté
 */
export function requireAuth(): string {
  const username = getSession()
  if (!username) redirect('/login')
  return username
}
