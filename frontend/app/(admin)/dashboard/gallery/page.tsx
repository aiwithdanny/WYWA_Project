'use client'
import { useState, useEffect } from 'react'
import { galleryAPI } from '@/lib/api'
import ImageUpload from '@/components/admin/ImageUpload'

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newItem, setNewItem] = useState({
    albumName: '', imageUrl: '', caption: '', year: new Date().getFullYear(), isFeatured: false
  })

  const fetchGallery = async () => {
    try {
      const data = await galleryAPI.getAll()
      setGallery(data.gallery || [])
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGallery()
  }, [])

  const filtered = gallery.filter((g: any) =>
    g.albumName.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingId) {
        await galleryAPI.update(editingId, newItem)
        await fetchGallery()
        setShowForm(false)
        setEditingId(null)
        setNewItem({ albumName: '', imageUrl: '', caption: '', year: new Date().getFullYear(), isFeatured: false })
      } else {
        await galleryAPI.create(newItem)
        await fetchGallery()
        setShowForm(false)
        setNewItem({ albumName: '', imageUrl: '', caption: '', year: new Date().getFullYear(), isFeatured: false })
      }
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (item: any) => {
    setNewItem({
      albumName: item.albumName || '',
      imageUrl: item.imageUrl || '',
      caption: item.caption || '',
      year: item.year || new Date().getFullYear(),
      isFeatured: !!item.isFeatured,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this gallery item?')) return
    try {
      await galleryAPI.delete(id)
      await fetchGallery()
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    }
  }

  if (loading) return <div className="text-center py-20 text-[#6B7A99]">Loading gallery...</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628]" style={{ fontFamily: 'Playfair Display, serif' }}>Gallery Manager</h1>
          <p className="text-[#6B7A99] text-sm mt-1">Manage WYWA photo gallery</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-[#1A4A8A] hover:bg-[#0A1628] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5">
          + Add Item
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 border-2 border-[#1A4A8A]/20">
          <h2 className="font-bold text-[#0A1628] mb-4">{editingId ? 'Edit Gallery Item' : 'Add Gallery Item'}</h2>
          <div className="mb-4">
            <input value={newItem.albumName} onChange={e => setNewItem({...newItem, albumName: e.target.value})} placeholder="Album Name *" className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A] mb-4" />
            <ImageUpload
              value={newItem.imageUrl}
              onChange={url => setNewItem({...newItem, imageUrl: url})}
              folder="wywa/gallery"
              label="Gallery Photo"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input value={newItem.caption} onChange={e => setNewItem({...newItem, caption: e.target.value})} placeholder="Caption" className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A]" />
            <input type="number" value={newItem.year} onChange={e => setNewItem({...newItem, year: parseInt(e.target.value) || new Date().getFullYear()})} placeholder="Year" className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A]" />
          </div>
          <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#EEF1F6] bg-[#F8F9FC] text-sm cursor-pointer mb-4 w-fit">
            <input type="checkbox" checked={newItem.isFeatured} onChange={e => setNewItem({...newItem, isFeatured: e.target.checked})} />
            Featured on homepage
          </label>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="bg-[#2da86a] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a6b42] transition-colors disabled:opacity-70">{saving ? 'Saving...' : editingId ? 'Update Item' : 'Save Item'} ✓</button>
            <button onClick={() => { setShowForm(false); setEditingId(null); setNewItem({ albumName: '', imageUrl: '', caption: '', year: new Date().getFullYear(), isFeatured: false }) }} className="bg-[#F8F9FC] text-[#6B7A99] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#EEF1F6] transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search gallery..."
          className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm focus:outline-none focus:border-[#1A4A8A] bg-[#F8F9FC]" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item: any) => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-200 hover:shadow-lg group">
            <div className={`h-40 flex items-center justify-center relative ${item.isFeatured ? 'bg-gradient-to-br from-[#C8A84B] to-[#8a6e2a]' : 'bg-gradient-to-br from-[#1A4A8A] to-[#0A1628]'}`}>
              <span className="text-5xl">🖼️</span>
              {item.isFeatured && <span className="absolute top-3 right-3 bg-white/20 text-white text-xs px-2 py-1 rounded-full">Featured</span>}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-[#0A1628] text-sm mb-1">{item.albumName}</h3>
              <p className="text-xs text-[#6B7A99] mb-3">{item.caption || 'No caption'}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B7A99]">{item.year}</span>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(item)} className="text-xs bg-[#EEF1F6] hover:bg-[#1A4A8A] hover:text-white text-[#3D4A63] px-3 py-1.5 rounded-lg transition-colors font-medium">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-xs bg-red-50 hover:bg-red-500 hover:text-white text-red-500 px-3 py-1.5 rounded-lg transition-colors font-medium">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="text-center py-12 text-[#6B7A99]">No gallery items found</div>}
    </div>
  )
}
