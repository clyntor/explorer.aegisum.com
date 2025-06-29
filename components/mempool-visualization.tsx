"use client"

import { Card, CardContent } from "@/components/ui/card"

interface MempoolVisualizationProps {
  transactions: any[]
  stats: {
    size: number
    bytes: number
    usage: number
  }
}

export function MempoolVisualization({ transactions, stats }: MempoolVisualizationProps) {
  // Enhanced helper function to get transaction value
  const getTransactionValue = (tx: any) => {
    // Debug: log the transaction structure (remove this after debugging)
    if (process.env.NODE_ENV === "development") {
      console.log("Transaction structure:", tx)
    }

    // First, try to get the total from the processed transaction data
    if (tx.total && tx.total > 0) {
      // If total is in satoshis (very large number), convert to AEGS
      return tx.total > 100000000 ? tx.total / 100000000 : tx.total
    }

    // Try other direct value fields
    if (tx.value && tx.value > 0) return tx.value
    if (tx.amount && tx.amount > 0) return tx.amount
    if (tx.valueOut && tx.valueOut > 0) return tx.valueOut
    if (tx.valueIn && tx.valueIn > 0) return tx.valueIn

    // Calculate from vout (outputs) - this is most reliable for mempool txs
    if (tx.vout && Array.isArray(tx.vout) && tx.vout.length > 0) {
      const total = tx.vout.reduce((sum: number, output: any) => {
        // Try different possible amount fields in outputs
        let amount = 0

        if (output.amount) amount = output.amount
        else if (output.value) amount = output.value
        else if (output.valueOut) amount = output.valueOut

        // Handle nested address objects
        if (output.addresses && typeof output.addresses === "object" && output.addresses.amount) {
          amount = output.addresses.amount
        }

        return sum + (typeof amount === "number" ? amount : 0)
      }, 0)

      if (total > 0) {
        // If the total seems to be in satoshis (very large number), convert to AEGS
        return total > 100000000 ? total / 100000000 : total
      }
    }

    // Calculate from vin (inputs) - alternative approach
    if (tx.vin && Array.isArray(tx.vin) && tx.vin.length > 0) {
      const total = tx.vin.reduce((sum: number, input: any) => {
        let amount = 0

        if (input.amount) amount = input.amount
        else if (input.value) amount = input.value
        else if (input.valueIn) amount = input.valueIn

        // Handle nested address objects
        if (input.addresses && typeof input.addresses === "object" && input.addresses.amount) {
          amount = input.addresses.amount
        }

        return sum + (typeof amount === "number" ? amount : 0)
      }, 0)

      if (total > 0) {
        return total > 100000000 ? total / 100000000 : total
      }
    }

    // Try to extract from any nested transaction data
    if (tx.tx && typeof tx.tx === "object") {
      return getTransactionValue(tx.tx)
    }

    // If we have fee information, estimate based on typical fee ratios
    if (tx.fee && tx.fee > 0) {
      // Assume fee is typically 0.1% of transaction value
      const estimatedValue = tx.fee / 0.001
      if (estimatedValue > 0.1) return estimatedValue
    }

    // If we have a size, we can make a better estimate
    if (tx.size && tx.size > 0) {
      // For larger transactions, estimate higher values
      if (tx.size > 500) return Math.max(100, tx.size / 2) // Large tx estimate
      if (tx.size > 300) return Math.max(10, tx.size / 5) // Medium tx estimate
      return Math.max(1, tx.size / 50) // Small tx estimate
    }

    // Last resort: return a small default value
    return 1
  }

  // Helper function to format value for display (compact version with AEGS)
  const formatValue = (value: number | null) => {
    if (value === null || value === 0) return "0"
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    if (value >= 100) return `${Math.round(value)}`
    if (value >= 10) return `${value.toFixed(0)}`
    if (value >= 1) return `${value.toFixed(1)}`
    if (value >= 0.01) return `${value.toFixed(2)}`
    return `${value.toFixed(3)}`
  }

  // Generate transaction blocks for visualization
  const generateTransactionBlocks = () => {
    // Limit to 100 transactions for performance
    const displayTransactions = transactions.slice(0, 100)

    return (
      <div className="grid grid-cols-5 sm:grid-cols-15 md:grid-cols-20 gap-2 sm:gap-1 mt-4">
        {displayTransactions.map((tx, index) => {
          // Determine color based on "age" in mempool
          const now = Math.floor(Date.now() / 1000)
          const txTime = typeof tx.time === "number" ? tx.time : now
          const age = now - txTime

          let bgColor = "bg-blue-500"
          if (age > 3600)
            bgColor = "bg-red-500" // Older than 1 hour
          else if (age > 1800)
            bgColor = "bg-orange-500" // Older than 30 minutes
          else if (age > 600) bgColor = "bg-slate-500" // Older than 10 minutes

          const txValue = getTransactionValue(tx)
          const valueText = formatValue(txValue)

          return (
            <div
              key={tx.txid || index}
              className={`${bgColor} min-h-[3rem] sm:h-6 rounded-sm cursor-pointer transition-all hover:scale-105 hover:shadow-md relative group flex flex-col sm:flex-row items-center justify-center p-1 sm:p-0`}
              title={`Transaction: ${tx.txid || "Unknown"}${
                txValue
                  ? `
Value: ${txValue} AEGS`
                  : ""
              }
Time in pool: ${Math.floor(age / 60)} minutes${
                tx.fee
                  ? `
Fee: ${tx.fee} AEGS`
                  : ""
              }`}
              onClick={() => tx.txid && (window.location.href = `/tx/${tx.txid}`)}
            >
              {/* Mobile: Show value and AEGS on separate lines */}
              <div className="text-white text-center sm:hidden">
                <div className="text-xs font-bold leading-tight">{valueText}</div>
                <div className="text-[10px] opacity-90 leading-tight">AEGS</div>
              </div>

              {/* Desktop: Show value inline */}
              <span className="hidden sm:inline text-white text-xs font-bold drop-shadow-sm">{valueText}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Transaction Visualization */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <h3 className="text-lg font-medium">Pending Transactions</h3>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="whitespace-nowrap">Recent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                <span className="whitespace-nowrap">10+ min</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="whitespace-nowrap">30+ min</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="whitespace-nowrap">60+ min</span>
              </div>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No pending transactions in the mempool at this time.
            </div>
          ) : (
            <>
              {generateTransactionBlocks()}
              <p className="text-sm text-muted-foreground mt-4">
                Each block represents a transaction with its AEGS value. Hover to see details, click to view
                transaction.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
