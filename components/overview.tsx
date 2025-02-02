"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface OverviewProps {
  data: { name: string; expenses: number; budget: number }[]
}

export function Overview({ data }: OverviewProps) {
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