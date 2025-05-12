"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchBar({ className = "", id = "" }) {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!query.trim()) return

    setIsSearching(true)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
      const data = await response.json()

      if (response.ok) {
        switch (data.type) {
          case "transaction":
            router.push(`/tx/${data.id}`)
            break
          case "address":
            router.push(`/address/${data.id}`)
            break
          case "block":
            router.push(`/block/${data.id}`)
            break
          case "notfound":
            // Could show a toast notification here
            console.log("No results found")
            break
        }
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <Input
        id={id}
        type="text"
        placeholder="Search by Address, TX, or Block"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-12"
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="absolute right-0 top-0 h-full px-3"
        disabled={isSearching}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  )
}
