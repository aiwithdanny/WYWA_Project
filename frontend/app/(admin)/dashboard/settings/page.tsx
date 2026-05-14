'use client'
import { useState, useEffect } from 'react'
import { settingsAPI } from '@/lib/api'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Waziristan Youth Welfare Association',
    shortName: 'WYWA',
    tagline: 'Empowering Youth. Building Futures. Serving Waziristan.',
    email: 'info@wywa.org.pk',
    phone: '+92-300-1234567',
    whatsapp: '+92-300-1234567',
    address: 'Wana, South Waziristan, KP, Pakistan',
    facebook: 'https://facebook.com/wywa',
    twitter: '',
    instagram: '',
    youtube: '',
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

  const handleSave = async () => {
    setSaving(true)
    try {
      await settingsAPI.update(settings)
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

  const Field = ({ label, k, type = 'text', placeholder = '' }: {
    label: string, k: string, type?: string, placeholder?: string
  }) => (
    <div>
      <label className="block text-xs font-medium text-[#3D4A63] mb-1">
        {label}
      </label>
      <input
        type={type}
        value={(settings as any)[k]}
        onChange={e => setSettings({ ...settings, [k]: e.target.value })}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-[#EEF1F6]
          text-sm focus:outline-none focus:border-[#1A4A8A]
          bg-[#F8F9FC] transition-all"
      />
    </div>
  )

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
          <Field label="Organization Name" k="siteName" />
          <Field label="Short Name" k="shortName" />
          <div className="md:col-span-2">
            <Field label="Tagline / Slogan" k="tagline" />
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
          <Field label="Email Address" k="email" type="email" />
          <Field label="Phone Number" k="phone" />
          <Field label="WhatsApp Number" k="whatsapp" />
          <div className="md:col-span-2">
            <Field label="Office Address" k="address" />
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
          <Field label="Facebook Page URL" k="facebook"
            placeholder="https://facebook.com/wywa" />
          <Field label="Twitter / X URL" k="twitter"
            placeholder="https://twitter.com/wywa" />
          <Field label="Instagram URL" k="instagram"
            placeholder="https://instagram.com/wywa" />
          <Field label="YouTube Channel URL" k="youtube"
            placeholder="https://youtube.com/@wywa" />
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-[#0A1628] mb-4 pb-3
          border-b border-[#EEF1F6]">
          Payment / Donation Details
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Bank Name" k="bankName" />
          <Field label="Account Title" k="accountTitle" />
          <Field label="Account Number" k="accountNumber"
            placeholder="e.g. 0123-4567890-03" />
          <Field label="IBAN" k="iban"
            placeholder="e.g. PK36HABB..." />
          <Field label="JazzCash Number" k="jazzcash"
            placeholder="e.g. 0300-1234567" />
          <Field label="EasyPaisa Number" k="easypaisa"
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
