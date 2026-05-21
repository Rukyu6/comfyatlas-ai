'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Pin } from '@/types/database'
import Masonry from 'react-masonry-css'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const [pins, setPins] = useState<Pin[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchPins()
  }, [])

  const fetchPins = async () => {
    try {
      const { data, error } = await supabase
        .from('pins')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setPins(data || [])
    } catch (error) {
      console.error('Error fetching pins:', error)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-[1920px] mx-auto px-4 py-8">
      {pins.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Comfyatlas AI
          </h2>
          <p className="text-gray-600 mb-8">
            No pins yet. Be the first to create one!
          </p>
          <Link
            href="/create"
            className="inline-block px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 font-medium"
          >
            Create Pin
          </Link>
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
