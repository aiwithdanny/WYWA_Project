'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const navItems = [
  { href: '/dashboard',   label: 'Dashboard',    icon: '📊' },
  { href: '/dashboard/programs',  label: 'Programs',     icon: '📋' },
  { href: '/dashboard/events',    label: 'Events',       icon: '📅' },
  { href: '/dashboard/news',      label: 'News',         icon: '📰' },
  { href: '/dashboard/team',      label: 'Team',         icon: '👥' },
  { href: '/dashboard/gallery',   label: 'Gallery',      icon: '🖼️' },
  { href: '/dashboard/donations', label: 'Donations',    icon: '💰' },
  { href: '/dashboard/volunteers',label: 'Volunteers',   icon: '🤝' },
  { href: '/dashboard/messages',  label: 'Messages',     icon: '✉️' },
  { href: '/dashboard/settings',  label: 'Settings',     icon: '⚙️' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-[#F8F9FC] overflow-hidden">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'}
        bg-[#0A1628] flex flex-col transition-all duration-300
        flex-shrink-0`}>

        {/* Logo */}
        <div className="flex items-center gap-3 p-5 border-b border-white/10">
          <Image
            src="https://res.cloudinary.com/dji2qef4l/image/upload/v1777286646/WYWA-LOGO.jpg"
            alt="WYWA"
            width={36}
            height={36}
            className="rounded-lg flex-shrink-0"
          />
          {sidebarOpen && (
            <div>
              <p className="text-white font-bold text-sm"
                style={{ fontFamily: 'Playfair Display, serif' }}>
                WYWA Admin
              </p>
              <p className="text-white/40 text-xs">Control Panel</p>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-5 py-3 mx-2
                rounded-xl mb-1 transition-all duration-200 group
                ${pathname === item.href
                  ? 'bg-[#1A4A8A] text-white'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}>
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {pathname === item.href && sidebarOpen && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full
                  bg-[#C8A84B]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10">
          {sidebarOpen && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#1A4A8A]
                flex items-center justify-center text-[#C8A84B]
                font-bold text-xs">
                SA
              </div>
              <div>
                <p className="text-white text-xs font-medium">Super Admin</p>
                <p className="text-white/40 text-xs">admin@wywa.org.pk</p>
              </div>
            </div>
          )}
          <Link href="/"
            className="flex items-center gap-2 text-white/40
              hover:text-white transition-colors text-xs">
            <span>🚪</span>
            {sidebarOpen && <span>Back to Website</span>}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="bg-white border-b border-[#EEF1F6]
          px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[#6B7A99] hover:text-[#0A1628]
                transition-colors text-xl">
              ☰
            </button>
            <h1 className="text-[#0A1628] font-semibold text-sm">
              WYWA Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6B7A99]">
              {new Date().toLocaleDateString('en-PK', {
                weekday: 'long', year: 'numeric',
                month: 'long', day: 'numeric'
              })}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#0A1628]
              flex items-center justify-center text-[#C8A84B]
              font-bold text-xs cursor-pointer">
              SA
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

