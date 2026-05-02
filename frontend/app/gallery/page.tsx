import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Photo Gallery — WYWA',
  description: 'Browse photos from WYWA programs, events, and community activities across Waziristan.',
  keywords: ['WYWA gallery', 'Waziristan NGO photos', 'WYWA events photos'],
  openGraph: {
    title: 'Photo Gallery — WYWA',
    description: 'Browse photos from WYWA programs and events across Waziristan.',
    url: 'https://wywa.org.pk/gallery',
    siteName: 'WYWA',
    images: [{ url: 'https://res.cloudinary.com/dji2qef4l/image/upload/v1777286646/WYWA-LOGO.jpg', width: 800, height: 600, alt: 'WYWA Logo' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photo Gallery — WYWA',
    description: 'Browse photos from WYWA programs and events across Waziristan.',
    images: ['https://res.cloudinary.com/dji2qef4l/image/upload/v1777286646/WYWA-LOGO.jpg'],
  },
  alternates: { canonical: 'https://wywa.org.pk/gallery' },
}

const albums = [
  { title: 'Scholarship Ceremony 2025', count: 24, emoji: '🎓', color: 'from-[#1A4A8A] to-[#0A1628]' },
  { title: 'Flood Relief Operations',   count: 36, emoji: '🆘', color: 'from-[#e0722a] to-[#8a3a10]' },
  { title: 'Clean Water Project',       count: 18, emoji: '💧', color: 'from-[#14a0a0] to-[#0a5050]' },
  { title: 'Mobile Health Camps',       count: 30, emoji: '🏥', color: 'from-[#2da86a] to-[#1a6b42]' },
  { title: 'Youth Leadership Academy',  count: 22, emoji: '🌟', color: 'from-[#8250c8] to-[#4a2a80]' },
  { title: 'Vocational Training',       count: 15, emoji: '💼', color: 'from-[#C8A84B] to-[#8a6e2a]' },
  { title: 'Community Events',          count: 40, emoji: '🤝', color: 'from-[#2563B0] to-[#0a2a60]' },
  { title: 'Women Empowerment',         count: 20, emoji: '👩', color: 'from-[#e0728a] to-[#8a2a40]' },
]

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#0A1628] pt-32 pb-20 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 text-[#E8C96A]
              text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
              Our Work in Pictures
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Photo Gallery
            </h1>
            <p className="text-white/60 text-lg">
              A visual journey through WYWA programs, events,
              and community impact across Waziristan.
            </p>
          </div>
        </section>

        <section className="bg-[#F8F9FC] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {albums.map((album, i) => (
                <div key={i}
                  className="rounded-2xl overflow-hidden cursor-pointer
                    hover:-translate-y-2 transition-all duration-300
                    hover:shadow-xl group">
                  <div className={`bg-gradient-to-br ${album.color}
                    h-48 flex items-center justify-center relative`}>
                    <span className="text-6xl group-hover:scale-110
                      transition-transform duration-300">
                      {album.emoji}
                    </span>
                    <div className="absolute inset-0 bg-black/0
                      group-hover:bg-black/20 transition-all duration-300
                      flex items-center justify-center">
                      <span className="text-white font-bold opacity-0
                        group-hover:opacity-100 transition-opacity text-sm">
                        View Album →
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-5">
                    <h3 className="font-bold text-[#0A1628] text-sm mb-1
                      group-hover:text-[#1A4A8A] transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-xs text-[#6B7A99]">
                      {album.count} photos
                    </p>
                  </div>
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
