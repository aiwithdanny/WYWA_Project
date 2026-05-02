import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'News & Blog — WYWA',
  description: 'Latest news, success stories, announcements and updates from Waziristan Youth Welfare Association.',
  keywords: ['WYWA news', 'Waziristan NGO updates', 'WYWA blog', 'youth welfare news Pakistan'],
  openGraph: {
    title: 'News & Blog — WYWA',
    description: 'Latest news and updates from Waziristan Youth Welfare Association.',
    url: 'https://wywa.org.pk/news',
    siteName: 'WYWA',
    images: [{ url: 'https://res.cloudinary.com/dji2qef4l/image/upload/v1777286646/WYWA-LOGO.jpg', width: 800, height: 600, alt: 'WYWA Logo' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News & Blog — WYWA',
    description: 'Latest news and updates from Waziristan Youth Welfare Association.',
    images: ['https://res.cloudinary.com/dji2qef4l/image/upload/v1777286646/WYWA-LOGO.jpg'],
  },
  alternates: { canonical: 'https://wywa.org.pk/news' },
}

const news = [
  { category: 'Success Story', date: 'April 20, 2026',
    title: 'WYWA Scholar Becomes First Female Doctor from Her Village',
    excerpt: 'Zara Wazir, a WYWA scholarship recipient, has graduated as a doctor from Khyber Medical University — the first female doctor from her village in South Waziristan.',
    tag: 'bg-green-100 text-green-700', readTime: '4 min read' },
  { category: 'Programs', date: 'April 15, 2026',
    title: '60th Water Well Completed in Birmal District',
    excerpt: 'WYWA Clean Water Initiative has reached a major milestone — completing its 60th water well installation, providing clean water to over 3,000 residents.',
    tag: 'bg-blue-100 text-blue-700', readTime: '3 min read' },
  { category: 'Announcement', date: 'April 10, 2026',
    title: 'Youth Leadership Academy 2026 Applications Now Open',
    excerpt: 'WYWA is pleased to announce that applications for the 2026 Youth Leadership Academy are now open. We are accepting 50 candidates aged 18-28.',
    tag: 'bg-yellow-100 text-yellow-700', readTime: '2 min read' },
  { category: 'Relief', date: 'March 28, 2026',
    title: 'WYWA Distributes Aid to 500 Flood-Affected Families',
    excerpt: 'Following recent flooding in North Waziristan, WYWA deployed emergency response teams within 48 hours, distributing food packages and shelter materials.',
    tag: 'bg-red-100 text-red-700', readTime: '5 min read' },
  { category: 'Health', date: 'March 15, 2026',
    title: 'Mobile Health Clinic Reaches 40th Village',
    excerpt: 'WYWA Mobile Health Clinic program has now served its 40th village, providing free medical care, vaccinations, and maternal health services.',
    tag: 'bg-purple-100 text-purple-700', readTime: '3 min read' },
  { category: 'Community', date: 'March 5, 2026',
    title: 'Women Empowerment Circle Launches in 5 New Locations',
    excerpt: 'WYWA Women Empowerment Circles have expanded to 5 new locations, bringing financial literacy and entrepreneurship training to 200 more women.',
    tag: 'bg-pink-100 text-pink-700', readTime: '4 min read' },
]

export default function NewsPage() {
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
