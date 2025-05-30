import Link from "next/link"
import { notFound } from "next/navigation"
import { formatNumber, formatHash, formatTimestamp } from "@/lib/utils"
import { getBlockByHash, getTransactionsByBlockHash, getNextBlockHash, getNetworkStats } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddressTag } from "@/components/address-tag"
import { getKnownAddress } from "@/lib/known-addresses"

export default async function BlockPage({ params }) {
  const { hash } = params
  const [block, networkStats] = await Promise.all([getBlockByHash(hash), getNetworkStats()])

  if (!block) {
    notFound()
  }

  const transactions = await getTransactionsByBlockHash(hash)

  // Get next block hash if it exists
  const nextBlockHash = await getNextBlockHash(block.height)

  // Get miner information if available
  const minerAddress = transactions[0]?.vout[0]?.addresses
  const knownMiner = minerAddress ? getKnownAddress(minerAddress) : null

  // Calculate confirmations
  const confirmations = networkStats.count - block.height + 1

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Block Details</h1>
        <p className="text-muted-foreground">
          <span className="font-medium">Block Height:</span> {block.height}
        </p>

        {/* Block Navigation */}
        <div className="flex items-center gap-2 mt-4">
          {block.previousblockhash && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/block/${block.previousblockhash}`}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous Block
              </Link>
            </Button>
          )}

          {nextBlockHash && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/block/${nextBlockHash}`}>
                Next Block
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Block Information</CardTitle>
          <CardDescription>Detailed information about this block</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Hash</h3>
                <p className="font-mono text-sm break-all">{block.hash}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Previous Block</h3>
                {block.previousblockhash ? (
                  <Link
                    href={`/block/${block.previousblockhash}`}
                    className="font-mono text-sm text-primary hover:underline break-all"
                  >
                    {block.previousblockhash}
                  </Link>
                ) : (
                  <p className="text-muted-foreground">Genesis Block</p>
                )}
              </div>
              {nextBlockHash && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Next Block</h3>
                  <Link
                    href={`/block/${nextBlockHash}`}
                    className="font-mono text-sm text-primary hover:underline break-all"
                  >
                    {nextBlockHash}
                  </Link>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Timestamp</h3>
                <p>{formatTimestamp(block.timestamp)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Difficulty</h3>
                <p>{block.difficulty}</p>
              </div>
              {minerAddress && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Mined by</h3>
                  <div className="flex items-center gap-2">
                    {knownMiner ? (
                      <>
                        {knownMiner.url ? (
                          <a
                            href={knownMiner.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {knownMiner.tag}
                          </a>
                        ) : (
                          <Link href={`/address/${minerAddress}`} className="text-primary hover:underline">
                            {knownMiner.tag}
                          </Link>
                        )}
                        <span className="text-muted-foreground">({formatHash(minerAddress, 8)})</span>
                      </>
                    ) : (
                      <Link href={`/address/${minerAddress}`} className="text-primary hover:underline">
                        {formatHash(minerAddress, 12)}
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Block Transactions ({transactions.length})</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">{formatNumber(confirmations)} Confirmations</span>
            </div>
          </CardTitle>
          <CardDescription>Transactions included in this block</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hash</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.txid}>
                  <TableCell className="font-medium">
                    <Link href={`/tx/${tx.txid}`} className="text-primary hover:underline">
                      {formatHash(tx.txid, 8)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {tx.vin[0].addresses === "coinbase" ? (
                      <Badge variant="outline">Coinbase (New Coins)</Badge>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Link href={`/address/${tx.vin[0].addresses}`} className="text-primary hover:underline">
                          {formatHash(tx.vin[0].addresses, 8)}
                        </Link>
                        <AddressTag address={tx.vin[0].addresses} />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/address/${tx.vout[0].addresses}`} className="text-primary hover:underline">
                        {formatHash(tx.vout[0].addresses, 8)}
                      </Link>
                      <AddressTag address={tx.vout[0].addresses} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{formatNumber(tx.total / 100000000)} AEGS</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
