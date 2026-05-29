'use client'
import { useState, useEffect } from 'react'
import { eventsAPI } from '@/lib/api'

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: '', slug: '', description: '', date: '', location: ''
  })

  const fetchEvents = async () => {
    try {
      const data = await eventsAPI.getAll()
      setEvents(data.events || [])
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const filtered = events.filter((e: any) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async () => {
    // Validate before sending
    if (!newEvent.title || !newEvent.title.trim()) {
      alert('Title is required')
      return
    }
    if (!newEvent.date) {
      alert('Date is required')
      return
    }
    
    setSaving(true)
    try {
      const payload = {
        title: newEvent.title.trim(),
        slug: newEvent.slug?.trim() || newEvent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now(),
        description: newEvent.description?.trim() || '',
        date: newEvent.date,
        location: newEvent.location?.trim() || '',
      }
      
      console.log('Sending payload:', payload)
      
      let result
      if (editingId) {
        result = await eventsAPI.update(editingId, payload)
      } else {
        result = await eventsAPI.create(payload)
      }
      
      console.log('Result:', result)
      await fetchEvents()
      setShowForm(false)
      setEditingId(null)
      setNewEvent({ title: '', slug: '', description: '', date: '', location: '' })
      alert(editingId ? 'Event updated!' : 'Event added!')
    } catch (error: any) {
      console.error('Error:', error)
      alert(error.message || 'Failed to save event')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (event: any) => {
    setNewEvent({
      title: event.title || '',
      slug: event.slug || '',
      description: event.description || '',
      date: event.date ? event.date.split('T')[0] : '',
      location: event.location || '',
    })
    setEditingId(event.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return
    try {
      await eventsAPI.delete(id)
      await fetchEvents()
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    }
  }

  if (loading) return <div className="text-center py-20 text-[#6B7A99]">Loading events...</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Events Manager
          </h1>
          <p className="text-[#6B7A99] text-sm mt-1">Manage all WYWA events</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-[#1A4A8A] hover:bg-[#0A1628] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5">
          + Add Event
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 border-2 border-[#1A4A8A]/20">
          <h2 className="font-bold text-[#0A1628] mb-4">{editingId ? 'Edit Event' : 'Add New Event'}</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <input value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="Title *" className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A]" />
            <input value={newEvent.slug} onChange={e => setNewEvent({...newEvent, slug: e.target.value})} placeholder="Slug (optional)" className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A]" />
            <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A]" />
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} placeholder="Location" className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A]" />
          </div>
          <textarea value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} placeholder="Description" rows={3} className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A] resize-none mb-4" />
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="bg-[#2da86a] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a6b42] transition-colors disabled:opacity-70">{saving ? 'Connecting to server... Please wait' : editingId ? 'Update Event' : 'Save Event'} ✓</button>
            <button onClick={() => { setShowForm(false); setEditingId(null); setNewEvent({ title: '', slug: '', description: '', date: '', location: '' }) }} className="bg-[#F8F9FC] text-[#6B7A99] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#EEF1F6] transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search events..."
          className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm focus:outline-none focus:border-[#1A4A8A] bg-[#F8F9FC]" />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0A1628] text-white">
              {['Event', 'Date', 'Location', 'Actions'].map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((event: any, i: number) => (
              <tr key={event.id} className={`border-b border-[#EEF1F6] hover:bg-[#F8F9FC] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFD]'}`}>
                <td className="px-6 py-4">
                  <p className="font-medium text-[#0A1628] text-sm">{event.title}</p>
                  <p className="text-xs text-[#6B7A99] mt-1 truncate max-w-xs">{event.description}</p>
                </td>
                <td className="px-6 py-4 text-sm text-[#6B7A99]">{event.date}</td>
                <td className="px-6 py-4 text-sm text-[#6B7A99]">{event.location}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(event)}
                      className="text-xs bg-[#EEF1F6] hover:bg-[#1A4A8A] hover:text-white text-[#3D4A63] px-3 py-1.5 rounded-lg transition-colors font-medium">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(event.id)}
                      className="text-xs bg-red-50 hover:bg-red-500 hover:text-white text-red-500 px-3 py-1.5 rounded-lg transition-colors font-medium">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#6B7A99]">No events found</div>
        )}
      </div>
    </div>
  )
}
