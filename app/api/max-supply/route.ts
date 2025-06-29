import { type NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  try {
    // Get client IP
    const ip = request.ip || request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Apply rate limiting (60 requests per minute)
    if (!rateLimit(ip, 60, 60000)) {
      return new NextResponse("Rate limit exceeded", {
        status: 429,
        headers: {
          "Content-Type": "text/plain",
          "Retry-After": "60",
        },
      })
    }

    // Max supply is always 100 million AEGS
    const maxSupply = 100000000

    return new NextResponse(maxSupply.toString(), {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour since this never changes
      },
    })
  } catch (error) {
    console.error("Error in max-supply API route:", error)

    return new NextResponse("100000000", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }
}
