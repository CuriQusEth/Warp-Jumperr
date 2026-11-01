import { createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { defineChain } from "viem";
import { injected, coinbaseWallet, walletConnect } from "wagmi/connectors";
import { DATA_SUFFIX } from "./erc8021";

/**
 * Base Vibenet: Base's experimental developer preview network
 * featuring 200ms canonical blocks under the Denim upgrade.
 * Documentation: https://docs.base.org/build-on-base/test-on-vibenet.md
 */
export const baseVibenet = defineChain({
  id: 84538453,
  name: "Base Vibenet (200ms Native Blocks)",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.vibes.base.org"],
      webSocket: ["wss://rpc.vibes.base.org/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "Vibenet Explorer",
      url: "https://vibes.base.org",
    },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [base, baseSepolia, baseVibenet],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [baseVibenet.id]: http("https://rpc.vibes.base.org"),
  },
  dataSuffix: DATA_SUFFIX,
  connectors: [
    injected(),
    coinbaseWallet({ appName: "Warp Jumper" }),
    walletConnect({ projectId: "YOUR_WC_PROJECT_ID" }),
  ],
});
