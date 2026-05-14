'use client'
import { useState, useEffect } from 'react'
import { volunteersAPI } from '@/lib/api'

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const fetchVolunteers = async () => {
    try {
      const data = await volunteersAPI.getAll()
      setVolunteers(data.volunteers || [])
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVolunteers()
  }, [])

  const filtered = volunteers.filter((v: any) => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' ? true : v.status === filter
    return matchesSearch && matchesFilter
  })

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await volunteersAPI.update(id, { status })
      await fetchVolunteers()
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this volunteer application?')) return
    try {
      await volunteersAPI.delete(id)
      await fetchVolunteers()
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    }
  }

  if (loading) return <div className="text-center py-20 text-[#6B7A99]">Loading volunteers...</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628]" style={{ fontFamily: 'Playfair Display, serif' }}>Volunteers Manager</h1>
          <p className="text-[#6B7A99] text-sm mt-1">Review and manage volunteer applications</p>
        </div>
        <div className="bg-[#0A1628] text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
          Total: {volunteers.length}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['All', 'PENDING', 'APPROVED', 'ACTIVE', 'REJECTED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filter === f ? 'bg-[#0A1628] text-white' : 'bg-white text-[#6B7A99] hover:bg-[#EEF1F6]'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search volunteers..."
          className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm focus:outline-none focus:border-[#1A4A8A] bg-[#F8F9FC]" />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0A1628] text-white">
              {['Name', 'Area', 'Availability', 'Skills', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((vol: any, i: number) => (
              <tr key={vol.id} className={`border-b border-[#EEF1F6] hover:bg-[#F8F9FC] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFD]'}`}>
                <td className="px-6 py-4">
                  <p className="font-medium text-[#0A1628] text-sm">{vol.name}</p>
                  <p className="text-xs text-[#6B7A99]">{vol.email}</p>
                  <p className="text-xs text-[#6B7A99]">{vol.phone}</p>
                </td>
                <td className="px-6 py-4 text-sm text-[#6B7A99]">{vol.area}</td>
                <td className="px-6 py-4 text-sm text-[#6B7A99]">{vol.availability}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {(vol.skills || []).slice(0, 3).map((s: string, idx: number) => (
                      <span key={idx} className="text-[10px] bg-[#EEF1F6] text-[#3D4A63] px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                    {(vol.skills || []).length > 3 && <span className="text-[10px] text-[#6B7A99]">+{(vol.skills || []).length - 3}</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select value={vol.status} onChange={e => handleStatusChange(vol.id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer ${
                      vol.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      vol.status === 'APPROVED' ? 'bg-blue-100 text-blue-700' :
                      vol.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-[#6B7A99]">{vol.createdAt?.split('T')[0]}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(vol.id)} className="text-xs bg-red-50 hover:bg-red-500 hover:text-white text-red-500 px-3 py-1.5 rounded-lg transition-colors font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-[#6B7A99]">No volunteers found</div>}
      </div>
    </div>
  )
}
