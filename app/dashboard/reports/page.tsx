"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { ExpenseBreakdown } from "@/components/expense-breakdown"
import { BudgetProgress } from "@/components/budget-progress"
import { IncomeVsExpenses } from "@/components/income-vs-expenses"
import { SavingsGoal } from "@/components/savings-goal"
import { ExpenseTrend } from "@/components/expense-trend"

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
      <h1 className="text-3xl font-bold">Financial Reports</h1>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Savings Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
            <ResponsiveContainer width="100%" height={300}>
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
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <Card>
    <CardHeader>
      <CardTitle>Expense Breakdown</CardTitle>
    </CardHeader>
    <CardContent>
      <ExpenseBreakdown />
    </CardContent>
  </Card>
  <Card>
    <CardHeader>
      <CardTitle>Budget Progress</CardTitle>
    </CardHeader>
    <CardContent>
      <BudgetProgress />
    </CardContent>
  </Card>
  <Card>
    <CardHeader>
      <CardTitle>Income vs Expenses</CardTitle>
    </CardHeader>
    <CardContent>
      <IncomeVsExpenses />
    </CardContent>
  </Card>
  <Card>
    <CardHeader>
      <CardTitle>Savings Goal Progress</CardTitle>
    </CardHeader>
    <CardContent>
      <SavingsGoal />
    </CardContent>
  </Card>
  <Card>
    <CardHeader>
      <CardTitle>Expense Trend</CardTitle>
    </CardHeader>
    <CardContent>
      <ExpenseTrend />
    </CardContent>
  </Card>
</div>
      <Card>
        <CardHeader>
          <CardTitle>Expense Growth Rate Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The radar chart above highlights categories with rapidly increasing spending. Based on the data:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            <li>Entertainment shows the highest growth rate at 12%, indicating a significant increase in spending.</li>
            <li>Food expenses are also growing rapidly at 8%, which might require attention.</li>
            <li>Healthcare costs are increasing at 7%, potentially due to rising medical expenses.</li>
            <li>Housing and Education show moderate growth rates of 5% and 4% respectively.</li>
            <li>Utilities and Transportation have the lowest growth rates, suggesting stable or well-managed expenses in these categories.</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Users should focus on managing expenses in high-growth categories, particularly Entertainment and Food, to maintain a balanced budget.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

