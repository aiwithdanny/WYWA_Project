'use client';

import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

const SITE_NAME = 'Waziristan Youth Welfare Association';
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dji2qef4l/image/upload/v1777286646/WYWA-LOGO.jpg';
const BASE_URL = 'https://www.wywa.org.pk';

export default function SEO({
  title = SITE_NAME,
  description = 'WYWA - Empowering the youth of Waziristan through education, community development, and sustainable programs. Join us in building a brighter future.',
  keywords = 'WYWA, Waziristan, youth organization, NGO, community development, education, Pakistan',
  image = DEFAULT_IMAGE,
  url = BASE_URL,
  type = 'website',
}: SEOProps) {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
      
      {/* Schema.org Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: SITE_NAME,
          url: BASE_URL,
          logo: DEFAULT_IMAGE,
          description: description,
          sameAs: [
            'https://www.facebook.com/WYWA',
            'https://twitter.com/WYWA',
            'https://www.instagram.com/WYWA',
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+92-XXX-XXXXXXX',
            contactType: 'Customer Service',
          },
        })}
      </script>
    </Head>
  );
}
