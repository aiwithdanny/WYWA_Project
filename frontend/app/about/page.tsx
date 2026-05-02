import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'About Us — WYWA',
  description: 'Learn about Waziristan Youth Welfare Association — our history, mission, vision, values and 14 years of community service in Waziristan, Pakistan.',
  keywords: ['About WYWA', 'Waziristan NGO history', 'WYWA mission', 'youth welfare Pakistan'],
  openGraph: {
    title: 'About Us — WYWA',
    description: 'Learn about WYWA — 14 years of empowering youth and serving Waziristan.',
    url: 'https://wywa.org.pk/about',
    siteName: 'WYWA',
    images: [{
      url: 'https://res.cloudinary.com/dji2qef4l/image/upload/v1777286646/WYWA-LOGO.jpg',
      width: 800,
      height: 600,
      alt: 'WYWA Official Logo',
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us — WYWA',
    description: 'Learn about WYWA — 14 years of empowering youth and serving Waziristan.',
    images: ['https://res.cloudinary.com/dji2qef4l/image/upload/v1777286646/WYWA-LOGO.jpg'],
  },
  alternates: {
    canonical: 'https://wywa.org.pk/about',
  },
}

export default function AboutPage() {
  const values = [
    { icon: '🎯', title: 'Mission', desc: 'To empower the youth of Waziristan through education, health, and community development programs that create lasting change.' },
    { icon: '🔭', title: 'Vision', desc: 'A prosperous, educated, and self-reliant Waziristan where every young person has equal opportunities to thrive.' },
    { icon: '💎', title: 'Integrity', desc: 'We operate with full transparency, accountability, and honesty in everything we do.' },
    { icon: '🤝', title: 'Inclusivity', desc: 'We serve all people of Waziristan regardless of tribe, gender, or background.' },
  ]

  const timeline = [
    { year: '2010', title: 'WYWA Founded', desc: 'Established by community leaders in Wana, South Waziristan with a vision to serve local youth.' },
    { year: '2012', title: 'First Scholarship Program', desc: 'Launched our flagship scholarship fund, supporting 12 students in the first year.' },
    { year: '2015', title: 'Disaster Relief Operations', desc: 'Responded to major flooding, delivering aid to over 500 families across the region.' },
    { year: '2018', title: 'Clean Water Initiative', desc: 'Installed 20 hand pumps and water filtration units in remote villages.' },
    { year: '2020', title: 'Youth Leadership Academy', desc: 'Launched our flagship leadership program with 30 founding members.' },
    { year: '2024', title: '12,000+ Lives Impacted', desc: 'Reached a major milestone — over 12,000 direct beneficiaries across all programs.' },
  ]

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
              About WYWA
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Story
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
              Founded in 2010 by passionate community leaders, WYWA has grown
              from a small local initiative into one of Waziristan's most
              impactful youth welfare organizations.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <div key={i}
                  className="bg-[#F8F9FC] rounded-2xl p-8 text-center
                    hover:-translate-y-2 transition-all duration-300
                    hover:shadow-xl border-b-4 border-[#1A4A8A]">
                  <div className="text-4xl mb-4">{v.icon}</div>
                  <h3 className="font-bold text-[#0A1628] text-lg mb-3"
                    style={{ fontFamily: 'Playfair Display, serif' }}>
                    {v.title}
                  </h3>
                  <p className="text-[#6B7A99] text-sm leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story + Timeline */}
        <section className="bg-[#F8F9FC] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-[#1A4A8A]
                  text-xs font-semibold uppercase tracking-widest mb-4">
                  <span className="w-7 h-0.5 bg-[#C8A84B]" />
                  Who We Are
                </div>
                <h2 className="text-4xl font-bold text-[#0A1628] mb-6"
                  style={{ fontFamily: 'Playfair Display, serif' }}>
                  A Community Built on Hope & Action
                </h2>
                <p className="text-[#6B7A99] leading-relaxed mb-4">
                  The Waziristan Youth Welfare Association (WYWA) is a registered
                  non-profit organization dedicated to the holistic development of
                  youth and communities in Waziristan, Pakistan.
                </p>
                <p className="text-[#6B7A99] leading-relaxed mb-4">
                  We believe that every young person in Waziristan deserves
                  access to quality education, healthcare, and economic opportunities.
                </p>
                <p className="text-[#6B7A99] leading-relaxed mb-8">
                  Through our integrated programs spanning education, disaster
                  relief, community development, and youth empowerment, we work
                  to create a Waziristan where potential is never wasted.
                </p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: 'Est.', value: '2010' },
                    { label: 'Registration', value: 'KP-2010-0847' },
                    { label: 'Status', value: 'SECP Certified' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-xl px-5 py-3
                      border border-[#EEF1F6]">
                      <p className="text-xs text-[#6B7A99]">{item.label}</p>
                      <p className="font-bold text-[#0A1628] text-sm">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="flex flex-col gap-6">
                {timeline.map((t, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl
                      bg-[#0A1628] flex items-center justify-center">
                      <span className="text-[#C8A84B] font-bold text-xs">
                        {t.year}
                      </span>
                    </div>
                    <div className="bg-white rounded-xl p-4 flex-1
                      border-l-4 border-[#C8A84B]">
                      <h4 className="font-bold text-[#0A1628] text-sm mb-1">
                        {t.title}
                      </h4>
                      <p className="text-xs text-[#6B7A99] leading-relaxed">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Registration */}
        <section className="bg-[#0A1628] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              {[
                { icon: '🏛️', title: 'Legally Registered', desc: 'NGO Registration No. KP-2010-0847 under the Societies Registration Act' },
                { icon: '✅', title: 'SECP Certified', desc: 'Registered with Securities & Exchange Commission of Pakistan' },
                { icon: '📊', title: 'Fully Transparent', desc: 'Annual reports and financial statements publicly available' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10
                  rounded-2xl p-8">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-3"
                    style={{ fontFamily: 'Playfair Display, serif' }}>
                    {item.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
