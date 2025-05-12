import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num)
}

export function formatHash(hash: string, length = 6): string {
  if (!hash) return ""
  if (hash === "coinbase") return "Coinbase"
  if (hash.length <= length * 2 + 3) return hash
  return `${hash.substring(0, length)}...${hash.substring(hash.length - length)}`
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString()
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor(Date.now() / 1000 - timestamp)

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  }

  let counter
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    counter = Math.floor(seconds / secondsInUnit)
    if (counter > 0) {
      return `${counter} ${unit}${counter === 1 ? "" : "s"} ago`
    }
  }

  return "just now"
}
