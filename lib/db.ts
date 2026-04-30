// lib/db.ts
// Stockage des likes via lowdb — base de données JSON persistante,
// 100% JavaScript, zéro binaire natif, compatible Windows/Linux/macOS.
// Structure du fichier .data/likes.json: { "likes": { "username": ["photoId1", ...] } }

import { join } from 'path'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// Schéma de la base de données
type Schema = {
  likes: Record<string, string[]>
}

const DATA_DIR = join(process.cwd(), '.data')
const DB_FILE = join(DATA_DIR, 'likes.json')

// Singleton: une seule instance partagée par process
let dbInstance: Low<Schema> | null = null

async function getDb(): Promise<Low<Schema>> {
  if (!dbInstance) {
    // Créer le dossier .data/ si nécessaire
    const { mkdirSync } = await import('fs')
    mkdirSync(DATA_DIR, { recursive: true })

    const adapter = new JSONFile<Schema>(DB_FILE)
    dbInstance = new Low<Schema>(adapter, { likes: {} })
    await dbInstance.read()

    // Initialiser la structure si le fichier est vide
    dbInstance.data ??= { likes: {} }
    dbInstance.data.likes ??= {}
  }
  return dbInstance
}

/**
 * Retourne tous les IDs de photos likées par un utilisateur
 */
export async function getUserLikes(username: string): Promise<string[]> {
  const db = await getDb()
  return db.data.likes[username] ?? []
}

/**
 * Vérifie si un utilisateur a liké une photo
 */
export async function hasLiked(username: string, photoId: string): Promise<boolean> {
  const db = await getDb()
  return (db.data.likes[username] ?? []).includes(photoId)
}

/**
 * Ajoute ou supprime un like (toggle)
 * Retourne true si maintenant liké, false si retiré
 */
export async function toggleLike(username: string, photoId: string): Promise<boolean> {
  const db = await getDb()
  const userLikes = db.data.likes[username] ?? []
  const index = userLikes.indexOf(photoId)

  if (index !== -1) {
    // Retirer le like
    userLikes.splice(index, 1)
  } else {
    // Ajouter le like
    userLikes.push(photoId)
  }

  db.data.likes[username] = userLikes
  await db.write() // Persiste dans le fichier JSON

  return index === -1 // true = maintenant liké
}
