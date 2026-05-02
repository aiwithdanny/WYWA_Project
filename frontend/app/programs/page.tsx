import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Programs — WYWA',
  description: 'Explore all active programs of Waziristan Youth Welfare Association including scholarships, health clinics, disaster relief, vocational training and more.',
  keywords: ['WYWA programs', 'Waziristan scholarship', 'NGO programs Pakistan', 'youth programs KPK'],
  openGraph: {
    title: 'Our Programs — WYWA',
    description: 'Explore all active WYWA programs making a difference in Waziristan.',
    url: 'https://wywa.org.pk/programs',
    siteName: 'WYWA',
    images: [{ url: 'https://res.cloudinary.com/dji2qef4l/image/upload/v1777286646/WYWA-LOGO.jpg', width: 800, height: 600, alt: 'WYWA Logo' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Programs — WYWA',
    description: 'Explore all active WYWA programs making a difference in Waziristan.',
    images: ['https://res.cloudinary.com/dji2qef4l/image/upload/v1777286646/WYWA-LOGO.jpg'],
  },
  alternates: { canonical: 'https://wywa.org.pk/programs' },
}

const programs = [
  { tag: 'Education', icon: '🎓', title: 'WYWA Scholarship Fund',
    desc: 'Annual scholarships for outstanding students from low-income families to attend universities and professional colleges across Pakistan.',
    stats: ['320+ Scholars', '14 Years Running', 'PKR 50,000/year'],
    color: '#1A4A8A', tagColor: 'bg-blue-100 text-blue-700' },
  { tag: 'Livelihoods', icon: '💼', title: 'Skills & Vocational Training',
    desc: 'Free trade training in carpentry, tailoring, IT, and healthcare — building economic independence for youth and women.',
    stats: ['1,200+ Trained', '8 Trades Offered', 'Free of Cost'],
    color: '#C8A84B', tagColor: 'bg-yellow-100 text-yellow-700' },
  { tag: 'Health', icon: '🏥', title: 'Mobile Health Clinics',
    desc: 'Regular medical camps and mobile health units serving remote villages with basic healthcare and maternal support.',
    stats: ['40+ Villages', 'Monthly Camps', 'Free Healthcare'],
    color: '#2da86a', tagColor: 'bg-green-100 text-green-700' },
  { tag: 'Relief', icon: '🆘', title: 'Flood & Disaster Relief',
    desc: 'Emergency response operations providing food, non-food items, and temporary shelter to affected families across Waziristan.',
    stats: ['5,000+ Families', 'Rapid Response', '48hr Deployment'],
    color: '#e0722a', tagColor: 'bg-red-100 text-red-700' },
  { tag: 'Leadership', icon: '🌟', title: 'Youth Leadership Academy',
    desc: 'A 6-month intensive program nurturing the next generation of community leaders, advocates, and social entrepreneurs.',
    stats: ['180 Graduates', '6-Month Program', 'Annual Intake'],
    color: '#8250c8', tagColor: 'bg-purple-100 text-purple-700' },
  { tag: 'Infrastructure', icon: '💧', title: 'Clean Water Initiative',
    desc: 'Installing hand pumps, filtration units, and water storage systems in underserved villages across South Waziristan.',
    stats: ['60+ Wells Built', '30 Villages', 'Ongoing'],
    color: '#14a0a0', tagColor: 'bg-teal-100 text-teal-700' },
  { tag: 'Education', icon: '📚', title: 'Adult Literacy Program',
    desc: 'Evening literacy classes for adults who missed formal education, focusing on reading, writing, and basic numeracy.',
    stats: ['800+ Enrolled', 'Evening Classes', 'Free'],
    color: '#1A4A8A', tagColor: 'bg-blue-100 text-blue-700' },
  { tag: 'Community', icon: '🏘️', title: 'Women Empowerment Circles',
    desc: 'Weekly gatherings for women to learn financial literacy, legal rights, and entrepreneurship skills.',
    stats: ['500+ Members', 'Weekly Sessions', '12 Circles'],
    color: '#e0728a', tagColor: 'bg-pink-100 text-pink-700' },
  { tag: 'Youth', icon: '⚽', title: 'Sports & Recreation',
    desc: 'Organized sports leagues and recreational activities to keep youth engaged and promote physical and mental wellness.',
    stats: ['2,000+ Youth', '5 Sports', 'Year-Round'],
    color: '#2563B0', tagColor: 'bg-indigo-100 text-indigo-700' },
]

export default function ProgramsPage() {
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
