'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Board } from '@/types/database'

export default function SavePinButton({ pinId }: { pinId: string }) {
  const [boards, setBoards] = useState<Board[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [supabase.auth])

  const fetchBoards = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setBoards(data)
    }
  }

  const handleSaveClick = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    await fetchBoards()
    setShowModal(true)
  }

  const handleSaveToBoard = async (boardId: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('board_pins')
        .insert({
          board_id: boardId,
          pin_id: pinId,
        })

      if (error) {
        if (error.code === '23505') {
          alert('Pin already saved to this board')
        } else {
          throw error
        }
      } else {
        alert('Pin saved successfully!')
        setShowModal(false)
      }
    } catch (error) {
      console.error('Error saving pin:', error)
      alert('Failed to save pin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleSaveClick}
        className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700"
      >
        Save
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Save to Board</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {boards.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">You don't have any boards yet</p>
                  <button
                    onClick={() => router.push('/boards/create')}
                    className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    Create Board
                  </button>
                </div>
              ) : (
                boards.map((board) => (
                  <button
                    key={board.id}
                    onClick={() => handleSaveToBoard(board.id)}
                    disabled={loading}
                    className="w-full text-left p-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <h3 className="font-semibold">{board.title}</h3>
                    {board.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {board.description}
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
