// app/page.tsx
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default function Home() {
  const username = getSession()
  if (username) redirect('/gallery')
  redirect('/login')
}
