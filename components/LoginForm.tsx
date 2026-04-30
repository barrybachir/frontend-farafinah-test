'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Mail } from 'lucide-react'
import { FaGoogle, FaApple, FaFacebook } from "react-icons/fa"

export default function LoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!username.trim() || !password) {
      setError('Veuillez remplir tous les champs.')
      return
    }

    startTransition(async () => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      })

      const data = await res.json()

      if (data.success) {
        router.push('/gallery')
        router.refresh()
      } else {
        setError(data.error)
      }
    })
  }

  return (
    <div
      className="w-full max-w-[460px] bg-white rounded-[28px] px-8 py-8 shadow-sm relative z-10"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-[30px] font-bold text-[#222] mb-2">
          Login Your Account
        </h1>

        <p className="text-[#666] text-base leading-relaxed">
          Hey, Enter your details to get sign in
        </p>

        <p className="text-[#666] text-base">
          to your account
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email */}
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Email address"
            autoComplete="username"
            className="
              w-full
              h-12
              border
              border-[#e7e7e7]
              rounded-lg
              px-5
              pr-12
              text-black
              text-[15px]
              outline-none
              placeholder:text-[#b8b8b8]
            "
          />

          <Mail
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passcode"
            autoComplete="current-password"
            className="
              w-full
              h-12
              border
              border-[#e7e7e7]
              rounded-lg
              text-black
              px-5
              pr-12
              text-[15px]
              outline-none
              placeholder:text-[#b8b8b8]
            "
          />

         
        </div>

        {/* Help text */}
        <p className="text-sm font-medium text-[#333] pt-0.5">
          Having trouble in sign in?
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="
            w-full
            h-12
            rounded-lg
            bg-[#efc078]
            text-black
            font-semibold
            text-[17px]
            transition
            hover:opacity-90
            disabled:opacity-60
          "
        >
          {isPending ? 'Connexion...' : 'Sign in'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-5">
        <div className="flex-1 border-t border-[#e8e8e8]" />
        <span className="text-sm text-gray-400">
          Or Sign in with
        </span>
        <div className="flex-1 border-t border-[#e8e8e8]" />
      </div>

      {/* Social buttons */}
      <div className="grid grid-cols-3 gap-3">
      <button className="flex items-center justify-center gap-2 h-12 rounded-lg border border-[#e7e7e7] text-sm font-medium text-black">
        <FaGoogle className="text-black" />
        Google
      </button>

      <button className="flex items-center justify-center gap-2 h-12 rounded-lg border border-[#e7e7e7] text-sm font-medium text-black">
        <FaApple className="text-black" />
        Apple ID
      </button>

      <button className="flex items-center justify-center gap-2 h-12 rounded-lg border border-[#e7e7e7] text-sm font-medium text-black">
        <FaFacebook className="text-black" />
        Facebook
      </button>
    </div>

      {/* Footer */}
      <div className="text-center mt-6 text-sm text-gray-400">
        Not Registered Yet?{' '}
        <span className="text-[#efc078] font-semibold cursor-pointer">
          Create an account
        </span>
      </div>
    </div>
  )
}