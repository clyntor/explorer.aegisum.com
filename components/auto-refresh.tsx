"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface AutoRefreshProps {
  interval?: number // Refresh interval in seconds
}

export function AutoRefresh({ interval = 60 }: AutoRefreshProps) {
  const router = useRouter()

  useEffect(() => {
    // Set up interval to refresh the page
    const timer = setInterval(() => {
      // This refreshes the current route without full page reload
      router.refresh()
    }, interval * 1000)

    // Clean up on unmount
    return () => clearInterval(timer)
  }, [router, interval])

  // This component doesn't render anything
  return null
}
