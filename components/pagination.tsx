"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  siblingsCount?: number
}

export function Pagination({ currentPage, totalPages, siblingsCount = 1 }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    return params.toString()
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    router.push(`${pathname}?${createQueryString("page", page.toString())}`)
  }

  // Generate page numbers to display
  const generatePagination = () => {
    // Always show first page
    const pagination = [1]

    // Calculate range of pages to show around current page
    const leftSiblingIndex = Math.max(currentPage - siblingsCount, 2)
    const rightSiblingIndex = Math.min(currentPage + siblingsCount, totalPages - 1)

    // Add dots indicators
    const showLeftDots = leftSiblingIndex > 2
    const showRightDots = rightSiblingIndex < totalPages - 1

    // Add pages in range
    if (showLeftDots) pagination.push(-1) // -1 represents dots
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pagination.push(i)
    }
    if (showRightDots) pagination.push(-2) // -2 represents dots

    // Always show last page if there are more than 1 page
    if (totalPages > 1) pagination.push(totalPages)

    return pagination
  }

  // Don't show pagination if there's only 1 page
  if (totalPages <= 1) return null

  const pages = generatePagination()

  return (
    <div className="flex items-center justify-center space-x-1 mt-6">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        aria-label="First page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((page, i) => {
        // Render dots
        if (page < 0) {
          return (
            <Button key={i} variant="ghost" size="icon" disabled className="cursor-default">
              ...
            </Button>
          )
        }

        // Render page number
        return (
          <Button
            key={i}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => handlePageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
