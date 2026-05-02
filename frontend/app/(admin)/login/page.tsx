'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Invalid credentials')
        return
      }
      localStorage.setItem('wywa_token', data.token)
      localStorage.setItem('wywa_user', JSON.stringify(data.user))
      router.push('/dashboard')
    } catch (err) {
      setError('Connection failed. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center
      justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="https://res.cloudinary.com/dji2qef4l/image/upload/v1777286646/WYWA-LOGO.jpg"
            alt="WYWA Logo"
            width={80}
            height={80}
            className="rounded-2xl mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            WYWA Admin
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Sign in to access the dashboard
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600
                rounded-xl px-4 py-3 text-sm">
                ❌ {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium
                text-[#3D4A63] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="admin@wywa.org.pk"
                className="w-full px-4 py-3 rounded-xl border
                  border-[#EEF1F6] bg-[#F8F9FC] text-sm
                  focus:outline-none focus:border-[#1A4A8A]
                  focus:ring-2 focus:ring-[#1A4A8A]/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium
                text-[#3D4A63] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border
                  border-[#EEF1F6] bg-[#F8F9FC] text-sm
                  focus:outline-none focus:border-[#1A4A8A]
                  focus:ring-2 focus:ring-[#1A4A8A]/10 transition-all"
              />
            </div>

            {/* Default credentials hint */}
            <div className="bg-[#F8F9FC] rounded-xl p-3 text-xs
              text-[#6B7A99]">
              <p className="font-semibold text-[#0A1628] mb-1">
                Default credentials:
              </p>
              <p>Email: admin@wywa.org.pk</p>
              <p>Password: wywa2026</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A4A8A] hover:bg-[#0A1628]
                text-white py-4 rounded-xl font-bold text-sm
                transition-all duration-200 hover:-translate-y-0.5
                hover:shadow-lg disabled:opacity-70">
              {loading ? 'Signing in...' : 'Sign In to Dashboard →'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          <a href="/" className="hover:text-white transition-colors">
            ← Back to WYWA Website
          </a>
        </p>
      </div>
    </div>
  )
}
