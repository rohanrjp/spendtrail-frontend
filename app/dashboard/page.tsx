'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentExpenses } from "@/components/recent-expenses"
import { ExpenseCategories } from "@/components/expense-categories"
import { CreditCard, Wallet, PiggyBank, TrendingUp } from 'lucide-react'
import { AIFinancialAdvice } from "@/components/ai-financial-advice"

// Dummy data for financial metrics
const financialData = {
  expenses: { current: 1234.56, goal: 2000 },
  budget: { current: 1800, goal: 2000 },
  income: { current: 3500, goal: 4000 },
  savings: { current: 2265.44, goal: 3500 },
}

// Helper function to calculate percentage
const calculatePercentage = (current: number, goal: number) => {
  return Math.min(Math.round((current / goal) * 100), 100)
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 grid-cols-1">
        <AIFinancialAdvice />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.expenses.current.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{calculatePercentage(financialData.expenses.current, financialData.expenses.goal)}% of total budget</p>
            <div className="mt-4 h-3 w-full bg-accent rounded-full overflow-hidden relative">
              <div className="h-full bg-red-500 absolute top-0 left-0 transition-all duration-500 ease-in-out" style={{ width: `${calculatePercentage(financialData.expenses.current, financialData.expenses.goal)}%` }}></div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>${financialData.expenses.goal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Wallet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.budget.current.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">${(financialData.budget.goal - financialData.budget.current).toFixed(2)} remaining</p>
            <div className="mt-4 h-3 w-full bg-accent rounded-full overflow-hidden relative">
              <div className="h-full bg-green-500 absolute top-0 left-0 transition-all duration-500 ease-in-out" style={{ width: `${calculatePercentage(financialData.budget.current, financialData.budget.goal)}%` }}></div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>${financialData.budget.goal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.income.current.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">${(financialData.income.current - financialData.income.goal).toFixed(2)} over goal</p>
            <div className="mt-4 h-3 w-full bg-accent rounded-full overflow-hidden relative">
              <div className="h-full bg-blue-500 absolute top-0 left-0 transition-all duration-500 ease-in-out" style={{ width: `${calculatePercentage(financialData.income.current, financialData.income.goal)}%` }}></div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>${financialData.income.goal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings</CardTitle>
            <PiggyBank className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData.savings.current.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{calculatePercentage(financialData.savings.current, financialData.savings.goal)}% of savings goal</p>
            <div className="mt-4 h-3 w-full bg-accent rounded-full overflow-hidden relative">
              <div className="h-full bg-purple-500 absolute top-0 left-0 transition-all duration-500 ease-in-out" style={{ width: `${calculatePercentage(financialData.savings.current, financialData.savings.goal)}%` }}></div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>${financialData.savings.goal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentExpenses />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expense Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview />
          </CardContent>
        </Card>
        <ExpenseCategories />
      </div>
    </div>
  )
}

