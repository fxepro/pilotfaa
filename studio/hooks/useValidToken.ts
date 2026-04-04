'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * Returns a JWT access token that is always valid.
 * - Reads from localStorage on mount
 * - Decodes the exp claim and schedules a refresh 2 minutes before expiry
 * - Calls /api/token/refresh/ to get a new access token silently
 * - Returns null if the user is not logged in or the refresh fails
 */
export function useValidToken(): string | null {
  const [token, setToken] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function jwtExpiry(jwt: string): number | null {
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]))
      return typeof payload.exp === 'number' ? payload.exp : null
    } catch {
      return null
    }
  }

  async function refreshToken(): Promise<string | null> {
    const refresh = localStorage.getItem('refresh_token')
    if (!refresh) return null
    try {
      const res = await fetch('/api/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      })
      if (!res.ok) return null
      const data = await res.json()
      const newAccess: string = data.access
      localStorage.setItem('access_token', newAccess)
      return newAccess
    } catch {
      return null
    }
  }

  function scheduleRefresh(jwt: string) {
    if (timerRef.current) clearTimeout(timerRef.current)
    const exp = jwtExpiry(jwt)
    if (!exp) return
    // Refresh 2 minutes before actual expiry
    const msUntilRefresh = exp * 1000 - Date.now() - 2 * 60 * 1000
    if (msUntilRefresh <= 0) {
      // Already expired or about to — refresh immediately
      refreshToken().then(t => { if (t) { setToken(t); scheduleRefresh(t) } })
      return
    }
    timerRef.current = setTimeout(async () => {
      const fresh = await refreshToken()
      if (fresh) {
        setToken(fresh)
        scheduleRefresh(fresh)
      } else {
        setToken(null)
      }
    }, msUntilRefresh)
  }

  useEffect(() => {
    async function init() {
      let access = localStorage.getItem('access_token')
      if (!access) { setToken(null); return }

      const exp = jwtExpiry(access)
      const nowSec = Date.now() / 1000

      // If token is already expired or expires in < 2 min, refresh now
      if (!exp || exp - nowSec < 120) {
        const fresh = await refreshToken()
        if (!fresh) { setToken(null); return }
        access = fresh
      }

      setToken(access)
      scheduleRefresh(access)
    }

    init()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return token
}
