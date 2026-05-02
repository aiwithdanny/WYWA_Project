import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1A4A8A 0%, #0A1628 100%)' }}>

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #C8A84B 0%, transparent 70%)' }} />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 text-[#E8C96A]
          text-xs font-semibold uppercase tracking-widest mb-6">
          <span className="w-7 h-0.5 bg-[#C8A84B]" />
          Make a Difference
          <span className="w-7 h-0.5 bg-[#C8A84B]" />
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6"
          style={{ fontFamily: 'Playfair Display, serif' }}>
          Support the Mission.<br />
          <span className="text-[#C8A84B]">Change a Life.</span>
        </h2>

        <p className="text-white/60 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Your contribution — big or small — directly funds education,
          relief, and community programs in Waziristan.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/donate"
            className="bg-[#C8A84B] hover:bg-[#E8C96A] text-[#0A1628]
              px-10 py-4 rounded-lg font-bold text-base
              transition-all duration-200 hover:-translate-y-1
              hover:shadow-2xl hover:shadow-[#C8A84B]/30">
            Donate Now ❤️
          </Link>
          <Link href="/volunteer"
            className="border border-white/20 hover:border-white/50
              text-white hover:bg-white/5
              px-10 py-4 rounded-lg font-medium text-base
              transition-all duration-200">
            Become a Volunteer
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-8 mt-14">
          {[
            { icon: '🏛️', text: 'NGO Registered' },
            { icon: '✅', text: 'SECP Certified' },
            { icon: '🔒', text: 'Secure Donations' },
            { icon: '📊', text: 'Transparent Reports' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-white/40 text-sm">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
