'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const stats = [
  { num: 12000, suffix: '+', label: 'Lives Impacted' },
  { num: 45,    suffix: '+', label: 'Active Programs' },
  { num: 14,    suffix: '+', label: 'Years of Service' },
  { num: 320,   suffix: '+', label: 'Scholarships' },
]

function useCountUp(target: number, duration = 2000) {
  const ref = useRef<HTMLSpanElement>(null)
  const observed = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !observed.current) {
        observed.current = true
        let start = 0
        const step = target / (duration / 16)
        const timer = setInterval(() => {
          start += step
          if (start >= target) {
            el.textContent = target.toLocaleString()
            clearInterval(timer)
          } else {
            el.textContent = Math.floor(start).toLocaleString()
          }
        }, 16)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return ref
}

function StatItem({ num, suffix, label }: { num: number; suffix: string; label: string }) {
  const ref = useCountUp(num)
  return (
    <div className="text-center">
      <div className="flex items-end justify-center gap-0.5">
        <span ref={ref}
          className="text-4xl md:text-5xl font-bold text-white"
          style={{ fontFamily: 'Playfair Display, serif' }}>
          0
        </span>
        <span className="text-3xl font-bold text-[#C8A84B] mb-1">{suffix}</span>
      </div>
      <p className="text-xs text-white/50 uppercase tracking-widest mt-1">{label}</p>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#0A1628] flex flex-col
      justify-center overflow-hidden pt-20">

      {/* Grid Background */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,212,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,212,0.4) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }} />

      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #2563B0 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-20 w-64 h-64 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #C8A84B 0%, transparent 70%)' }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
        py-20 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left — Text */}
        <div className="flex flex-col gap-6">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 w-fit
            bg-[#C8A84B]/10 border border-[#C8A84B]/30
            text-[#E8C96A] px-4 py-2 rounded-full text-xs
            font-medium tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A84B] animate-pulse" />
            Est. 2010 · Waziristan, Pakistan
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold
            text-white leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Empowering<br />
            Youth,<br />
            Building{' '}
            <span className="text-[#C8A84B]">Brighter</span><br />
            Futures
          </h1>

          {/* Tagline */}
          <p className="text-lg text-white/60 italic"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            "Serving the heart of Waziristan — one life at a time."
          </p>

          {/* Description */}
          <p className="text-base text-white/50 max-w-lg leading-relaxed">
            The Waziristan Youth Welfare Association is dedicated to education,
            community development, disaster relief, and youth empowerment —
            creating lasting change for the people of Waziristan.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-2">
            <Link href="/programs"
              className="bg-[#C8A84B] hover:bg-[#E8C96A] text-[#0A1628]
                px-8 py-4 rounded-lg font-semibold text-[15px]
                transition-all duration-200 hover:-translate-y-1
                hover:shadow-xl hover:shadow-[#C8A84B]/30">
              Explore Programs →
            </Link>
            <Link href="/contact"
              className="border border-white/20 hover:border-white/50
                text-white/80 hover:text-white
                px-8 py-4 rounded-lg font-medium text-[15px]
                transition-all duration-200 hover:bg-white/5">
              Partner With Us
            </Link>
          </div>
        </div>

        {/* Right — Logo Visual */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2
              border-[#C8A84B]/20 animate-pulse scale-110" />
            {/* Middle ring */}
            <div className="absolute inset-0 rounded-full border
              border-[#1A4A8A]/40 scale-125" />

            {/* Logo Container */}
            <div className="relative w-72 h-72 rounded-full
              bg-gradient-to-br from-[#1A4A8A] to-[#0A1628]
              border-4 border-[#C8A84B]/30
              flex items-center justify-center
              shadow-2xl shadow-[#1A4A8A]/50">
              <Image
                src="https://res.cloudinary.com/dji2qef4l/image/upload/v1777286646/WYWA-LOGO.jpg"
                alt="WYWA Official Logo"
                width={220}
                height={220}
                className="rounded-full object-cover"
                priority
              />
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-[#C8A84B]
              text-[#0A1628] px-4 py-2 rounded-full text-xs font-bold
              shadow-lg">
              Since 2010 ✨
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#1A4A8A]
              text-white px-4 py-2 rounded-full text-xs font-bold
              shadow-lg border border-[#C8A84B]/30">
              South Waziristan 📍
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 border-t border-white/10 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <StatItem key={i} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
