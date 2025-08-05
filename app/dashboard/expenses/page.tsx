"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateExpenseDialog } from "@/components/create-expense-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Expense = {
  id: number;
  expense_category: string;
  owner: number;
  expense_emoji: string;
  expense_amount: number;
  subscription_id?: number | null;
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExpenseGroup, setEditingExpenseGroup] = useState<{
    category: string;
    emoji: string;
    total: number;
    subscriptionTotal: number;
  } | null>(null);

  const [amountToAdd, setAmountToAdd] = useState<number>(0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("jwt_token");

    try {
      const response = await fetch("https://spendtrail-backend.onrender.com/api/expenses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("User not authenticated");
        throw new Error("Failed to fetch expenses, Please Login again");
      }

      const data: Expense[] = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching expenses"
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditExpense = (category: string, emoji: string, subscriptionTotal: number) => {
    setEditingExpenseGroup({
      category,
      emoji,
      total: 0,
      subscriptionTotal,
    });
    setIsEditDialogOpen(true);
  };

  const groupedExpenses: {
    [category: string]: {
      emoji: string;
      total: number;
      subscriptionTotal: number;
    };
  } = {};

  expenses.forEach((expense) => {
    const key = expense.expense_category;
    const isSubscription = expense.subscription_id !== null && expense.subscription_id !== undefined;

    if (!groupedExpenses[key]) {
      groupedExpenses[key] = {
        emoji: expense.expense_emoji,
        total: 0,
        subscriptionTotal: 0,
      };
    }

    groupedExpenses[key].total += expense.expense_amount;
    if (isSubscription) {
      groupedExpenses[key].subscriptionTotal += expense.expense_amount;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpenseGroup) return;

    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("User is not authenticated");

      const response = await fetch(        
        `https://spendtrail-backend.onrender.com/api/update_expense/${editingExpenseGroup.category}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount_to_add: amountToAdd }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update expense");
      }

      toast.success("Expense has been updated");
      setIsEditDialogOpen(false);
      fetchExpenses();
    } catch (err) {
      let errorMessage = "An unknown error occurred.";
      if (err instanceof Error) errorMessage = err.message;
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <Card key={index} className="p-4">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="h-6 w-2/3 bg-gray-300 dark:bg-gray-700 animate-pulse" />
                  <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-1/2 bg-gray-300 dark:bg-gray-700 animate-pulse mb-2" />
                </CardContent>
              </Card>
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
        {/* Create expense tile */}
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

        {/* Expense tiles */}
        {Object.entries(groupedExpenses).map(([category, info]) => (
          <Card
            key={category}
            className="cursor-pointer"
            onClick={() => handleEditExpense(category, info.emoji, info.subscriptionTotal)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{info.emoji}</span>
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-2xl font-bold">₹ {info.total}</p>
              {info.subscriptionTotal > 0 && (
                <p className="text-sm text-muted-foreground">
                  Subscription Expense So Far: ₹ {info.subscriptionTotal}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Dialog */}
      <CreateExpenseDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onExpenseCreated={fetchExpenses}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add More Expense</DialogTitle>
          </DialogHeader>
          {editingExpenseGroup && (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {/* Editable input */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Add Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amountToAdd}
                    onChange={(e) => setAmountToAdd(parseFloat(e.target.value))}
                    className="col-span-3"
                    required
                  />
                </div>

                {/* Read-only subscription display */}
                {editingExpenseGroup.subscriptionTotal > 0 && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Subscription Spent</Label>
                    <Input
                      type="number"
                      readOnly
                      className="col-span-3"
                      value={editingExpenseGroup.subscriptionTotal}
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-green-600">
                  Update Expense
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
