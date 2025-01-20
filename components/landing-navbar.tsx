import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export function LandingNavbar() {
  return (
    <nav className="w-full border-b border-gray-800 bg-background text-foreground">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 max-w-screen-3xl mx-auto">
        <Link href="/" className="flex items-center">
          <span className="text-3xl font-bold whitespace-nowrap bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">SpendTrail</span>
        </Link>
        <ModeToggle />
      </div>
    </nav>
  )
}

