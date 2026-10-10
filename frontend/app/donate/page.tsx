'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { donationsAPI } from '@/lib/api'
import { useSiteSettings } from '@/lib/useSiteSettings'

const amounts = [500, 1000, 2500, 5000, 10000, 25000]
const campaigns = [
  'General Fund', 'Scholarship Program', 'Disaster Relief',
  'Clean Water Initiative', 'Mobile Health Clinics',
  'Youth Leadership Academy'
]

export default function DonatePage() {
  const { settings } = useSiteSettings()
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [phone, setPhone]         = useState('')
  const [amount, setAmount]       = useState(1000)
  const [custom, setCustom]       = useState('')
  const [campaign, setCampaign]   = useState('General Fund')
  const [payMethod, setPayMethod] = useState('')
  const [txnId, setTxnId]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  const finalAmount = custom ? parseInt(custom) : amount

  // Build list of available payment accounts from settings
  const accounts: { id: string; label: string; icon: string; details: string[] }[] = []
  if (settings?.jazzcash) {
    accounts.push({
      id: 'JAZZCASH', label: 'JazzCash', icon: '📱',
      details: [`Number: ${settings.jazzcash}`, `Title: ${settings.accountTitle || 'WYWA'}`],
    })
  }
  if (settings?.easypaisa) {
    accounts.push({
      id: 'EASYPAISA', label: 'EasyPaisa', icon: '📱',
      details: [`Number: ${settings.easypaisa}`, `Title: ${settings.accountTitle || 'WYWA'}`],
    })
  }
  if (settings?.accountNumber) {
    const bankDetails = [`Title: ${settings.accountTitle || 'WYWA'}`, `Account: ${settings.accountNumber}`]
    if (settings?.iban) bankDetails.push(`IBAN: ${settings.iban}`)
    if (settings?.bankName) bankDetails.unshift(`Bank: ${settings.bankName}`)
    accounts.push({ id: 'BANK_TRANSFER', label: 'Bank Transfer', icon: '🏦', details: bankDetails })
  }

  const handleDonate = async () => {
    if (!name || !email) {
      setError('Please enter your name and email')
      return
    }
    if (!payMethod) {
      setError('Please select the payment method you used')
      return
    }
    if (!txnId.trim()) {
      setError('Please enter the Transaction ID from your payment receipt')
      return
    }
    setLoading(true)
    setError('')
    try {
      await donationsAPI.initiate({
        donorName: name,
        email,
        phone,
        amount: finalAmount,
        campaign,
        currency: 'PKR',
        paymentMethod: payMethod,
        paymentRef: txnId.trim(),
      })
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Could not submit your donation. Please check your connection and try again.')
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
                    <div className="text-6xl mb-6">🙏</div>
                    <h3 className="text-2xl font-bold text-[#0A1628] mb-3"
                      style={{ fontFamily: 'Playfair Display, serif' }}>
                      Thank You! Your Donation is Under Review
                    </h3>
                    <p className="text-[#6B7A99] max-w-md mx-auto">
                      We received your donation details of{' '}
                      <strong>PKR {finalAmount.toLocaleString()}</strong> for{' '}
                      {campaign}. Our team will verify your transaction{' '}
                      (Ref: {txnId}) and confirm it shortly. A receipt will be
                      sent to your email.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-[#0A1628] mb-8"
                      style={{ fontFamily: 'Playfair Display, serif' }}>
                      Choose Your Donation
                    </h2>

                    {/* Name & Email */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#0A1628] mb-2">Full Name *</label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="w-full px-4 py-3 rounded-xl border-2 border-[#EEF1F6] text-sm focus:outline-none focus:border-[#1A4A8A] transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#0A1628] mb-2">Email *</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl border-2 border-[#EEF1F6] text-sm focus:outline-none focus:border-[#1A4A8A] transition-all" />
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[#0A1628] mb-2">Phone (optional)</label>
                      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="03XX-XXXXXXX" className="w-full px-4 py-3 rounded-xl border-2 border-[#EEF1F6] text-sm focus:outline-none focus:border-[#1A4A8A] transition-all" />
                    </div>

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

                    {/* Payment Accounts (dynamic from settings) */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold
                        text-[#0A1628] mb-3">
                        Step 1 — Send PKR {finalAmount.toLocaleString()} to any account below
                      </label>
                      {accounts.length === 0 ? (
                        <p className="text-sm text-[#6B7A99] bg-[#F8F9FC] rounded-xl px-4 py-3">
                          Payment accounts are being set up. Please check back soon or contact us directly.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {accounts.map(acc => (
                            <button key={acc.id}
                              onClick={() => setPayMethod(acc.id)}
                              className={`text-left rounded-xl border-2 p-4 transition-all
                                ${payMethod === acc.id
                                  ? 'border-[#1A4A8A] bg-[#1A4A8A]/5'
                                  : 'border-[#EEF1F6] hover:border-[#1A4A8A]'
                                }`}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{acc.icon}</span>
                                <span className="font-semibold text-sm text-[#0A1628]">{acc.label}</span>
                                {payMethod === acc.id && (
                                  <span className="ml-auto text-[#1A4A8A] text-sm">✓</span>
                                )}
                              </div>
                              {acc.details.map((d, i) => (
                                <p key={i} className="text-xs text-[#3D4A63] font-mono ml-8">{d}</p>
                              ))}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Transaction ID */}
                    <div className="mb-8">
                      <label className="block text-sm font-semibold
                        text-[#0A1628] mb-3">
                        Step 2 — Enter Transaction ID (TID) from your receipt *
                      </label>
                      <input
                        value={txnId}
                        onChange={e => setTxnId(e.target.value)}
                        placeholder="e.g. 12345678901"
                        className="w-full px-4 py-3 rounded-xl border-2
                          border-[#EEF1F6] text-sm font-mono focus:outline-none
                          focus:border-[#1A4A8A] transition-all" />
                      <p className="text-xs text-[#6B7A99] mt-2">
                        After sending the amount, you will receive a Transaction ID via SMS.
                        Enter it here so we can verify your donation.
                      </p>
                    </div>

                    {error && (
                      <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        {error}
                      </p>
                    )}
                    <button
                      onClick={handleDonate}
                      disabled={loading}
                      className="w-full bg-[#C8A84B] hover:bg-[#E8C96A]
                        text-[#0A1628] py-4 rounded-xl font-bold text-base
                        transition-all duration-200 hover:-translate-y-0.5
                        hover:shadow-lg disabled:opacity-70">
                      {loading ? 'Submitting...' : `Submit Donation PKR ${finalAmount.toLocaleString()} →`}
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
                    Manual Verification
                  </p>
                  <p className="text-white/50 text-xs">
                    Every donation is manually verified by our team before confirmation.
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
