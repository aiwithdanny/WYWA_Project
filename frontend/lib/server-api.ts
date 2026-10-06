// Server-side API helper for Server Components.
// Uses native fetch (no client-only APIs) so pages can pre-render
// on the server — no client-side loading spinners needed.

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://wywa-backend.onrender.com'

export async function serverFetch<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      next: { revalidate: 60 }, // refresh cached data every 60s
      signal: AbortSignal.timeout(15000), // don't hang builds on cold backend
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export { API_URL }
