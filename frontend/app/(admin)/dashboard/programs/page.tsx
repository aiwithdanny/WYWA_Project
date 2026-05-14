'use client'
import { useState, useEffect } from 'react'
import { programsAPI } from '@/lib/api'
import ImageUpload from '@/components/admin/ImageUpload'

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newProgram, setNewProgram] = useState({
    title: '', slug: '', description: '', category: 'EDUCATION', status: 'DRAFT', beneficiaries: 0, location: '', startDate: '', imageUrl: ''
  })

  const fetchPrograms = async () => {
    try {
      const data = await programsAPI.getAll()
      setPrograms(data.programs || [])
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrograms()
  }, [])

  const filtered = programs.filter((p: any) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingId) {
        await programsAPI.update(editingId, newProgram)
        await fetchPrograms()
        setShowForm(false)
        setEditingId(null)
        setNewProgram({ title: '', slug: '', description: '', category: 'EDUCATION', status: 'DRAFT', beneficiaries: 0, location: '', startDate: '', imageUrl: '' })
      } else {
        await programsAPI.create(newProgram)
        await fetchPrograms()
        setShowForm(false)
        setNewProgram({ title: '', slug: '', description: '', category: 'EDUCATION', status: 'DRAFT', beneficiaries: 0, location: '', startDate: '', imageUrl: '' })
      }
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (program: any) => {
    setNewProgram({
      title: program.title || '',
      slug: program.slug || '',
      description: program.description || '',
      category: program.category || 'EDUCATION',
      status: program.status || 'DRAFT',
      beneficiaries: program.beneficiaries || 0,
      location: program.location || '',
      startDate: program.startDate ? program.startDate.split('T')[0] : '',
      imageUrl: program.imageUrl || '',
    })
    setEditingId(program.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this program?')) return
    try {
      await programsAPI.delete(id)
      await fetchPrograms()
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    }
  }

  const toggleStatus = async (program: any) => {
    const newStatus = program.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    try {
      await programsAPI.update(program.id, { status: newStatus })
      await fetchPrograms()
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    }
  }

  if (loading) return <div className="text-center py-20 text-[#6B7A99]">Loading programs...</div>

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628]"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Programs Manager
          </h1>
          <p className="text-[#6B7A99] text-sm mt-1">
            Manage all WYWA programs
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#1A4A8A] hover:bg-[#0A1628] text-white
            px-5 py-2.5 rounded-xl text-sm font-semibold
            transition-all duration-200 hover:-translate-y-0.5">
          + Add Program
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border-2 border-[#1A4A8A]/20">
          <h2 className="font-bold text-[#0A1628] mb-4">{editingId ? 'Edit Program' : 'Add New Program'}</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-[#3D4A63] mb-1">
                Program Title *
              </label>
              <input
                value={newProgram.title}
                onChange={e => setNewProgram({...newProgram, title: e.target.value})}
                placeholder="Enter program title"
                className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6]
                  text-sm focus:outline-none focus:border-[#1A4A8A]
                  bg-[#F8F9FC]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3D4A63] mb-1">
                Category
              </label>
              <select
                value={newProgram.category}
                onChange={e => setNewProgram({...newProgram, category: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6]
                  text-sm focus:outline-none focus:border-[#1A4A8A] bg-[#F8F9FC]">
                {['EDUCATION', 'HEALTH', 'DISASTER_RELIEF', 'YOUTH_EMPOWERMENT', 'INFRASTRUCTURE', 'COMMUNITY_DEVELOPMENT', 'OTHER'].map(c => (
                  <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input value={newProgram.slug} onChange={e => setNewProgram({...newProgram, slug: e.target.value})} placeholder="Slug (optional)" className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A]" />
            <input type="number" value={newProgram.beneficiaries} onChange={e => setNewProgram({...newProgram, beneficiaries: parseInt(e.target.value) || 0})} placeholder="Beneficiaries" className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A]" />
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input value={newProgram.location} onChange={e => setNewProgram({...newProgram, location: e.target.value})} placeholder="Location" className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A]" />
            <input type="date" value={newProgram.startDate} onChange={e => setNewProgram({...newProgram, startDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A]" />
          </div>
          <textarea value={newProgram.description} onChange={e => setNewProgram({...newProgram, description: e.target.value})} placeholder="Description" rows={3} className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A] resize-none mb-4" />
          <div className="mb-4">
            <ImageUpload
              value={newProgram.imageUrl}
              onChange={url => setNewProgram({...newProgram, imageUrl: url})}
              folder="wywa/programs"
              label="Program Image"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="bg-[#2da86a] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a6b42] transition-colors disabled:opacity-70">{saving ? 'Saving...' : editingId ? 'Update Program' : 'Save Program'} ✓</button>
            <button onClick={() => { setShowForm(false); setEditingId(null); setNewProgram({ title: '', slug: '', description: '', category: 'EDUCATION', status: 'DRAFT', beneficiaries: 0, location: '', startDate: '', imageUrl: '' }) }} className="bg-[#F8F9FC] text-[#6B7A99] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#EEF1F6] transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-2xl p-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search programs..."
          className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6]
            text-sm focus:outline-none focus:border-[#1A4A8A] bg-[#F8F9FC]" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0A1628] text-white">
              {['Program', 'Category', 'Status', 'Beneficiaries', 'Date', 'Actions'].map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs
                  font-semibold uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((program, i) => (
              <tr key={program.id}
                className={`border-b border-[#EEF1F6] hover:bg-[#F8F9FC]
                  transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFD]'}`}>
                <td className="px-6 py-4">
                  <p className="font-medium text-[#0A1628] text-sm">
                    {program.title}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1
                    rounded-full text-xs font-medium">
                    {program.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(program)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      cursor-pointer transition-colors
                      ${program.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      }`}>
                    {program.status}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-[#6B7A99]">
                  {program.beneficiaries.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-[#6B7A99]">
                  {program.startDate || program.createdAt?.split('T')[0]}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(program)}
                      className="text-xs bg-[#EEF1F6] hover:bg-[#1A4A8A]
                      hover:text-white text-[#3D4A63] px-3 py-1.5 rounded-lg
                      transition-colors font-medium">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="text-xs bg-red-50 hover:bg-red-500
                        hover:text-white text-red-500 px-3 py-1.5 rounded-lg
                        transition-colors font-medium">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#6B7A99]">
            No programs found
          </div>
        )}
      </div>
    </div>
  )
}
