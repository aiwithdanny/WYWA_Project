export default function Impact() {
  const stories = [
    {
      quote: "WYWA's scholarship changed my life. I was the first in my village to attend university. Now I'm a teacher, giving back to the community that believed in me.",
      name: 'Aisha Wazir',
      role: 'Scholarship Recipient, Class of 2019',
      initial: 'A',
      color: 'from-[#1A4A8A] to-[#0A1628]',
      border: '#C8A84B',
    },
    {
      quote: "When floods hit our village, WYWA arrived within 48 hours. They brought food, tents, and hope. We will never forget their service to our community.",
      name: 'Muhammad Khan',
      role: 'Flood Relief Beneficiary, 2022',
      initial: 'M',
      color: 'from-[#2da86a] to-[#1a6b42]',
      border: '#3B82D4',
    },
  ]

  return (
    <section className="bg-[#F8F9FC] py-24" id="impact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — Stats */}
          <div>
            <div className="inline-flex items-center gap-2 text-[#1A4A8A]
              text-xs font-semibold uppercase tracking-widest mb-4">
              <span className="w-7 h-0.5 bg-[#C8A84B]" />
              Our Impact
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A1628] mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Numbers That<br />
              <span className="text-[#1A4A8A]">Tell a Story</span>
            </h2>
            <p className="text-[#6B7A99] leading-relaxed mb-10">
              Every number represents a real person, a real family, a real
              community transformed by collective action and unwavering dedication.
            </p>

            {/* Impact Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '12,000+', label: 'Beneficiaries Reached',  color: '#1A4A8A' },
                { num: '320+',    label: 'Scholarships Awarded',   color: '#C8A84B' },
                { num: '60+',     label: 'Wells & Water Points',   color: '#2da86a' },
                { num: '45+',     label: 'Active Programs',        color: '#e0722a' },
              ].map((item, i) => (
                <div key={i}
                  className="bg-white rounded-2xl p-6 shadow-sm
                    hover:-translate-y-1 transition-all duration-200"
                  style={{ borderBottom: `3px solid ${item.color}` }}>
                  <span className="text-3xl font-bold text-[#0A1628] block mb-1"
                    style={{ fontFamily: 'Playfair Display, serif' }}>
                    {item.num}
                  </span>
                  <span className="text-xs text-[#6B7A99] font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Stories */}
          <div className="flex flex-col gap-6">
            {stories.map((s, i) => (
              <div key={i}
                className="bg-white rounded-2xl p-7 shadow-sm"
                style={{ borderLeft: `4px solid ${s.border}` }}>
                <p className="text-[#3D4A63] text-sm leading-relaxed italic mb-5">
                  "{s.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br
                    ${s.color} flex items-center justify-center
                    text-white font-bold text-sm`}>
                    {s.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A1628] text-sm">
                      {s.name}
                    </p>
                    <p className="text-xs text-[#6B7A99]">{s.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
