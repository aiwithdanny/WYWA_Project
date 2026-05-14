'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { statsAPI, messagesAPI, donationsAPI, programsAPI, authAPI } from '@/lib/api'

const quickLinks = [
  { href: '/dashboard/programs',   label: 'Add Program',    icon: '�', color: '#1A4A8A' },
  { href: '/dashboard/events',     label: 'Add Event',      icon: '�', color: '#C8A84B' },
  { href: '/dashboard/news',       label: 'Write Article',  icon: '�', color: '#2da86a' },
  { href: '/dashboard/team',       label: 'Add Member',     icon: '👥', color: '#8250c8' },
  { href: '/dashboard/gallery',    label: 'Upload Photos',  icon: '🖼️', color: '#14a0a0' },
  { href: '/dashboard/messages',   label: 'View Messages',  icon: '✉️', color: '#e0722a' },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [recentDonations, setRecentDonations] = useState<any[]>([])
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const user = authAPI.getUser()

  useEffect(() => {
    Promise.all([
      statsAPI.get().catch(() => null),
      messagesAPI.getAll().catch(() => null),
      donationsAPI.getAll().catch(() => null),
      programsAPI.getAll().catch(() => null),
    ]).then(([statsRes, messagesRes, donationsRes, programsRes]) => {
      if (statsRes?.stats) setStats(statsRes.stats)
      if (messagesRes?.messages) setRecentMessages(messagesRes.messages.slice(0, 4))
      if (donationsRes?.donations) setRecentDonations(donationsRes.donations.slice(0, 4))
      if (programsRes?.programs) setPrograms(programsRes.programs)
      setLoading(false)
    }).catch(() => {
      alert('Connection error — make sure backend is running on port 8000')
      setLoading(false)
    })
  }, [])

  const statCards = stats ? [
    { label: 'Total Beneficiaries', value: (stats.beneficiaries || 0).toLocaleString(), icon: '👥', color: '#1A4A8A', change: `${stats.activePrograms || 0} active programs` },
    { label: 'Active Programs',     value: (stats.activePrograms || 0).toString(),       icon: '📋', color: '#C8A84B', change: 'Programs running' },
    { label: 'Total Donations',     value: `PKR ${((stats.totalDonations || 0) / 1000000).toFixed(1)}M`, icon: '💰', color: '#2da86a', change: `${stats.donationCount || 0} donations` },
    { label: 'Volunteers',          value: (stats.volunteers || 0).toString(),           icon: '🤝', color: '#e0722a', change: `${stats.activeVolunteers || 0} active` },
    { label: 'Messages',            value: (stats.messagesTotal || 0).toString(),          icon: '✉️', color: '#8250c8', change: `${stats.messagesUnread || 0} unread` },
    { label: 'Upcoming Events',     value: (stats.upcomingEvents || 0).toString(),         icon: '�', color: '#14a0a0', change: `${stats.totalEvents || 0} total` },
  ] : []

  const categoryCounts = programs.reduce((acc: any, p: any) => {
    const cat = p.category?.toLowerCase() || 'other'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {})

  const categoryColors: any = {
    education: '#1A4A8A', health: '#2da86a', disaster_relief: '#e0722a',
    youth_empowerment: '#8250c8', infrastructure: '#14a0a0', community_development: '#C8A84B',
  }

  const categoryLabels: any = {
    education: 'Education', health: 'Health', disaster_relief: 'Relief',
    youth_empowerment: 'Youth', infrastructure: 'Infrastructure', community_development: 'Community',
  }

  if (loading) return <div className="text-center py-20 text-[#6B7A99]">Loading dashboard...</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-[#0A1628] to-[#1A4A8A] rounded-2xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Welcome back, {user?.name || 'Admin'}! 👋
        </h1>
        <p className="text-white/60 text-sm">Here is what is happening with WYWA today.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat: any, i: number) => (
          <div key={i} className="bg-white rounded-2xl p-5 hover:-translate-y-1 transition-all duration-200 hover:shadow-lg"
            style={{ borderBottom: `3px solid ${stat.color}` }}>
            <div className="text-2xl mb-3">{stat.icon}</div>
            <div className="text-xl font-bold text-[#0A1628] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
              {stat.value}
            </div>
            <div className="text-xs text-[#6B7A99] mb-2">{stat.label}</div>
            <div className="text-xs font-medium" style={{ color: stat.color }}>{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6">
        <h2 className="font-bold text-[#0A1628] mb-4 text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>Quick Actions</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {quickLinks.map((link, i) => (
            <Link key={i} href={link.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F8F9FC] hover:bg-white hover:shadow-md transition-all duration-200 border border-transparent hover:border-[#EEF1F6] group">
              <span className="text-2xl group-hover:scale-110 transition-transform">{link.icon}</span>
              <span className="text-xs font-medium text-[#3D4A63] text-center leading-tight">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0A1628] text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>Recent Messages</h2>
            <Link href="/dashboard/messages" className="text-xs text-[#1A4A8A] font-medium hover:underline">View All →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentMessages.length === 0 && <p className="text-sm text-[#6B7A99]">No recent messages</p>}
            {recentMessages.map((msg: any, i: number) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-[#F8F9FC] hover:bg-[#EEF1F6] transition-colors">
                <div className="w-9 h-9 rounded-full bg-[#1A4A8A] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">{msg.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#0A1628] truncate">{msg.name}</p>
                    {!msg.isRead && <span className="w-2 h-2 rounded-full bg-[#C8A84B] flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-[#6B7A99] truncate">{msg.subject}</p>
                </div>
                <span className="text-xs text-[#6B7A99] flex-shrink-0">{msg.createdAt?.split('T')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0A1628] text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>Recent Donations</h2>
            <Link href="/dashboard/donations" className="text-xs text-[#1A4A8A] font-medium hover:underline">View All →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentDonations.length === 0 && <p className="text-sm text-[#6B7A99]">No donations yet</p>}
            {recentDonations.map((don: any, i: number) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-[#F8F9FC] hover:bg-[#EEF1F6] transition-colors">
                <div className="w-9 h-9 rounded-full bg-[#2da86a] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">{don.isAnonymous ? 'A' : don.donorName.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0A1628]">{don.isAnonymous ? 'Anonymous' : don.donorName}</p>
                  <p className="text-xs text-[#6B7A99] truncate">{don.campaign}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-[#2da86a]">PKR {don.amount?.toLocaleString()}</p>
                  <p className="text-xs text-[#6B7A99]">{don.createdAt?.split('T')[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#0A1628] text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>Programs Overview</h2>
          <Link href="/dashboard/programs" className="text-xs text-[#1A4A8A] font-medium hover:underline">Manage Programs →</Link>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {Object.entries(categoryCounts).map(([cat, count]: [string, any], i: number) => (
            <div key={i} className="rounded-xl p-4 text-center" style={{ background: `${categoryColors[cat] || '#6B7A99'}15` }}>
              <p className="text-2xl font-bold mb-1" style={{ color: categoryColors[cat] || '#6B7A99', fontFamily: 'Playfair Display, serif' }}>{count}</p>
              <p className="text-xs text-[#6B7A99] font-medium">{categoryLabels[cat] || cat} Programs</p>
            </div>
          ))}
          {Object.keys(categoryCounts).length === 0 && (
            <div className="col-span-full text-center py-8 text-[#6B7A99]">No programs yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
