import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Code, AlertTriangle, ExternalLink } from "lucide-react"

export default function APIPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Code className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-bold">Aegisum API</h1>
          </div>
          <p className="text-xl text-muted-foreground">Simple API endpoints for Aegisum blockchain data</p>
        </div>

        {/* Important Notice */}
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="h-5 w-5" />
              Please Be Respectful
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700 dark:text-amber-300">
            <p>
              Our API is free to use, but please don't spam it with excessive requests. We have rate limits in place to
              keep the service running smoothly for everyone.
            </p>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Available Endpoints</h2>

          <div className="grid gap-4">
            {/* Current Supply */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Current Supply</CardTitle>
                <CardDescription>Get the current circulating supply of AEGS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Plain Text</Badge>
                  <a
                    href="https://explorer.aegisum.com/api/supply"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-mono text-sm flex items-center gap-1"
                  >
                    /api/supply
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Example Output:</p>
                  <code className="block bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm">19804000</code>
                </div>
              </CardContent>
            </Card>

            {/* Max Supply */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Maximum Supply</CardTitle>
                <CardDescription>Get the maximum possible supply of AEGS (100M)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Plain Text</Badge>
                  <a
                    href="https://explorer.aegisum.com/api/max-supply"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-mono text-sm flex items-center gap-1"
                  >
                    /api/max-supply
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Example Output:</p>
                  <code className="block bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm">100000000</code>
                </div>
              </CardContent>
            </Card>

            {/* Price */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Current Price</CardTitle>
                <CardDescription>Get the current AEGS price in USD</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Plain Text</Badge>
                  <a
                    href="https://explorer.aegisum.com/api/price"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-mono text-sm flex items-center gap-1"
                  >
                    /api/price
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Example Output:</p>
                  <code className="block bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm">0.00077000</code>
                </div>
              </CardContent>
            </Card>

            {/* Market Cap */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Market Cap</CardTitle>
                <CardDescription>Get the current market capitalization in USD</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Plain Text</Badge>
                  <a
                    href="https://explorer.aegisum.com/api/market-cap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-mono text-sm flex items-center gap-1"
                  >
                    /api/market-cap
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Example Output:</p>
                  <code className="block bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm">15249.08</code>
                </div>
              </CardContent>
            </Card>

            {/* Block Height */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Block Height</CardTitle>
                <CardDescription>Get the current blockchain height</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Plain Text</Badge>
                  <a
                    href="https://explorer.aegisum.com/api/block-height"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-mono text-sm flex items-center gap-1"
                  >
                    /api/block-height
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Example Output:</p>
                  <code className="block bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm">34411</code>
                </div>
              </CardContent>
            </Card>

            {/* Difficulty */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Difficulty</CardTitle>
                <CardDescription>Get the current difficulty</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Plain Text</Badge>
                  <a
                    href="https://explorer.aegisum.com/api/difficulty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-mono text-sm flex items-center gap-1"
                  >
                    /api/difficulty
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Example Output:</p>
                  <code className="block bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm">20574.6753725802</code>
                </div>
              </CardContent>
            </Card>

            {/* Network Hashrate */}       
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Network Hashrate</CardTitle>
                <CardDescription>Get the current network hashrate (hash/s)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Plain Text</Badge>
                  <a
                    href="https://explorer.aegisum.com/api/network-hashrate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-mono text-sm flex items-center gap-1"
                  >
                    /api/network-hashrate
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Example Output:</p>
                  <code className="block bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm">473377087815.4365</code>
                </div>
              </CardContent>
            </Card>

            {/* Peers */}       
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Peers</CardTitle>
                <CardDescription>Get the number of connections the block explorer has to other nodes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Plain Text</Badge>
                  <a
                    href="https://explorer.aegisum.com/api/peers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-mono text-sm flex items-center gap-1"
                  >
                    /api/peers
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Example Output:</p>
                  <code className="block bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm">22</code>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Summary Endpoint */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-800 dark:text-blue-200">Complete Summary</CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Get all blockchain data in one JSON response with formatted values
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">JSON</Badge>
                <a
                  href="https://explorer.aegisum.com/api/summary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-mono text-sm flex items-center gap-1"
                >
                  /api/summary
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Example Output:</p>
                <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-xs overflow-x-auto">
                  {`{
  "blockHeight": { "value": 34411, "formatted": "34,411" },
  "currentSupply": { "value": 19804000, "formatted": "19,804,000" },
  "difficulty": { "value": 20574.6753725802, "formatted": "20,574.6753" },
  "marketCap": { "value": 15249.08, "formatted": "$15,249.08" },
  "maxSupply": { "value": 100000000, "formatted": "100,000,000" },
  "price": { "value": 0.00077000, "formatted": "$0.00077" },
  "networkHashRate": { "value": 473377087815.4365, "formatted": "473.3771 GH/s" },
  "peers": { "value": 22, "formatted": "22" },
  "supplyPercentage": { "value": 19.804, "formatted": "19.80%" },
  "timestamp": "2025-06-29T18:28:36.792Z",
  "network": "Aegisum",
  "symbol": "AEGS"
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Simple Usage */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
            <CardDescription>Simple examples for getting started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Get current price:</p>
              <code className="block bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm break-all">
                curl https://explorer.aegisum.com/api/price
              </code>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Get all data as JSON:</p>
              <code className="block bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm break-all">
                curl https://explorer.aegisum.com/api/summary
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
