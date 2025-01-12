import { Navbar } from "@/components/navbar"

export default function BudgetsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6">Budgets</h1>
        <p>This is where you'll manage your budgets.</p>
      </main>
    </div>
  )
}

