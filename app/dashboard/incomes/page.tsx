"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateIncomeDialog } from "@/components/create-income-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type Income = {
  id: number;
  income_category: string;
  income_emoji: string;
  income_amount: number;
};

export default function IncomesPage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("jwt_token");

    try {
      const response = await fetch(
        "https://spendtrail-backend.onrender.com/api/incomes",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("User not authenticated");
        }
        throw new Error("Failed to fetch incomes. Please log in again.");
      }

      const data: Income[] = await response.json();
      setIncomes(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching incomes"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditIncome = (income: Income) => {
    setEditingIncome(income);
    setIsEditDialogOpen(true);
  };

  const handleUpdateIncome = async (updatedIncome: Income) => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("User is not authenticated. Please log in.");
      }

      const response = await fetch(
        `https://spendtrail-backend.onrender.com/api/update_income/${updatedIncome.income_category}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount_to_add: updatedIncome.income_amount,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update income.");
      }

      toast.success("Income has been updated successfully!");
      setIsEditDialogOpen(false);
      fetchIncomes();
    } catch (err) {
      let errorMessage = "An unexpected error occurred while updating income.";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Incomes</h1>
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
                  <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700 animate-pulse mb-2" />
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
        <h1 className="text-3xl font-bold">Incomes</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Incomes</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          className="cursor-pointer"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Create Income</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Add New</div>
          </CardContent>
        </Card>
        {incomes.map((income) => (
          <Card
            key={income.id}
            className="cursor-pointer"
            onClick={() => handleEditIncome(income)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{income.income_emoji}</span>
                {income.income_category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹ {income.income_amount}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <CreateIncomeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onIncomeCreated={fetchIncomes}
      />
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add more Income</DialogTitle>
          </DialogHeader>
          {editingIncome && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateIncome(editingIncome);
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
                    step="0.01"
                    min="0" 
                    onChange={(e) => {
                      const value = e.target.value;
                      setEditingIncome({
                        ...editingIncome,
                        income_amount: value ? parseFloat(value) : 0,
                      });
                    }}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-green-600">
                  Update Income
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
