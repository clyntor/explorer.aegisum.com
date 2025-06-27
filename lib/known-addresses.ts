/**
 * Known Addresses
 *
 * This file contains a mapping of known Aegisum addresses to their labels/tags.
 * Add new addresses here to have them automatically recognized throughout the explorer.
 */

export interface KnownAddress {
  address: string
  tag: string
  description?: string
  url?: string
  type: "dev" | "pool" | "exchange" | "service" | "team" | "other"
}

// List of known addresses
export const knownAddresses: KnownAddress[] = [
  {
    address: "aegs1qn48wlu7zuk8dd3vpvj6tj3gsjnmsnaxcv302hu",
    tag: "Dev Fund",
    description: "Aegisum Development Fund",
    type: "dev",
  },
  {
    address: "aegs1qvvpxjd25vecp69avrr3zt0jf5hukaw97a6xpqq",
    tag: "Hash Hut",
    description: "Mining Pool",
    url: "https://hash-hut.net",
    type: "pool",
  },
  {
    address: "aegs1qhf6a48yhj3alnzrpchcdvf89gerwqkq0re7wwv",
    tag: "Clynt",
    description: "Project Lead",
    url: "https://clyntor.dev",
    type: "team",
  },
  {
    address: "AtvEmmEnmsbTphC6ASaVJyCSu416XzpLmY",
    tag: "Official Pool",
    description: "Mining Pool",
    url: "https://pool.aegisum.com",
    type: "pool",
  },
  {
    address: "aegs1q5wwgnxfxq9d4reeenhw2j4qg3sw8a9kkq0squ9",
    tag: "Zerg Pool",
    description: "Mining Pool",
    url: "https://zergpool.com",
    type: "pool",
  },
  {
    address: "Ay8EwfQ73qgbiPeyEgKBFuUNT5sr6UncsA",
    tag: "Z Pool",
    description: "Mining Pool",
    url: "https://zpool.ca/",
    type: "pool",
  },  
]

// Map for quick lookups
export const knownAddressesMap: Record<string, KnownAddress> = knownAddresses.reduce(
  (acc, addr) => {
    acc[addr.address] = addr
    return acc
  },
  {} as Record<string, KnownAddress>,
)

/**
 * Check if an address is known and return its information
 * @param address The address to check
 * @returns The known address information or null if not found
 */
export function getKnownAddress(address: string): KnownAddress | null {
  return knownAddressesMap[address] || null
}

/**
 * Get the tag for a known address or return null
 * @param address The address to check
 * @returns The tag or null if not a known address
 */
export function getAddressTag(address: string): string | null {
  return knownAddressesMap[address]?.tag || null
}
