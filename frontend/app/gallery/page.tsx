'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import fetchAPI from '@/lib/api'

export default function GalleryPage() {
  const [albums, setAlbums] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAPI('/api/gallery')
      .then(data => {
        if (data.gallery && data.gallery.length > 0) {
          const colors = [
            'from-[#1A4A8A] to-[#0A1628]', 'from-[#e0722a] to-[#8a3a10]',
            'from-[#14a0a0] to-[#0a5050]', 'from-[#2da86a] to-[#1a6b42]',
            'from-[#8250c8] to-[#4a2a80]', 'from-[#C8A84B] to-[#8a6e2a]',
            'from-[#2563B0] to-[#0a2a60]', 'from-[#e0728a] to-[#8a2a40]',
          ]
          const mapped = data.gallery.map((g: any, i: number) => ({
            title: g.albumName || g.caption || 'Gallery Item',
            color: colors[i % colors.length],
            imageUrl: g.imageUrl || '',
            year: g.year || new Date().getFullYear(),
          }))
          setAlbums(mapped)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

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
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-[#1A4A8A] border-t-transparent rounded-full" />
                <span className="ml-3 text-[#6B7A99]">Loading gallery...</span>
              </div>
            ) : albums.length === 0 ? (
              <div className="text-center py-20 text-[#6B7A99]">
                <p className="text-lg font-medium">No photos in gallery</p>
                <p className="text-sm mt-2">Check back soon for updates.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {albums.map((album, i) => (
                <div key={i}
                  className="rounded-2xl overflow-hidden cursor-pointer
                    hover:-translate-y-2 transition-all duration-300
                    hover:shadow-xl group">
                  <div className={`bg-gradient-to-br ${album.color}
                    h-48 flex items-center justify-center relative`}>
                    {album.imageUrl ? (
                      <img src={album.imageUrl} alt={album.title}
                        className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl group-hover:scale-110
                        transition-transform duration-300">
                        📷
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/0
                      group-hover:bg-black/20 transition-all duration-300
                      flex items-center justify-center">
                      <span className="text-white font-bold opacity-0
                        group-hover:opacity-100 transition-opacity text-sm">
                        View →
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-5">
                    <h3 className="font-bold text-[#0A1628] text-sm mb-1
                      group-hover:text-[#1A4A8A] transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-xs text-[#6B7A99]">
                      {album.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
