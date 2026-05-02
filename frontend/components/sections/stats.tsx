'use client'
import { useEffect, useRef } from 'react'

const stats = [
  { num: 12000, suffix: '+', label: 'Beneficiaries Reached', icon: '👥', color: '#1A4A8A' },
  { num: 320,   suffix: '+', label: 'Scholarships Awarded',  icon: '🎓', color: '#C8A84B' },
  { num: 60,    suffix: '+', label: 'Wells & Water Points',  icon: '💧', color: '#2da86a' },
  { num: 45,    suffix: '+', label: 'Active Programs',       icon: '📋', color: '#e0722a' },
]

function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const done = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done.current) {
        done.current = true
        let current = 0
        const step = target / (1800 / 16)
        const timer = setInterval(() => {
          current += step
          if (current >= target) {
            el.textContent = target.toLocaleString()
            clearInterval(timer)
          } else {
            el.textContent = Math.floor(current).toLocaleString()
          }
        }, 16)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])
  return <span ref={ref}>0</span>
}

export default function Stats() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-[#1A4A8A]
            text-xs font-semibold uppercase tracking-widest mb-3">
            <span className="w-7 h-0.5 bg-[#C8A84B]" />
            Our Impact
            <span className="w-7 h-0.5 bg-[#C8A84B]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0A1628]"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Numbers That Tell a Story
          </h2>
          <p className="text-[#6B7A99] mt-4 max-w-xl mx-auto text-base leading-relaxed">
            Every number represents a real person, a real family, a real
            community transformed by collective action.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i}
              className="bg-[#F8F9FC] rounded-2xl p-8 text-center
                hover:-translate-y-2 transition-all duration-300
                hover:shadow-xl cursor-default"
              style={{ borderBottom: `4px solid ${stat.color}` }}>
              <div className="text-4xl mb-4">{stat.icon}</div>
              <div className="flex items-end justify-center gap-1 mb-2">
                <span className="text-4xl md:text-5xl font-bold text-[#0A1628]"
                  style={{ fontFamily: 'Playfair Display, serif' }}>
                  <CountUp target={stat.num} />
                </span>
                <span className="text-2xl font-bold mb-1"
                  style={{ color: stat.color }}>
                  {stat.suffix}
                </span>
              </div>
              <p className="text-sm text-[#6B7A99] font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
