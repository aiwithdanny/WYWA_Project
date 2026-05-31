'use client'
import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000'

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [token, setToken] = useState('')

  useEffect(() => {
    const storedToken = localStorage.getItem('wywa_token')
    if (storedToken) setToken(storedToken)
  }, [])

  const fetchVolunteers = async () => {
    try {
      const headers: any = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`
      
      const res = await fetch(`${API_URL}/api/volunteers`, { headers })
      if (res.status === 401) {
        alert('Session expired. Please login again.')
        return
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setVolunteers(data.volunteers || [])
    } catch (err: any) {
      alert(err.message || 'Connection error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchVolunteers()
  }, [token])

  const updateStatus = async (id: string, status: string) => {
    try {
      const headers: any = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      await fetch(`${API_URL}/api/volunteers/${id}`, { method: 'PUT', headers, body: JSON.stringify({ status }) })
      await fetchVolunteers()
    } catch (err: any) {
      alert(err.message || 'Connection error')
    }
  }

  const filtered = volunteers.filter(v => {
    const matchesSearch = v.name?.toLowerCase().includes(search.toLowerCase()) || v.email?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' ? true : v.status === filter
    return matchesSearch && matchesFilter
  })

  if (loading) return <div className="text-center py-20 text-[#6B7A99]">Loading volunteers...</div>

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1628]">Volunteers Manager</h1>
        <p className="text-[#6B7A99] text-sm mt-1">Manage volunteer applications</p>
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
              {['Name', 'Email', 'Phone', 'Area', 'Status', 'Applied Date', 'Actions'].map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((vol, i) => (
              <tr key={vol.id} className={`border-b border-[#EEF1F6] hover:bg-[#F8F9FC] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFD]'}`}>
                <td className="px-6 py-4"><p className="font-medium text-[#0A1628] text-sm">{vol.name}</p></td>
                <td className="px-6 py-4 text-sm text-[#6B7A99]">{vol.email}</td>
                <td className="px-6 py-4 text-sm text-[#6B7A99]">{vol.phone}</td>
                <td className="px-6 py-4 text-xs text-[#6B7A99]">{vol.area}</td>
                <td className="px-6 py-4">
                  <select value={vol.status} onChange={e => updateStatus(vol.id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer ${
                      vol.status === 'ACTIVE' || vol.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      vol.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-[#6B7A99]">{new Date(vol.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button onClick={() => updateStatus(vol.id, 'REJECTED')} className="text-xs bg-red-50 hover:bg-red-500 hover:text-white text-red-500 px-3 py-1.5 rounded-lg transition-colors">Reject</button>
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
