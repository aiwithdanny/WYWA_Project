'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('http://localhost:8000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
    } catch (error) {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#0A1628] pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
            text-center">
            <div className="inline-flex items-center gap-2 text-[#E8C96A]
              text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
              Get In Touch
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Contact Us
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Whether you want to volunteer, donate, partner, or learn
              more — we would love to hear from you.
            </p>
          </div>
        </section>

        <section className="bg-[#F8F9FC] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">

              {/* Info */}
              <div className="flex flex-col gap-8">
                <div>
                  <h2 className="text-3xl font-bold text-[#0A1628] mb-4"
                    style={{ fontFamily: 'Playfair Display, serif' }}>
                    Let us Build Change Together
                  </h2>
                  <p className="text-[#6B7A99] leading-relaxed">
                    Our team is ready to answer your questions and
                    explore opportunities for collaboration.
                  </p>
                </div>

                {[
                  { icon: '📍', label: 'Office',
                    value: 'Wana, South Waziristan, KP, Pakistan' },
                  { icon: '📧', label: 'Email',
                    value: 'info@wywa.org.pk' },
                  { icon: '📞', label: 'Phone',
                    value: '+92-300-1234567' },
                  { icon: '💬', label: 'WhatsApp',
                    value: '+92-300-1234567' },
                  { icon: '🌐', label: 'Registration',
                    value: 'NGO Reg: KP-2010-0847' },
                  { icon: '🕐', label: 'Office Hours',
                    value: 'Mon-Fri, 9AM-5PM PKT' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-xl bg-[#1A4A8A]
                      flex items-center justify-center text-xl
                      flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0A1628]
                        text-sm mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-[#6B7A99] text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}

                <div>
                  <p className="font-semibold text-[#0A1628] text-sm mb-3">
                    Follow Us
                  </p>
                  <div className="flex gap-3">
                    {['Facebook', 'Twitter', 'LinkedIn', 'YouTube'].map(s => (
                      <a key={s} href="#"
                        className="px-4 py-2 bg-white border
                          border-[#EEF1F6] rounded-lg text-xs
                          text-[#3D4A63] font-medium
                          hover:bg-[#1A4A8A] hover:text-white
                          hover:border-[#1A4A8A] transition-all">
                        {s}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="bg-white rounded-2xl p-10 shadow-sm">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-6">✅</div>
                    <h3 className="text-2xl font-bold text-[#0A1628] mb-3"
                      style={{ fontFamily: 'Playfair Display, serif' }}>
                      Message Received!
                    </h3>
                    <p className="text-[#6B7A99]">
                      Thank you for reaching out. Our team will get
                      back to you within 1-2 business days.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-[#0A1628] mb-2"
                      style={{ fontFamily: 'Playfair Display, serif' }}>
                      Send Us a Message
                    </h3>
                    <p className="text-[#6B7A99] text-sm mb-8">
                      We respond within 1-2 business days.
                    </p>
                    <form onSubmit={handleSubmit}
                      className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium
                            text-[#3D4A63] mb-1.5">Full Name *</label>
                          <input required
                            value={form.name}
                            onChange={e => setForm({...form, name: e.target.value})}
                            placeholder="Ali Khan"
                            className="w-full px-4 py-3 rounded-lg
                              border border-[#EEF1F6] bg-[#F8F9FC]
                              text-sm focus:outline-none
                              focus:border-[#1A4A8A] transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium
                            text-[#3D4A63] mb-1.5">Phone</label>
                          <input
                            value={form.phone}
                            onChange={e => setForm({...form, phone: e.target.value})}
                            placeholder="+92-300-0000000"
                            className="w-full px-4 py-3 rounded-lg
                              border border-[#EEF1F6] bg-[#F8F9FC]
                              text-sm focus:outline-none
                              focus:border-[#1A4A8A] transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium
                          text-[#3D4A63] mb-1.5">Email *</label>
                        <input required type="email"
                          value={form.email}
                          onChange={e => setForm({...form, email: e.target.value})}
                          placeholder="ali@example.com"
                          className="w-full px-4 py-3 rounded-lg
                            border border-[#EEF1F6] bg-[#F8F9FC]
                            text-sm focus:outline-none
                            focus:border-[#1A4A8A] transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium
                          text-[#3D4A63] mb-1.5">Subject *</label>
                        <select required
                          value={form.subject}
                          onChange={e => setForm({...form, subject: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg
                            border border-[#EEF1F6] bg-[#F8F9FC]
                            text-sm focus:outline-none
                            focus:border-[#1A4A8A] transition-all">
                          <option value="">Select a topic...</option>
                          <option>Volunteering</option>
                          <option>Donating / Funding</option>
                          <option>Partnership</option>
                          <option>Program Information</option>
                          <option>Media & Press</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium
                          text-[#3D4A63] mb-1.5">Message *</label>
                        <textarea required rows={5}
                          value={form.message}
                          onChange={e => setForm({...form, message: e.target.value})}
                          placeholder="Tell us how you would like to get involved..."
                          className="w-full px-4 py-3 rounded-lg
                            border border-[#EEF1F6] bg-[#F8F9FC]
                            text-sm focus:outline-none
                            focus:border-[#1A4A8A] transition-all
                            resize-none" />
                      </div>
                      <button type="submit"
                        disabled={loading}
                        className="w-full bg-[#1A4A8A] hover:bg-[#0A1628]
                          text-white py-4 rounded-lg font-semibold
                          text-sm transition-all duration-200
                          hover:-translate-y-0.5 hover:shadow-lg
                          disabled:opacity-70">
                        {loading ? 'Sending...' : 'Send Message →'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
