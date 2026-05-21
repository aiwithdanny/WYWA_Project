'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import fetchAPI from '@/lib/api'

const categoryMeta: any = {
  EDUCATION:              { tag: 'Education',    icon: '🎓', tagColor: 'bg-blue-100 text-blue-700' },
  HEALTH:                 { tag: 'Health',       icon: '🏥', tagColor: 'bg-green-100 text-green-700' },
  DISASTER_RELIEF:        { tag: 'Relief',       icon: '🆘', tagColor: 'bg-orange-100 text-orange-700' },
  YOUTH_EMPOWERMENT:      { tag: 'Youth',        icon: '🌟', tagColor: 'bg-purple-100 text-purple-700' },
  INFRASTRUCTURE:         { tag: 'Infrastructure', icon: '💧', tagColor: 'bg-teal-100 text-teal-700' },
  COMMUNITY_DEVELOPMENT:  { tag: 'Community',    icon: '🤝', tagColor: 'bg-yellow-100 text-yellow-700' },
  OTHER:                  { tag: 'Other',        icon: '📋', tagColor: 'bg-gray-100 text-gray-700' },
}

export default function Programs() {
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAPI('/api/programs?status=PUBLISHED')
      .then(data => {
        if (data.programs && data.programs.length > 0) {
          const mapped = data.programs.slice(0, 6).map((p: any) => {
            const meta = categoryMeta[p.category || 'OTHER']
            return {
              tag: meta?.tag || p.category,
              icon: meta?.icon || '📋',
              title: p.title,
              desc: p.description || '',
              meta1: `${p.beneficiaries || 0}+ Beneficiaries`,
              meta2: p.location || 'Waziristan',
              tagColor: meta?.tagColor || 'bg-gray-100 text-gray-700',
            }
          })
          setPrograms(mapped)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="bg-[#0A1628] py-24" id="programs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end
          justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 text-[#E8C96A]
              text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
              Programs
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Active Initiatives
            </h2>
          </div>
          <Link href="/programs"
            className="bg-[#C8A84B] hover:bg-[#E8C96A] text-[#0A1628]
              px-6 py-3 rounded-lg font-semibold text-sm
              transition-all duration-200 hover:-translate-y-0.5
              hover:shadow-lg w-fit">
            View All Programs →
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin w-8 h-8 border-4 border-[#C8A84B] border-t-transparent rounded-full" />
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center text-white/50 py-10">No active programs at the moment.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((p, i) => (
              <div key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-8
                  hover:bg-white/10 hover:border-[#C8A84B]/30
                  transition-all duration-300 hover:-translate-y-1
                  group cursor-pointer">

                {/* Tag */}
                <span className={`inline-block px-3 py-1 rounded-full
                  text-xs font-semibold uppercase tracking-wider mb-5
                  ${p.tagColor}`}>
                  {p.tag}
                </span>

                {/* Icon + Title */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl">{p.icon}</span>
                  <h3 className="text-white font-semibold text-lg leading-tight
                    group-hover:text-[#C8A84B] transition-colors">
                    {p.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  {p.desc}
                </p>

                {/* Meta */}
                <div className="flex gap-4 pt-4 border-t border-white/10">
                  <span className="text-xs text-white/30">{p.meta1}</span>
                  <span className="text-xs text-white/30">{p.meta2}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
