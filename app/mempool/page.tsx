export const dynamic = "force-dynamic"
export const revalidate = 30 // Revalidate every 30 seconds

import { getMempoolTransactions } from "@/lib/data"
import { MempoolVisualization } from "@/components/mempool-visualization"
import { MempoolStats } from "@/components/mempool-stats"

export default async function MempoolPage() {
  const { transactions, stats } = await getMempoolTransactions()

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mempool</h1>
        <p className="text-muted-foreground">Pending transactions waiting to be confirmed</p>
      </div>

      {/* Mempool Stats Cards */}
      <div className="mb-8">
        <MempoolStats stats={stats} />
      </div>

      {/* Mempool Visualization */}
      <div>
        <MempoolVisualization transactions={transactions} stats={stats} />
      </div>
    </main>
  )
}
