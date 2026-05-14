'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { newsAPI } from '@/lib/api'

const categoryMeta: any = {
  SUCCESS_STORIES:  { tag: 'bg-green-100 text-green-700', label: 'Success Story' },
  PROGRAMS:         { tag: 'bg-blue-100 text-blue-700', label: 'Programs' },
  ANNOUNCEMENTS:    { tag: 'bg-yellow-100 text-yellow-700', label: 'Announcement' },
  EVENTS:           { tag: 'bg-red-100 text-red-700', label: 'Event' },
  MEDIA:            { tag: 'bg-purple-100 text-purple-700', label: 'Media' },
  GENERAL:          { tag: 'bg-gray-100 text-gray-700', label: 'General' },
}

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    newsAPI.getAll()
      .then(data => {
        if (data.news && data.news.length > 0) {
          const mapped = data.news.map((n: any) => {
            const meta = categoryMeta[n.category || 'GENERAL'] || categoryMeta.GENERAL
            return {
              category: meta.label,
              date: n.publishedAt ? new Date(n.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : new Date(n.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              title: n.title,
              excerpt: n.excerpt || 'No excerpt available.',
              tag: meta.tag,
              readTime: '3 min read',
            }
          })
          setNews(mapped)
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
              Latest Updates
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              News & Blog
            </h1>
            <p className="text-white/60 text-lg">
              Stay updated with the latest stories, announcements,
              and impact reports from WYWA.
            </p>
          </div>
        </section>

        <section className="bg-[#F8F9FC] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-[#1A4A8A] border-t-transparent rounded-full" />
                <span className="ml-3 text-[#6B7A99]">Loading news...</span>
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-20 text-[#6B7A99]">
                <p className="text-lg font-medium">No news articles available</p>
                <p className="text-sm mt-2">Check back soon for updates.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((article, i) => (
                  <div key={i}
                    className="bg-white rounded-2xl overflow-hidden
                      hover:-translate-y-2 transition-all duration-300
                      hover:shadow-xl group cursor-pointer">
                    <div className="bg-gradient-to-br from-[#0A1628]
                      to-[#1A4A8A] h-40 flex items-center justify-center">
                      <span className="text-5xl">📰</span>
                    </div>
                    <div className="p-7">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs
                          font-semibold ${article.tag}`}>
                          {article.category}
                        </span>
                        <span className="text-xs text-[#6B7A99]">
                          {article.readTime}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#0A1628] text-lg mb-3
                        group-hover:text-[#1A4A8A] transition-colors
                        leading-tight"
                        style={{ fontFamily: 'Playfair Display, serif' }}>
                        {article.title}
                      </h3>
                      <p className="text-[#6B7A99] text-sm leading-relaxed mb-4">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between
                        pt-4 border-t border-[#EEF1F6]">
                        <span className="text-xs text-[#6B7A99]">
                          {article.date}
                        </span>
                        <span className="text-xs font-semibold
                          text-[#1A4A8A] group-hover:underline">
                          Read More →
                        </span>
                      </div>
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
