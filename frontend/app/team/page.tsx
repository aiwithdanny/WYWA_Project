import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Our Team — WYWA',
  description: 'Meet the dedicated leadership team behind Waziristan Youth Welfare Association committed to serving and empowering communities.',
  keywords: ['WYWA team', 'WYWA leadership', 'Waziristan NGO team'],
  openGraph: {
    title: 'Our Team — WYWA',
    description: 'Meet the dedicated team behind Waziristan Youth Welfare Association.',
    url: 'https://wywa.org.pk/team',
    siteName: 'WYWA',
    images: [{ url: 'https://res.cloudinary.com/dji2qef4l/image/upload/v1777286646/WYWA-LOGO.jpg', width: 800, height: 600, alt: 'WYWA Logo' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Team — WYWA',
    description: 'Meet the dedicated team behind Waziristan Youth Welfare Association.',
    images: ['https://res.cloudinary.com/dji2qef4l/image/upload/v1777286646/WYWA-LOGO.jpg'],
  },
  alternates: { canonical: 'https://wywa.org.pk/team' },
}

const team = [
  { name: 'Zahir Khan', role: 'Founder & President', initial: 'ZK',
    bio: 'A native of South Waziristan with 15+ years in community development and humanitarian work across KP.',
    color: 'from-[#1A4A8A] to-[#0A1628]' },
  { name: 'Nasreen Mehsud', role: 'Director of Education', initial: 'NM',
    bio: 'Former schoolteacher turned education advocate, leading WYWA scholarship and literacy programs since 2013.',
    color: 'from-[#2da86a] to-[#1a6b42]' },
  { name: 'Imran Wazir', role: 'Head of Relief Operations', initial: 'IW',
    bio: 'Disaster response specialist who has coordinated relief efforts in 3 major flood events across Waziristan.',
    color: 'from-[#C8A84B] to-[#8a6e2a]' },
  { name: 'Rukhsana Khan', role: 'Community Programs Lead', initial: 'RK',
    bio: 'Women rights advocate and program designer with expertise in grassroots empowerment and livelihood creation.',
    color: 'from-[#8250c8] to-[#4a2a80]' },
  { name: 'Dr. Saeed Ahmad', role: 'Health Programs Director', initial: 'SA',
    bio: 'Medical doctor with 10+ years serving remote communities, overseeing all mobile health clinic operations.',
    color: 'from-[#e0722a] to-[#8a3a10]' },
  { name: 'Fawad Mehsud', role: 'Finance & Admin Manager', initial: 'FM',
    bio: 'Certified accountant ensuring full financial transparency and compliance with NGO regulations.',
    color: 'from-[#14a0a0] to-[#0a5050]' },
  { name: 'Zainab Wazir', role: 'Youth Programs Coordinator', initial: 'ZW',
    bio: 'Youth empowerment specialist managing the Leadership Academy and sports programs for young people.',
    color: 'from-[#e0728a] to-[#8a2a40]' },
  { name: 'Khalid Dawar', role: 'Field Operations Manager', initial: 'KD',
    bio: 'Manages on-ground operations across North and South Waziristan, ensuring program delivery at village level.',
    color: 'from-[#2563B0] to-[#0a2a60]' },
]

export default function TeamPage() {
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <div key={i}
                  className="bg-white rounded-2xl overflow-hidden
                    hover:-translate-y-2 transition-all duration-300
                    hover:shadow-xl group">
                  <div className={`bg-gradient-to-br ${member.color}
                    p-10 flex items-center justify-center`}>
                    <div className="w-20 h-20 rounded-full
                      bg-white/15 border-2 border-white/20
                      flex items-center justify-center
                      text-white font-bold text-2xl
                      group-hover:scale-110 transition-transform"
                      style={{ fontFamily: 'Playfair Display, serif' }}>
                      {member.initial}
                    </div>
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
