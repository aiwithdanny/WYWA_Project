const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ─── GENERIC FETCH ───
async function fetchAPI(endpoint: string, options?: RequestInit) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Something went wrong')
    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// ─── AUTH TOKEN ───
function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('wywa_token')
  }
  return null
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── PROGRAMS ───
export const programsAPI = {
  getAll: (params?: { category?: string; featured?: boolean }) => {
    const query = new URLSearchParams(params as any).toString()
    return fetchAPI(`/api/programs${query ? `?${query}` : ''}`)
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
  register: (data: any) => fetchAPI('/api/events/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}

// ─── NEWS ───
export const newsAPI = {
  getAll: () => fetchAPI('/api/news'),
  getBySlug: (slug: string) => fetchAPI(`/api/news/${slug}`),
}

// ─── TEAM ───
export const teamAPI = {
  getAll: () => fetchAPI('/api/team'),
}

// ─── GALLERY ───
export const galleryAPI = {
  getAll: () => fetchAPI('/api/gallery'),
}

// ─── DONATIONS ───
export const donationsAPI = {
  initiate: (data: any) => fetchAPI('/api/donations/initiate', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  verify: (data: any) => fetchAPI('/api/donations/verify', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}

// ─── VOLUNTEERS ───
export const volunteersAPI = {
  apply: (data: any) => fetchAPI('/api/volunteers/apply', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}

// ─── MESSAGES ───
export const messagesAPI = {
  send: (data: any) => fetchAPI('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}

// ─── NEWSLETTER ───
export const newsletterAPI = {
  subscribe: (data: any) => fetchAPI('/api/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify(data),
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

export default fetchAPI

