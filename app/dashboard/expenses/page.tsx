"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateExpenseDialog } from "@/components/create-expense-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Expense = {
  id: number;
  category: string;
  amount: number;
  emoji: string;
};

const dummyExpenses: Expense[] = [
  { id: 1, category: "Food", amount: 20, emoji: "🍔" },
  { id: 2, category: "Transport", amount: 15, emoji: "🚌" },
  { id: 3, category: "Shopping", amount: 50, emoji: "🛍️" },
  { id: 4, category: "Utilities", amount: 30, emoji: "💡" },
  { id: 5, category: "Health", amount: 25, emoji: "💊" },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(dummyExpenses);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditDialogOpen(true);
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
    setIsEditDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Expenses</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          className="cursor-pointer"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Create Expense</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Add New</div>
          </CardContent>
        </Card>
        {expenses.map((expense) => (
          <Card
            key={expense.id}
            className="cursor-pointer"
            onClick={() => handleEditExpense(expense)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{expense.emoji}</span>
                {expense.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${expense.amount}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <CreateExpenseDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onExpenseCreated={() => {}}
      />
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateExpense(editingExpense);
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={editingExpense.amount}
                    onChange={(e) =>
                      setEditingExpense({
                        ...editingExpense,
                        amount: Number(e.target.value),
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Expense</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

