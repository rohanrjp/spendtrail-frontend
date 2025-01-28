"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type IncomeExpenseData = {
  label: string;
  amount: number;
  fill: string;
};

interface IncomeExpenseAnalysisProps {
  data: IncomeExpenseData[];
}

export default function IncomeExpenseAnalysis({
  data,
}: IncomeExpenseAnalysisProps) {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer>
        <BarChart
          data={data}
          barCategoryGap="25%" // Adjust bar spacing
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            interval={0} // Show all labels
            tick={{ fontSize: 14 }} // Adjust font size
            padding={{ left: 20, right: 20 }} // Add padding to prevent cutoff
          />
          <YAxis />
          <Bar
            dataKey="amount"
            radius={[5, 5, 0, 0]} // Rounded top corners
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
