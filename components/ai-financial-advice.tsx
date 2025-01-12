"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain } from 'lucide-react'

export function AIFinancialAdvice() {
  const [advice, setAdvice] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/financial-advice')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch financial advice')
        }
        return response.json()
      })
      .then(data => {
        setAdvice(data)
        setIsLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setIsLoading(false)
      })
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">AI Financial Advice</CardTitle>
        <Brain className="h-4 w-4 text-purple-500" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[100px] w-full" />
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{advice}</p>
        )}
      </CardContent>
    </Card>
  )
}

