/**
 * Aegisum Blockchain Sync Script
 *
 * This script connects to the Aegisum daemon via RPC and syncs blockchain data to MongoDB.
 * It should be run as a background process to keep the explorer database up-to-date.
 */

const { MongoClient } = require("mongodb")
const axios = require("axios")
const crypto = require("crypto")

// Configuration
const RPC_HOST = process.env.RPC_HOST || "localhost"
const RPC_PORT = process.env.RPC_PORT || 39940
const RPC_USER = process.env.RPC_USER || "rpcuser"
const RPC_PASS = process.env.RPC_PASS || "rpcpassword"
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/explorerdb"
const MONGODB_DB = process.env.MONGODB_DB || "explorerdb"
const SYNC_INTERVAL = process.env.SYNC_INTERVAL || 60000 // 1 minute
const MEMPOOL_SYNC_INTERVAL = 30000 // 30 seconds

// RPC client setup
const rpcUrl = `http://${RPC_USER}:${RPC_PASS}@${RPC_HOST}:${RPC_PORT}`

// MongoDB setup
let db
let client

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    db = client.db(MONGODB_DB)
    console.log("Connected to MongoDB")

    // Create indexes for better performance
    await createIndexes()
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

// Create necessary indexes
async function createIndexes() {
  try {
    // Addresses collection
    await db.collection("addresses").createIndex({ a_id: 1 }, { unique: true })
    await db.collection("addresses").createIndex({ balance: -1 })

    // Transactions collection
    await db.collection("txes").createIndex({ txid: 1 }, { unique: true })
    await db.collection("txes").createIndex({ blockhash: 1 })
    await db.collection("txes").createIndex({ blockindex: 1 })
    await db.collection("txes").createIndex({ timestamp: -1 })

    // Address-transaction links
    await db.collection("addresstxes").createIndex({ a_id: 1, txid: 1 }, { unique: true })
    await db.collection("addresstxes").createIndex({ a_id: 1 })
    await db.collection("addresstxes").createIndex({ txid: 1 })
    await db.collection("addresstxes").createIndex({ blockindex: -1 })

    // Network history
    await db.collection("networkhistories").createIndex({ blockindex: 1 }, { unique: true })
    await db.collection("networkhistories").createIndex({ timestamp: -1 })

    // Mempool
    await db.collection("mempool").createIndex({ txid: 1 }, { unique: true })
    await db.collection("mempool").createIndex({ time: -1 })

    // Create a blocks collection for easier searching
    await db.collection("blocks").createIndex({ hash: 1 }, { unique: true })
    await db.collection("blocks").createIndex({ height: 1 }, { unique: true })

    console.log("Indexes created")
  } catch (error) {
    console.error("Error creating indexes:", error)
  }
}

