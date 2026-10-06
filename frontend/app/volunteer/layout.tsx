import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Volunteer — Join WYWA',
  description:
    'Apply as a WYWA volunteer and help serve education, relief, and youth empowerment across Waziristan.',
}

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
