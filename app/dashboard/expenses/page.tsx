"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { CreateExpenseDialog } from "@/components/create-expense-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

type Expense = {
  id: number;
  expense_category: string;
  owner: number;
  expense_emoji: string;
  expense_amount: number;
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    fetchExpenses();
  }, []);
  
  const fetchExpenses = async () => {
    setIsLoading(true);
    setError(null);
  
    const token = localStorage.getItem('jwt_token');
  
    try {
      const response = await fetch('https://spendtrail-backend.onrender.com/api/expenses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('User not authenticated');
        }
        throw new Error('Failed to fetch expenses, Please Login again');
      }
  
      const data: Expense[] = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching expenses');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-[150px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

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
                <span>{expense.expense_emoji}</span>
                {expense.expense_category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹ {expense.expense_amount}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <CreateExpenseDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onExpenseCreated={fetchExpenses}
      />
<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add More Expense</DialogTitle>
    </DialogHeader>
    {editingExpense && (
      <form
  onSubmit={async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch(
        `https://spendtrail-backend.onrender.com/api/update_expense/${editingExpense.expense_category}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount_to_add: editingExpense.expense_amount,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update expense");
      }

      setIsEditDialogOpen(false);
      fetchExpenses(); // Refresh expenses after update
    } catch (err) {
      let errorMessage = "An unknown error occurred.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err; // Handle string errors
      }

      console.error("Error updating expense:", errorMessage);
      alert("Error updating expense: " + errorMessage);
    }
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
        onChange={(e) => {
          const updatedExpense = { ...editingExpense, expense_amount: Number(e.target.value) };
          setEditingExpense(updatedExpense);
        }}
        className="col-span-3"
        required
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

