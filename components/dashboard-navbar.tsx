import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react'

interface DashboardNavbarProps {
  onMenuClick?: () => void
}

export function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 md:px-6 max-w-screen-3xl mx-auto">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden mr-2">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-bold whitespace-nowrap bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              SpendTrail
            </span>
          </Link>
        </div>
        <ModeToggle />
      </div>
    </header>
  )
}

