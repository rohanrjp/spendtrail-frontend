"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Saved", value: 7500 },
  { name: "Remaining", value: 2500 },
]

const COLORS = ["#0088FE", "#FFBB28"]

export function SavingsGoal() {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const saved = data[0].value
  const percentage = ((saved / total) * 100).toFixed(1)

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-2xl font-bold mt-4">{percentage}%</div>
      <div className="text-sm text-gray-500">of $10,000 goal</div>
    </div>
  )
}

