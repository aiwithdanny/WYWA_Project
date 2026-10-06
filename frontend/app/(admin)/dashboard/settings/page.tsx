'use client'
import { useState, useEffect } from 'react'
import { settingsAPI } from '@/lib/api'

import { useSiteSettings, invalidateSettingsCache } from '@/lib/useSiteSettings'

// NOTE: Field is defined OUTSIDE the page component on purpose.
// Defining it inside would recreate it on every keystroke, remounting
// the <input> and stealing focus (cursor disappears after each character).
function Field({ label, k, value, onChange, type = 'text', placeholder = '' }: {
  label: string, k: string, value: any,
  onChange: (k: string, v: string) => void,
  type?: string, placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#3D4A63] mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange(k, e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6]
          text-sm focus:outline-none focus:border-[#1A4A8A]
          bg-[#F8F9FC] transition-all"
      />
    </div>
  )
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Waziristan Youth Welfare Association',
    shortName: 'WYWA',
    tagline: 'Empowering Youth. Building Futures. Serving Waziristan.',
    heroTagline: 'Serving the heart of Waziristan — one life at a time.',
    heroDescription: 'The Waziristan Youth Welfare Association is dedicated to education, community development, disaster relief, and youth empowerment — creating lasting change for the people of Waziristan.',
    estLine: 'Est. 2010 · Waziristan, Pakistan',
    email: 'info@wywa.org.pk',
    phone: '+92-300-1234567',
    whatsapp: '+92-300-1234567',
    address: 'Wana, South Waziristan, KP, Pakistan',
    facebook: 'https://facebook.com/wywa',
    twitter: '',
    instagram: '',
    youtube: '',
    testimonials: '',
    bankName: 'Habib Bank Limited',
    accountTitle: 'Waziristan Youth Welfare Association',
    accountNumber: '',
    iban: '',
    jazzcash: '',
    easypaisa: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsAPI.get()
        if (data.settings && Object.keys(data.settings).length > 0) {
          setSettings(prev => ({ ...prev, ...data.settings }))
        }
      } catch (err: any) {
        console.error('Failed to load settings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleFieldChange = (k: string, v: string) => {
    setSettings(prev => ({ ...prev, [k]: v }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await settingsAPI.update(settings)
      // Clear the public-site settings cache so the new values show immediately
      invalidateSettingsCache()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      alert(err.message || 'Connection error — is backend running on port 8000?')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-[#1A4A8A]/20 border-t-[#1A4A8A] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1628]"
          style={{ fontFamily: 'Playfair Display, serif' }}>
          Site Settings
        </h1>
        <p className="text-[#6B7A99] text-sm mt-1">
          Manage your website configuration and contact details
        </p>
      </div>

      {/* General */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-[#0A1628] mb-4 pb-3
          border-b border-[#EEF1F6]">
          General Information
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Organization Name" k="siteName" value={(settings as any).siteName} onChange={handleFieldChange} />
          <Field label="Short Name" k="shortName" value={(settings as any).shortName} onChange={handleFieldChange} />
          <div className="md:col-span-2">
            <Field label="Tagline / Slogan" k="tagline" value={(settings as any).tagline} onChange={handleFieldChange} />
          </div>
        </div>
      </div>

      {/* Homepage Content */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-[#0A1628] mb-4 pb-3
          border-b border-[#EEF1F6]">
          Homepage Content
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Hero Tagline" k="heroTagline" value={(settings as any).heroTagline} onChange={handleFieldChange} />
          <Field label="Hero Badge Line" k="estLine" value={(settings as any).estLine} onChange={handleFieldChange}
            placeholder="e.g. Est. 2010 · Waziristan, Pakistan" />
          <div className="md:col-span-2">
            <Field label="Hero Description" k="heroDescription" value={(settings as any).heroDescription} onChange={handleFieldChange} />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-[#0A1628] mb-4 pb-3
          border-b border-[#EEF1F6]">
          Contact Information
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Email Address" k="email" value={(settings as any).email} onChange={handleFieldChange} type="email" />
          <Field label="Phone Number" k="phone" value={(settings as any).phone} onChange={handleFieldChange} />
          <Field label="WhatsApp Number" k="whatsapp" value={(settings as any).whatsapp} onChange={handleFieldChange} />
          <div className="md:col-span-2">
            <Field label="Office Address" k="address" value={(settings as any).address} onChange={handleFieldChange} />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-[#0A1628] mb-4 pb-3
          border-b border-[#EEF1F6]">
          Social Media Links
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Facebook Page URL" k="facebook" value={(settings as any).facebook} onChange={handleFieldChange}
            placeholder="https://facebook.com/wywa" />
          <Field label="Twitter / X URL" k="twitter" value={(settings as any).twitter} onChange={handleFieldChange}
            placeholder="https://twitter.com/wywa" />
          <Field label="Instagram URL" k="instagram" value={(settings as any).instagram} onChange={handleFieldChange}
            placeholder="https://instagram.com/wywa" />
          <Field label="YouTube Channel URL" k="youtube" value={(settings as any).youtube} onChange={handleFieldChange}
            placeholder="https://youtube.com/@wywa" />
        </div>
      </div>

      {/* Testimonials (JSON array) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-[#0A1628] mb-4 pb-3
          border-b border-[#EEF1F6]">
          Homepage Testimonials
        </h2>
        <p className="text-xs text-[#6B7A99] mb-3">
          JSON array of quote objects. Leave empty to use the default testimonials.
        </p>
        <textarea
          value={(settings as any).testimonials || ''}
          onChange={e => setSettings({ ...settings, testimonials: e.target.value })}
          placeholder='[{"quote":"...","name":"...","role":"...","initial":"A"}]'
          rows={6}
          className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6]
            text-sm font-mono focus:outline-none focus:border-[#1A4A8A]
            bg-[#F8F9FC] transition-all"
        />
      </div>

      {/* Payment */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-[#0A1628] mb-4 pb-3
          border-b border-[#EEF1F6]">
          Payment / Donation Details
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Bank Name" k="bankName" value={(settings as any).bankName} onChange={handleFieldChange} />
          <Field label="Account Title" k="accountTitle" value={(settings as any).accountTitle} onChange={handleFieldChange} />
          <Field label="Account Number" k="accountNumber" value={(settings as any).accountNumber} onChange={handleFieldChange}
            placeholder="e.g. 0123-4567890-03" />
          <Field label="IBAN" k="iban" value={(settings as any).iban} onChange={handleFieldChange}
            placeholder="e.g. PK36HABB..." />
          <Field label="JazzCash Number" k="jazzcash" value={(settings as any).jazzcash} onChange={handleFieldChange}
            placeholder="e.g. 0300-1234567" />
          <Field label="EasyPaisa Number" k="easypaisa" value={(settings as any).easypaisa} onChange={handleFieldChange}
            placeholder="e.g. 0312-7654321" />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1A4A8A] hover:bg-[#0A1628] text-white
            px-8 py-3 rounded-xl font-semibold text-sm
            transition-all duration-200 hover:-translate-y-0.5
            hover:shadow-lg disabled:opacity-70">
          {saving ? 'Saving...' : 'Save Settings →'}
        </button>
        {saved && (
          <span className="text-[#2da86a] font-semibold text-sm">
            ✅ Settings saved successfully!
          </span>
        )}
      </div>
    </div>
  )
}
