/**
 * Base Denim 200ms Native Blocks RPC & Protocol Specifications
 *
 * Compliant with Base official documentation:
 * "Migrate From Flashblocks" (https://docs.base.org/upgrades/denim/200ms-blocks.md)
 *
 * Summary of Changes:
 * 1. Denim replaces Flashblocks with canonical 200ms blocks.
 * 2. Flashblocks subscriptions ("newFlashblocks", "pendingLogs") and "pending"
 *    block tags are deprecated and unavailable after Denim.
 * 3. All real-time streams use canonical "newHeads" and "logs".
 * 4. All state reads (eth_call, eth_getBalance, eth_getTransactionCount, eth_estimateGas)
 *    strictly query "latest" canonical state.
 * 5. Historical block assumptions adjusted for 200ms (5 blocks/sec).
 */

export const DEFAULT_DENIM_CHAIN_ID = 8453; // Base Mainnet
export const DEFAULT_DENIM_NETWORK = "Base Mainnet";

export const DENIM_SPECS = {
  blockTimeMs: 200,
  blocksPerSecond: 5,
  defaultChainId: 8453, // Base Mainnet
  denimUpgrade: {
    baseMainnetStatus: "Active 200ms canonical blocks (November 2026)",
    baseSepoliaActivated: "October 21, 2026 18:00 UTC",
    vibenetStatus: "Active developer testbed",
  },
  rpcActionReplacements: {
    "eth_subscribe(\"newFlashblocks\")": "eth_subscribe(\"newHeads\")",
    "eth_subscribe(\"pendingLogs\")": "eth_subscribe(\"logs\")",
    "eth_subscribe(\"newFlashblockTransactions\")": "eth_subscribe(\"newHeads\"), then fetch canonical block txs",
    "eth_getBlockByNumber(\"pending\", ...)": "eth_getBlockByNumber(\"latest\", ...)",
    "eth_getBalance(..., \"pending\")": "eth_getBalance(..., \"latest\")",
    "eth_getTransactionCount(..., \"pending\", ...)": "eth_getTransactionCount(..., \"latest\")",
    "eth_call(..., \"pending\")": "eth_call(..., \"latest\")",
    "eth_estimateGas(..., \"pending\")": "eth_estimateGas(..., \"latest\")",
    "eth_simulateV1(..., \"pending\")": "eth_simulateV1(..., \"latest\")",
    "eth_getLogs(to: \"pending\")": "eth_getLogs(to: \"latest\")",
    "eth_getBlockTransactionCountByNumber(\"pending\")": "eth_getBlockTransactionCountByNumber(\"latest\")",
  },
} as const;

/**
 * Enforces Denim canonical block tag rules.
 * Converts any legacy 'pending' tag into 'latest'.
 */
export function sanitizeDenimBlockTag(tag?: string | number | bigint): string {
  if (!tag || tag === "pending") {
    return "latest";
  }
  if (typeof tag === "bigint") {
    return `0x${tag.toString(16)}`;
  }
  return String(tag);
}

/**
 * Calculates historical block depth accounting for 200ms block intervals.
 * 200ms block intervals = 5 canonical blocks per second (10x higher block rate than 2s blocks).
 *
 * @param seconds Target elapsed duration in seconds
 * @returns Number of canonical 200ms blocks covering this window
 */
export function calculateDenimHistoricalBlocks(seconds: number): number {
  return Math.ceil(seconds * DENIM_SPECS.blocksPerSecond);
}
