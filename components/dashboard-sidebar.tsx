"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, CreditCard, PiggyBank, BarChart3, User, Menu, Wallet, RefreshCcw, RefreshCwIcon } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard", color: "text-blue-500" },
  { name: "Expenses", icon: CreditCard, href: "/dashboard/expenses", color: "text-red-500" },
  { name: "Subscriptions", icon: RefreshCcw, href: "/dashboard/subscriptions", color: "text-indigo-500" },
  { name: "Budgets", icon: PiggyBank, href: "/dashboard/budgets", color: "text-green-500" },
  { name: "Incomes", icon: Wallet, href: "/dashboard/incomes", color: "text-yellow-500" },
  { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics", color: "text-purple-500" },
  { name: "Past Reports", icon: Menu, href: "/dashboard/past-reports", color: "text-orange-500" },
  { name: "Profile", icon: User, href: "/dashboard/profile", color: "text-pink-500" },
  
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onClose: () => void
}

export function DashboardSidebar({ open, onClose, className }: SidebarProps) {
  const pathname = usePathname()

  const SidebarContent = (
    <ScrollArea className="flex-1">
      <nav className="flex flex-col gap-6 p-4 mt-3">
        {sidebarItems.map((item) => (
          <Link key={item.href} href={item.href} onClick={onClose}>
            <span
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === item.href ? "bg-accent text-accent-foreground" : "text-foreground"
              )}
            >
              <item.icon className={cn("mr-2 h-4 w-4", item.color)} />
              <span>{item.name}</span>
            </span>
          </Link>
        ))}
      </nav>
    </ScrollArea>
  )

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="w-[240px] sm:w-[300px] bg-background">
          <SheetHeader>
            <VisuallyHidden>
              <SheetTitle>Dashboard Sidebar</SheetTitle>
            </VisuallyHidden>
          </SheetHeader>
          {SidebarContent}
        </SheetContent>
      </Sheet>
      <aside className={cn("hidden md:flex flex-col w-64 border-r bg-background", className)}>
        {SidebarContent}
      </aside>
    </>
  )
}

