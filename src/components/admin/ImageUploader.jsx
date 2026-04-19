// src/components/admin/ImageUploader.jsx
import { useState, useRef } from 'react'
import { uploadImage, uploadImageFromURL } from '../../api'

export default function ImageUploader({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [tab, setTab] = useState('file') // 'file' or 'url'
  const [error, setError] = useState('')
  const fileInputRef = useRef()

  // Upload from file
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    setUploading(true)
    setError('')

    try {
      const uploaded = []
      for (const file of files) {
        const formData = new FormData()
        formData.append('image', file)
        const { data } = await uploadImage(formData)
        uploaded.push({
          url: data.url,
          public_id: data.public_id,
          sort_order: images.length + uploaded.length,
        })
      }
      onChange([...images, ...uploaded])
    } catch {
      setError('Failed to upload image. Try again.')
    } finally {
      setUploading(false)
      fileInputRef.current.value = ''
    }
  }

  // Upload from URL
  const handleURLUpload = async () => {
    if (!urlInput.trim()) {
      setError('Please enter a valid URL')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('url', urlInput.trim())
      const { data } = await uploadImage(formData)
      onChange([...images, {
        url: data.url,
        public_id: data.public_id,
        sort_order: images.length,
      }])
      setUrlInput('')
    } catch {
      setError('Failed to upload from URL. Check the URL and try again.')
    } finally {
      setUploading(false)
    }
  }

  // Remove image
  const handleRemove = (index) => {
    const updated = images.filter((_, i) => i !== index)
    onChange(updated)
  }

  // Move image (reorder)
  const handleMove = (index, direction) => {
    const updated = [...images]
    const swapIndex = index + direction
    if (swapIndex < 0 || swapIndex >= updated.length) return
    ;[updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]]
    onChange(updated)
  }

  return (
    <div className="space-y-4">

      <div className="flex border border-black/20">
        <button
          type="button"
          onClick={() => setTab('file')}
          className={`flex-1 py-2 text-xs tracking-widest uppercase font-medium transition-colors
            ${tab === 'file'
              ? 'bg-black text-white'
              : 'text-black/40 hover:text-black'
            }`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={`flex-1 py-2 text-xs tracking-widest uppercase font-medium transition-colors
            ${tab === 'url'
              ? 'bg-black text-white'
              : 'text-black/40 hover:text-black'
            }`}
        >
          Paste URL
        </button>
      </div>

      {/* File Upload */}
      {tab === 'file' && (
        <div
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-black/20 p-8 text-center cursor-pointer hover:border-black transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          {uploading ? (
            <div className="space-y-2">
              <div className="text-2xl">⏳</div>
              <p className="text-xs text-black/40 tracking-widest uppercase">
                Uploading...
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-3xl">📁</div>
              <p className="text-sm text-black/60">
                Click to upload images
              </p>
              <p className="text-xs text-black/30">
                PNG, JPG up to 10MB · Multiple files allowed
              </p>
            </div>
          )}
        </div>
      )}

      {/* URL Upload */}
      {tab === 'url' && (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 border border-black/20 px-3 py-2.5 text-sm text-black outline-none focus:border-black placeholder:text-black/20"
            onKeyDown={e => e.key === 'Enter' && handleURLUpload()}
          />
          <button
            type="button"
            onClick={handleURLUpload}
            disabled={uploading}
            className="px-4 py-2.5 bg-black hover:bg-gold hover:text-black text-white text-xs tracking-widest uppercase transition-colors disabled:bg-black/30 whitespace-nowrap"
          >
            {uploading ? '...' : 'Add'}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div>
          <p className="text-[10px] text-black/40 tracking-widest uppercase mb-2">
            {images.length} image{images.length > 1 ? 's' : ''} · First image is cover
          </p>
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative group border border-black/10"
              >
                <img
                  src={img.url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-24 object-cover"
                />

                {/* Cover badge */}
                {index === 0 && (
                  <span className="absolute top-1 left-1 bg-gold text-black text-[9px] px-1.5 py-0.5 font-semibold tracking-wide uppercase">
                    Cover
                  </span>
                )}

                {/* Controls */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMove(index, -1)}
                      className="w-6 h-6 bg-white text-black text-xs flex items-center justify-center hover:bg-gold"
                      title="Move left"
                    >
                      ←
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="w-6 h-6 bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                    title="Remove"
                  >
                    ✕
                  </button>
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleMove(index, 1)}
                      className="w-6 h-6 bg-white text-black text-xs flex items-center justify-center hover:bg-gold"
                      title="Move right"
                    >
                      →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}