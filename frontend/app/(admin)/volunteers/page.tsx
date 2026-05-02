'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#0A1628] pt-32 pb-20 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Become a Volunteer
            </h1>
            <p className="text-white/60 text-lg">Join us in serving Waziristan.</p>
          </div>
        </section>

        <section className="bg-[#F8F9FC] py-24">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-6">🙌</div>
                  <h3 className="text-2xl font-bold text-[#0A1628] mb-3">Application Received!</h3>
                  <p className="text-[#6B7A99]">We'll contact you within 3-5 business days.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}>
                  <input type="text" placeholder="Full Name" required className="w-full px-4 py-3 rounded-xl border-2 mb-4" />
                  <input type="email" placeholder="Email" required className="w-full px-4 py-3 rounded-xl border-2 mb-4" />
                  <input type="tel" placeholder="Phone" required className="w-full px-4 py-3 rounded-xl border-2 mb-4" />
                  <button type="submit" className="w-full bg-[#1A4A8A] text-white py-4 rounded-xl font-bold">
                    Submit Application →
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
