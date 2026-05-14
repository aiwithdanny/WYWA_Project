'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { teamAPI } from '@/lib/api'

export default function TeamPage() {
  const [team, setTeam] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    teamAPI.getAll()
      .then(data => {
        if (data.team && data.team.length > 0) {
          const colors = [
            'from-[#1A4A8A] to-[#0A1628]', 'from-[#2da86a] to-[#1a6b42]',
            'from-[#C8A84B] to-[#8a6e2a]', 'from-[#8250c8] to-[#4a2a80]',
            'from-[#e0722a] to-[#8a3a10]', 'from-[#14a0a0] to-[#0a5050]',
            'from-[#e0728a] to-[#8a2a40]', 'from-[#2563B0] to-[#0a2a60]',
          ]
          const mapped = data.team.map((t: any, i: number) => ({
            name: t.name,
            role: t.role,
            initial: t.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
            bio: t.bio || '',
            color: colors[i % colors.length],
            imageUrl: t.imageUrl || '',
          }))
          setTeam(mapped)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#0A1628] pt-32 pb-20 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 text-[#E8C96A]
              text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
              Leadership
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Meet Our Team
            </h1>
            <p className="text-white/60 text-lg">
              Dedicated individuals committed to service, integrity,
              and community-first leadership.
            </p>
          </div>
        </section>

        <section className="bg-[#F8F9FC] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-[#1A4A8A] border-t-transparent rounded-full" />
                <span className="ml-3 text-[#6B7A99]">Loading team...</span>
              </div>
            ) : team.length === 0 ? (
              <div className="text-center py-20 text-[#6B7A99]">
                <p className="text-lg font-medium">No team members listed</p>
                <p className="text-sm mt-2">Check back soon for updates.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.map((member, i) => (
                <div key={i}
                  className="bg-white rounded-2xl overflow-hidden
                    hover:-translate-y-2 transition-all duration-300
                    hover:shadow-xl group">
                  <div className={`bg-gradient-to-br ${member.color}
                    p-10 flex items-center justify-center`}>
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-white/30
                          group-hover:scale-110 transition-transform" />
                    ) : (
                      <div className="w-20 h-20 rounded-full
                        bg-white/15 border-2 border-white/20
                        flex items-center justify-center
                        text-white font-bold text-2xl
                        group-hover:scale-110 transition-transform"
                        style={{ fontFamily: 'Playfair Display, serif' }}>
                        {member.initial}
                      </div>
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-[#0A1628] text-lg mb-1"
                      style={{ fontFamily: 'Playfair Display, serif' }}>
                      {member.name}
                    </h3>
                    <p className="text-[#1A4A8A] text-xs font-semibold
                      uppercase tracking-wider mb-3">
                      {member.role}
                    </p>
                    <p className="text-[#6B7A99] text-xs leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </section>

        <section className="bg-[#0A1628] py-16 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Want to Join Our Team?
            </h2>
            <p className="text-white/60 mb-8">
              We are always looking for passionate individuals to join
              our mission of serving Waziristan.
            </p>
            <a href="/volunteer"
              className="bg-[#C8A84B] hover:bg-[#E8C96A] text-[#0A1628]
                px-10 py-4 rounded-lg font-bold text-base
                transition-all duration-200 hover:-translate-y-1
                inline-block">
              Apply as Volunteer →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
