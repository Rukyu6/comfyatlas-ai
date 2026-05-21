import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Masonry from 'react-masonry-css'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function BoardDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: board, error: boardError } = await supabase
    .from('boards')
    .select(`
      *,
      profiles:user_id (
        id,
        username
      )
    `)
    .eq('id', params.id)
    .single()

  if (boardError || !board) {
    notFound()
  }

  const { data: boardPins } = await supabase
    .from('board_pins')
    .select(`
      pin_id,
      pins (
        id,
        title,
        image_url,
        image_width,
        image_height
      )
    `)
    .eq('board_id', params.id)

  const pins = boardPins?.map(bp => bp.pins).filter(Boolean) || []

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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">{board.title}</h1>
        {board.description && (
          <p className="text-gray-600 text-lg">{board.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          by <Link href={`/profile/${board.profiles.id}`} className="hover:underline">
            {board.profiles.username}
          </Link>
        </p>
      </div>

      {pins.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600">No pins in this board yet</p>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {pins.map((pin: any) => (
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
