const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return 'https://wywa-backend.onrender.com'
  }
  return 'http://localhost:8000'
}

const API_URL = getApiUrl()

export { API_URL }

// ─── WAKE UP BACKEND (Render free tier) ───
async function wakeUpBackend(): Promise<void> {
  try {
    await fetch(`${API_URL}/api/health`, { 
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    })
  } catch {
    // Ignore errors - just trying to wake up
  }
}

// ─── GENERIC FETCH ───
async function fetchAPI(endpoint: string, options?: RequestInit): Promise<any> {
  try {
    // Wake up backend for write operations
    if (options?.method && ['POST', 'PUT', 'DELETE'].includes(options.method)) {
      await wakeUpBackend()
    }
    
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || data.error || `HTTP ${res.status}: ${JSON.stringify(data)}`)
    }
    return data
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please try again in 30 seconds.')
    }
    throw error
  }
}

export default fetchAPI

// ─── AUTH TOKEN ───
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('wywa_token')
  }
  return null
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── PROGRAMS ───
export const programsAPI = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return fetchAPI(`/api/programs${query}`)
  },
  getBySlug: (slug: string) => fetchAPI(`/api/programs/${slug}`),
  create: (data: any) => fetchAPI('/api/programs', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI(`/api/programs/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI(`/api/programs/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }),
}

// ─── EVENTS ───
export const eventsAPI = {
  getAll: () => fetchAPI('/api/events'),
  getBySlug: (slug: string) => fetchAPI(`/api/events/${slug}`),
  create: (data: any) => fetchAPI('/api/events', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI(`/api/events/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI(`/api/events/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }),
  register: (data: any) => fetchAPI('/api/events/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}

// ─── NEWS ───
export const newsAPI = {
  getAll: () => fetchAPI('/api/news'),
  getBySlug: (slug: string) => fetchAPI(`/api/news/${slug}`),
  create: (data: any) => fetchAPI('/api/news', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI(`/api/news/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI(`/api/news/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }),
}

// ─── TEAM ───
export const teamAPI = {
  getAll: () => fetchAPI('/api/team'),
  create: (data: any) => fetchAPI('/api/team', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI(`/api/team/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI(`/api/team/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }),
}

// ─── GALLERY ───
export const galleryAPI = {
  getAll: () => fetchAPI('/api/gallery'),
  create: (data: any) => fetchAPI('/api/gallery', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI(`/api/gallery/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI(`/api/gallery/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }),
}

// ─── VOLUNTEERS ───
export const volunteersAPI = {
  getAll: () => fetchAPI('/api/volunteers', { headers: authHeaders() }),
  apply: (data: any) => fetchAPI('/api/volunteers/apply', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI(`/api/volunteers/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI(`/api/volunteers/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }),
}

// ─── MESSAGES ───
export const messagesAPI = {
  getAll: () => fetchAPI('/api/contact', { headers: authHeaders() }),
  send: (data: any) => fetchAPI('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI(`/api/contact/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI(`/api/contact/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }),
}

// ─── DONATIONS ───
export const donationsAPI = {
  getAll: () => fetchAPI('/api/donations', { headers: authHeaders() }),
  update: (id: string, data: any) => fetchAPI(`/api/donations/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI(`/api/donations/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }),
  initiate: (data: any) => fetchAPI('/api/donations/initiate', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  verify: (data: any) => fetchAPI('/api/donations/verify', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}

// ─── NEWSLETTER ───
export const newsletterAPI = {
  getAll: () => fetchAPI('/api/newsletter', { headers: authHeaders() }),
  subscribe: (data: any) => fetchAPI('/api/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI(`/api/newsletter/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }),
}

// ─── SETTINGS ───
export const settingsAPI = {
  get: () => fetchAPI('/api/settings'),
  update: (data: any) => fetchAPI('/api/settings', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }),
}

// ─── STATS ───
export const statsAPI = {
  get: () => fetchAPI('/api/stats'),
}

// ─── REPORTS ───
export const reportsAPI = {
  getAll: () => fetchAPI('/api/reports'),
  create: (data: any) => fetchAPI('/api/reports', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI(`/api/reports/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }),
}

// ─── AUTH ───
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (data.token) {
      localStorage.setItem('wywa_token', data.token)
      localStorage.setItem('wywa_user', JSON.stringify(data.user))
    }
    return data
  },
  logout: () => {
    localStorage.removeItem('wywa_token')
    localStorage.removeItem('wywa_user')
  },
  getUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('wywa_user')
      return user ? JSON.parse(user) : null
    }
    return null
  },
  isLoggedIn: () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('wywa_token')
    }
    return false
  },
}

