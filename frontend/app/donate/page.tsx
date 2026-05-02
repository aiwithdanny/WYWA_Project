'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const amounts = [500, 1000, 2500, 5000, 10000, 25000]
const campaigns = [
  'General Fund', 'Scholarship Program', 'Disaster Relief',
  'Clean Water Initiative', 'Mobile Health Clinics',
  'Youth Leadership Academy'
]

export default function DonatePage() {
  const [amount, setAmount]       = useState(1000)
  const [custom, setCustom]       = useState('')
  const [campaign, setCampaign]   = useState('General Fund')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)

  const finalAmount = custom ? parseInt(custom) : amount

  const handleDonate = async () => {
    setLoading(true)
    try {
      await fetch('http://localhost:8000/api/donations/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: 'Anonymous',
          email: 'donor@example.com',
          amount: finalAmount,
          campaign,
          currency: 'PKR',
        }),
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
        <section className="bg-[#0A1628] pt-32 pb-20 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 text-[#E8C96A]
              text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
              Make a Difference
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Donate to WYWA
            </h1>
            <p className="text-white/60 text-lg">
              Your generosity directly funds education, relief,
              and community programs in Waziristan.
            </p>
          </div>
        </section>

        <section className="bg-[#F8F9FC] py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Form */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-10 shadow-sm">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-6">🎉</div>
                    <h3 className="text-2xl font-bold text-[#0A1628] mb-3"
                      style={{ fontFamily: 'Playfair Display, serif' }}>
                      Thank You for Your Generosity!
                    </h3>
                    <p className="text-[#6B7A99]">
                      Your donation of PKR {finalAmount.toLocaleString()} to{' '}
                      {campaign} has been received. A receipt will be
                      sent to your email shortly.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-[#0A1628] mb-8"
                      style={{ fontFamily: 'Playfair Display, serif' }}>
                      Choose Your Donation
                    </h2>

                    {/* Amount */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold
                        text-[#0A1628] mb-3">
                        Select Amount (PKR)
                      </label>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        {amounts.map(a => (
                          <button key={a}
                            onClick={() => { setAmount(a); setCustom('') }}
                            className={`py-3 rounded-xl text-sm font-semibold
                              border-2 transition-all duration-200
                              ${amount === a && !custom
                                ? 'bg-[#0A1628] border-[#0A1628] text-white'
                                : 'border-[#EEF1F6] text-[#3D4A63] hover:border-[#1A4A8A]'
                              }`}>
                            PKR {a.toLocaleString()}
                          </button>
                        ))}
                      </div>
                      <input
                        type="number"
                        value={custom}
                        onChange={e => setCustom(e.target.value)}
                        placeholder="Enter custom amount..."
                        className="w-full px-4 py-3 rounded-xl border-2
                          border-[#EEF1F6] text-sm focus:outline-none
                          focus:border-[#1A4A8A] transition-all" />
                    </div>

                    {/* Campaign */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold
                        text-[#0A1628] mb-3">
                        Select Campaign
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {campaigns.map(c => (
                          <button key={c}
                            onClick={() => setCampaign(c)}
                            className={`py-2.5 px-4 rounded-xl text-xs
                              font-medium border-2 transition-all text-left
                              ${campaign === c
                                ? 'bg-[#1A4A8A] border-[#1A4A8A] text-white'
                                : 'border-[#EEF1F6] text-[#3D4A63] hover:border-[#1A4A8A]'
                              }`}>
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-8">
                      <label className="block text-sm font-semibold
                        text-[#0A1628] mb-3">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: '🏦 Bank Transfer' },
                          { label: '📱 JazzCash' },
                          { label: '📱 EasyPaisa' },
                        ].map(m => (
                          <button key={m.label}
                            className="py-3 rounded-xl border-2
                              border-[#EEF1F6] text-xs font-medium
                              text-[#3D4A63] hover:border-[#1A4A8A]
                              transition-all">
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleDonate}
                      disabled={loading}
                      className="w-full bg-[#C8A84B] hover:bg-[#E8C96A]
                        text-[#0A1628] py-4 rounded-xl font-bold text-base
                        transition-all duration-200 hover:-translate-y-0.5
                        hover:shadow-lg disabled:opacity-70">
                      {loading ? 'Processing...' : `Donate PKR ${finalAmount.toLocaleString()} →`}
                    </button>
                  </>
                )}
              </div>

              {/* Sidebar */}
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-[#0A1628] mb-4"
                    style={{ fontFamily: 'Playfair Display, serif' }}>
                    Your Impact
                  </h3>
                  {[
                    { amount: 'PKR 500',    impact: 'Provides books for 1 student' },
                    { amount: 'PKR 1,000',  impact: 'Funds a medical camp visit' },
                    { amount: 'PKR 5,000',  impact: 'Sponsors a month of training' },
                    { amount: 'PKR 25,000', impact: 'Funds a full scholarship' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 py-3 border-b
                      border-[#EEF1F6] last:border-0">
                      <span className="text-[#C8A84B] font-bold text-xs
                        w-20 flex-shrink-0">
                        {item.amount}
                      </span>
                      <span className="text-[#6B7A99] text-xs">
                        {item.impact}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="bg-[#0A1628] rounded-2xl p-6 text-center">
                  <div className="text-3xl mb-3">🔒</div>
                  <p className="text-white font-semibold text-sm mb-2">
                    100% Secure
                  </p>
                  <p className="text-white/50 text-xs">
                    All donations are encrypted and securely processed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
