export const dynamic = "force-dynamic"

import Link from "next/link"
import { getNetworkStats } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Globe, Server, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function NetworkPage() {
  // Add error handling for data fetching
  let networkStats

  try {
    networkStats = await getNetworkStats()
  } catch (error) {
    console.error("Error fetching network data:", error)
    // Provide fallback data
    networkStats = {
      count: 0,
      connections: 0,
      last_updated: Math.floor(Date.now() / 1000),
    }
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Network Information</h1>
        <p className="text-muted-foreground">Aegisum network nodes and connection information</p>
      </div>

      {/* Official Node Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Official Aegisum Node</CardTitle>
          <CardDescription>Connect to the official Aegisum network node</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Node Address</h3>
              <div className="flex items-center space-x-2">
                <Server className="h-5 w-5 text-primary" />
                <p className="text-lg font-semibold">node.aegisum.com</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Port: 39940</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Connection Information</h3>
              <p className="text-sm mb-2">Add this node to your Aegisum wallet configuration file:</p>
              <div className="bg-muted p-3 rounded-md font-mono text-xs overflow-x-auto">
                addnode=node.aegisum.com:39940
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Node Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span>High Availability</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-green-500" />
                  <span>Globally Distributed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Server className="h-4 w-4 text-green-500" />
                  <span>24/7 Uptime</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 mt-4">
              <Button variant="outline" className="flex items-center" asChild>
                <Link href="https://github.com/Aegisum/aegisum-core/releases" target="_blank" rel="noopener noreferrer">
                  Download Aegisum Core
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
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
    </main>
  )
}
