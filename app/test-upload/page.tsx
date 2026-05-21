'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'

export default function TestUploadPage() {
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleUploadSuccess = (result: any) => {
    console.log('Upload success:', result)
    setUploadResult(result.info)
    setError('')
  }

  const handleUploadError = (error: any) => {
    console.error('Upload error:', error)
    setError('Upload failed: ' + error.message)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cloudinary 上传测试
          </h1>
          <p className="text-gray-600 mb-8">
            测试 Cloudinary 图片上传功能（无需登录）
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">步骤 1: 上传图片</h2>
            <CldUploadWidget
              uploadPreset="comfyatlas"
              onSuccess={handleUploadSuccess}
              onError={handleUploadError}
            >
              {({ open }) => (
                <button
                  onClick={() => open()}
                  className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-red-500 transition-colors bg-gray-50 hover:bg-gray-100"
                >
                  <svg
                    className="w-16 h-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-lg font-medium text-gray-700">
                    点击上传图片
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    支持 JPG, PNG, GIF 等格式
                  </p>
                </button>
              )}
            </CldUploadWidget>
          </div>

          {uploadResult && (
            <div className="space-y-6">
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4 text-green-600">
                  ✓ 上传成功！
                </h2>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    上传的图片：
                  </h3>
                  <img
                    src={uploadResult.secure_url}
                    alt="Uploaded"
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    上传信息：
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">图片 URL:</span>
                      <p className="text-gray-900 break-all font-mono text-xs mt-1">
                        {uploadResult.secure_url}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500">尺寸:</span>
                      <p className="text-gray-900 mt-1">
                        {uploadResult.width} × {uploadResult.height} px
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500">格式:</span>
                      <p className="text-gray-900 mt-1">
                        {uploadResult.format?.toUpperCase()}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500">文件大小:</span>
                      <p className="text-gray-900 mt-1">
                        {(uploadResult.bytes / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <span className="text-gray-500 text-sm">Public ID:</span>
                    <p className="text-gray-900 font-mono text-xs mt-1">
                      {uploadResult.public_id}
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    🎉 Cloudinary 配置正确！
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    图片已成功上传到 Cloudinary，所有配置都正常工作。
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              配置信息：
            </h3>
            <div className="bg-gray-50 rounded p-3 text-sm font-mono">
              <p className="text-gray-600">
                Cloud Name: <span className="text-gray-900">duglcljnt</span>
              </p>
              <p className="text-gray-600">
                Upload Preset: <span className="text-gray-900">comfyatlas</span>
              </p>
            </div>
          </div>

          <div className="mt-6">
            <a
              href="/"
              className="text-red-600 hover:text-red-700 font-medium"
            >
              ← 返回首页
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
