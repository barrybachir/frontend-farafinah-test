'use client'
// components/Navbar.tsx

import { useRouter } from 'next/navigation'

interface NavbarProps {
  username: string
  likeCount: number
}

export default function Navbar({ username, likeCount }: NavbarProps) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <nav style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 58,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(10px)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28,
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14,
        }}>✦</div>
        <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.3px' }}>Gallery</span>
      </div>

      {/* Infos droite */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Compteur de likes */}
        <div style={{
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '5px 14px',
          fontSize: 13,
          color: 'var(--muted)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ color: 'var(--accent2)' }}>♥</span>
          <span id="like-counter">{likeCount} likes</span>
        </div>

        {/* Utilisateur */}
        <div style={{
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '5px 14px',
          fontSize: 13,
          color: 'var(--muted)',
        }}>
          {username}
        </div>

        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '6px 14px',
            color: 'var(--muted)',
            fontSize: 13,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.target as HTMLButtonElement).style.borderColor = 'var(--accent2)'
            ;(e.target as HTMLButtonElement).style.color = 'var(--accent2)'
          }}
          onMouseLeave={e => {
            (e.target as HTMLButtonElement).style.borderColor = 'var(--border)'
            ;(e.target as HTMLButtonElement).style.color = 'var(--muted)'
          }}
        >
          Déconnexion
        </button>
      </div>
    </nav>
  )
}
