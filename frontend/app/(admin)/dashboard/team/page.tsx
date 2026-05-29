'use client'
import { useState, useEffect } from 'react'
import { teamAPI } from '@/lib/api'
import ImageUpload from '@/components/admin/ImageUpload'

export default function AdminTeamPage() {
  const [team, setTeam] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newMember, setNewMember] = useState({
    name: '', role: '', bio: '', email: '', phone: '', orderIndex: 0, imageUrl: ''
  })

  const fetchTeam = async () => {
    try {
      const data = await teamAPI.getAll()
      setTeam(data.team || [])
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeam()
  }, [])

  const filtered = team.filter((t: any) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async () => {
    // Validate before sending
    if (!newMember.name || !newMember.name.trim()) {
      alert('Name is required')
      return
    }
    if (!newMember.role || !newMember.role.trim()) {
      alert('Role is required')
      return
    }
    
    setSaving(true)
    try {
      const payload = {
        name: newMember.name.trim(),
        role: newMember.role.trim(),
        bio: newMember.bio?.trim() || '',
        email: newMember.email?.trim() || null,
        phone: newMember.phone?.trim() || null,
        orderIndex: newMember.orderIndex || 0,
        imageUrl: newMember.imageUrl?.trim() || null,
      }
      
      console.log('Sending payload:', payload)
      
      let result
      if (editingId) {
        result = await teamAPI.update(editingId, payload)
      } else {
        result = await teamAPI.create(payload)
      }
      
      console.log('Result:', result)
      await fetchTeam()
      setShowForm(false)
      setEditingId(null)
      setNewMember({ name: '', role: '', bio: '', email: '', phone: '', orderIndex: 0, imageUrl: '' })
      alert(editingId ? 'Member updated!' : 'Member added!')
    } catch (error: any) {
      console.error('Error:', error)
      alert(error.message || 'Failed to save team member')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (member: any) => {
    setNewMember({
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      email: member.email || '',
      phone: member.phone || '',
      orderIndex: member.orderIndex || 0,
      imageUrl: member.imageUrl || '',
    })
    setEditingId(member.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deactivate this team member?')) return
    try {
      await teamAPI.delete(id)
      await fetchTeam()
    } catch (err: any) {
      alert(err.message || 'Connection error — make sure backend is running on port 8000')
    }
  }

  if (loading) return <div className="text-center py-20 text-[#6B7A99]">Loading team...</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628]" style={{ fontFamily: 'Playfair Display, serif' }}>Team Manager</h1>
          <p className="text-[#6B7A99] text-sm mt-1">Manage WYWA team members</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-[#1A4A8A] hover:bg-[#0A1628] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5">
          + Add Member
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 border-2 border-[#1A4A8A]/20">
          <h2 className="font-bold text-[#0A1628] mb-4">{editingId ? 'Edit Team Member' : 'Add Team Member'}</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} placeholder="Name *" className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A]" />
            <input value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} placeholder="Role *" className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A]" />
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} placeholder="Email" className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A]" />
            <input value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} placeholder="Phone" className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A]" />
          </div>
          <textarea value={newMember.bio} onChange={e => setNewMember({...newMember, bio: e.target.value})} placeholder="Bio" rows={3} className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm bg-[#F8F9FC] focus:outline-none focus:border-[#1A4A8A] resize-none mb-4" />
          <div className="mb-4">
            <ImageUpload
              value={newMember.imageUrl}
              onChange={url => setNewMember({...newMember, imageUrl: url})}
              folder="wywa/team"
              label="Profile Photo"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="bg-[#2da86a] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a6b42] transition-colors disabled:opacity-70">{saving ? 'Connecting to server... Please wait' : editingId ? 'Update Member' : 'Save Member'} ✓</button>
            <button onClick={() => { setShowForm(false); setEditingId(null); setNewMember({ name: '', role: '', bio: '', email: '', phone: '', orderIndex: 0, imageUrl: '' }) }} className="bg-[#F8F9FC] text-[#6B7A99] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#EEF1F6] transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search team members..."
          className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6] text-sm focus:outline-none focus:border-[#1A4A8A] bg-[#F8F9FC]" />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0A1628] text-white">
              {['Name', 'Role', 'Email', 'Actions'].map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((member: any, i: number) => (
              <tr key={member.id} className={`border-b border-[#EEF1F6] hover:bg-[#F8F9FC] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFD]'}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1A4A8A] to-[#0A1628] flex items-center justify-center text-white font-bold text-xs">
                      {member.name.charAt(0)}
                    </div>
                    <p className="font-medium text-[#0A1628] text-sm">{member.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#6B7A99]">{member.role}</td>
                <td className="px-6 py-4 text-sm text-[#6B7A99]">{member.email || '—'}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(member)} className="text-xs bg-[#EEF1F6] hover:bg-[#1A4A8A] hover:text-white text-[#3D4A63] px-3 py-1.5 rounded-lg transition-colors font-medium">Edit</button>
                    <button onClick={() => handleDelete(member.id)} className="text-xs bg-red-50 hover:bg-red-500 hover:text-white text-red-500 px-3 py-1.5 rounded-lg transition-colors font-medium">Deactivate</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-[#6B7A99]">No team members found</div>}
      </div>
    </div>
  )
}
