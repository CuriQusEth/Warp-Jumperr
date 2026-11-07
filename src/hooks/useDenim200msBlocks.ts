import { useState, useEffect, useRef } from "react";
import { useBlockNumber, useWatchBlockNumber, useChainId } from "wagmi";
import { DENIM_SPECS } from "../lib/denimRpc";

export interface DenimBlockState {
  blockNumber: bigint | undefined;
  lastBlockTimeMs: number;
  blockIntervalMs: number | null;
  blocksPerSec: number | null;
  isDenimActive: boolean;
  blockTag: "latest";
  networkName: string;
}

export function useDenim200msBlocks() {
  const chainId = useChainId();
  const [blockIntervalMs, setBlockIntervalMs] = useState<number | null>(null);
  const [blocksPerSec, setBlocksPerSec] = useState<number | null>(null);
  const lastTimestampRef = useRef<number>(Date.now());

  // Canonical latest block number query (never uses 'pending')
  const { data: initialBlockNumber } = useBlockNumber({
    watch: true,
  });

  const [currentBlock, setCurrentBlock] = useState<bigint | undefined>(initialBlockNumber);

  // Sync state if initialBlockNumber updates
  useEffect(() => {
    if (initialBlockNumber && !currentBlock) {
      setCurrentBlock(initialBlockNumber);
    }
  }, [initialBlockNumber]);

  // Real-time canonical newHeads watcher at high frequency
  useWatchBlockNumber({
    pollingInterval: 250, // Polling / WebSocket fast interval
    onBlockNumber(newBlock) {
      const now = Date.now();
      const elapsed = now - lastTimestampRef.current;
      lastTimestampRef.current = now;

      setCurrentBlock(newBlock);

      // Filter out spurious 0ms or abnormally large initial ticks
      if (elapsed > 50 && elapsed < 10000) {
        setBlockIntervalMs(elapsed);
        setBlocksPerSec(Number((1000 / elapsed).toFixed(1)));
      }
    },
  });

  const getNetworkInfo = (id: number) => {
    switch (id) {
      case 84538453:
        return { name: "Base Vibenet (200ms Native Blocks)", isDenim: true, isMainnet: false };
      case 84532:
        return { name: "Base Sepolia (Denim Live)", isDenim: true, isMainnet: false };
      case 8453:
      default:
        return { name: "Base Mainnet (Denim Live 200ms)", isDenim: true, isMainnet: true };
    }
  };

  const netInfo = getNetworkInfo(chainId);

  return {
    blockNumber: currentBlock,
    blockIntervalMs: blockIntervalMs ?? DENIM_SPECS.blockTimeMs,
    blocksPerSec: blocksPerSec ?? DENIM_SPECS.blocksPerSecond,
    isDenimActive: netInfo.isDenim,
    isMainnet: netInfo.isMainnet,
    blockTag: "latest" as const,
    networkName: netInfo.name,
    targetBlockTimeMs: DENIM_SPECS.blockTimeMs,
  };
}
