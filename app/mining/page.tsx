export const dynamic = "force-dynamic"

import Link from "next/link"
import { formatNumber } from "@/lib/utils"
import { getMiningStats, getDifficultyHistory } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart2, Pickaxe, Timer, TrendingUp, Gift, HelpCircle, Info } from "lucide-react"
import { DifficultyChart } from "@/components/difficulty-chart"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default async function MiningPage() {
  // Add error handling for data fetching
  let miningStats
  let difficultyHistory

  try {
    // Fetch 100 blocks of difficulty history instead of 50
    ;[miningStats, difficultyHistory] = await Promise.all([getMiningStats(), getDifficultyHistory(100)])
  } catch (error) {
    console.error("Error fetching mining data:", error)
    // Provide fallback data
    miningStats = {
      blocks: 0,
      difficulty: 0,
      networkhashps: 0,
      currentReward: 500,
      nextHalvingHeight: 100000,
      blocksUntilHalving: 100000,
      daysUntilHalving: 0,
      halvingSchedule: [],
      maxSupply: 100000000,
      currentSupply: 0,
      blockTime: 180,
      retargetInterval: 3,
      specialBlocks: [
        { height: 1, reward: 1000000, description: "Relaunch distribution" },
        { height: 2, reward: 1000000, description: "Relaunch distribution" },
        { height: 3, reward: 600000, description: "Relaunch distribution" },
      ],
    }
    difficultyHistory = []
  }

  // Calculate percentage of max supply mined
  const percentMined = (miningStats.currentSupply / miningStats.maxSupply) * 100

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mining Statistics</h1>
        <p className="text-muted-foreground">Aegisum network mining information and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Current Block</p>
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <Pickaxe className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{formatNumber(miningStats.blocks)}</h3>
              <p className="text-xs text-muted-foreground">Current block height</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Block Reward</p>
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <BarChart2 className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{miningStats.currentReward} AEGS</h3>
              <p className="text-xs text-muted-foreground">Current mining reward</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Network Hashrate</p>
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{Number(miningStats.networkhashps?.toFixed(4)) || "0.0000"} GH/s</h3>
              <p className="text-xs text-muted-foreground">Estimated network hashrate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200">Halving Countdown</p>
              <div className="bg-amber-200 dark:bg-amber-800 p-2 rounded-full text-amber-800 dark:text-amber-200">
                <Timer className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                {formatNumber(miningStats.blocksUntilHalving)} blocks
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                ~{Math.round(miningStats.daysUntilHalving)} days until reward halving
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Chart - Full Width */}
      <div className="mb-8">
        <DifficultyChart data={difficultyHistory} />
      </div>

      {/* Network Statistics Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Network Statistics</CardTitle>
          <CardDescription>Current Aegisum network performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Difficulty</h3>
              <p className="text-xl font-semibold">{Number(miningStats.difficulty)?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 }) || "0.0000"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Algorithm</h3>
              <p className="text-xl font-semibold">Scrypt (PoW)</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Block Time</h3>
              <p className="text-xl font-semibold">~3 minutes</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Difficulty Adjustment</h3>
              <p className="text-xl font-semibold">Every 3 blocks</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Max Supply</h3>
              <p className="text-xl font-semibold">{formatNumber(miningStats.maxSupply)} AEGS</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Supply</h3>
              <p className="text-xl font-semibold">{formatNumber(miningStats.currentSupply)} AEGS</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Block Reward Schedule - Now full width */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Block Reward Schedule</CardTitle>
          <CardDescription>Aegisum halving schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Halving</TableHead>
                  <TableHead>Block Height</TableHead>
                  <TableHead>Est. Date</TableHead>
                  <TableHead>Block Reward</TableHead>
                  <TableHead>Total Supply</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {miningStats.halvingSchedule &&
                  miningStats.halvingSchedule.slice(0, 15).map((halving) => (
                    <TableRow key={halving.halving}>
                      <TableCell className="font-medium">{halving.halving}</TableCell>
                      <TableCell>{formatNumber(halving.height)}</TableCell>
                      <TableCell>{halving.date}</TableCell>
                      <TableCell>
                        {typeof halving.reward === "number" && halving.reward < 0.01
                          ? halving.reward.toFixed(8)
                          : halving.reward}{" "}
                        AEGS
                      </TableCell>
                      <TableCell>{formatNumber(halving.supply)} AEGS</TableCell>
                    </TableRow>
                  ))}
                {(!miningStats.halvingSchedule || miningStats.halvingSchedule.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No halving schedule data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Supply Information and Special Block Rewards side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Supply Information</CardTitle>
            <CardDescription>Aegisum coin supply statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Current Supply</span>
                  <span className="text-sm">{formatNumber(miningStats.currentSupply)} AEGS</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${percentMined}%` }}></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{percentMined.toFixed(2)}%</span>
                  <span>Max Supply: {formatNumber(miningStats.maxSupply)} AEGS</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Initial Block Reward</h4>
                  <p className="text-lg font-semibold">500 AEGS</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Halving Interval</h4>
                  <p className="text-lg font-semibold">100,000 blocks</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="mr-2 h-5 w-5 text-amber-500" />
              Special Block Rewards
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Aegisum was relaunched and coins were redistributed to all previous holders via these special
                      blocks
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>Aegisum relaunch distribution blocks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-md p-4 mb-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">About the Relaunch</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    In March 2025, Aegisum underwent a chain relaunch due to chain synchronization issues with the
                    original blockchain. A total of 2.6 million AEGS were remade and redistributed to all original coin
                    holders based on their previous balances. These special blocks (1-3) were used to facilitate this
                    fair redistribution, ensuring all holders received their coins back after the relaunch.
                  </p>
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Block Height</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {miningStats.specialBlocks &&
                  miningStats.specialBlocks.map((block, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {block.hash ? (
                          <Link href={`/block/${block.hash}`} className="text-primary hover:underline">
                            {block.height}
                          </Link>
                        ) : (
                          block.height
                        )}
                      </TableCell>
                      <TableCell>{formatNumber(block.reward)} AEGS</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {block.description}
                          {index === 0 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>First part of redistribution to original holders</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {index === 1 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Second part of redistribution to original holders</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {index === 2 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Final part of redistribution to original holders</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
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
