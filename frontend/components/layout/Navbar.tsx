'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const navLinks = [
  { name: 'Home',      href: '/' },
  { name: 'About',     href: '/about' },
  { name: 'Programs',  href: '/programs' },
  { name: 'Events',    href: '/events' },
  { name: 'News',      href: '/news' },
  { name: 'Gallery',   href: '/gallery' },
  { name: 'Team',      href: '/team' },
  { name: 'Contact',   href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="https://res.cloudinary.com/dji2qef4l/image/upload/v1777286646/WYWA-LOGO.jpg"
              alt="WYWA Logo"
              width={50}
              height={50}
              className="rounded-lg object-cover"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-sm text-[#0A1628]"
                style={{ fontFamily: 'Playfair Display, serif' }}>
                Waziristan Youth
              </span>
              <span className="text-[10px] text-[#6B7A99] uppercase tracking-widest">
                Welfare Association
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map(link => (
              <Link key={link.name} href={link.href}
                className="text-[13px] font-medium text-[#3D4A63]
                  hover:text-[#1A4A8A] transition-colors duration-200
                  relative group">
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5
                  bg-[#C8A84B] group-hover:w-full transition-all duration-200" />
              </Link>
            ))}
          </div>

          {/* Donate Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/donate"
              className="bg-[#C8A84B] hover:bg-[#E8C96A] text-[#0A1628]
                px-5 py-2.5 rounded-lg text-[13px] font-600
                transition-all duration-200 hover:-translate-y-0.5
                hover:shadow-lg font-semibold">
              Donate Now ❤️
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2">
            <span className={`block w-6 h-0.5 bg-[#0A1628] transition-all duration-300
              ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-[#0A1628] transition-all duration-300
              ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-[#0A1628] transition-all duration-300
              ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-6
          flex flex-col gap-4 shadow-xl">
          {navLinks.map(link => (
            <Link key={link.name} href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-[15px] font-medium text-[#3D4A63]
                hover:text-[#1A4A8A] transition-colors py-1">
              {link.name}
            </Link>
          ))}
          <Link href="/donate"
            onClick={() => setMenuOpen(false)}
            className="bg-[#C8A84B] text-[#0A1628] px-5 py-3 rounded-lg
              text-[14px] font-semibold text-center mt-2">
            Donate Now ❤️
          </Link>
        </div>
      )}
    </nav>
  )
}
