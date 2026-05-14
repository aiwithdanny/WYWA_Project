'use client'
import { useState, useEffect } from 'react'
import { newsAPI } from '@/lib/api'
import ImageUpload from '@/components/admin/ImageUpload'

export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newArticle, setNewArticle] = useState({
    title: '', slug: '', excerpt: '', body: '', category: 'GENERAL', status: 'DRAFT', isFeatured: false, imageUrl: ''
  })

  const fetchNews = async () => {
    try {
      const data = await newsAPI.getAll()
      setNews(data.news || [])
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const filtered = news.filter((n: any) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingId) {
        await newsAPI.update(editingId, newArticle)
        await fetchNews()
        setShowForm(false)
        setEditingId(null)
        setNewArticle({ title: '', slug: '', excerpt: '', body: '', category: 'GENERAL', status: 'DRAFT', isFeatured: false, imageUrl: '' })
      } else {
        await newsAPI.create(newArticle)
        await fetchNews()
        setShowForm(false)
        setNewArticle({ title: '', slug: '', excerpt: '', body: '', category: 'GENERAL', status: 'DRAFT', isFeatured: false, imageUrl: '' })
      }
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (article: any) => {
    setNewArticle({
      title: article.title || '',
      slug: article.slug || '',
      excerpt: article.excerpt || '',
      body: article.body || '',
      category: article.category || 'GENERAL',
      status: article.status || 'DRAFT',
      isFeatured: !!article.isFeatured,
      imageUrl: article.imageUrl || '',
    })
    setEditingId(article.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return
    try {
      await newsAPI.delete(id)
      await fetchNews()
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    }
  }

  const toggleStatus = async (article: any) => {
    const newStatus = article.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    try {
      await newsAPI.update(article.id, { status: newStatus })
      await fetchNews()
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    }
  }

  if (loading) return <div className="text-center py-20 text-[#6B7A99]">Loading news...</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628]" style={{ fontFamily: 'Playfair Display, serif' }}>News Manager</h1>
          <p className="text-[#6B7A99] text-sm mt-1">Manage all WYWA news and blog articles</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-[#1A4A8A] hover:bg-[#0A1628] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5">
          + Add Article
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 border-2 border-[#1A4A8A]/20">
          <h2 className="font-bold text-[#0A1628] mb-4">{editingId ? 'Edit Article' : 'Add New Article'}</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} placeholder="Title *" className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A]" />
            <input value={newArticle.slug} onChange={e => setNewArticle({...newArticle, slug: e.target.value})} placeholder="Slug (optional)" className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A]" />
          </div>
          <input value={newArticle.excerpt} onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})} placeholder="Excerpt" className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A] mb-4" />
          <textarea value={newArticle.body} onChange={e => setNewArticle({...newArticle, body: e.target.value})} placeholder="Body *" rows={4} className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A] resize-none mb-4" />
          <div className="mb-4">
            <ImageUpload
              value={newArticle.imageUrl}
              onChange={url => setNewArticle({...newArticle, imageUrl: url})}
              folder="wywa/news"
              label="Cover Image"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <select value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A]">
              {['GENERAL', 'PROGRAMS', 'EVENTS', 'ANNOUNCEMENTS', 'SUCCESS_STORIES', 'MEDIA'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={newArticle.status} onChange={e => setNewArticle({...newArticle, status: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A]">
              {['DRAFT', 'PUBLISHED', 'ARCHIVED'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#EEF1F6] bg-[#F8F9FC] text-sm cursor-pointer">
              <input type="checkbox" checked={newArticle.isFeatured} onChange={e => setNewArticle({...newArticle, isFeatured: e.target.checked})} />
              Featured
            </label>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="bg-[#2da86a] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a6b42] transition-colors disabled:opacity-70">{saving ? 'Saving...' : editingId ? 'Update Article' : 'Save Article'} ✓</button>
            <button onClick={() => { setShowForm(false); setEditingId(null); setNewArticle({ title: '', slug: '', excerpt: '', body: '', category: 'GENERAL', status: 'DRAFT', isFeatured: false, imageUrl: '' }) }} className="bg-[#F8F9FC] text-[#6B7A99] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#EEF1F6] transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search articles..."
          className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm focus:outline-none focus:border-[#1A4A8A] bg-[#F8F9FC]" />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0A1628] text-white">
              {['Article', 'Category', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((article: any, i: number) => (
              <tr key={article.id} className={`border-b border-[#EEF1F6] hover:bg-[#F8F9FC] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFD]'}`}>
                <td className="px-6 py-4">
                  <p className="font-medium text-[#0A1628] text-sm">{article.title}</p>
                  {article.isFeatured && <span className="text-[10px] bg-[#C8A84B]/20 text-[#8a6e2a] px-2 py-0.5 rounded-full mt-1 inline-block">Featured</span>}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">{article.category}</span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleStatus(article)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${article.status === 'PUBLISHED' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}>
                    {article.status}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-[#6B7A99]">{article.publishedAt?.split('T')[0] || article.createdAt?.split('T')[0]}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(article)} className="text-xs bg-[#EEF1F6] hover:bg-[#1A4A8A] hover:text-white text-[#3D4A63] px-3 py-1.5 rounded-lg transition-colors font-medium">Edit</button>
                    <button onClick={() => handleDelete(article.id)} className="text-xs bg-red-50 hover:bg-red-500 hover:text-white text-red-500 px-3 py-1.5 rounded-lg transition-colors font-medium">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-[#6B7A99]">No articles found</div>}
      </div>
    </div>
  )
}
