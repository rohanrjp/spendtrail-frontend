"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { ExpenseBreakdown } from "@/components/expense-breakdown"
import { BudgetProgress } from "@/components/budget-progress"
import { IncomeVsExpenses } from "@/components/income-vs-expenses"
import { SavingsGoal } from "@/components/savings-goal"
import { ExpenseTrend } from "@/components/expense-trend"
import { Overview } from "@/components/overview"

const monthlyData = [
  { name: 'Jan', income: 40000, expenses: 24000 },
  { name: 'Feb', income: 30000, expenses: 13980 },
  { name: 'Mar', income: 20000, expenses: 98000 },
  { name: 'Apr', income: 27800, expenses: 39080 },
  { name: 'May', income: 18900, expenses: 48000 },
  { name: 'Jun', income: 23900, expenses: 38000 },
]

const categoryData = [
  { name: 'Housing', value: 40000 },
  { name: 'Food', value: 30000 },
  { name: 'Transportation', value: 30000 },
  { name: 'Utilities', value: 20000 },
  { name: 'Entertainment', value: 10000 },
]

const savingsData = [
  { name: 'Jan', amount: 5000 },
  { name: 'Feb', amount: 7000 },
  { name: 'Mar', amount: 3000 },
  { name: 'Apr', amount: 8000 },
  { name: 'May', amount: 6000 },
  { name: 'Jun', amount: 9000 },
]

const expenseGrowthData = [
  { category: 'Housing', growthRate: 5 },
  { category: 'Food', growthRate: 8 },
  { category: 'Transportation', growthRate: 2 },
  { category: 'Utilities', growthRate: 3 },
  { category: 'Entertainment', growthRate: 12 },
  { category: 'Healthcare', growthRate: 7 },
  { category: 'Education', growthRate: 4 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658']

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Financial Analytics</h1>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#8884d8" name="Income" />
                <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Savings Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={savingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Savings" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expense Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={expenseGrowthData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                <Radar name="Growth Rate" dataKey="growthRate" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expenses vs Budget Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <Overview/>
            </ResponsiveContainer>
          </CardContent>
        </Card>        
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
</div>
      <Card>
        <CardHeader>
          <CardTitle>Expense Growth Rate Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

