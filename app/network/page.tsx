export const dynamic = "force-dynamic"
export const revalidate = 1800 // Revalidate every 30 minutes

import Link from "next/link"
import { getNetworkStats, getPeerInfo } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpRight, Globe, Server, Zap, Network, Clock, Pickaxe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function NetworkPage() {
  // Add error handling for data fetching
  let networkStats
  let peerInfo

  try {
    ;[networkStats, peerInfo] = await Promise.all([getNetworkStats(), getPeerInfo()])
  } catch (error) {
    console.error("Error fetching network data:", error)
    // Provide fallback data
    networkStats = {
      count: 0,
      connections: 0,
      last_updated: Math.floor(Date.now() / 1000),
    }
    peerInfo = []
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Network Information</h1>
        <p className="text-muted-foreground">Aegisum network nodes and connection information</p>
      </div>

      {/* Connection Nodes */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Official Connection Nodes</CardTitle>
          <CardDescription>Connect to these nodes in your Aegisum wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Primary Node */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Primary Node</h3>
                    <div className="flex items-center mt-1">
                      <Server className="h-4 w-4 text-primary mr-2" />
                      <p className="font-medium">node.aegisum.com</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  >
                    Primary
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Add to your wallet configuration:</p>
                  <div className="bg-muted p-2 rounded-md font-mono text-xs overflow-x-auto">
                    addnode=node.aegisum.com:39940
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Backup Node 1 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Backup Node 1</h3>
                    <div className="flex items-center mt-1">
                      <Server className="h-4 w-4 text-primary mr-2" />
                      <p className="font-medium">node1.aegisum.com</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    Backup
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Add to your wallet configuration:</p>
                  <div className="bg-muted p-2 rounded-md font-mono text-xs overflow-x-auto">
                    addnode=node1.aegisum.com:39940
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Backup Node 2 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Backup Node 2</h3>
                    <div className="flex items-center mt-1">
                      <Server className="h-4 w-4 text-primary mr-2" />
                      <p className="font-medium">node2.aegisum.com</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    Backup
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Add to your wallet configuration:</p>
                  <div className="bg-muted p-2 rounded-md font-mono text-xs overflow-x-auto">
                    addnode=node2.aegisum.com:39940
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Node Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Node Features</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full text-green-600 dark:text-green-400 mr-3">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">High Availability</p>
                      <p className="text-xs text-muted-foreground">Multiple nodes for redundancy</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Globally Distributed</p>
                      <p className="text-xs text-muted-foreground">Optimized for low latency</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full text-purple-600 dark:text-purple-400 mr-3">
                      <Server className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">24/7 Uptime</p>
                      <p className="text-xs text-muted-foreground">Continuous monitoring and maintenance</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col justify-center items-center space-y-3 h-full">
              <Button variant="outline" className="flex items-center w-full md:w-auto" asChild>
                <Link href="https://github.com/Aegisum/aegisum-core/releases" target="_blank" rel="noopener noreferrer">
                  Download Aegisum Core
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="flex items-center w-full md:w-auto" asChild>
                <Link href="/mining.pdf" target="_blank" rel="noopener noreferrer">
                  Mining Guide PDF
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mining Pool */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Official Mining Pool</CardTitle>
          <CardDescription>Mine Aegisum with the official pool</CardDescription>
        </CardHeader>
        <CardContent>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Mining Pool</h3>
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
                    stratum+tcp://stratum.pool.aegisum.com:2922
                  </div>

                  <Button variant="outline" className="flex items-center" asChild>
                    <Link href="https://pool.aegisum.com" target="_blank" rel="noopener noreferrer">
                      Visit Mining Pool
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Network Connections */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Network Connections</CardTitle>
          <CardDescription>Current network connection statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Active Connections</p>
                  <div className="bg-primary/10 p-2 rounded-full text-primary">
                    <Globe className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">{networkStats.connections}</h3>
                  <p className="text-xs text-muted-foreground">Current peer connections</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Protocol Version</p>
                  <div className="bg-primary/10 p-2 rounded-full text-primary">
                    <Server className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">70024</h3>
                  <p className="text-xs text-muted-foreground">Current protocol version</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Peer Information */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Network className="mr-2 h-5 w-5" />
                Connected Peers
              </CardTitle>
              <CardDescription>Information about currently connected peers</CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Updates every 30 minutes</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Connection Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {peerInfo && peerInfo.length > 0 ? (
                  peerInfo.map((peer, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{peer.addr || "Unknown"}</TableCell>
                      <TableCell>{peer.version || "Unknown"}</TableCell>
                      <TableCell>
                        {peer.conntime ? new Date(peer.conntime * 1000).toLocaleString() : "Unknown"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                      No peer information available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