// Make RPC call to Aegisum daemon
async function rpcCall(method, params = []) {
  try {
    const response = await axios.post(rpcUrl, {
      jsonrpc: "1.0",
      id: crypto.randomBytes(16).toString("hex"),
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

// Get blockchain info
async function getBlockchainInfo() {
  return rpcCall("getblockchaininfo")
}

// Get network info
async function getNetworkInfo() {
  return rpcCall("getnetworkinfo")
}

// Get block hash at height
async function getBlockHash(height) {
  return rpcCall("getblockhash", [height])
}

// Get block by hash
async function getBlock(hash) {
  return rpcCall("getblock", [hash, 2]) // Verbosity 2 includes transaction details
}

// Get transaction by ID
async function getTransaction(txid) {
  return rpcCall("getrawtransaction", [txid, 1]) // Verbose output
}

// Get mempool info
async function getMempoolInfo() {
  return rpcCall("getmempoolinfo")
}

// Get raw mempool
async function getRawMempool(verbose = true) {
  return rpcCall("getrawmempool", [verbose])
}

// Get mining info
async function getMiningInfo() {
  return rpcCall("getmininginfo")
}

// Get network hashrate
async function getNetworkHashPS(blocks = 120, height = -1) {
  return rpcCall("getnetworkhashps", [blocks, height])
}

// Calculate the total coin supply based on blockchain data
async function calculateTotalSupply(blockHeight) {
  try {
    // Aegisum parameters
    const initialReward = 500 // Regular block reward
    const halvingInterval = 100000 // Blocks between halvings

    // Special block rewards
    let specialBlocksSupply = 0
    if (blockHeight >= 1) specialBlocksSupply += 1000000 // Block 1: 1 million AEGS
    if (blockHeight >= 2) specialBlocksSupply += 1000000 // Block 2: 1 million AEGS
    if (blockHeight >= 3) specialBlocksSupply += 600000 // Block 3: 600,000 AEGS

    // Calculate regular blocks supply (starting from block 4)
    let regularBlocksSupply = 0
    if (blockHeight >= 4) {
      const regularBlocks = blockHeight - 3 // Exclude special blocks

      // Calculate supply with halvings
      let remainingBlocks = regularBlocks
      let currentReward = initialReward
      let currentHalvingBlock = 0

      while (remainingBlocks > 0) {
        const blocksUntilNextHalving = Math.min(
          remainingBlocks,
          halvingInterval - (currentHalvingBlock % halvingInterval),
        )

        regularBlocksSupply += blocksUntilNextHalving * currentReward

        remainingBlocks -= blocksUntilNextHalving
        currentHalvingBlock += blocksUntilNextHalving

        if (currentHalvingBlock % halvingInterval === 0 && remainingBlocks > 0) {
          currentReward /= 2
        }
      }
    }

    // Total supply is the sum of special blocks and regular blocks
    const totalSupply = specialBlocksSupply + regularBlocksSupply

    console.log(`Calculated supply at block ${blockHeight}: ${totalSupply} AEGS`)
    return totalSupply
  } catch (error) {
    console.error("Error calculating total supply:", error)
    return 12000000 // Fallback to 12 million if calculation fails
  }
}

// Count total transactions in the blockchain
async function countTotalTransactions() {
  try {
    const txCount = await db.collection("txes").countDocuments()
    return txCount
  } catch (error) {
    console.error("Error counting transactions:", error)
    return 0
  }
}

// Process a transaction
async function processTransaction(tx, blockHeight, blockHash, blockTime) {
  try {
    // Skip if transaction already exists
    const existingTx = await db.collection("txes").findOne({ txid: tx.txid })
    if (existingTx) return

    // Prepare transaction document
    const txDoc = {
      txid: tx.txid,
      blockhash: blockHash,
      blockindex: blockHeight,
      timestamp: blockTime,
      vin: [],
      vout: [],
      total: 0,
      tx_type: null,
      op_return: null,
      algo: "scrypt", // Aegisum uses scrypt
    }

    // Process inputs
    for (const input of tx.vin) {
      if (input.coinbase) {
        // Coinbase transaction (block reward)
        const coinbaseOutput = tx.vout[0]
        const amount = Math.round(coinbaseOutput.value * 100000000) // Convert to satoshis

        txDoc.vin.push({
          addresses: "coinbase",
          amount: amount,
        })

        // Update coinbase address
        await updateAddress("coinbase", 0, amount)
      } else {
        // Regular transaction input
        try {
          const inputTx = await getTransaction(input.txid)
          const prevOutput = inputTx.vout[input.vout]
          const addresses = prevOutput.scriptPubKey.addresses || []
          const amount = Math.round(prevOutput.value * 100000000) // Convert to satoshis

          if (addresses.length > 0) {
            txDoc.vin.push({
              addresses: addresses[0],
              amount: amount,
            })

            // Update sender address
            await updateAddress(addresses[0], 0, amount)

            // Create address-transaction link
            await createAddressTx(addresses[0], tx.txid, -amount, blockHeight)
          }
        } catch (error) {
          console.error(`Error processing input ${input.txid}:${input.vout}:`, error.message)
        }
      }
    }

    // Process outputs
    for (const output of tx.vout) {
      const addresses = output.scriptPubKey.addresses || []
      const amount = Math.round(output.value * 100000000) // Convert to satoshis

      // Check for OP_RETURN
      if (output.scriptPubKey.type === "nulldata") {
        txDoc.op_return = output.scriptPubKey.asm
      }

      if (addresses.length > 0) {
        txDoc.vout.push({
          addresses: addresses[0],
          amount: amount,
        })

        txDoc.total += amount

        // Update recipient address
        await updateAddress(addresses[0], amount, 0)

        // Create address-transaction link
        await createAddressTx(addresses[0], tx.txid, amount, blockHeight)
      }
    }

    // Save transaction
    await db.collection("txes").insertOne(txDoc)

    // Remove from mempool if it was there
    await db.collection("mempool").deleteOne({ txid: tx.txid })
  } catch (error) {
    console.error(`Error processing transaction ${tx.txid}:`, error.message)
  }
}

// Update address balances
async function updateAddress(address, received, sent) {
  try {
    // Get or create address
    const existingAddress = await db.collection("addresses").findOne({ a_id: address })

    if (existingAddress) {
      // Update existing address
      await db.collection("addresses").updateOne(
        { a_id: address },
        {
          $inc: {
            balance: received - sent,
            received: received,
            sent: sent,
          },
        },
      )
    } else {
      // Create new address
      await db.collection("addresses").insertOne({
        a_id: address,
        balance: received - sent,
        received: received,
        sent: sent,
        __v: 0,
      })
    }
  } catch (error) {
    console.error(`Error updating address ${address}:`, error.message)
  }
}

// Create address-transaction link
async function createAddressTx(address, txid, amount, blockHeight) {
  try {
    // Check if link already exists
    const existingLink = await db.collection("addresstxes").findOne({ a_id: address, txid: txid })

    if (!existingLink) {
      await db.collection("addresstxes").insertOne({
        a_id: address,
        txid: txid,
        amount: amount,
        blockindex: blockHeight,
        __v: 0,
      })
    }
  } catch (error) {
    console.error(`Error creating address-tx link ${address}:${txid}:`, error.message)
  }
}

// Update network statistics
async function updateNetworkStats(blockHeight) {
  try {
    // Get blockchain and network info
    const [blockchainInfo, networkInfo, miningInfo, networkHashPS] = await Promise.all([
      getBlockchainInfo(),
      getNetworkInfo(),
      getMiningInfo(),
      getNetworkHashPS(),
    ])

    // Get latest block for timestamp
    const latestBlockHash = await getBlockHash(blockHeight)
    const latestBlock = await getBlock(latestBlockHash)

    // Calculate the current supply based on blockchain data
    const currentSupply = await calculateTotalSupply(blockHeight)

    // Count total transactions
    const txCount = await db.collection("txes").countDocuments()

    // Update coin stats
    await db.collection("coinstats").updateOne(
      { coin: "Aegisum" },
      {
        $set: {
          count: blockHeight,
          last: blockHeight,
          supply: currentSupply,
          txes: txCount, // Use actual transaction count
          connections: networkInfo.connections,
          blockchain_last_updated: Math.floor(Date.now() / 1000),
          orphan_index: blockHeight - 1,
          orphan_current: 0,
        },
      },
      { upsert: true },
    )

    // Update network history
    const difficulty = miningInfo.difficulty
    const nethash = networkHashPS / 1000000 // Convert to MH/s

    await db.collection("networkhistories").updateOne(
      { blockindex: blockHeight },
      {
        $set: {
          nethash: nethash,
          difficulty_pow: difficulty,
          difficulty_pos: 0, // Aegisum is PoW only
          timestamp: latestBlock.time,
          __v: 0,
        },
      },
      { upsert: true },
    )

    // Update rich list
    await db.collection("richlists").updateOne(
      { coin: "Aegisum" },
      {
        $set: {
          richlist_last_updated: Math.floor(Date.now() / 1000),
        },
      },
      { upsert: true },
    )

    // Add block to blocks collection for easier searching
    await db.collection("blocks").updateOne(
      { hash: latestBlockHash },
      {
        $set: {
          hash: latestBlockHash,
          height: blockHeight,
          timestamp: latestBlock.time,
          txCount: latestBlock.tx.length,
          difficulty: difficulty,
          size: latestBlock.size,
          nonce: latestBlock.nonce,
          merkleroot: latestBlock.merkleroot,
          previousblockhash: latestBlock.previousblockhash,
        },
      },
      { upsert: true },
    )
  } catch (error) {
    console.error(`Error updating network stats:`, error.message)
  }
}

// Process a block
async function processBlock(height) {
  try {
    console.log(`Processing block ${height}`)

    // Get block hash
    const blockHash = await getBlockHash(height)

    // Get block details
    const block = await getBlock(blockHash)

    // Process each transaction
    for (const tx of block.tx) {
      await processTransaction(tx, height, blockHash, block.time)
    }

    // Update network statistics
    await updateNetworkStats(height)

    return true
  } catch (error) {
    console.error(`Error processing block ${height}:`, error.message)
    return false
  }
}

// Sync mempool transactions
async function syncMempool() {
  try {
    console.log("Syncing mempool...")

    // Get mempool info and transactions
    const [mempoolInfo, rawMempool] = await Promise.all([getMempoolInfo(), getRawMempool(true)])

    // Update mempool stats
    await db.collection("mempoolstats").updateOne(
      {},
      {
        $set: {
          size: mempoolInfo.size,
          bytes: mempoolInfo.bytes,
          usage: mempoolInfo.usage,
          last_updated: Math.floor(Date.now() / 1000),
        },
      },
      { upsert: true },
    )

    // Clear existing mempool transactions
    await db.collection("mempool").deleteMany({})

    // Add current mempool transactions
    const mempoolTxs = []
    for (const [txid, txInfo] of Object.entries(rawMempool)) {
      mempoolTxs.push({
        txid: txid,
        size: txInfo.size,
        time: txInfo.time,
        height: txInfo.height,
      })
    }

    if (mempoolTxs.length > 0) {
      await db.collection("mempool").insertMany(mempoolTxs)
    }

    console.log(`Mempool sync completed. ${mempoolTxs.length} transactions in mempool.`)
  } catch (error) {
    console.error("Mempool sync error:", error.message)
  }
}

// Initialize database
async function initializeDatabase() {
  try {
    // Check if coinstats exists
    const coinStats = await db.collection("coinstats").findOne({ coin: "Aegisum" })

    if (!coinStats) {
      // Create initial coin stats
      await db.collection("coinstats").insertOne({
        coin: "Aegisum",
        count: 0,
        last: 0,
        supply: 0,
        txes: 0,
        connections: 0,
        last_price: 0,
        last_usd_price: 0,
        blockchain_last_updated: Math.floor(Date.now() / 1000),
        reward_last_updated: 0,
        masternodes_last_updated: 0,
        network_last_updated: Math.floor(Date.now() / 1000),
        richlist_last_updated: Math.floor(Date.now() / 1000),
        markets_last_updated: 0,
        orphan_index: 0,
        orphan_current: 0,
        newer_claim_address: true,
        __v: 0,
      })

      console.log("Initialized coin stats")
    }

    // Create rich list document if it doesn't exist
    const richList = await db.collection("richlists").findOne({ coin: "Aegisum" })

    if (!richList) {
      await db.collection("richlists").insertOne({
        coin: "Aegisum",
        received: [],
        balance: [],
      })

      console.log("Initialized rich list")
    }

    // Create mempool stats if it doesn't exist
    const mempoolStats = await db.collection("mempoolstats").findOne({})

    if (!mempoolStats) {
      await db.collection("mempoolstats").insertOne({
        size: 0,
        bytes: 0,
        usage: 0,
        last_updated: Math.floor(Date.now() / 1000),
      })

      console.log("Initialized mempool stats")
    }
  } catch (error) {
    console.error("Error initializing database:", error.message)
  }
}

// Main sync function
async function syncBlockchain() {
  try {
    // Get current blockchain height from RPC
    const blockchainInfo = await getBlockchainInfo()
    const currentHeight = blockchainInfo.blocks

    // Get last synced height from database
    const coinStats = await db.collection("coinstats").findOne({ coin: "Aegisum" })
    const lastSyncedHeight = coinStats ? coinStats.count : 0

    console.log(`Current blockchain height: ${currentHeight}, Last synced height: ${lastSyncedHeight}`)

    // Sync new blocks
    for (let height = lastSyncedHeight + 1; height <= currentHeight; height++) {
      const success = await processBlock(height)

      if (!success) {
        console.error(`Failed to process block ${height}, stopping sync`)
        break
      }
    }

    console.log("Blockchain sync completed")
  } catch (error) {
    console.error("Sync error:", error.message)
  }
}

// Main function
async function main() {
  try {
    // Connect to MongoDB
    await connectToMongoDB()

    // Initialize database
    await initializeDatabase()

    // Initial sync
    await syncBlockchain()
    await syncMempool()

    // Set up periodic sync
    setInterval(syncBlockchain, SYNC_INTERVAL)
    setInterval(syncMempool, MEMPOOL_SYNC_INTERVAL)

    console.log(
      `Sync service started, blockchain sync every ${SYNC_INTERVAL / 1000} seconds, mempool sync every ${MEMPOOL_SYNC_INTERVAL / 1000} seconds`,
    )
  } catch (error) {
    console.error("Fatal error:", error)
    process.exit(1)
  }
}

// Start the sync process
main()
