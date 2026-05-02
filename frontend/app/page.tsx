import { Metadata } from 'next';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import Stats from '../components/sections/Stats';
import Mission from '../components/sections/Mission';
import Programs from '../components/sections/Programs';
import Impact from '../components/sections/Impact';
import Testimonials from '../components/sections/Testimonials';
import CallToAction from '../components/sections/CallToAction';
import Footer from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Waziristan Youth Welfare Association | Empowering Youth',
  description: 'WYWA - Empowering the youth of Waziristan through education, community development, and sustainable programs. Join us in building a brighter future for our community.',
  keywords: ['WYWA', 'Waziristan', 'youth organization', 'NGO', 'community development', 'education', 'Pakistan'],
  openGraph: {
    title: 'Waziristan Youth Welfare Association | Empowering Youth',
    description: 'WYWA - Empowering the youth of Waziristan through education, community development, and sustainable programs.',
    url: 'https://www.wywa.org.pk',
    siteName: 'WYWA',
    images: [
      {
        url: 'https://res.cloudinary.com/dji2qef4l/image/upload/v1777286646/WYWA-LOGO.jpg',
        width: 1200,
        height: 630,
        alt: 'WYWA Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Waziristan Youth Welfare Association',
    description: 'Empowering the youth of Waziristan through education and community development.',
    images: ['https://res.cloudinary.com/dji2qef4l/image/upload/v1777286646/WYWA-LOGO.jpg'],
  },
  alternates: {
    canonical: 'https://www.wywa.org.pk',
  },
};

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <Mission />
      <Programs />
      <Impact />
      <Testimonials />
      <CallToAction />
      <Footer />
    </main>
  );
}
