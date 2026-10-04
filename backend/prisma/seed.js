require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ─── USERS ───
  const admin = await prisma.user.upsert({
    where: { email: 'admin@wywa.org.pk' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@wywa.org.pk',
      passwordHash: bcrypt.hashSync('wywa2026', 10),
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  })
  console.log('✅ Admin user:', admin.email)

  // ─── PROGRAMS ───
  const programs = [
    { title: 'WYWA Scholarship Fund', slug: 'scholarship-fund', description: 'Annual scholarships for outstanding students from low-income families to attend universities and professional colleges across Pakistan.', category: 'EDUCATION', status: 'PUBLISHED', beneficiaries: 320, startDate: new Date('2024-01-15'), location: 'Waziristan', isFeatured: true },
    { title: 'Mobile Health Clinics', slug: 'mobile-health', description: 'Regular medical camps and mobile health units serving remote villages with basic healthcare and maternal support.', category: 'HEALTH', status: 'PUBLISHED', beneficiaries: 800, startDate: new Date('2024-01-20'), location: 'Shawal Valley', isFeatured: false },
    { title: 'Clean Water Initiative', slug: 'clean-water', description: 'Installing hand pumps and filtration units in underserved communities to provide clean drinking water.', category: 'INFRASTRUCTURE', status: 'PUBLISHED', beneficiaries: 3000, startDate: new Date('2024-02-15'), location: 'Birmal', isFeatured: true },
    { title: 'Youth Leadership Academy', slug: 'youth-leadership', description: '6-month intensive leadership program for aspiring young leaders from Waziristan.', category: 'YOUTH_EMPOWERMENT', status: 'PUBLISHED', beneficiaries: 180, startDate: new Date('2024-04-01'), location: 'Wana', isFeatured: false },
    { title: 'Skills & Vocational Training', slug: 'vocational-training', description: 'Free trade training in carpentry, tailoring, IT, and healthcare for youth and women.', category: 'COMMUNITY_DEVELOPMENT', status: 'PUBLISHED', beneficiaries: 1200, startDate: new Date('2024-02-01'), location: 'WYWA Center', isFeatured: false },
    { title: 'Flood & Disaster Relief', slug: 'disaster-relief', description: 'Emergency response operations providing food, shelter, and medical aid during disasters.', category: 'DISASTER_RELIEF', status: 'PUBLISHED', beneficiaries: 5000, startDate: new Date('2024-03-10'), location: 'Region-wide', isFeatured: false },
  ]

  for (const p of programs) {
    await prisma.program.upsert({ where: { slug: p.slug }, update: {}, create: p })
  }
  console.log('✅ Programs seeded:', programs.length)

  // ─── TEAM MEMBERS ───
  const team = [
    { name: 'Zahir Khan', role: 'Founder & President', bio: '15+ years in community development and youth empowerment across Waziristan.', email: 'zahir@wywa.org.pk', phone: '+92-300-1111111', orderIndex: 1, isActive: true },
    { name: 'Nasreen Mehsud', role: 'Director of Education', bio: 'Former schoolteacher leading education programs and scholarship initiatives.', email: 'nasreen@wywa.org.pk', phone: '+92-300-2222222', orderIndex: 2, isActive: true },
    { name: 'Imran Wazir', role: 'Head of Relief Operations', bio: 'Disaster response specialist coordinating emergency aid and rehabilitation.', email: 'imran@wywa.org.pk', phone: '+92-300-3333333', orderIndex: 3, isActive: true },
    { name: 'Rukhsana Khan', role: 'Community Programs Lead', bio: 'Women rights advocate driving empowerment and vocational training programs.', email: 'rukhsana@wywa.org.pk', phone: '+92-300-4444444', orderIndex: 4, isActive: true },
  ]

  for (const t of team) {
    await prisma.teamMember.create({ data: t }).catch(() => {})
  }
  console.log('✅ Team members seeded:', team.length)

  // ─── NEWS ───
  const news = [
    { title: 'WYWA Scholar Becomes First Female Doctor from Her Village', slug: 'first-female-doctor', excerpt: 'Zara Wazir, a WYWA scholarship recipient, has graduated as a doctor.', body: 'Full article content here about Zara Wazir journey and achievement.', category: 'SUCCESS_STORIES', status: 'PUBLISHED', isFeatured: true, publishedAt: new Date('2026-04-20') },
    { title: '60th Water Well Completed in Birmal District', slug: '60th-water-well', excerpt: 'WYWA Clean Water Initiative reaches major milestone.', body: 'Full article content about the 60th water well and impact on 3,000 residents.', category: 'PROGRAMS', status: 'PUBLISHED', isFeatured: false, publishedAt: new Date('2026-04-15') },
    { title: 'Youth Leadership Academy 2026 Applications Now Open', slug: 'yla-2026-open', excerpt: 'Applications for the 2026 Youth Leadership Academy are now open.', body: 'Full article with application details and eligibility criteria.', category: 'ANNOUNCEMENTS', status: 'PUBLISHED', isFeatured: false, publishedAt: new Date('2026-04-10') },
  ]

  for (const n of news) {
    await prisma.news.upsert({ where: { slug: n.slug }, update: {}, create: n })
  }
  console.log('✅ News articles seeded:', news.length)

  // ─── EVENTS ───
  const events = [
    { title: 'Annual Scholarship Ceremony 2026', slug: 'scholarship-ceremony-2026', description: 'Celebrate scholarship recipients and their achievements.', date: new Date('2026-05-15'), location: 'Wana Community Hall', isPublished: true, isFeatured: true },
    { title: 'Free Medical Camp — Shawal Valley', slug: 'medical-camp-may-2026', description: 'Free checkups, medicines, and maternal health services.', date: new Date('2026-05-22'), location: 'Shawal Valley', isPublished: true, isFeatured: true },
  ]

  for (const e of events) {
    await prisma.event.upsert({ where: { slug: e.slug }, update: {}, create: e })
  }
  console.log('✅ Events seeded:', events.length)

  // ─── GALLERY ───
  const gallery = [
    { albumName: 'Scholarship Ceremony 2025', imageUrl: '', caption: 'Annual ceremony honoring top scholars', year: 2025, isFeatured: true },
    { albumName: 'Flood Relief Operations', imageUrl: '', caption: 'Emergency relief work in North Waziristan', year: 2024, isFeatured: true },
    { albumName: 'Clean Water Project', imageUrl: '', caption: 'New wells installation in Birmal', year: 2024, isFeatured: false },
  ]

  for (const g of gallery) {
    await prisma.gallery.create({ data: g }).catch(() => {})
  }
  console.log('✅ Gallery items seeded:', gallery.length)

  // ─── DONATIONS ───
  const donations = [
    { donorName: 'Ahmad Khan', email: 'ahmad@example.com', phone: '+92-300-1111111', amount: 50000, currency: 'PKR', campaign: 'Scholarship Fund', paymentMethod: 'BANK_TRANSFER', status: 'COMPLETED', isAnonymous: false },
    { donorName: 'Sara Mehsud', email: 'sara@example.com', phone: '+92-300-2222222', amount: 25000, currency: 'PKR', campaign: 'Clean Water Initiative', paymentMethod: 'JAZZCASH', status: 'PENDING', isAnonymous: false },
    { donorName: 'Anonymous', email: 'anonymous@example.com', amount: 100000, currency: 'PKR', campaign: 'Disaster Relief', paymentMethod: 'BANK_TRANSFER', status: 'COMPLETED', isAnonymous: true },
  ]

  for (const d of donations) {
    await prisma.donation.create({ data: d }).catch(() => {})
  }
  console.log('✅ Donations seeded:', donations.length)

  // ─── VOLUNTEERS ───
  const volunteers = [
    { name: 'Bilal Wazir', email: 'bilal@example.com', phone: '+92-300-3333333', skills: ['Teaching', 'IT'], availability: 'Weekends', area: 'EDUCATION', experience: '2 years teaching experience', motivation: 'Want to give back to my community', status: 'APPROVED' },
    { name: 'Fatima Ali', email: 'fatima@example.com', phone: '+92-300-4444444', skills: ['Healthcare', 'Administration'], availability: 'Full-time', area: 'HEALTH', experience: 'Nurse at local clinic', motivation: 'Help provide healthcare to remote areas', status: 'PENDING' },
  ]

  for (const v of volunteers) {
    await prisma.volunteer.create({ data: v }).catch(() => {})
  }
  console.log('✅ Volunteers seeded:', volunteers.length)

  // ─── MESSAGES ───
  const messages = [
    { name: 'Ahmad Khan', email: 'ahmad@example.com', phone: '+92-300-1111111', subject: 'Volunteer Application', message: 'I would like to volunteer for the education program. I am a teacher with 5 years experience.', status: 'NEW', isRead: false, isReplied: false },
    { name: 'Sara Mehsud', email: 'sara@example.com', phone: '+92-300-2222222', subject: 'Donation Inquiry', message: 'I want to make a monthly donation to the scholarship fund. Please guide me.', status: 'NEW', isRead: false, isReplied: false },
    { name: 'Bilal Wazir', email: 'bilal@example.com', phone: '+92-300-3333333', subject: 'Partnership Proposal', message: 'Our organization would like to partner with WYWA on a joint community project.', status: 'READ', isRead: true, isReplied: false },
  ]

  for (const m of messages) {
    await prisma.message.create({ data: m }).catch(() => {})
  }
  console.log('✅ Messages seeded:', messages.length)

  // ─── SITE SETTINGS ───
  const settings = [
    { key: 'siteName', value: 'WYWA', group: 'general' },
    { key: 'contactEmail', value: 'info@wywa.org.pk', group: 'general' },
    { key: 'phone', value: '+92-300-1234567', group: 'general' },
    { key: 'address', value: 'Wana, South Waziristan, KP, Pakistan', group: 'general' },
    { key: 'facebook', value: 'https://facebook.com/wywa', group: 'social' },
    { key: 'twitter', value: 'https://twitter.com/wywa', group: 'social' },
    { key: 'instagram', value: 'https://instagram.com/wywa', group: 'social' },
  ]

  for (const s of settings) {
    await prisma.siteSetting.upsert({ where: { key: s.key }, update: {}, create: s })
  }
  console.log('✅ Site settings seeded:', settings.length)

  console.log('🎉 Database seeding complete!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => await prisma.$disconnect())
