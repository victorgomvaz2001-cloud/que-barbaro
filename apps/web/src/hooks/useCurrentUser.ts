'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import type { ApiResponse, AuthTokenPayload } from '@falcanna/types'

export function useCurrentUser() {
  const [user, setUser] = useState<AuthTokenPayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient
      .get<ApiResponse<AuthTokenPayload>>('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  return { user, loading, isAdmin: user?.role === 'admin' }
}
