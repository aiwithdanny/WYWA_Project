import Link from 'next/link'

const programs = [
  {
    tag: 'Education',
    tagColor: 'bg-blue-100 text-blue-700',
    icon: '🎓',
    title: 'WYWA Scholarship Fund',
    desc: 'Annual scholarships for outstanding students from low-income families to attend universities and professional colleges.',
    meta1: '🎓 320+ Scholars',
    meta2: '📅 Ongoing',
    border: '#1A4A8A',
  },
  {
    tag: 'Livelihoods',
    tagColor: 'bg-yellow-100 text-yellow-700',
    icon: '💼',
    title: 'Skills & Vocational Training',
    desc: 'Free trade training in carpentry, tailoring, IT, and healthcare — building economic independence for youth and women.',
    meta1: '👥 1,200+ Trained',
    meta2: '📅 Ongoing',
    border: '#C8A84B',
  },
  {
    tag: 'Health',
    tagColor: 'bg-green-100 text-green-700',
    icon: '🏥',
    title: 'Mobile Health Clinics',
    desc: 'Regular medical camps and mobile health units serving remote villages with basic healthcare and maternal support.',
    meta1: '🏥 40+ Villages',
    meta2: '📅 Monthly',
    border: '#2da86a',
  },
  {
    tag: 'Relief',
    tagColor: 'bg-red-100 text-red-700',
    icon: '🆘',
    title: 'Flood & Disaster Relief',
    desc: 'Emergency response operations providing food, non-food items, and temporary shelter to affected families.',
    meta1: '🆘 5,000+ Families',
    meta2: '📅 As Needed',
    border: '#e0722a',
  },
  {
    tag: 'Leadership',
    tagColor: 'bg-purple-100 text-purple-700',
    icon: '🌟',
    title: 'Youth Leadership Academy',
    desc: 'A 6-month intensive program nurturing the next generation of community leaders, advocates, and social entrepreneurs.',
    meta1: '🌟 180 Graduates',
    meta2: '📅 Annual',
    border: '#8250c8',
  },
  {
    tag: 'Infrastructure',
    tagColor: 'bg-teal-100 text-teal-700',
    icon: '💧',
    title: 'Clean Water Initiative',
    desc: 'Installing hand pumps, filtration units, and water storage systems in underserved villages across South Waziristan.',
    meta1: '💧 60+ Wells Built',
    meta2: '📅 Ongoing',
    border: '#14a0a0',
  },
]

export default function Programs() {
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
      </div>
    </section>
  )
}
