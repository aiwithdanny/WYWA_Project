'use client'
import { useState, useEffect } from 'react'
import { settingsAPI } from './api'

// Defaults match the admin Settings page. Anything the admin saves
// in /dashboard/settings overrides these on the public site.
export const defaultSettings: Record<string, any> = {
  siteName: 'Waziristan Youth Welfare Association',
  shortName: 'WYWA',
  tagline: 'Empowering Youth. Building Futures. Serving Waziristan.',
  heroTagline: 'Serving the heart of Waziristan — one life at a time.',
  heroDescription:
    'The Waziristan Youth Welfare Association is dedicated to education, community development, disaster relief, and youth empowerment — creating lasting change for the people of Waziristan.',
  estLine: 'Est. 2010 · Waziristan, Pakistan',
  email: 'info@wywa.org.pk',
  phone: '+92-300-1234567',
  whatsapp: '+92-300-1234567',
  address: 'Wana, South Waziristan, KP, Pakistan',
  facebook: 'https://facebook.com/wywa',
  twitter: '',
  instagram: '',
  youtube: '',
  bankName: 'Habib Bank Limited',
  accountTitle: 'Waziristan Youth Welfare Association',
  accountNumber: '',
  iban: '',
  jazzcash: '',
  easypaisa: '',
}

let cache: Record<string, any> | null = null
let inflight: Promise<Record<string, any>> | null = null

function loadSettings(): Promise<Record<string, any>> {
  if (cache) return Promise.resolve(cache)
  if (inflight) return inflight
  inflight = settingsAPI
    .get()
    .then((data) => {
      cache = { ...defaultSettings, ...(data.settings || {}) }
      return cache as Record<string, any>
    })
    .catch(() => {
      cache = { ...defaultSettings }
      return cache as Record<string, any>
    })
    .finally(() => {
      inflight = null
    })
  return inflight
}

/** Live site settings from /api/settings (falls back to defaults offline). */
export function useSiteSettings(): Record<string, any> {
  const [settings, setSettings] = useState<Record<string, any>>(cache || defaultSettings)
  useEffect(() => {
    loadSettings().then(setSettings)
  }, [])
  return settings
}
