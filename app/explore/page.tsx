'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Pin } from '@/types/database'
import Masonry from 'react-masonry-css'
import Link from 'next/link'
import Image from 'next/image'

export default function ExplorePage() {
  const [pins, setPins] = useState<Pin[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('pins')
        .select('*')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setPins(data || [])
    } catch (error) {
      console.error('Error searching pins:', error)
    } finally {
      setLoading(false)
    }
  }

  const breakpointColumns = {
    default: 5,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-center mb-6">Explore</h1>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for pins..."
            className="w-full px-6 py-4 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-red-600 text-white rounded-full hover:bg-red-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-xl text-gray-600">Searching...</div>
        </div>
      ) : pins.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600">
            {searchQuery ? 'No results found. Try a different search.' : 'Enter a search term to explore pins'}
          </p>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {pins.map((pin) => (
            <Link
              key={pin.id}
              href={`/pin/${pin.id}`}
              className="block mb-4 group relative overflow-hidden rounded-2xl"
            >
              <div className="relative">
                <Image
                  src={pin.image_url}
                  alt={pin.title}
                  width={pin.image_width || 400}
                  height={pin.image_height || 600}
                  className="w-full h-auto rounded-2xl hover:brightness-90 transition-all"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-2xl flex items-end p-4">
                  <h3 className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {pin.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </Masonry>
      )}
    </div>
  )
}
