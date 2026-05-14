'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { programsAPI } from '@/lib/api'

const categoryMeta: any = {
  EDUCATION:              { tag: 'Education',    icon: '🎓', color: '#1A4A8A', tagColor: 'bg-blue-100 text-blue-700' },
  HEALTH:                 { tag: 'Health',       icon: '🏥', color: '#2da86a', tagColor: 'bg-green-100 text-green-700' },
  DISASTER_RELIEF:        { tag: 'Relief',       icon: '🆘', color: '#e0722a', tagColor: 'bg-orange-100 text-orange-700' },
  YOUTH_EMPOWERMENT:      { tag: 'Youth',        icon: '🌟', color: '#8250c8', tagColor: 'bg-purple-100 text-purple-700' },
  INFRASTRUCTURE:         { tag: 'Infrastructure', icon: '💧', color: '#14a0a0', tagColor: 'bg-teal-100 text-teal-700' },
  COMMUNITY_DEVELOPMENT:  { tag: 'Community',    icon: '🤝', color: '#C8A84B', tagColor: 'bg-yellow-100 text-yellow-700' },
  OTHER:                  { tag: 'Other',        icon: '📋', color: '#6B7A99', tagColor: 'bg-gray-100 text-gray-700' },
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    programsAPI.getAll()
      .then(data => {
        if (data.programs && data.programs.length > 0) {
          const mapped = data.programs.map((p: any) => {
            const meta = categoryMeta[p.category || 'OTHER']
            return {
              tag: meta?.tag || p.category,
              icon: meta?.icon || '📋',
              title: p.title,
              desc: p.description || '',
              stats: [
                `${p.beneficiaries || 0}+ Beneficiaries`,
                p.status === 'PUBLISHED' ? 'Active' : 'Draft',
                p.location || 'Waziristan'
              ],
              color: meta?.color || '#6B7A99',
              tagColor: meta?.tagColor || 'bg-gray-100 text-gray-700'
            }
          })
          setPrograms(mapped)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[#0A1628] pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 text-[#E8C96A]
              text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
              What We Do
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Programs
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              From education to disaster relief — explore all active
              initiatives making a real difference in Waziristan.
            </p>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="bg-[#F8F9FC] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-[#1A4A8A] border-t-transparent rounded-full" />
                <span className="ml-3 text-[#6B7A99]">Loading programs...</span>
              </div>
            ) : programs.length === 0 ? (
              <div className="text-center py-20 text-[#6B7A99]">
                <p className="text-lg font-medium">No programs available</p>
                <p className="text-sm mt-2">Check back soon for updates.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((p, i) => (
                  <div key={i}
                    className="bg-white rounded-2xl p-8 hover:-translate-y-2
                      transition-all duration-300 hover:shadow-xl group"
                    style={{ borderBottom: `4px solid ${p.color}` }}>
                    <span className={`inline-block px-3 py-1 rounded-full
                      text-xs font-semibold uppercase tracking-wider mb-5
                      ${p.tagColor}`}>
                      {p.tag}
                    </span>
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-3xl">{p.icon}</span>
                      <h3 className="font-bold text-[#0A1628] text-lg
                        leading-tight group-hover:text-[#1A4A8A]
                        transition-colors"
                        style={{ fontFamily: 'Playfair Display, serif' }}>
                        {p.title}
                      </h3>
                    </div>
                    <p className="text-[#6B7A99] text-sm leading-relaxed mb-6">
                      {p.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-4
                      border-t border-[#EEF1F6]">
                      {p.stats.map((s, j) => (
                        <span key={j}
                          className="text-xs bg-[#F8F9FC] text-[#3D4A63]
                            px-3 py-1 rounded-full font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0A1628] py-16 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Want to Support a Program?
            </h2>
            <p className="text-white/60 mb-8">
              Your donation directly funds these life-changing initiatives.
            </p>
            <Link href="/donate"
              className="bg-[#C8A84B] hover:bg-[#E8C96A] text-[#0A1628]
                px-10 py-4 rounded-lg font-bold text-base
                transition-all duration-200 hover:-translate-y-1">
              Donate Now ❤️
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
