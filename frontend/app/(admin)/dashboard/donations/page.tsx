'use client'
import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000'

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [token, setToken] = useState('')

  // Get token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('wywa_token')
    if (storedToken) setToken(storedToken)
  }, [])

  const fetchDonations = async () => {
    try {
      const headers: any = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`
      
      const res = await fetch(`${API_URL}/api/donations`, { headers })
      if (res.status === 401) {
        alert('Session expired. Please login again.')
        return
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setDonations(data.donations || [])
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchDonations()
  }, [token])

  const filtered = donations.filter((d: any) => {
    const matchesSearch = d.donorName?.toLowerCase().includes(search.toLowerCase()) || d.email?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' ? true : d.status === filter
    return matchesSearch && matchesFilter
  })

  const totalAmount = filtered.reduce((sum: number, d: any) => sum + (d.amount || 0), 0)

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const headers: any = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      await fetch(`${API_URL}/api/donations/${id}`, { method: 'PUT', headers, body: JSON.stringify({ status }) })
      await fetchDonations()
    } catch (err: any) {
      alert(err.message || 'Connection error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this donation record?')) return
    try {
      const headers: any = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      await fetch(`${API_URL}/api/donations/${id}`, { method: 'DELETE', headers })
      await fetchDonations()
    } catch (err: any) {
      alert(err.message || 'Connection error')
    }
  }

  if (loading) return <div className="text-center py-20 text-[#6B7A99]">Loading donations...</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628]" style={{ fontFamily: 'Playfair Display, serif' }}>Donations Manager</h1>
          <p className="text-[#6B7A99] text-sm mt-1">Track and manage all donations</p>
        </div>
        <div className="bg-[#0A1628] text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
          Total: PKR {totalAmount.toLocaleString()}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['All', 'PENDING', 'COMPLETED', 'FAILED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filter === f ? 'bg-[#0A1628] text-white' : 'bg-white text-[#6B7A99] hover:bg-[#EEF1F6]'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search donations..."
          className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm focus:outline-none focus:border-[#1A4A8A] bg-[#F8F9FC]" />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0A1628] text-white">
              {['Donor', 'Amount', 'Campaign', 'Method', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((donation: any, i: number) => (
              <tr key={donation.id} className={`border-b border-[#EEF1F6] hover:bg-[#F8F9FC] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFD]'}`}>
                <td className="px-6 py-4">
                  <p className="font-medium text-[#0A1628] text-sm">{donation.isAnonymous ? 'Anonymous' : donation.donorName}</p>
                  <p className="text-xs text-[#6B7A99]">{donation.email}</p>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-[#2da86a]">PKR {donation.amount?.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-[#6B7A99]">{donation.campaign}</td>
                <td className="px-6 py-4 text-xs text-[#6B7A99]">{donation.paymentMethod}</td>
                <td className="px-6 py-4">
                  <select value={donation.status} onChange={e => handleStatusChange(donation.id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer ${
                      donation.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      donation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                    <option value="PENDING">PENDING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="FAILED">FAILED</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-[#6B7A99]">{donation.createdAt?.split('T')[0]}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(donation.id)} className="text-xs bg-red-50 hover:bg-red-500 hover:text-white text-red-500 px-3 py-1.5 rounded-lg transition-colors font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-[#6B7A99]">No donations found</div>}
      </div>
    </div>
  )
}
