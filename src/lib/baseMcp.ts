import { encodeFunctionData } from "viem";
import { SCOREBOARD_ADDRESS, SCOREBOARD_ABI } from "../contracts";
import { DATA_SUFFIX_HEX } from "./erc8021";
import { baseMcpClient } from "./baseMcpClient";

function withSuffix(calldata: `0x${string}`): string {
  return (calldata + DATA_SUFFIX_HEX) as string;
}

export async function saveScoreViaMcp(score: number) {
  const data = withSuffix(
    encodeFunctionData({
      abi: SCOREBOARD_ABI,
      functionName: "recordScore",
      args: [BigInt(score)],
    })
  );
  // Returns { approvalUrl, requestId }
  return baseMcpClient.send_calls({
    chain: "base",
    calls: [{ to: SCOREBOARD_ADDRESS, data, value: "0x0" }],
  });
}

export async function readScoreViaMcp(player: string): Promise<any> {
  return baseMcpClient.chain_rpc_request({
    method: "eth_call",
    params: [{
      to: SCOREBOARD_ADDRESS,
      data: encodeFunctionData({
        abi: SCOREBOARD_ABI,
        functionName: "getScore",
        args: [player as `0x${string}`],
      }),
    }, "latest"],
    chain: "base",
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
