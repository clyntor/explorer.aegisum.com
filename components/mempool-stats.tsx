"use client"

import { Card, CardContent } from "@/components/ui/card"
import { formatNumber } from "@/lib/utils"
import { Clock, Database, ArrowUpDown } from "lucide-react"

interface MempoolStatsProps {
  stats: {
    size: number
    bytes: number
    usage: number
  }
}

export function MempoolStats({ stats }: MempoolStatsProps) {
  // Ensure stats has all required properties with fallbacks
  const safeStats = {
    size: stats?.size || 0,
    bytes: stats?.bytes || 0,
    usage: stats?.usage || 0,
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">Transactions</p>
            <div className="bg-blue-200 dark:bg-blue-800 p-2 rounded-full text-blue-800 dark:text-blue-200">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">{formatNumber(safeStats.size)}</h3>
            <p className="text-xs text-blue-800 dark:text-blue-300">Pending transactions</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-900 dark:text-purple-200">Memory Usage</p>
            <div className="bg-purple-200 dark:bg-purple-800 p-2 rounded-full text-purple-800 dark:text-purple-200">
              <Database className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {formatNumber(safeStats.usage / 1024)} KB
            </h3>
            <p className="text-xs text-purple-800 dark:text-purple-300">Memory used by mempool</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">Average Size</p>
            <div className="bg-emerald-200 dark:bg-emerald-800 p-2 rounded-full text-emerald-800 dark:text-emerald-200">
              <ArrowUpDown className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {safeStats.size > 0 ? formatNumber(Math.round(safeStats.bytes / safeStats.size)) : 0} bytes
            </h3>
            <p className="text-xs text-emerald-800 dark:text-emerald-300">Average transaction size</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
