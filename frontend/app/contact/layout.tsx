import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — WYWA',
  description:
    'Get in touch with the Waziristan Youth Welfare Association — partner with us or ask a question.',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
