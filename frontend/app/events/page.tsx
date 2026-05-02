'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const events = [
  {
    date: 'May 15, 2026',
    title: 'Annual Scholarship Award Ceremony',
    location: 'Wana Community Hall',
    type: 'Ceremony',
    desc: 'Join us to celebrate this years scholarship recipients and their families.',
    color: '#1A4A8A',
    tag: 'bg-blue-100 text-blue-700',
  },
  {
    date: 'May 22, 2026',
    title: 'Free Medical Camp — Shawal Valley',
    location: 'Shawal Valley, NW',
    type: 'Health',
    desc: 'Free medical checkups, vaccinations, and medicines for remote villagers.',
    color: '#2da86a',
    tag: 'bg-green-100 text-green-700',
  },
  {
    date: 'June 1, 2026',
    title: 'Youth Leadership Academy — Intake 2026',
    location: 'WYWA Training Center, Wana',
    type: 'Training',
    desc: 'Applications open for the 6-month Youth Leadership Academy program.',
    color: '#8250c8',
    tag: 'bg-purple-100 text-purple-700',
  },
  {
    date: 'June 10, 2026',
    title: 'Clean Water Project Launch — Birmal',
    location: 'Birmal, South Waziristan',
    type: 'Infrastructure',
    desc: 'Launch ceremony for 10 new water filtration units in Birmal village.',
    color: '#14a0a0',
    tag: 'bg-teal-100 text-teal-700',
  },
  {
    date: 'June 20, 2026',
    title: 'Fundraising Dinner — Islamabad',
    location: 'Marriott Hotel, Islamabad',
    type: 'Fundraising',
    desc: 'Annual fundraising dinner with keynote speakers and impact presentations.',
    color: '#C8A84B',
    tag: 'bg-yellow-100 text-yellow-700',
  },
  {
    date: 'July 5, 2026',
    title: 'Vocational Training Graduation',
    location: 'WYWA Skills Center, Wana',
    type: 'Ceremony',
    desc: 'Graduation ceremony for 120 vocational training graduates.',
    color: '#e0722a',
    tag: 'bg-red-100 text-red-700',
  },
]

interface EventType {
  date: string
  title: string
  location: string
  type: string
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
            {event.type}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <EventCard key={i} event={event} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
