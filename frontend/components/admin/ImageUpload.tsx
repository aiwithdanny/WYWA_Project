'use client'
import { useState, useRef } from 'react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  label?: string
}

function getToken() {
  if (typeof window !== 'undefined') return localStorage.getItem('wywa_token')
  return null
}

export default function ImageUpload({ value, onChange, folder = 'wywa/general', label = 'Upload Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Local preview
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setUploading(true)

    const formData = new FormData()
    formData.append('image', file)
    formData.append('folder', folder)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      })
      const data = await res.json()
      if (data.status === 'success' && data.url) {
        onChange(data.url)
        setPreview(data.url)
      } else {
        alert(data.message || 'Upload failed')
      }
    } catch {
      alert('Upload failed. Check backend connection.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    onChange('')
    setPreview('')
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-[#3D4A63]">{label}</label>
      {preview ? (
        <div className="relative inline-block">
          <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-[#EEF1F6]" />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[#1A4A8A]/30 text-[#1A4A8A] text-sm font-medium hover:bg-[#1A4A8A]/5 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-[#1A4A8A] border-t-transparent rounded-full" />
              Uploading...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Click to upload image
            </>
          )}
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}
