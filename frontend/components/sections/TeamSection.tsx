'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import fetchAPI from '@/lib/api'

export default function TeamSection() {
  const [team, setTeam] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAPI('/api/team')
      .then(data => {
        if (data.team && data.team.length > 0) {
          setTeam(data.team.slice(0, 4))
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const colors = [
    'from-[#1A4A8A] to-[#0A1628]', 'from-[#2da86a] to-[#1a6b42]',
    'from-[#C8A84B] to-[#8a6e2a]', 'from-[#8250c8] to-[#4a2a80]',
  ]

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 text-[#1A4A8A] text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
              Our People
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A1628]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Meet the Team
            </h2>
          </div>
          <Link href="/team" className="bg-[#C8A84B] hover:bg-[#E8C96A] text-[#0A1628] px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg w-fit">
            View All Members →
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin w-8 h-8 border-4 border-[#1A4A8A] border-t-transparent rounded-full" />
          </div>
        ) : team.length === 0 ? (
          <div className="text-center text-[#6B7A99] py-10">No team members listed.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member: any, i: number) => (
              <div key={i} className="bg-[#F8F9FC] rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group text-center">
                <div className={`bg-gradient-to-br ${colors[i % colors.length]} p-10 flex items-center justify-center`}>
                  {member.imageUrl ? (
                    <img src={member.imageUrl} alt={member.name} className="w-20 h-20 rounded-full object-cover border-2 border-white/30 group-hover:scale-110 transition-transform" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white/15 border-2 border-white/20 flex items-center justify-center text-white font-bold text-2xl group-hover:scale-110 transition-transform" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {member.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-[#0A1628] text-lg mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{member.name}</h3>
                  <p className="text-[#1A4A8A] text-xs font-semibold uppercase tracking-wider mb-3">{member.role}</p>
                  <p className="text-[#6B7A99] text-xs leading-relaxed line-clamp-3">{member.bio || ''}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
