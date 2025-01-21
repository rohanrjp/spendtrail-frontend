"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  { name: "Jan", expenses: 2400, budget: 2400 },
  { name: "Feb", expenses: 1398, budget: 2210 },
  { name: "Mar", expenses: 9800, budget: 2290 },
  { name: "Apr", expenses: 3908, budget: 2000 },
  { name: "May", expenses: 4800, budget: 2181 },
  { name: "Jun", expenses: 3800, budget: 2500 },
  { name: "Jul", expenses: 4300, budget: 2100 },
  { name: "Aug", expenses: 5000, budget: 2300 },
  { name: "Sep", expenses: 4100, budget: 2400 },
  { name: "Oct", expenses: 3700, budget: 2200 },
  { name: "Nov", expenses: 3500, budget: 2100 },
  { name: "Dec", expenses: 4200, budget: 2300 },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{ background: "var(--background)", border: "1px solid var(--border)" }}
          labelStyle={{ color: "var(--foreground)" }}
          position={{ x: 190, y: 20 }}
        />
        <Legend />
        <Line type="monotone" dataKey="expenses" stroke="#8884d8" strokeWidth={2} dot={false} name="Expenses" />
        <Line type="monotone" dataKey="budget" stroke="#ff3e00" strokeWidth={2} dot={false} name="Budget" />
      </LineChart>
    </ResponsiveContainer>
  )
}

