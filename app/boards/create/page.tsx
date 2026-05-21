'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CreateBoardPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('You must be logged in to create a board')

      const { data, error } = await supabase
        .from('boards')
        .insert({
          user_id: user.id,
          title,
          description,
          is_private: isPrivate,
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/boards/${data.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Board</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Board Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="e.g., Travel Inspiration"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="What's your board about?"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPrivate"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <label htmlFor="isPrivate" className="ml-2 text-sm text-gray-700">
            Keep this board private
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-full font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-4 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Board'}
          </button>
        </div>
      </form>
    </div>
  )
}
