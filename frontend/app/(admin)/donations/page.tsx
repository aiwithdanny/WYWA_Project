'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function DonatePage() {
  const [amount, setAmount] = useState(1000)
  const [custom, setCustom] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const finalAmount = custom ? parseInt(custom) : amount

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#0A1628] pt-32 pb-20 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Donate to WYWA
            </h1>
            <p className="text-white/60 text-lg">Your generosity changes lives in Waziristan.</p>
          </div>
        </section>

        <section className="bg-[#F8F9FC] py-24">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-6">🎉</div>
                  <h3 className="text-2xl font-bold text-[#0A1628] mb-3">Thank You!</h3>
                  <p className="text-[#6B7A99]">Your donation of PKR {finalAmount.toLocaleString()} has been received.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-[#0A1628] mb-6">Choose Amount (PKR)</h2>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[500, 1000, 2500, 5000, 10000, 25000].map(a => (
                      <button key={a} type="button"
                        onClick={() => { setAmount(a); setCustom('') }}
                        className={`py-3 rounded-xl border-2 ${amount === a && !custom ? 'bg-[#0A1628] border-[#0A1628] text-white' : 'border-gray-200'}`}>
                        PKR {a}
                      </button>
                    ))}
                  </div>
                  <input type="number" value={custom} onChange={e => setCustom(e.target.value)}
                    placeholder="Custom amount"
                    className="w-full px-4 py-3 rounded-xl border-2 mb-6" />
                  <button onClick={() => setSubmitted(true)}
                    className="w-full bg-[#C8A84B] py-4 rounded-xl font-bold">
                    Donate PKR {finalAmount.toLocaleString()} →
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
