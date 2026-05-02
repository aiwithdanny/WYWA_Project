'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const skills = [
  'Teaching', 'Healthcare', 'IT & Technology', 'Construction',
  'Media & Communications', 'Fundraising', 'Administration', 'Social Work'
]
const areas = [
  'Education', 'Health', 'Disaster Relief',
  'Community Development', 'Media', 'Fundraising', 'Administration'
]

export default function VolunteerPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '',
    availability: '', experience: '', motivation: '',
    selectedSkills: [] as string[],
    selectedArea: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)

  const toggleSkill = (skill: string) => {
    setForm(f => ({
      ...f,
      selectedSkills: f.selectedSkills.includes(skill)
        ? f.selectedSkills.filter(s => s !== skill)
        : [...f.selectedSkills, skill]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('http://localhost:8000/api/volunteers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          skills: form.selectedSkills,
          availability: form.availability,
          area: form.selectedArea || 'OTHER',
          motivation: form.motivation,
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
              Join Our Team
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Become a Volunteer
            </h1>
            <p className="text-white/60 text-lg">
              Join hundreds of passionate volunteers making a real
              difference in Waziristan.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: '🌍', title: 'Make Real Impact',
                  desc: 'Directly contribute to programs that change lives.' },
                { icon: '📚', title: 'Learn & Grow',
                  desc: 'Gain valuable skills and field experience.' },
                { icon: '🤝', title: 'Build Network',
                  desc: 'Connect with like-minded change-makers.' },
                { icon: '🏆', title: 'Get Certified',
                  desc: 'Receive official volunteer certification.' },
              ].map((b, i) => (
                <div key={i} className="text-center p-6 rounded-2xl
                  bg-[#F8F9FC] hover:-translate-y-1 transition-all">
                  <div className="text-4xl mb-3">{b.icon}</div>
                  <h3 className="font-bold text-[#0A1628] mb-2">{b.title}</h3>
                  <p className="text-[#6B7A99] text-sm">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="bg-[#F8F9FC] py-24">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-white rounded-2xl p-10 shadow-sm">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-6">🙌</div>
                  <h3 className="text-2xl font-bold text-[#0A1628] mb-3"
                    style={{ fontFamily: 'Playfair Display, serif' }}>
                    Application Received!
                  </h3>
                  <p className="text-[#6B7A99]">
                    Thank you for volunteering! Our team will review
                    your application and contact you within 3-5 days.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-[#0A1628] mb-2"
                    style={{ fontFamily: 'Playfair Display, serif' }}>
                    Volunteer Application
                  </h2>
                  <p className="text-[#6B7A99] text-sm mb-8">
                    Fill out this form and we will get back to you
                    within 3-5 days.
                  </p>
                  <form onSubmit={handleSubmit}
                    className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium
                          text-[#3D4A63] mb-1.5">Full Name *</label>
                        <input required
                          value={form.name}
                          onChange={e => setForm({...form, name: e.target.value})}
                          placeholder="Ali Khan"
                          className="w-full px-4 py-3 rounded-lg border
                            border-[#EEF1F6] bg-[#F8F9FC] text-sm
                            focus:outline-none focus:border-[#1A4A8A]
                            transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium
                          text-[#3D4A63] mb-1.5">Phone *</label>
                        <input required
                          value={form.phone}
                          onChange={e => setForm({...form, phone: e.target.value})}
                          placeholder="+92-300-0000000"
                          className="w-full px-4 py-3 rounded-lg border
                            border-[#EEF1F6] bg-[#F8F9FC] text-sm
                            focus:outline-none focus:border-[#1A4A8A]
                            transition-all" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium
                        text-[#3D4A63] mb-1.5">Email *</label>
                      <input required type="email"
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        placeholder="ali@example.com"
                        className="w-full px-4 py-3 rounded-lg border
                          border-[#EEF1F6] bg-[#F8F9FC] text-sm
                          focus:outline-none focus:border-[#1A4A8A]
                          transition-all" />
                    </div>

                    <div>
                      <label className="block text-xs font-medium
                        text-[#3D4A63] mb-2">
                        Skills (select all that apply)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                          <button key={skill} type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-4 py-2 rounded-full text-xs
                              font-medium border-2 transition-all
                              ${form.selectedSkills.includes(skill)
                                ? 'bg-[#1A4A8A] border-[#1A4A8A] text-white'
                                : 'border-[#EEF1F6] text-[#3D4A63] hover:border-[#1A4A8A]'
                              }`}>
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium
                        text-[#3D4A63] mb-2">Preferred Area *</label>
                      <div className="flex flex-wrap gap-2">
                        {areas.map(area => (
                          <button key={area} type="button"
                            onClick={() => setForm({...form, selectedArea: area})}
                            className={`px-4 py-2 rounded-full text-xs
                              font-medium border-2 transition-all
                              ${form.selectedArea === area
                                ? 'bg-[#C8A84B] border-[#C8A84B] text-[#0A1628]'
                                : 'border-[#EEF1F6] text-[#3D4A63] hover:border-[#C8A84B]'
                              }`}>
                            {area}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium
                        text-[#3D4A63] mb-1.5">Availability *</label>
                      <select required
                        value={form.availability}
                        onChange={e => setForm({...form, availability: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border
                          border-[#EEF1F6] bg-[#F8F9FC] text-sm
                          focus:outline-none focus:border-[#1A4A8A]
                          transition-all">
                        <option value="">Select availability...</option>
                        <option>Weekdays only</option>
                        <option>Weekends only</option>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Flexible</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium
                        text-[#3D4A63] mb-1.5">
                        Why do you want to volunteer?
                      </label>
                      <textarea rows={4}
                        value={form.motivation}
                        onChange={e => setForm({...form, motivation: e.target.value})}
                        placeholder="Tell us what motivates you to serve Waziristan..."
                        className="w-full px-4 py-3 rounded-lg border
                          border-[#EEF1F6] bg-[#F8F9FC] text-sm
                          focus:outline-none focus:border-[#1A4A8A]
                          transition-all resize-none" />
                    </div>

                    <button type="submit"
                      disabled={loading}
                      className="w-full bg-[#1A4A8A] hover:bg-[#0A1628]
                        text-white py-4 rounded-lg font-bold text-sm
                        transition-all duration-200 hover:-translate-y-0.5
                        hover:shadow-lg disabled:opacity-70">
                      {loading ? 'Submitting...' : 'Submit Application →'}
                    </button>
                  </form>
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
