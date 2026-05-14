'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { eventsAPI } from '@/lib/api'

interface EventType {
  date: string
  title: string
  location: string
  desc: string
  color: string
  tag: string
}

function EventCard({ event }: { event: EventType }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden hover:-translate-y-2
        transition-all duration-300 hover:shadow-xl group"
      style={{ borderTop: `4px solid ${event.color}` }}
    >
      <div className="p-8">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.tag}`}>
            Event
          </span>
          <span className="text-xs text-[#6B7A99] font-medium">
            📅 {event.date}
          </span>
        </div>
        <h3
          className="font-bold text-[#0A1628] text-lg mb-3
            group-hover:text-[#1A4A8A] transition-colors leading-tight"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {event.title}
        </h3>
        <p className="text-[#6B7A99] text-sm leading-relaxed mb-4">
          {event.desc}
        </p>
        <p className="text-xs text-[#3D4A63] font-medium mb-6">
          📍 {event.location}
        </p>
        <button
          className="w-full py-3 rounded-xl border-2 text-sm font-semibold
            transition-all duration-200 text-[#1A4A8A] border-[#1A4A8A]
            hover:bg-[#1A4A8A] hover:text-white"
        >
          Register Now →
        </button>
      </div>
    </div>
  )
}

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    eventsAPI.getAll()
      .then(data => {
        if (data.events && data.events.length > 0) {
          const mapped = data.events.map((e: any) => ({
            color: '#1A4A8A',
            tag: 'bg-blue-100 text-blue-700',
            date: e.date ? new Date(e.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '',
            title: e.title,
            desc: e.description || '',
            location: e.location,
          }))
          setEvents(mapped)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#0A1628] pt-32 pb-20 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 text-[#E8C96A]
              text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
              What is Happening
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
            </div>
            <h1
              className="text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Upcoming Events
            </h1>
            <p className="text-white/60 text-lg">
              Stay updated with WYWA latest events, programs,
              and community activities.
            </p>
          </div>
        </section>

        <section className="bg-[#F8F9FC] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-[#1A4A8A] border-t-transparent rounded-full" />
                <span className="ml-3 text-[#6B7A99]">Loading events...</span>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-20 text-[#6B7A99]">
                <p className="text-lg font-medium">No upcoming events</p>
                <p className="text-sm mt-2">Check back soon for updates.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event: any, i: number) => (
                  <EventCard key={i} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
