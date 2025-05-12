import { Badge } from "@/components/ui/badge"
import { getKnownAddress } from "@/lib/known-addresses"
import { ExternalLink } from "lucide-react"

interface AddressTagProps {
  address: string
  showLink?: boolean
  className?: string
}

export function AddressTag({ address, showLink = true, className = "" }: AddressTagProps) {
  const knownAddress = getKnownAddress(address)

  if (!knownAddress) {
    return null
  }

  // Determine badge variant based on address type
  let badgeClass = ""

  switch (knownAddress.type) {
    case "dev":
      badgeClass =
        "bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800"
      break
    case "pool":
      badgeClass =
        "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      break
    case "team":
      badgeClass =
        "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800"
      break
    case "exchange":
      badgeClass =
        "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
      break
    case "service":
      badgeClass =
        "bg-cyan-100 text-cyan-800 hover:bg-cyan-100 dark:bg-cyan-900 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800"
      break
    default:
      badgeClass =
        "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700"
  }

  const content = (
    <Badge
      variant="outline"
      className={`${badgeClass} ${className} font-medium text-xs py-0.5 px-2`}
      title={knownAddress.description || knownAddress.tag}
    >
      {knownAddress.tag}
      {knownAddress.url && showLink && <ExternalLink className="ml-1 h-3 w-3" />}
    </Badge>
  )

  if (knownAddress.url && showLink) {
    return (
      <a href={knownAddress.url} target="_blank" rel="noopener noreferrer" className="inline-flex">
        {content}
      </a>
    )
  }

  return content
}
