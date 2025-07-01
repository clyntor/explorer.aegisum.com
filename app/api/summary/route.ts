import { type NextRequest, NextResponse } from "next/server"
import { getNetworkStats, rpcCall } from "@/lib/data"
import { getAegsPrice } from "@/lib/price"
import { rateLimit } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  try {
    // Get client IP
    const ip = request.ip || request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Apply rate limiting (30 requests per minute for summary since it's more expensive)
    if (!rateLimit(ip, 30, 60000)) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
          },
        },
      )
    }

    const [networkStats, price] = await Promise.all([getNetworkStats(), getAegsPrice()])

    const priceNumber = Number.parseFloat(price)
    const maxSupply = 100000000 // 100 million AEGS
    const marketCap = networkStats.supply * priceNumber
    const networkHashRate = await rpcCall("getnetworkhashps", [120, -1])
    
    return NextResponse.json(
      {
        blockHeight: {
          value: networkStats.count,
          formatted: networkStats.count.toLocaleString(),
        },
        currentSupply: {
          value: networkStats.supply,
          formatted: networkStats.supply.toLocaleString(),
        },
        difficulty: {
          value: networkStats.difficulty_pow,
          formatted: Number(networkStats.difficulty_pow).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })
        },
        marketCap: {
          value: marketCap,
          formatted: `$${marketCap.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
        },
        maxSupply: {
          value: maxSupply,
          formatted: maxSupply.toLocaleString(),
        },
        networkHashRate: {
          value: networkHashRate,
          formatted: `${Number(networkHashRate / 1000000000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })} GH/s`
        },
        peers: {
          value: networkStats.connections,
          formatted: networkStats.connections.toLocaleString()
        },
        price: {
          value: priceNumber,
          formatted: `$${price}`,
        },
        supplyPercentage: {
          value: (networkStats.supply / maxSupply) * 100,
          formatted: `${((networkStats.supply / maxSupply) * 100).toFixed(2)}%`,
        },
        timestamp: new Date().toISOString(),
        network: "Aegisum",
        symbol: "AEGS",
      },
      {
        headers: {
          "Cache-Control": "public, max-age=30",
        },
      },
    )
  } catch (error) {
    console.error("Error in summary API route:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch summary data",
        blockHeight: { value: 0, formatted: "0" },
        currentSupply: { value: 0, formatted: "0" },
        difficulty: { value: 0.0000, formatted: "0.0000" },
        marketCap: { value: 0, formatted: "$0.00" },
        maxSupply: { value: 100000000, formatted: "100,000,000" },
        networkHashRate: { value: 0.0000, formatted: "0.0000 GH/s" },
        peers: { value: 0, formatted: "0" },
        price: { value: 0, formatted: "$0.00000000" },
        supplyPercentage: { value: 0, formatted: "0.00%" },
        timestamp: new Date().toISOString(),
        network: "Aegisum",
        symbol: "AEGS",
      },
      { status: 500 },
    )
  }
}
