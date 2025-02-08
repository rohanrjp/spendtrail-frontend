"use client"

import { useEffect, useState } from 'react'
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
        currency: "INR",
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

export function RecentExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    const fetchExpenses = async () => {
      const jwtToken = localStorage.getItem('jwt_token')  

      if (!jwtToken) {
        console.error("JWT token is missing in localStorage.")
        return
      }

      try {
        
        const response = await fetch("https://spendtrail-backend.onrender.com/api/dashboard/recent_expenses", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        })

        
        if (!response.ok) {
          throw new Error(`Error fetching expenses: ${response.statusText}`)
        }

        const data = await response.json()

        
        const mappedExpenses = data.map((expense: { category: string, amount: number, date: string }, index: number) => ({
          id: index + 1,  
          name: expense.category,
          amount: expense.amount,
          date: expense.date,  
        }))

        setExpenses(mappedExpenses)
      } catch (error) {
        console.error("Error fetching recent expenses:", error)
      }
    }

    fetchExpenses()
  }, [])  

  return (
    <div className="h-[300px] overflow-auto">
      <DataTable columns={columns} data={expenses} />
    </div>
  )
}