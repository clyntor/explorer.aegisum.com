import Link from "next/link"
import { formatNumber, formatHash, timeAgo } from "@/lib/utils"
import { getPaginatedTransactions } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { List } from "lucide-react"
import { Pagination } from "@/components/pagination"
import { AddressTag } from "@/components/address-tag"

export default async function TransactionsPage({ searchParams }) {
  const page = Number(searchParams.page) || 1
  const { transactions, pagination } = await getPaginatedTransactions(page)

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Transactions</h1>
        <p className="text-muted-foreground">Recent transactions on the Aegisum blockchain</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <List className="mr-2 h-5 w-5" />
            Latest Transactions
          </CardTitle>
          <CardDescription>Most recent transactions in the Aegisum blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hash</TableHead>
                  <TableHead>Age</TableHead>
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
                    <TableCell>{timeAgo(tx.timestamp)}</TableCell>
                    <TableCell>
                      {tx.vin[0]?.addresses === "coinbase" ? (
                        <Badge variant="outline">Coinbase</Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Link href={`/address/${tx.vin[0]?.addresses}`} className="text-primary hover:underline">
                            {formatHash(tx.vin[0]?.addresses || "", 8)}
                          </Link>
                          <AddressTag address={tx.vin[0]?.addresses || ""} />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/address/${tx.vout[0]?.addresses}`} className="text-primary hover:underline">
                          {formatHash(tx.vout[0]?.addresses || "", 8)}
                        </Link>
                        <AddressTag address={tx.vout[0]?.addresses || ""} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatNumber(tx.total / 100000000)} AEGS</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        </CardContent>
      </Card>
    </main>
  )
}
