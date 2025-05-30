import Link from "next/link"
import { notFound } from "next/navigation"
import { formatNumber, formatTimestamp } from "@/lib/utils"
import { getTransactionById, getNetworkStats } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowDownToLine, ArrowUpFromLine, Clock, CheckCircle } from "lucide-react"
import { AddressTag } from "@/components/address-tag"

export default async function TransactionPage({ params }) {
  const { txid } = params

  // Try to get the transaction from the database and network stats
  const [tx, networkStats] = await Promise.all([getTransactionById(txid), getNetworkStats()])

  if (!tx) {
    notFound()
  }

  // Check if this is a mempool transaction (no blockhash)
  const isPending = !tx.blockhash || tx.isPending

  // Calculate confirmations for confirmed transactions
  let confirmations = 0
  if (!isPending && tx.blockindex && networkStats.count) {
    confirmations = networkStats.count - tx.blockindex + 1
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Transaction Details</h1>
        <p className="text-muted-foreground break-all">
          <span className="font-medium">Transaction ID:</span> {tx.txid}
        </p>
        {isPending && (
          <div className="mt-2">
            <Badge
              variant="outline"
              className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-200 flex items-center"
            >
              <Clock className="h-3 w-3 mr-1" />
              Pending - Not yet confirmed
            </Badge>
          </div>
        )}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Transaction Information</CardTitle>
          <CardDescription>Detailed information about this transaction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              {!isPending && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Block</h3>
                  <Link href={`/block/${tx.blockhash}`} className="text-primary hover:underline">
                    {tx.blockindex}
                  </Link>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Timestamp</h3>
                <p>{isPending ? "Pending" : formatTimestamp(tx.timestamp)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Value</h3>
                <p>{formatNumber(tx.total / 100000000)} AEGS</p>
              </div>
            </div>
            <div className="space-y-4">
              {tx.tx_type && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Type</h3>
                  <Badge>{tx.tx_type}</Badge>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Confirmations</h3>
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="text-amber-600 dark:text-amber-400">Unconfirmed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {formatNumber(confirmations)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="bg-muted/40">
            <CardTitle className="flex items-center">
              <ArrowUpFromLine className="mr-2 h-5 w-5" />
              Inputs
            </CardTitle>
            <CardDescription>Source of funds</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tx.vin && tx.vin.length > 0 ? (
                  tx.vin.map((input, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {input.addresses === "coinbase" ? (
                          <Badge variant="outline">Coinbase (New Coins)</Badge>
                        ) : input.addresses === "unknown" ? (
                          <span className="text-muted-foreground">Unknown</span>
                        ) : (
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/address/${input.addresses}`}
                              className="text-primary hover:underline break-all"
                            >
                              {input.addresses}
                            </Link>
                            <AddressTag address={input.addresses} />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{formatNumber(input.amount / 100000000)} AEGS</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                      {isPending ? "Input information not available for pending transactions" : "No inputs found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-muted/40">
            <CardTitle className="flex items-center">
              <ArrowDownToLine className="mr-2 h-5 w-5" />
              Outputs
            </CardTitle>
            <CardDescription>Destination of funds</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tx.vout && tx.vout.length > 0 ? (
                  tx.vout.map((output, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/address/${output.addresses}`}
                            className="text-primary hover:underline break-all"
                          >
                            {output.addresses}
                          </Link>
                          <AddressTag address={output.addresses} />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatNumber(output.amount / 100000000)} AEGS</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                      {isPending ? "Output information not available for pending transactions" : "No outputs found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
