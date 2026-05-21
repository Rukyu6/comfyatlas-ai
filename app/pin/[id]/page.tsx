'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import SavePinButton from '@/components/SavePinButton'

export default function PinPage({ params }: { params: { id: string } }) {
  const [pin, setPin] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchPin()
  }, [params.id])

  const fetchPin = async () => {
    try {
      const { data, error } = await supabase
        .from('pins')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            avatar_url
          )
        `)
        .eq('id', params.id)
        .single()

      if (error || !data) {
        router.push('/')
        return
      }

      setPin(data)
    } catch (error) {
      console.error('Error fetching pin:', error)
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

  if (!pin) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative">
          <Image
            src={pin.image_url}
            alt={pin.title}
            width={pin.image_width || 800}
            height={pin.image_height || 1200}
            className="w-full h-auto rounded-2xl shadow-lg"
            priority
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <SavePinButton pinId={pin.id} />
            {pin.source_url && (
              <a
                href={pin.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Visit source →
              </a>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {pin.title}
            </h1>
            {pin.description && (
              <p className="text-gray-600 leading-relaxed">
                {pin.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <Link href={`/profile/${pin.profiles.id}`} className="flex items-center gap-3 hover:opacity-80">
              {pin.profiles.avatar_url ? (
                <Image
                  src={pin.profiles.avatar_url}
                  alt={pin.profiles.username}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">
                    {pin.profiles.username[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">
                  {pin.profiles.username}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(pin.created_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
