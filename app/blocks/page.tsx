import Link from "next/link"
import { formatHash, timeAgo } from "@/lib/utils"
import { getPaginatedBlocks } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Layers } from "lucide-react"
import { Pagination } from "@/components/pagination"
import { AddressTag } from "@/components/address-tag"

export default async function BlocksPage({ searchParams }) {
  const page = Number(searchParams.page) || 1
  const { blocks, pagination } = await getPaginatedBlocks(page)

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Blocks</h1>
        <p className="text-muted-foreground">Recent blocks mined on the Aegisum blockchain</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layers className="mr-2 h-5 w-5" />
            Latest Blocks
          </CardTitle>
          <CardDescription>Most recent blocks in the Aegisum blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Height</TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Mined by</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blocks.map((block) => (
                  <TableRow key={block.height || block.hash}>
                    <TableCell className="font-medium">
                      <Link href={`/block/${block.hash}`} className="text-primary hover:underline">
                        {block.height}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      <Link href={`/block/${block.hash}`} className="text-primary hover:underline">
                        {formatHash(block.hash, 10)}
                      </Link>
                    </TableCell>
                    <TableCell>{timeAgo(block.timestamp)}</TableCell>
                    <TableCell>{block.txCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/address/${block.minedBy}`} className="text-primary hover:underline">
                          {formatHash(block.minedBy, 8)}
                        </Link>
                        <AddressTag address={block.minedBy} />
                      </div>
                    </TableCell>
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
