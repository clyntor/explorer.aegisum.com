export const dynamic = "force-dynamic"
export const revalidate = 60

import Link from "next/link"
import { formatNumber, formatHash, timeAgo } from "@/lib/utils"
import { getLatestBlocks, getNetworkStats, getRecentTransactions } from "@/lib/data"
import { getAegsPrice } from "@/lib/price"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart2, Layers, Zap, DollarSign } from "lucide-react"
import { AddressTag } from "@/components/address-tag"
import { getKnownAddress } from "@/lib/known-addresses"

export default async function Home() {
  const [latestBlocks, networkStats, recentTxs, price] = await Promise.all([
    getLatestBlocks(5),
    getNetworkStats(),
    getRecentTransactions(5),
    getAegsPrice(),
  ])

  // Format price for display
  const priceValue = Number.parseFloat(price)
  const formattedPrice = priceValue < 0.01 ? `$${priceValue.toFixed(8)}` : `$${priceValue.toFixed(4)}`

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Aegisum Blockchain Explorer</h1>
        <p className="text-muted-foreground mb-6">Explore the AEGS blockchain</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Blocks"
          value={formatNumber(networkStats.count)}
          description="Total blocks"
          icon={<Layers className="h-5 w-5" />}
        />
        <StatCard
          title="Price (USDT)"
          value={formattedPrice}
          description="TradeOgre AEGS/USDT"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          title="Network Hashrate"
          value={`${networkStats.nethash.toFixed(4)} GH/s`}
          description="Current hashrate"
          icon={<Zap className="h-5 w-5" />}
        />
        <StatCard
          title="Circulating Supply"
          value={`${formatNumber(networkStats.supply)} AEGS`}
          description="Current supply"
          icon={<BarChart2 className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Latest Blocks
              <Link href="/blocks" className="text-sm font-normal text-primary hover:underline">
                View all
              </Link>
            </CardTitle>
            <CardDescription>Most recent blocks mined on the Aegisum network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Height</TableHead>
                    <TableHead className="w-[100px]">Age</TableHead>
                    <TableHead className="w-[80px]">Txs</TableHead>
                    <TableHead>Mined by</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestBlocks.map((block) => {
                    const knownAddress = getKnownAddress(block.minedBy)
                    return (
                      <TableRow key={block.height}>
                        <TableCell className="font-medium">
                          <Link href={`/block/${block.hash}`} className="text-primary hover:underline">
                            {block.height}
                          </Link>
                        </TableCell>
                        <TableCell>{timeAgo(block.timestamp)}</TableCell>
                        <TableCell>{block.txCount}</TableCell>
                        <TableCell>
                          {knownAddress ? (
                            <div className="flex items-center gap-2">
                              {knownAddress.url ? (
                                <a
                                  href={knownAddress.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {knownAddress.tag}
                                </a>
                              ) : (
                                <Link href={`/address/${block.minedBy}`} className="text-primary hover:underline">
                                  {knownAddress.tag}
                                </Link>
                              )}
                              <span className="text-muted-foreground text-xs">({formatHash(block.minedBy, 6)})</span>
                            </div>
                          ) : (
                            <Link href={`/address/${block.minedBy}`} className="text-primary hover:underline">
                              {formatHash(block.minedBy, 8)}
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Transactions
              <Link href="/transactions" className="text-sm font-normal text-primary hover:underline">
                View all
              </Link>
            </CardTitle>
            <CardDescription>Latest transactions on the Aegisum blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Hash</TableHead>
                  <TableHead className="w-[100px]">Age</TableHead>
                  <TableHead>Recipient</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTxs.map((tx) => (
                  <TableRow key={tx.txid}>
                    <TableCell className="font-medium">
                      <Link href={`/tx/${tx.txid}`} className="text-primary hover:underline">
                        {formatHash(tx.txid, 8)}
                      </Link>
                    </TableCell>
                    <TableCell>{timeAgo(tx.timestamp)}</TableCell>
                    <TableCell>
                      {tx.vout[0].addresses ? (
                        <div className="flex items-center gap-2">
                          {(() => {
                            const knownAddress = getKnownAddress(tx.vout[0].addresses)
                            if (knownAddress) {
                              return (
                                <>
                                  {knownAddress.url ? (
                                    <a
                                      href={knownAddress.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline"
                                    >
                                      {knownAddress.tag}
                                    </a>
                                  ) : (
                                    <Link
                                      href={`/address/${tx.vout[0].addresses}`}
                                      className="text-primary hover:underline"
                                    >
                                      {knownAddress.tag}
                                    </Link>
                                  )}
                                  <span className="text-muted-foreground text-xs">
                                    ({formatHash(tx.vout[0].addresses, 6)})
                                  </span>
                                </>
                              )
                            } else {
                              return (
                                <Link
                                  href={`/address/${tx.vout[0].addresses}`}
                                  className="text-primary hover:underline"
                                >
                                  {formatHash(tx.vout[0].addresses, 8)}
                                </Link>
                              )
                            }
                          })()}
                          <AddressTag address={tx.vout[0].addresses} showLink={false} />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Unknown</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function StatCard({ title, value, description, icon }) {
  // Determine colors based on the title
  let bgColor = "bg-primary/10"
  let textColor = "text-primary"
  let gradientClasses = ""

  if (title === "Blocks") {
    bgColor = "bg-blue-100 dark:bg-blue-900/30"
    textColor = "text-blue-600 dark:text-blue-400"
    gradientClasses = "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900/50"
  } else if (title === "Price (USDT)") {
    bgColor = "bg-green-100 dark:bg-green-900/30"
    textColor = "text-green-600 dark:text-green-400"
    gradientClasses = "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900/50"
  } else if (title === "Network Hashrate") {
    bgColor = "bg-purple-100 dark:bg-purple-900/30"
    textColor = "text-purple-600 dark:text-purple-400"
    gradientClasses = "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900/50"
  } else if (title === "Circulating Supply") {
    bgColor = "bg-amber-100 dark:bg-amber-900/30"
    textColor = "text-amber-600 dark:text-amber-400"
    gradientClasses = "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900/50"
  }

  return (
    <Card className={gradientClasses}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={`${bgColor} p-2 rounded-full ${textColor}`}>{icon}</div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
