'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { newsletterAPI } from '@/lib/api'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      await newsletterAPI.subscribe({ email })
      setSubscribed(true)
      setEmail('')
    } catch {
      alert('Subscription failed. Please try again.')
    }
  }

  return (
    <footer className="bg-[#0A1628] text-white/60 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="https://res.cloudinary.com/dji2qef4l/image/upload/v1777286646/WYWA-LOGO.jpg"
                alt="WYWA Logo"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <div>
                <p className="font-bold text-white text-sm"
                  style={{ fontFamily: 'Playfair Display, serif' }}>
                  Waziristan Youth
                </p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">
                  Welfare Association
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-white/50">
              A grassroots nonprofit dedicated to education, relief, and
              empowerment in the heart of Waziristan since 2010.
            </p>
            <div className="flex gap-3 mt-6">
              {['f', 'in', 'tw', 'yt'].map(s => (
                <a key={s} href="#"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10
                    flex items-center justify-center text-xs text-white/40
                    hover:bg-[#1A4A8A] hover:text-white transition-all duration-200">
                  {s}
                </a>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-xs text-white/40 mb-2 font-medium">Subscribe to our newsletter</p>
              {subscribed ? (
                <p className="text-sm text-[#2da86a]">Thanks for subscribing!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8A84B]"
                  />
                  <button type="submit" className="px-4 py-2 rounded-lg bg-[#C8A84B] text-[#0A1628] text-xs font-semibold hover:bg-[#E8C96A] transition-colors">
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-2.5">
              {['About', 'Programs', 'Events', 'News', 'Gallery', 'Team', 'Contact'].map(item => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`}
                    className="text-sm text-white/40 hover:text-[#C8A84B] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <ul className="flex flex-col gap-3 text-sm text-white/40">
              <li>📍 Wana, South Waziristan, KP, Pakistan</li>
              <li>📧 info@wywa.org.pk</li>
              <li>📞 +92-300-1234567</li>
              <li>🌐 NGO Reg: KP-2010-0847</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row
          justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            © 2026 Waziristan Youth Welfare Association. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Built with ❤️ for the people of Waziristan
          </p>
        </div>
      </div>
    </footer>
  )
}
