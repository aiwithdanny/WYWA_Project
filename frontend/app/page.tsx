import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/sections/Hero'
import Stats from '@/components/sections/Stats'
import Mission from '@/components/sections/Mission'
import Programs from '@/components/sections/Programs'
import Impact from '@/components/sections/Impact'
import LatestNews from '@/components/sections/LatestNews'
import TeamSection from '@/components/sections/TeamSection'
import Testimonials from '@/components/sections/Testimonials'
import CallToAction from '@/components/sections/CallToAction'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <Mission />
      <Programs />
      <Impact />
      <LatestNews />
      <TeamSection />
      <Testimonials />
      <CallToAction />
      <Footer />
    </main>
  )
}
