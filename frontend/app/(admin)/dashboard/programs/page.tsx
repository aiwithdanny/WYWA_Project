'use client'
import { useState } from 'react'

const initialPrograms = [
  { id: 1, title: 'WYWA Scholarship Fund', category: 'Education', status: 'Published', beneficiaries: 320, date: '2024-01-15' },
  { id: 2, title: 'Skills & Vocational Training', category: 'Livelihoods', status: 'Published', beneficiaries: 1200, date: '2024-02-01' },
  { id: 3, title: 'Mobile Health Clinics', category: 'Health', status: 'Published', beneficiaries: 800, date: '2024-01-20' },
  { id: 4, title: 'Flood & Disaster Relief', category: 'Relief', status: 'Published', beneficiaries: 5000, date: '2024-03-10' },
  { id: 5, title: 'Youth Leadership Academy', category: 'Youth', status: 'Draft', beneficiaries: 180, date: '2024-04-01' },
  { id: 6, title: 'Clean Water Initiative', category: 'Infrastructure', status: 'Published', beneficiaries: 3000, date: '2024-02-15' },
]

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState(initialPrograms)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [newProgram, setNewProgram] = useState({
    title: '', category: 'Education', status: 'Draft', beneficiaries: 0
  })

  const filtered = programs.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => {
    setPrograms([...programs, {
      id: programs.length + 1,
      ...newProgram,
      date: new Date().toISOString().split('T')[0]
    }])
    setShowForm(false)
    setNewProgram({ title: '', category: 'Education', status: 'Draft', beneficiaries: 0 })
  }

  const handleDelete = (id: number) => {
    setPrograms(programs.filter(p => p.id !== id))
  }

  const toggleStatus = (id: number) => {
    setPrograms(programs.map(p =>
      p.id === id
        ? { ...p, status: p.status === 'Published' ? 'Draft' : 'Published' }
        : p
    ))
  }

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
          <h2 className="font-bold text-[#0A1628] mb-4">Add New Program</h2>
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
                {['Education', 'Health', 'Relief', 'Youth', 'Infrastructure', 'Livelihoods'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd}
              className="bg-[#2da86a] text-white px-5 py-2.5 rounded-xl
                text-sm font-semibold hover:bg-[#1a6b42] transition-colors">
              Save Program ✓
            </button>
            <button onClick={() => setShowForm(false)}
              className="bg-[#F8F9FC] text-[#6B7A99] px-5 py-2.5 rounded-xl
                text-sm font-semibold hover:bg-[#EEF1F6] transition-colors">
              Cancel
            </button>
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
                    onClick={() => toggleStatus(program.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      cursor-pointer transition-colors
                      ${program.status === 'Published'
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
                  {program.date}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-xs bg-[#EEF1F6] hover:bg-[#1A4A8A]
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
