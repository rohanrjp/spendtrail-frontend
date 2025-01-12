"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import { CreateIncomeDialog } from "@/components/create-income-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Dummy data for incomes
const initialIncomes = [
  { id: 1, category: "Salary", amount: 3000, emoji: "💼" },
  { id: 2, category: "Freelance", amount: 500, emoji: "💻" },
  { id: 3, category: "Investments", amount: 200, emoji: "📈" },
  { id: 4, category: "Rental Income", amount: 800, emoji: "🏠" },
  { id: 5, category: "Side Hustle", amount: 300, emoji: "🚗" },
]

export default function IncomesPage() {
  const [incomes, setIncomes] = useState(initialIncomes)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingIncome, setEditingIncome] = useState<typeof incomes[0] | null>(null)

  const handleEditIncome = (income: typeof incomes[0]) => {
    setEditingIncome(income)
    setIsEditDialogOpen(true)
  }

  const handleUpdateIncome = (updatedIncome: typeof incomes[0]) => {
    setIncomes(incomes.map(inc => inc.id === updatedIncome.id ? updatedIncome : inc))
    setIsEditDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Incomes</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer" onClick={() => setIsCreateDialogOpen(true)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Create Income</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Add New</div>
          </CardContent>
        </Card>
        {incomes.map((income) => (
          <Card key={income.id} className="cursor-pointer" onClick={() => handleEditIncome(income)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{income.emoji}</span>
                {income.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${income.amount}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <CreateIncomeDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Income</DialogTitle>
          </DialogHeader>
          {editingIncome && (
            <form onSubmit={(e) => {
              e.preventDefault()
              handleUpdateIncome(editingIncome)
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={editingIncome.amount}
                    onChange={(e) => setEditingIncome({...editingIncome, amount: Number(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Income</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

