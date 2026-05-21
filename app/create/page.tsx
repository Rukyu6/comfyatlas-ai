'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CldUploadWidget } from 'next-cloudinary'

export default function CreatePinPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageWidth, setImageWidth] = useState<number | null>(null)
  const [imageHeight, setImageHeight] = useState<number | null>(null)
  const [sourceUrl, setSourceUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleUploadSuccess = (result: any) => {
    setImageUrl(result.info.secure_url)
    setImageWidth(result.info.width)
    setImageHeight(result.info.height)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('You must be logged in to create a pin')

      if (!imageUrl) throw new Error('Please upload an image')

      const { data, error } = await supabase
        .from('pins')
        .insert({
          user_id: user.id,
          title,
          description,
          image_url: imageUrl,
          image_width: imageWidth,
          image_height: imageHeight,
          source_url: sourceUrl || null,
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/pin/${data.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Pin</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <CldUploadWidget
              uploadPreset="comfyatlas"
              onSuccess={handleUploadSuccess}
            >
              {({ open }) => (
                <div>
                  <button
                    type="button"
                    onClick={() => open()}
                    className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 transition-colors"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">
                          Click to upload image
                        </p>
                      </div>
                    )}
                  </button>
                </div>
              )}
            </CldUploadWidget>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Add a title"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Tell everyone what your pin is about"
              />
            </div>

            <div>
              <label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Source URL
              </label>
              <input
                type="url"
                id="sourceUrl"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="https://example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !imageUrl}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Pin'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
