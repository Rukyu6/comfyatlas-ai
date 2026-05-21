import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Masonry from 'react-masonry-css'
import Link from 'next/link'
import Image from 'next/image'

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !profile) {
    notFound()
  }

  const { data: pins } = await supabase
    .from('pins')
    .select('*')
    .eq('user_id', params.id)
    .order('created_at', { ascending: false })

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
      <div className="text-center mb-12">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.username}
            width={120}
            height={120}
            className="rounded-full mx-auto mb-4"
          />
        ) : (
          <div className="w-30 h-30 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-600 text-4xl font-bold">
              {profile.username[0].toUpperCase()}
            </span>
          </div>
        )}
        <h1 className="text-3xl font-bold mb-2">{profile.full_name || profile.username}</h1>
        <p className="text-gray-600">@{profile.username}</p>
        {profile.bio && (
          <p className="text-gray-700 mt-4 max-w-2xl mx-auto">{profile.bio}</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Pins</h2>
        {!pins || pins.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">No pins yet</p>
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
    </div>
  )
}
