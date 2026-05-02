import Link from 'next/link'

const stats = [
  { label: 'Total Beneficiaries', value: '12,000+', icon: '👥', color: '#1A4A8A', change: '+8% this month' },
  { label: 'Active Programs',     value: '45',       icon: '📋', color: '#C8A84B', change: '+2 new programs' },
  { label: 'Total Donations',     value: 'PKR 2.4M', icon: '💰', color: '#2da86a', change: '+15% this month' },
  { label: 'Volunteers',          value: '320+',     icon: '🤝', color: '#e0722a', change: '+12 this week' },
  { label: 'Messages',            value: '24',       icon: '✉️', color: '#8250c8', change: '8 unread' },
  { label: 'Events This Month',   value: '6',        icon: '📅', color: '#14a0a0', change: '2 upcoming' },
]

const recentMessages = [
  { name: 'Ahmad Khan',    subject: 'Volunteer Application',  time: '2 hours ago',  read: false },
  { name: 'Sara Mehsud',  subject: 'Donation Inquiry',        time: '4 hours ago',  read: false },
  { name: 'Bilal Wazir',  subject: 'Partnership Proposal',    time: '1 day ago',    read: true },
  { name: 'Fatima Ali',   subject: 'Program Information',     time: '2 days ago',   read: true },
]

const recentDonations = [
  { name: 'Anonymous',    amount: 'PKR 5,000',  campaign: 'General Fund',      time: '1 hour ago' },
  { name: 'Zubair Khan',  amount: 'PKR 25,000', campaign: 'Scholarship Fund',  time: '3 hours ago' },
  { name: 'Hina Afridi',  amount: 'PKR 2,500',  campaign: 'Clean Water',       time: '5 hours ago' },
  { name: 'M. Dawood',    amount: 'PKR 10,000', campaign: 'Disaster Relief',   time: '1 day ago' },
]

const quickLinks = [
  { href: '/dashboard/programs',   label: 'Add Program',    icon: '📋', color: '#1A4A8A' },
  { href: '/dashboard/events',     label: 'Add Event',      icon: '📅', color: '#C8A84B' },
  { href: '/dashboard/news',       label: 'Write Article',  icon: '📰', color: '#2da86a' },
  { href: '/dashboard/team',       label: 'Add Member',     icon: '👥', color: '#8250c8' },
  { href: '/dashboard/gallery',    label: 'Upload Photos',  icon: '🖼️', color: '#14a0a0' },
  { href: '/dashboard/messages',   label: 'View Messages',  icon: '✉️', color: '#e0722a' },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">

      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#0A1628] to-[#1A4A8A]
        rounded-2xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-2"
          style={{ fontFamily: 'Playfair Display, serif' }}>
          Welcome back, Super Admin! 👋
        </h1>
        <p className="text-white/60 text-sm">
          Here's what's happening with WYWA today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <div key={i}
            className="bg-white rounded-2xl p-5 hover:-translate-y-1
              transition-all duration-200 hover:shadow-lg"
            style={{ borderBottom: `3px solid ${stat.color}` }}>
            <div className="text-2xl mb-3">{stat.icon}</div>
            <div className="text-xl font-bold text-[#0A1628] mb-1"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              {stat.value}
            </div>
            <div className="text-xs text-[#6B7A99] mb-2">{stat.label}</div>
            <div className="text-xs font-medium"
              style={{ color: stat.color }}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6">
        <h2 className="font-bold text-[#0A1628] mb-4 text-lg"
          style={{ fontFamily: 'Playfair Display, serif' }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {quickLinks.map((link, i) => (
            <Link key={i} href={link.href}
              className="flex flex-col items-center gap-2 p-4
                rounded-xl bg-[#F8F9FC] hover:bg-white
                hover:shadow-md transition-all duration-200
                border border-transparent hover:border-[#EEF1F6]
                group">
              <span className="text-2xl group-hover:scale-110
                transition-transform">
                {link.icon}
              </span>
              <span className="text-xs font-medium text-[#3D4A63]
                text-center leading-tight">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent Messages */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0A1628] text-lg"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Recent Messages
            </h2>
            <Link href="/dashboard/messages"
              className="text-xs text-[#1A4A8A] font-medium hover:underline">
              View All →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentMessages.map((msg, i) => (
              <div key={i}
                className="flex items-center gap-4 p-3 rounded-xl
                  bg-[#F8F9FC] hover:bg-[#EEF1F6] transition-colors">
                <div className="w-9 h-9 rounded-full bg-[#1A4A8A]
                  flex items-center justify-center text-white
                  font-bold text-xs flex-shrink-0">
                  {msg.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#0A1628]
                      truncate">
                      {msg.name}
                    </p>
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full
                        bg-[#C8A84B] flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#6B7A99] truncate">
                    {msg.subject}
                  </p>
                </div>
                <span className="text-xs text-[#6B7A99] flex-shrink-0">
                  {msg.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Donations */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0A1628] text-lg"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Recent Donations
            </h2>
            <Link href="/dashboard/donations"
              className="text-xs text-[#1A4A8A] font-medium hover:underline">
              View All →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentDonations.map((don, i) => (
              <div key={i}
                className="flex items-center gap-4 p-3 rounded-xl
                  bg-[#F8F9FC] hover:bg-[#EEF1F6] transition-colors">
                <div className="w-9 h-9 rounded-full bg-[#2da86a]
                  flex items-center justify-center text-white
                  font-bold text-xs flex-shrink-0">
                  {don.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0A1628]">
                    {don.name}
                  </p>
                  <p className="text-xs text-[#6B7A99] truncate">
                    {don.campaign}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-[#2da86a]">
                    {don.amount}
                  </p>
                  <p className="text-xs text-[#6B7A99]">{don.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Programs Overview */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#0A1628] text-lg"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Programs Overview
          </h2>
          <Link href="/dashboard/programs"
            className="text-xs text-[#1A4A8A] font-medium hover:underline">
            Manage Programs →
          </Link>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: 'Education',        count: 3, color: '#1A4A8A' },
            { label: 'Health',           count: 2, color: '#2da86a' },
            { label: 'Relief',           count: 4, color: '#e0722a' },
            { label: 'Youth',            count: 3, color: '#8250c8' },
          ].map((cat, i) => (
            <div key={i}
              className="rounded-xl p-4 text-center"
              style={{ background: `${cat.color}15` }}>
              <p className="text-2xl font-bold mb-1"
                style={{ color: cat.color,
                  fontFamily: 'Playfair Display, serif' }}>
                {cat.count}
              </p>
              <p className="text-xs text-[#6B7A99] font-medium">
                {cat.label} Programs
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
