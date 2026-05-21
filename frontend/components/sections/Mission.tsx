export default function Mission() {
  const points = [
    { icon: '📚', title: 'Education First',
      desc: 'Providing scholarships, learning centers, and vocational training.' },
    { icon: '🤝', title: 'Community-Led Development',
      desc: 'Building infrastructure, livelihoods, and social capital.' },
    { icon: '🚑', title: 'Rapid Relief Response',
      desc: 'Mobilizing quickly during disasters to deliver aid.' },
    { icon: '🌱', title: 'Sustainable Impact',
      desc: 'Creating programs that last — generational change.' },
  ]
  return (
    <section className="bg-[#F8F9FC] py-24" id="mission">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative bg-gradient-to-br from-[#0A1628] to-[#1A4A8A]
            rounded-2xl p-10 overflow-hidden">
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#C8A84B]"
              style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
            <span className="text-7xl block mb-6">🏔️</span>
            <blockquote className="text-white/90 text-xl leading-relaxed italic mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              "Every young person in Waziristan deserves the opportunity
              to thrive, lead, and shape their own destiny."
            </blockquote>
            <p className="text-[#C8A84B] text-sm font-semibold uppercase tracking-widest">
              — WYWA Foundation
            </p>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 text-[#1A4A8A]
              text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
              Our Mission
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A1628] mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Rooted in Community.<br />
              <span className="text-[#1A4A8A]">Driven by Purpose.</span>
            </h2>
            <p className="text-[#6B7A99] leading-relaxed mb-8">
              Founded in 2010, WYWA has been a beacon of hope and progress
              in Waziristan — working tirelessly to uplift youth and
              strengthen communities through integrated programs and
              grassroots action.
            </p>
            <div className="flex flex-col gap-4">
              {points.map((p, i) => (
                <div key={i}
                  className="flex gap-4 items-start bg-white rounded-xl p-4
                    border-l-4 border-[#3B82D4] hover:translate-x-1
                    transition-all duration-200 hover:shadow-md">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <h4 className="font-semibold text-[#0A1628] text-sm mb-1">
                      {p.title}
                    </h4>
                    <p className="text-xs text-[#6B7A99] leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
