'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Board } from '@/types/database'

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBoards(data || [])
    } catch (error) {
      console.error('Error fetching boards:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Boards</h1>
        <Link
          href="/boards/create"
          className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700"
        >
          Create Board
        </Link>
      </div>

      {boards.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            No boards yet
          </h2>
          <p className="text-gray-600 mb-8">
            Create your first board to organize your pins
          </p>
          <Link
            href="/boards/create"
            className="inline-block px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 font-medium"
          >
            Create Board
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/boards/${board.id}`}
              className="group"
            >
              <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden mb-3">
                {board.cover_image_url ? (
                  <img
                    src={board.cover_image_url}
                    alt={board.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-400 to-pink-500">
                    <span className="text-white text-4xl font-bold">
                      {board.title[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-lg">{board.title}</h3>
              {board.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {board.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
