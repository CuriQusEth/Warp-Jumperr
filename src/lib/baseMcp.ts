import { encodeFunctionData } from "viem";
import { SCOREBOARD_ADDRESS, SCOREBOARD_ABI } from "../contracts";
import { DATA_SUFFIX_HEX } from "./erc8021";
import { baseMcpClient } from "./baseMcpClient";
import { sanitizeDenimBlockTag } from "./denimRpc";

function withSuffix(calldata: `0x${string}`): string {
  return (calldata + DATA_SUFFIX_HEX) as string;
}

export async function saveScoreViaMcp(score: number, chain: string = "base") {
  const data = withSuffix(
    encodeFunctionData({
      abi: SCOREBOARD_ABI,
      functionName: "recordScore",
      args: [BigInt(score)],
    })
  );
  // Returns { approvalUrl, requestId }
  return baseMcpClient.send_calls({
    chain,
    calls: [{ to: SCOREBOARD_ADDRESS, data, value: "0x0" }],
  });
}

/**
 * Reads on-chain score using Denim-compliant canonical 'latest' tag.
 * (Flashblocks preconfirmation / 'pending' tags are prohibited under Denim).
 */
export async function readScoreViaMcp(player: string, chain: string = "base"): Promise<any> {
  return baseMcpClient.chain_rpc_request({
    method: "eth_call",
    params: [
      {
        to: SCOREBOARD_ADDRESS,
        data: encodeFunctionData({
          abi: SCOREBOARD_ABI,
          functionName: "getScore",
          args: [player as `0x${string}`],
        }),
      },
      "latest", // Canonical block state under Denim 200ms native blocks
    ],
    chain,
  });
}

/**
 * Fetches the latest canonical block for Denim 200ms verification.
 * Note: Replaces eth_getBlockByNumber("pending", ...)
 */
export async function readLatestCanonicalBlock(chain: string = "base"): Promise<any> {
  return baseMcpClient.chain_rpc_request({
    method: "eth_getBlockByNumber",
    params: [sanitizeDenimBlockTag("latest"), false],
    chain,
  });
}

/**
 * Fetches latest canonical account balance.
 * Note: Replaces eth_getBalance(..., "pending")
 */
export async function readCanonicalBalance(account: string, chain: string = "base"): Promise<any> {
  return baseMcpClient.chain_rpc_request({
    method: "eth_getBalance",
    params: [account, sanitizeDenimBlockTag("latest")],
    chain,
  });
}

export async function pollStatus(
  requestId: string,
  intervalMs = 2000,
  timeoutMs  = 120_000
): Promise<"completed" | "failed"> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, intervalMs));
    const { status } = await baseMcpClient.get_request_status({ requestId });
    if (status === "completed" || status === "failed") return status;
  }
  return "failed";
}
