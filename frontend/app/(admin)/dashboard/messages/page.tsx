'use client'
import { useState, useEffect } from 'react'
import { messagesAPI } from '@/lib/api'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [filter, setFilter] = useState('All')

  const filters = ['All', 'NEW', 'READ', 'REPLIED']

  const fetchMessages = async () => {
    try {
      const data = await messagesAPI.getAll()
      setMessages(data.messages || [])
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const filtered = messages.filter((m: any) =>
    filter === 'All' ? true : m.status === filter
  )

  const markRead = async (msg: any) => {
    if (msg.isRead) {
      setSelected(msg)
      return
    }
    try {
      await messagesAPI.update(msg.id, { isRead: true })
      await fetchMessages()
      setSelected({ ...msg, isRead: true })
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
      setSelected(msg)
    }
  }

  const deleteMsg = async (id: string) => {
    if (!confirm('Delete this message?')) return
    try {
      await messagesAPI.delete(id)
      await fetchMessages()
      if (selected?.id === id) setSelected(null)
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    }
  }

  const sendReply = async () => {
    if (!selected) return
    try {
      await messagesAPI.update(selected.id, { status: 'REPLIED', isReplied: true })
      await fetchMessages()
      setSelected({ ...selected, status: 'REPLIED', isReplied: true })
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    }
  }

  if (loading) return <div className="text-center py-20 text-[#6B7A99]">Loading messages...</div>

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1628]" style={{ fontFamily: 'Playfair Display, serif' }}>Messages Inbox</h1>
        <p className="text-[#6B7A99] text-sm mt-1">{messages.filter((m: any) => !m.isRead).length} unread messages</p>
      </div>

      <div className="flex gap-2">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filter === f ? 'bg-[#0A1628] text-white' : 'bg-white text-[#6B7A99] hover:bg-[#EEF1F6]'}`}>
            {f}
            {f === 'NEW' && <span className="ml-1.5 bg-[#C8A84B] text-[#0A1628] rounded-full px-1.5 py-0.5 text-xs">{messages.filter((m: any) => !m.isRead).length}</span>}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-2">
          {filtered.map((msg: any) => (
            <div key={msg.id} onClick={() => markRead(msg)}
              className={`bg-white rounded-xl p-4 cursor-pointer border-2 transition-all hover:border-[#1A4A8A] ${selected?.id === msg.id ? 'border-[#1A4A8A]' : 'border-transparent'}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1A4A8A] flex items-center justify-center text-white text-xs font-bold">{msg.name.charAt(0)}</div>
                  <p className="font-semibold text-[#0A1628] text-sm">{msg.name}</p>
                  {!msg.isRead && <span className="w-2 h-2 rounded-full bg-[#C8A84B]" />}
                </div>
                <span className="text-xs text-[#6B7A99]">{msg.createdAt?.split('T')[0]}</span>
              </div>
              <p className="text-xs font-medium text-[#3D4A63] mb-1">{msg.subject}</p>
              <p className="text-xs text-[#6B7A99] truncate">{msg.message}</p>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-8 text-[#6B7A99] text-sm">No messages found</div>}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-2xl p-8 h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#1A4A8A] flex items-center justify-center text-white font-bold text-lg">{selected.name.charAt(0)}</div>
                  <div>
                    <h3 className="font-bold text-[#0A1628] text-lg">{selected.name}</h3>
                    <p className="text-[#6B7A99] text-sm">{selected.email}</p>
                    <p className="text-[#6B7A99] text-xs">{selected.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selected.status === 'NEW' ? 'bg-yellow-100 text-yellow-700' :
                    selected.status === 'REPLIED' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{selected.status}</span>
                  <button onClick={() => deleteMsg(selected.id)} className="text-xs bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1 rounded-full transition-colors">Delete</button>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-xs text-[#6B7A99] mb-1">Subject</p>
                <p className="font-semibold text-[#0A1628]">{selected.subject}</p>
              </div>
              <div className="bg-[#F8F9FC] rounded-xl p-5 mb-6">
                <p className="text-sm text-[#3D4A63] leading-relaxed">{selected.message}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#3D4A63] mb-2">Reply</p>
                <textarea rows={4} placeholder="Type your reply..."
                  className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] bg-[#F8F9FC] text-sm focus:outline-none focus:border-[#1A4A8A] resize-none mb-3" />
                <button onClick={sendReply} className="bg-[#1A4A8A] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0A1628] transition-colors">Send Reply →</button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-4">✉️</div>
                <p className="text-[#6B7A99]">Select a message to read it</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
