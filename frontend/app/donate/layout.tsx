import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Donate — Support WYWA',
  description:
    'Support WYWA mission: your donation funds education, disaster relief, and youth empowerment across Waziristan.',
}

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
