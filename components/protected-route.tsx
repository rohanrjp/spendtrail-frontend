"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/utils/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/sign-in')
    }
  }, [router])

  if (!isAuthenticated()) {
    return null
  }

  return <>{children}</>
}

