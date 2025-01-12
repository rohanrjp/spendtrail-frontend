"use client"

import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from 'lucide-react'
import { Button } from "@/components/ui/button"

type Expense = {
  id: number
  name: string
  amount: number
  date: string
}

const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
]

const expenses: Expense[] = [
  { id: 1, name: "Groceries", amount: 120.50, date: "2023-04-01" },
  { id: 2, name: "Electricity Bill", amount: 85.00, date: "2023-04-05" },
  { id: 3, name: "Internet", amount: 60.00, date: "2023-04-10" },
  { id: 4, name: "Gas", amount: 45.75, date: "2023-04-15" },
  { id: 5, name: "Restaurant", amount: 78.25, date: "2023-04-20" },
]

export function RecentExpenses() {
  return (
    <div className="h-[300px] overflow-auto">
      <DataTable columns={columns} data={expenses} />
    </div>
  )
}

