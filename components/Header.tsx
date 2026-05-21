'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-red-600">
              Comfyatlas AI
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
                Home
              </Link>
              <Link href="/explore" className="text-gray-700 hover:text-gray-900 font-medium">
                Explore
              </Link>
              {user && (
                <Link href="/create" className="text-gray-700 hover:text-gray-900 font-medium">
                  Create
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/boards"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  My Boards
                </Link>
                <Link
                  href={`/profile/${user.id}`}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
