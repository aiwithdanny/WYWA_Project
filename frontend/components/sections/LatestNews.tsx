'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import fetchAPI from '@/lib/api'

export default function LatestNews() {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAPI('/api/news?status=PUBLISHED')
      .then(data => {
        if (data.news && data.news.length > 0) {
          setNews(data.news.slice(0, 3))
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="bg-[#F8F9FC] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 text-[#1A4A8A] text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
              News & Updates
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A1628]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Latest Stories
            </h2>
          </div>
          <Link href="/news" className="bg-[#C8A84B] hover:bg-[#E8C96A] text-[#0A1628] px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg w-fit">
            View All News →
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin w-8 h-8 border-4 border-[#1A4A8A] border-t-transparent rounded-full" />
          </div>
        ) : news.length === 0 ? (
          <div className="text-center text-[#6B7A99] py-10">No news articles at the moment.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((article: any, i: number) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group cursor-pointer">
                <div className="bg-gradient-to-br from-[#0A1628] to-[#1A4A8A] h-40 flex items-center justify-center">
                  {article.imageUrl ? (
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">📰</span>
                  )}
                </div>
                <div className="p-6">
                  <span className="text-xs text-[#6B7A99] font-medium">
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <h3 className="font-bold text-[#0A1628] text-lg mt-2 mb-2 group-hover:text-[#1A4A8A] transition-colors leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {article.title}
                  </h3>
                  <p className="text-[#6B7A99] text-sm leading-relaxed line-clamp-3">
                    {article.excerpt || article.body?.substring(0, 120) + '...' || 'No excerpt available.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
