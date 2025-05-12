export const dynamic = "force-dynamic"
export const revalidate = 30 // Revalidate every 30 seconds

import Link from "next/link"
import { getMempoolTransactions } from "@/lib/data"
import { MempoolVisualization } from "@/components/mempool-visualization"
import { MempoolStats } from "@/components/mempool-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Pickaxe, Zap } from "lucide-react"

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
      <div className="mb-8">
        <MempoolVisualization transactions={transactions} stats={stats} />
      </div>

      {/* Mining Pool Section */}
      <Card className="mb-8 border-amber-200 dark:border-amber-800">
        <CardHeader className="bg-amber-50 dark:bg-amber-950/40 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <CardTitle>Speed Up Your Transaction</CardTitle>
          </div>
          <CardDescription>
            See your transaction in the mempool above? Get mining on our pool to help speed it up!
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Official Mining Pool</h3>
                  <div className="flex items-center mt-1">
                    <Pickaxe className="h-4 w-4 text-primary mr-2" />
                    <p className="font-medium">pool.aegisum.com</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                  Mining Pool
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Pool Features</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Automatic payouts every 1 hour</li>
                    <li>No registration required</li>
                    <li>Proportional reward distribution</li>
                    <li>Real-time statistics</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Stratum Connection</h4>
                  <div className="bg-muted p-2 rounded-md font-mono text-xs overflow-x-auto mb-4">
                    stratum+tcp://stratum.pool.aegisum.com:2922 -u aegs123... -p c=AEGS,mc=AEGS
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="flex items-center" asChild>
                      <Link href="https://pool.aegisum.com" target="_blank" rel="noopener noreferrer">
                        Visit Mining Pool
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex items-center" asChild>
                      <Link href="/mining.pdf" target="_blank" rel="noopener noreferrer">
                        Mining Guide
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </main>
  )
}
