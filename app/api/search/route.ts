import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import axios from "axios"

// RPC configuration
const RPC_HOST = process.env.RPC_HOST || "localhost"
const RPC_PORT = process.env.RPC_PORT || 39940
const RPC_USER = process.env.RPC_USER || "rpcuser"
const RPC_PASS = process.env.RPC_PASS || "rpcpassword"
const RPC_URL = `http://${RPC_USER}:${RPC_PASS}@${RPC_HOST}:${RPC_PORT}`

// Helper function to make RPC calls
async function rpcCall(method, params = []) {
  try {
    const response = await axios.post(RPC_URL, {
      jsonrpc: "1.0",
      id: Date.now(),
      method,
      params,
    })

    if (response.data.error) {
      throw new Error(`RPC Error: ${JSON.stringify(response.data.error)}`)
    }

    return response.data.result
  } catch (error) {
    console.error(`RPC call failed (${method}):`, error.message)
    throw error
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 })
  }

  try {
    const { db } = await connectToDatabase()

    // Check if query is a transaction ID in the mempool
    const mempoolTx = await db.collection("mempool").findOne({ txid: query })
    if (mempoolTx) {
      return NextResponse.json({ type: "transaction", id: query })
    }

    // If not found in database mempool, try RPC mempool
    try {
      const mempoolInfo = await rpcCall("getmempoolentry", [query])
      if (mempoolInfo) {
        return NextResponse.json({ type: "transaction", id: query })
      }
    } catch (error) {
      // Not in RPC mempool, continue with other checks
    }

    // Check if query is a transaction ID in confirmed transactions
    const transaction = await db.collection("txes").findOne({ txid: query })
    if (transaction) {
      return NextResponse.json({ type: "transaction", id: query })
    }

    // Check if query is an address
    const address = await db.collection("addresses").findOne({ a_id: query })
    if (address) {
      return NextResponse.json({ type: "address", id: query })
    }

    // Check if query is a block hash
    const blockByHash = await db.collection("blocks").findOne({ hash: query })
    if (blockByHash) {
      return NextResponse.json({ type: "block", id: query })
    }

    // Check if query is a block hash in transactions
    const txWithBlockHash = await db.collection("txes").findOne({ blockhash: query })
    if (txWithBlockHash) {
      return NextResponse.json({ type: "block", id: query })
    }

    // Check if query is a block height (number)
    if (/^\d+$/.test(query)) {
      const blockHeight = Number.parseInt(query)

      // First try to find the block directly by height
      const blockByHeight = await db.collection("blocks").findOne({ height: blockHeight })
      if (blockByHeight) {
        return NextResponse.json({ type: "block", id: blockByHeight.hash })
      }

      // If not found in blocks collection, try to find in transactions
      const txWithBlockHeight = await db.collection("txes").findOne({ blockindex: blockHeight })
      if (txWithBlockHeight) {
        return NextResponse.json({ type: "block", id: txWithBlockHeight.blockhash })
      }

      // If still not found, try RPC
      try {
        const blockHash = await rpcCall("getblockhash", [blockHeight])
        if (blockHash) {
          return NextResponse.json({ type: "block", id: blockHash })
        }
      } catch (error) {
        // Block not found in RPC, continue with other checks
      }
    }

    return NextResponse.json({ type: "notfound" }, { status: 404 })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "An error occurred during search" }, { status: 500 })
  }
}
