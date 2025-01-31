"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { removeToken, getToken } from "@/utils/auth"
import { Loader2 } from 'lucide-react'
import useSWR from 'swr'

interface UserData {
  id: number
  name: string
  email: string
  avatar: string
  join_date: string
  income_goal: number
  savings_goal: number
}

const fetcher = async (url: string) => {
  const token = getToken()
  if (!token) throw new Error('No token found')
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch user data, Please login again')
  return res.json()
}

export default function ProfilePage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { data: userData, error, mutate } = useSWR<UserData>('https://spendtrail-backend.onrender.com/auth/profile', fetcher)

  const [incomeGoal, setIncomeGoal] = useState("")
  const [savingsGoal, setSavingsGoal] = useState("")
  const [loadingIncome, setLoadingIncome] = useState(false)
  const [loadingSavings, setLoadingSavings] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    removeToken()
    router.push("/")
  }

  const handleUpdateGoal = async (goalType: "income" | "savings") => {
    const token = getToken()
    if (!token) return alert("No token found")

    const url = goalType === "income"
      ? "https://spendtrail-backend.onrender.com/api/dashboard/update_income_goal"
      : "https://spendtrail-backend.onrender.com/api/dashboard/update_savings_goal"

    const goalValue = goalType === "income" ? incomeGoal : savingsGoal
    if (!goalValue) return alert("Please enter a valid amount")

    goalType === "income" ? setLoadingIncome(true) : setLoadingSavings(true)

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount_to_update: parseFloat(goalValue) }),
      })
    
      const responseData = await res.json()
      console.log("API Response:", responseData)
    
      if (!res.ok) throw new Error(responseData.detail || "Failed to update goal")
    
      mutate() // Refresh data
      goalType === "income" ? setIncomeGoal("") : setSavingsGoal("")
      alert(`${goalType === "income" ? "Income" : "Savings"} goal updated successfully`)
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message) // TypeScript now recognizes error.message
      } else {
        alert("An unknown error occurred")
      }
    } finally {
      goalType === "income" ? setLoadingIncome(false) : setLoadingSavings(false)
    }

  if (error) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            {userData ? (
              <Avatar className="h-20 w-20">
                <AvatarFallback>{userData.avatar}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-200" />
            )}
            <div>
              {userData ? (
                <>
                  <CardTitle className="text-2xl">{userData.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                </>
              ) : (
                <>
                  <div className="h-8 w-40 mb-2 bg-gray-200" />
                  <div className="h-4 w-32 bg-gray-200" />
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">User ID</p>
              {userData ? <p>{userData.id}</p> : <div className="h-4 w-20 bg-gray-200" />}
            </div>
            <div>
              <p className="font-semibold">Join Date</p>
              {userData ? (
                <p>{new Date(userData.join_date).toLocaleDateString()}</p>
              ) : (
                <div className="h-4 w-24 bg-gray-200" />
              )}
            </div>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleLogout} 
            disabled={isLoggingOut}
            className="w-full bg-red-600"
          >
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </Button>
        </CardContent>
      </Card>

      {/* Update Income Goal */}
      <Card>
        <CardHeader>
          <CardTitle>Update Income Goal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            type="number" 
            placeholder="Enter new income goal" 
            value={incomeGoal}
            onChange={(e) => setIncomeGoal(e.target.value)}
          />
          <Button 
            onClick={() => handleUpdateGoal("income")} 
            disabled={loadingIncome}
            className="w-full bg-blue-600"
          >
            {loadingIncome ? <Loader2 className="animate-spin" size={18} /> : "Update Income Goal"}
          </Button>
        </CardContent>
      </Card>

      {/* Update Savings Goal */}
      <Card>
        <CardHeader>
          <CardTitle>Update Savings Goal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            type="number" 
            placeholder="Enter new savings goal" 
            value={savingsGoal}
            onChange={(e) => setSavingsGoal(e.target.value)}
          />
          <Button 
            onClick={() => handleUpdateGoal("savings")} 
            disabled={loadingSavings}
            className="w-full bg-green-600"
          >
            {loadingSavings ? <Loader2 className="animate-spin" size={18} /> : "Update Savings Goal"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
}