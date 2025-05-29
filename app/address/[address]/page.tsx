import Link from "next/link"
import { notFound } from "next/navigation"
import { formatNumber, formatHash, timeAgo } from "@/lib/utils"
import { getAddressInfo, getPaginatedAddressTransactions, getTransactionById } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowDownToLine, ArrowUpFromLine, Wallet, RefreshCw } from "lucide-react"
import { Pagination } from "@/components/pagination"
import { AddressTag } from "@/components/address-tag"

export default async function AddressPage({ params, searchParams }) {
  const { address } = params
  const page = Number(searchParams.page) || 1

  const addressInfo = await getAddressInfo(address)

  if (!addressInfo) {
    notFound()
  }

  const { transactions, pagination } = await getPaginatedAddressTransactions(address, page)

  // Enrich transactions with full details and calculate correct amounts
  const enrichedTransactions = await Promise.all(
    transactions.map(async (tx) => {
      const fullTx = await getTransactionById(tx.txid)

      if (!fullTx) {
        return {
          ...tx,
          type: tx.amount > 0 ? "received" : "sent",
          displayAmount: Math.abs(tx.amount),
        }
      }

      // Calculate total amounts for this address in this transaction
      let totalSent = 0
      let totalReceived = 0

      // Sum all inputs from this address
      if (fullTx.vin && Array.isArray(fullTx.vin)) {
        fullTx.vin.forEach((input) => {
          if (input.addresses === address) {
            totalSent += input.amount || 0
          }
        })
      }

      // Sum all outputs to this address
      if (fullTx.vout && Array.isArray(fullTx.vout)) {
        fullTx.vout.forEach((output) => {
          if (output.addresses === address) {
            totalReceived += output.amount || 0
          }
        })
      }

      // Determine transaction type and net amount
      let type = "received"
      let displayAmount = totalReceived

      if (totalSent > 0 && totalReceived > 0) {
        // Self-send transaction
        type = "self"
        displayAmount = totalReceived - totalSent
      } else if (totalSent > 0) {
        // Sent transaction
        type = "sent"
        displayAmount = totalSent
      }

      return {
        ...tx,
        type,
        displayAmount: Math.abs(displayAmount),
        netAmount: totalReceived - totalSent, // Keep track of net amount for display logic
      }
    }),
  )

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Address Details</h1>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-muted-foreground break-all">{addressInfo.a_id}</p>
          <AddressTag address={addressInfo.a_id} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Balance</p>
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{formatNumber(addressInfo.balance / 100000000)} AEGS</h3>
              <p className="text-xs text-muted-foreground">Current balance</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Received</p>
              <div className="bg-green-100 p-2 rounded-full text-green-600 dark:bg-green-900 dark:text-green-400">
                <ArrowDownToLine className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{formatNumber(addressInfo.received / 100000000)} AEGS</h3>
              <p className="text-xs text-muted-foreground">Total received</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Sent</p>
              <div className="bg-blue-100 p-2 rounded-full text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                <ArrowUpFromLine className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{formatNumber(addressInfo.sent / 100000000)} AEGS</h3>
              <p className="text-xs text-muted-foreground">Total sent</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Transactions involving this address</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrichedTransactions.map((tx) => (
                <TableRow key={tx._id}>
                  <TableCell className="font-medium">
                    <Link href={`/tx/${tx.txid}`} className="text-primary hover:underline">
                      {formatHash(tx.txid, 8)}
                    </Link>
                  </TableCell>
                  <TableCell>{timeAgo(tx.timestamp)}</TableCell>
                  <TableCell>
                    {tx.type === "received" ? (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
                      >
                        Received
                      </Badge>
                    ) : tx.type === "sent" ? (
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300"
                      >
                        Sent
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Self
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {tx.type === "sent" ? (
                      <span className="text-red-600 dark:text-red-400">
                        -{formatNumber(tx.displayAmount / 100000000)} AEGS
                      </span>
                    ) : tx.type === "self" ? (
                      <span className={tx.netAmount >= 0 ? "" : "text-red-600 dark:text-red-400"}>
                        {tx.netAmount >= 0 ? "+" : ""}
                        {formatNumber(Math.abs(tx.netAmount) / 100000000)} AEGS
                      </span>
                    ) : (
                      <span className="text-green-600 dark:text-green-400">
                        +{formatNumber(tx.displayAmount / 100000000)} AEGS
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        </CardContent>
      </Card>
    </main>
  )
}
