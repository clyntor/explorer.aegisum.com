import { type NextRequest, NextResponse } from "next/server"
import { getNetworkStats } from "@/lib/data"
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
        maxSupply: {
          value: maxSupply,
          formatted: maxSupply.toLocaleString(),
        },
        price: {
          value: priceNumber,
          formatted: `$${price}`,
        },
        marketCap: {
          value: marketCap,
          formatted: `$${marketCap.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
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
        maxSupply: { value: 100000000, formatted: "100,000,000" },
        price: { value: 0, formatted: "$0.00000000" },
        marketCap: { value: 0, formatted: "$0.00" },
        supplyPercentage: { value: 0, formatted: "0.00%" },
        timestamp: new Date().toISOString(),
        network: "Aegisum",
        symbol: "AEGS",
      },
      { status: 500 },
    )
  }
}
