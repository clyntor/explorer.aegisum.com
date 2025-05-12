"use client"

import { type LightbulbIcon as LucideProps, ImagesIcon as icons } from "lucide-react"

export const Icons = {
  ...icons,
  // Add custom icons here if needed
  Pickaxe: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 10l5.196-5.196a2 2 0 0 0 0-2.828l-1.172-1.172a2 2 0 0 0-2.828 0L10 6" />
      <path d="m4 20 6-6" />
      <path d="M4 14h6v6" />
      <path d="m10 4 4 4" />
    </svg>
  ),
}
