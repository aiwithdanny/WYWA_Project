const testimonials = [
  {
    quote: "WYWA has transformed our entire village. The clean water project alone has saved countless lives. We are forever grateful for their tireless work.",
    name: 'Elder Gul Hassan',
    role: 'Village Elder, North Waziristan',
    initial: 'G',
  },
  {
    quote: "As a woman in Waziristan, I never thought I would run my own business. WYWA's vocational training gave me the skills and confidence to do exactly that.",
    name: 'Fatima Mehsud',
    role: 'Vocational Training Graduate, 2021',
    initial: 'F',
  },
  {
    quote: "The Youth Leadership Academy shaped my entire career. I now work for an international NGO, and I owe it all to WYWA's belief in young people.",
    name: 'Zubair Khan',
    role: 'Youth Academy Graduate, 2020',
    initial: 'Z',
  },
]

export default function Testimonials() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-[#1A4A8A]
            text-xs font-semibold uppercase tracking-widest mb-3">
            <span className="w-7 h-0.5 bg-[#C8A84B]" />
            Testimonials
            <span className="w-7 h-0.5 bg-[#C8A84B]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0A1628]"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Voices from the Community
          </h2>
          <p className="text-[#6B7A99] mt-4 max-w-xl mx-auto">
            Real stories from real people whose lives have been touched
            by WYWA's programs and dedication.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i}
              className="bg-[#F8F9FC] rounded-2xl p-8 relative
                hover:-translate-y-2 transition-all duration-300
                hover:shadow-xl group">

              {/* Quote mark */}
              <div className="text-6xl text-[#C8A84B]/20 font-serif
                absolute top-4 right-6 leading-none select-none">
                "
              </div>

              <p className="text-[#3D4A63] text-sm leading-relaxed italic mb-6 relative z-10">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3 pt-4
                border-t border-[#EEF1F6]">
                <div className="w-10 h-10 rounded-full
                  bg-gradient-to-br from-[#1A4A8A] to-[#0A1628]
                  flex items-center justify-center
                  text-[#C8A84B] font-bold text-sm">
                  {t.initial}
                </div>
                <div>
                  <p className="font-semibold text-[#0A1628] text-sm">
                    {t.name}
                  </p>
                  <p className="text-xs text-[#6B7A99]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
