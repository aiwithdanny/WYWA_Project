'use client'
import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [token, setToken] = useState('')

  useEffect(() => {
    const storedToken = localStorage.getItem('wywa_token')
    if (storedToken) setToken(storedToken)
  }, [])

  const fetchMessages = async () => {
    try {
      const headers: any = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`
      
      const res = await fetch(`${API_URL}/api/contact`, { headers })
      if (res.status === 401) {
        alert('Session expired. Please login again.')
        return
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (err: any) {
      alert(err.message || 'Connection error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchMessages()
  }, [token])

  const markAsRead = async (id: string) => {
    try {
      const headers: any = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      await fetch(`${API_URL}/api/contact/${id}`, { method: 'GET', headers })
      await fetchMessages()
    } catch (err: any) {
      console.error('Error marking as read:', err)
    }
  }

  if (loading) return <div className="text-center py-20 text-[#6B7A99]">Loading messages...</div>

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1628]">Messages Inbox</h1>
        <p className="text-[#6B7A99] text-sm mt-1">View and manage contact messages</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} onClick={() => { setSelected(msg); if (!msg.isRead) markAsRead(msg.id) }}
              className="bg-white p-4 rounded-xl cursor-pointer hover:shadow-md border-l-4 border-[#1A4A8A] transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-[#0A1628]">{msg.name}</p>
                  <p className="text-xs text-gray-400">{msg.email}</p>
                </div>
                <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
              <p className="text-sm text-gray-600 mt-1 font-medium">{msg.subject}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{msg.message}</p>
              {!msg.isRead && <span className="text-xs text-[#C8A84B] mt-2 inline-block">● New</span>}
            </div>
          ))}
          {messages.length === 0 && <div className="text-center py-8 text-gray-500">No messages yet</div>}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
          {selected ? (
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-[#0A1628]">{selected.name}</h3>
                  <p className="text-gray-500 text-sm">{selected.email}</p>
                  {selected.phone && <p className="text-gray-500 text-sm">📞 {selected.phone}</p>}
                </div>
                <p className="text-xs text-gray-400">{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-1">Subject: {selected.subject}</p>
                <p className="text-gray-600 whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="flex gap-3">
                <a href={`mailto:${selected.email}?subject=RE: ${selected.subject}`} 
                  className="bg-[#1A4A8A] hover:bg-[#0A1628] text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  Reply via Email
                </a>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                  Mark as Read
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">✉️</div>
              <p className="text-gray-400">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
