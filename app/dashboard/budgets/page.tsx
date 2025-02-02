"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { CreateBudgetDialog } from "@/components/create-budget-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Budget {
  id: number
  category: string
  total_budget_amount: number
  spent: number
  emoji: string
  remaining: number
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchBudgets = async () => {
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("jwt_token")

      if (!token) {
        setError("Authorization token not found.")
        return
      }

      const response = await fetch("https://spendtrail-backend.onrender.com/api/budget_details", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch budgets")
      }

      const data = await response.json()
      setBudgets(data)
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching budgets")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBudgets()
  }, [])

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget)
    setIsEditDialogOpen(true)
  }

  const handleUpdateBudget = async (updatedBudget: Budget) => {
    try {
      const token = localStorage.getItem("jwt_token")

      const response = await fetch(
        `https://spendtrail-backend.onrender.com/api/update_budget/${updatedBudget.category}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount_to_add: updatedBudget.total_budget_amount, 
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to update the budget")
      }

      await fetchBudgets()
      setIsEditDialogOpen(false)
    } catch (err: any) {
      setError(err.message || "An error occurred while updating the budget")
    }
  }

  const handleBudgetCreated = () => {
    fetchBudgets() 
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Budgets</h1>
      {loading && <p>Loading budgets...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer" onClick={() => setIsCreateDialogOpen(true)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Create Budget</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Add New</div>
          </CardContent>
        </Card>
        {loading
          ? Array(2)
              .fill(null)
              .map((_, index) => (
                <Card key={index} className="cursor-pointer">
                  <CardHeader>
                    <div className="h-6 w-2/3 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-1/3 bg-gray-300 dark:bg-gray-700 animate-pulse mb-2"></div>
                    <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 animate-pulse mb-2"></div>
                    <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 animate-pulse mb-2"></div>
                  </CardContent>
                </Card>
              ))
          : budgets.map((budget) => (
              <Card key={budget.id} className="cursor-pointer" onClick={() => handleEditBudget(budget)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>{budget.emoji}</span>
                    {budget.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">₹ {budget.total_budget_amount}</p>
                  <p>Spent: ₹ {budget.spent}</p>
                  <p>Remaining: ₹ {budget.remaining}</p>
                </CardContent>
              </Card>
            ))}
      </div>
      <CreateBudgetDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onBudgetCreated={handleBudgetCreated} 
      />
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Budget</DialogTitle>
          </DialogHeader>
          {editingBudget && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleUpdateBudget(editingBudget)
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Updated Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    onChange={(e) =>
                      setEditingBudget({
                        ...editingBudget,
                        total_budget_amount: Number(e.target.value),
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-green-600">Update Budget</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}