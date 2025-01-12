"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Housing", budget: 1000, spent: 900 },
  { name: "Food", budget: 500, spent: 450 },
  { name: "Transport", budget: 300, spent: 280 },
  { name: "Utilities", budget: 200, spent: 180 },
  { name: "Entertainment", budget: 150, spent: 200 },
]

export function BudgetProgress() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="budget" fill="#8884d8" name="Budget" />
        <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
      </BarChart>
    </ResponsiveContainer>
  )
}

