// This file is no longer needed as we're using the direct approach
// You can keep it as a fallback if needed
import { NextResponse } from "next/server"
import { getAegsPrice } from "@/lib/price"

export async function GET() {
  try {
    const price = await getAegsPrice()

    return NextResponse.json({
      success: true,
      price,
      cached: false,
    })
  } catch (error) {
    console.error("Error in price API route:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch price data",
        price: "0.00000000", // Provide a default price
      },
      { status: 200 },
    ) // Return 200 even on error to prevent client-side exceptions
  }
}
