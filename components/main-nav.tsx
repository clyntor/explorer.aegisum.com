"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { BarChart2, Clock, Layers, List, Menu, Pickaxe, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchBar } from "@/components/search-bar"
import { useState } from "react"

export function MainNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      href: "/blocks",
      label: "Blocks",
      icon: <Layers className="h-4 w-4 mr-2" />,
    },
    {
      href: "/transactions",
      label: "Transactions",
      icon: <List className="h-4 w-4 mr-2" />,
    },
    {
      href: "/mempool",
      label: "Mempool",
      icon: <Clock className="h-4 w-4 mr-2" />,
    },
    {
      href: "/mining",
      label: "Mining",
      icon: <Pickaxe className="h-4 w-4 mr-2" />,
    },
    {
      href: "/richlist",
      label: "Rich List",
      icon: <BarChart2 className="h-4 w-4 mr-2" />,
    },
    {
      href: "/network",
      label: "Network",
      icon: <Globe className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-14 items-center px-4">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Aegisum Logo" width={28} height={28} />
            <span className="font-bold text-xl">AEGS</span>
            <span className="text-muted-foreground">Explorer</span>
          </Link>
        </div>
        <div className="hidden md:flex flex-1 items-center justify-between">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center transition-colors hover:text-foreground/80 ${
                  pathname === route.href ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <SearchBar className="w-64 lg:w-80" />
            <ThemeToggle />
          </div>
        </div>
        <div className="flex md:hidden flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <div className="px-7">
                <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
                  <Image src="/logo.png" alt="Aegisum Logo" width={24} height={24} className="mr-2" />
                  <span className="font-bold text-xl">AEGS</span>
                  <span className="text-muted-foreground ml-2">Explorer</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-4 text-lg font-medium mt-6 px-7">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center py-2 transition-colors hover:text-foreground/80 ${
                      pathname === route.href ? "text-foreground" : "text-foreground/60"
                    }`}
                  >
                    {route.icon}
                    {route.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* Mobile search bar that appears below header */}
      <div className="md:hidden border-b">
        <div className="container mx-auto px-4 py-2">
          <SearchBar id="mobile-search" className="w-full" />
        </div>
      </div>
    </header>
  )
}
