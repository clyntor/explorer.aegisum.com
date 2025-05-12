import Link from "next/link"
import { formatNumber, formatHash } from "@/lib/utils"
import { getRichList, getNetworkStats } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AddressTag } from "@/components/address-tag"

export default async function RichListPage() {
  const [richList, networkStats] = await Promise.all([getRichList(100), getNetworkStats()])

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Rich List</h1>
        <p className="text-muted-foreground">Top 100 richest Aegisum addresses by balance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wealth Distribution</CardTitle>
          <CardDescription>Total Supply: {formatNumber(networkStats.supply)} AEGS</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right hidden md:table-cell">% of Supply</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {richList.map((address, index) => {
                const percentOfSupply = (address.balance / (networkStats.supply * 100000000)) * 100
                return (
                  <TableRow key={address.a_id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {address.a_id === "coinbase" ? (
                        <Badge variant="outline">Coinbase (New Coins)</Badge>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={`/address/${address.a_id}`} className="text-primary hover:underline">
                            {formatHash(address.a_id, 12)}
                          </Link>
                          <AddressTag address={address.a_id} />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{formatNumber(address.balance / 100000000)} AEGS</TableCell>
                    <TableCell className="text-right hidden md:table-cell">{percentOfSupply.toFixed(4)}%</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
