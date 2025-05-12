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
  // Generate transaction blocks for visualization
  const generateTransactionBlocks = () => {
    // Limit to 100 transactions for performance
    const displayTransactions = transactions.slice(0, 100)

    return (
      <div className="grid grid-cols-10 gap-1 mt-4">
        {displayTransactions.map((tx, index) => {
          // Determine color based on "age" in mempool
          // Ensure tx.time exists and is a number, otherwise use current time
          const now = Math.floor(Date.now() / 1000)
          const txTime = typeof tx.time === "number" ? tx.time : now
          const age = now - txTime

          let bgColor = "bg-blue-500"
          if (age > 3600)
            bgColor = "bg-red-500" // Older than 1 hour
          else if (age > 1800)
            bgColor = "bg-orange-500" // Older than 30 minutes
          else if (age > 600) bgColor = "bg-yellow-500" // Older than 10 minutes

          return (
            <div
              key={tx.txid || index}
              className={`${bgColor} h-6 rounded-sm cursor-pointer transition-transform hover:scale-105`}
              title={`Transaction: ${tx.txid || "Unknown"}\nTime in pool: ${Math.floor(age / 60)} minutes`}
              onClick={() => tx.txid && (window.location.href = `/tx/${tx.txid}`)}
            />
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Pending Transactions</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span>Recent</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span>10+ min</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                <span>30+ min</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span>60+ min</span>
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
                Each block represents a transaction. Click on a block to view transaction details.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
