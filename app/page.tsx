export const dynamic = "force-dynamic"
export const revalidate = 60 // Revalidate every 60 seconds (1 minute)

import Link from "next/link"
import { formatNumber, formatHash, timeAgo } from "@/lib/utils"
import { getLatestBlocks, getNetworkStats, getRecentTransactions } from "@/lib/data"
import { getAegsPrice } from "@/lib/price"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart2, Zap, DollarSign, TrendingUp } from "lucide-react"
import { AddressTag } from "@/components/address-tag"
import { getKnownAddress } from "@/lib/known-addresses"
import { AutoRefresh } from "@/components/auto-refresh"

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

  // Calculate market cap and show full dollar amount
  const marketCap = networkStats.supply * priceValue
  const formattedMarketCap = `$${marketCap.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <AutoRefresh interval={60} />

      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-slate-100">Aegisum Blockchain Explorer</h1>
        <p className="text-slate-400 mb-6">Explore the AEGS blockchain</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Price (USDT)"
          value={formattedPrice}
          description="TradeOgre AEGS/USDT"
          icon={<DollarSign className="h-5 w-5" />}
          variant="price"
        />
        <StatCard
          title="Market Cap"
          value={formattedMarketCap}
          description="Current market capitalization"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="market"
        />
        <StatCard
          title="Circulating Supply"
          value={`${formatNumber(networkStats.supply)} AEGS`}
          description="Current supply"
          icon={<BarChart2 className="h-5 w-5" />}
          variant="supply"
        />
        <StatCard
          title="Network Hashrate"
          value={`${networkStats.nethash.toFixed(4)} GH/s`}
          description="Current hashrate"
          icon={<Zap className="h-5 w-5" />}
          variant="hashrate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="h-full bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-slate-100">
              Latest Blocks
              <Link href="/blocks" className="text-sm font-normal text-blue-400 hover:text-blue-300 hover:underline">
                View all
              </Link>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Most recent blocks mined on the Aegisum network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="w-[80px] text-slate-300">Height</TableHead>
                    <TableHead className="w-[100px] text-slate-300">Age</TableHead>
                    <TableHead className="w-[80px] text-slate-300">Txs</TableHead>
                    <TableHead className="text-slate-300">Mined by</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestBlocks.map((block) => {
                    const knownAddress = getKnownAddress(block.minedBy)
                    return (
                      <TableRow key={block.height} className="border-slate-700 hover:bg-slate-700/30">
                        <TableCell className="font-medium">
                          <Link
                            href={`/block/${block.hash}`}
                            className="text-blue-400 hover:text-blue-300 hover:underline"
                          >
                            {block.height}
                          </Link>
                        </TableCell>
                        <TableCell className="text-slate-300">{timeAgo(block.timestamp)}</TableCell>
                        <TableCell className="text-slate-300">{block.txCount}</TableCell>
                        <TableCell>
                          {knownAddress ? (
                            <div className="flex items-center gap-2">
                              {knownAddress.url ? (
                                <a
                                  href={knownAddress.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 hover:underline"
                                >
                                  {knownAddress.tag}
                                </a>
                              ) : (
                                <Link
                                  href={`/address/${block.minedBy}`}
                                  className="text-blue-400 hover:text-blue-300 hover:underline"
                                >
                                  {knownAddress.tag}
                                </Link>
                              )}
                              <span className="text-slate-500 text-xs">({formatHash(block.minedBy, 6)})</span>
                            </div>
                          ) : (
                            <Link
                              href={`/address/${block.minedBy}`}
                              className="text-blue-400 hover:text-blue-300 hover:underline"
                            >
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

        <Card className="h-full bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-slate-100">
              Recent Transactions
              <Link
                href="/transactions"
                className="text-sm font-normal text-blue-400 hover:text-blue-300 hover:underline"
              >
                View all
              </Link>
            </CardTitle>
            <CardDescription className="text-slate-400">Latest transactions on the Aegisum blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="w-[120px] text-slate-300">Hash</TableHead>
                  <TableHead className="w-[100px] text-slate-300">Age</TableHead>
                  <TableHead className="text-slate-300">Recipient</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTxs.map((tx) => (
                  <TableRow key={tx.txid} className="border-slate-700 hover:bg-slate-700/30">
                    <TableCell className="font-medium">
                      <Link href={`/tx/${tx.txid}`} className="text-blue-400 hover:text-blue-300 hover:underline">
                        {formatHash(tx.txid, 8)}
                      </Link>
                    </TableCell>
                    <TableCell className="text-slate-300">{timeAgo(tx.timestamp)}</TableCell>
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
                                      className="text-blue-400 hover:text-blue-300 hover:underline"
                                    >
                                      {knownAddress.tag}
                                    </a>
                                  ) : (
                                    <Link
                                      href={`/address/${tx.vout[0].addresses}`}
                                      className="text-blue-400 hover:text-blue-300 hover:underline"
                                    >
                                      {knownAddress.tag}
                                    </Link>
                                  )}
                                  <span className="text-slate-500 text-xs">
                                    ({formatHash(tx.vout[0].addresses, 6)})
                                  </span>
                                </>
                              )
                            } else {
                              return (
                                <Link
                                  href={`/address/${tx.vout[0].addresses}`}
                                  className="text-blue-400 hover:text-blue-300 hover:underline"
                                >
                                  {formatHash(tx.vout[0].addresses, 8)}
                                </Link>
                              )
                            }
                          })()}
                          <AddressTag address={tx.vout[0].addresses} showLink={false} />
                        </div>
                      ) : (
                        <span className="text-slate-500">Unknown</span>
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

function StatCard({ title, value, description, icon, variant }) {
  // More subtle, professional colors
  const variants = {
    price: {
      bg: "bg-slate-800/60",
      border: "border-slate-600/50",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      gradient: "bg-gradient-to-br from-slate-800/80 to-slate-700/60",
    },
    market: {
      bg: "bg-slate-800/60",
      border: "border-slate-600/50",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      gradient: "bg-gradient-to-br from-slate-800/80 to-slate-700/60",
    },
    supply: {
      bg: "bg-slate-800/60",
      border: "border-slate-600/50",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      gradient: "bg-gradient-to-br from-slate-800/80 to-slate-700/60",
    },
    hashrate: {
      bg: "bg-slate-800/60",
      border: "border-slate-600/50",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
      gradient: "bg-gradient-to-br from-slate-800/80 to-slate-700/60",
    },
  }

  const style = variants[variant] || variants.price

  return (
    <Card className={`${style.gradient} ${style.border} border`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <div className={`${style.iconBg} p-2 rounded-full ${style.iconColor}`}>{icon}</div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-slate-100">{value}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
