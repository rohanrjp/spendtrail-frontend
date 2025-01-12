"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import { CreateBudgetDialog } from "@/components/create-budget-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Dummy data for budgets
const initialBudgets = [
  { id: 1, category: "Housing", amount: 1000, spent: 800, emoji: "🏠" },
  { id: 2, category: "Food", amount: 500, spent: 450, emoji: "🍔" },
  { id: 3, category: "Transportation", amount: 200, spent: 180, emoji: "🚗" },
  { id: 4, category: "Entertainment", amount: 150, spent: 100, emoji: "🎬" },
  { id: 5, category: "Utilities", amount: 300, spent: 280, emoji: "💡" },
]

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState(initialBudgets)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<typeof budgets[0] | null>(null)

  const handleEditBudget = (budget: typeof budgets[0]) => {
    setEditingBudget(budget)
    setIsEditDialogOpen(true)
  }

  const handleUpdateBudget = (updatedBudget: typeof budgets[0]) => {
    setBudgets(budgets.map(bud => bud.id === updatedBudget.id ? updatedBudget : bud))
    setIsEditDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Budgets</h1>
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
        {budgets.map((budget) => (
          <Card key={budget.id} className="cursor-pointer" onClick={() => handleEditBudget(budget)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{budget.emoji}</span>
                {budget.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${budget.amount}</p>
              <p>Spent: ${budget.spent}</p>
              <p>Remaining: ${budget.amount - budget.spent}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <CreateBudgetDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          {editingBudget && (
            <form onSubmit={(e) => {
              e.preventDefault()
              handleUpdateBudget(editingBudget)
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={editingBudget.amount}
                    onChange={(e) => setEditingBudget({...editingBudget, amount: Number(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="spent" className="text-right">
                    Spent
                  </Label>
                  <Input
                    id="spent"
                    type="number"
                    value={editingBudget.spent}
                    onChange={(e) => setEditingBudget({...editingBudget, spent: Number(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Budget</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

