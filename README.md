# Warp Jumper ⚡

Warp Jumper is a fast, fluid, and visually stunning precision platformer built with modern web technologies, upgraded for the **Base Denim 200ms Native Blocks** era. You play as a dimensional acrobat who can teleport short distances mid-air. Master perfect jumps, precise warps, and momentum to navigate through ever-changing neon obstacle courses and reach new heights.

---

## ⚡ Base Denim 200ms Native Blocks Migration (Compliant with docs.base.org)

This project has been fully migrated according to the official Base specification: **"Migrate From Flashblocks"** (`https://docs.base.org/llms.txt`):

### 1. Replaced Flashblocks with Canonical 200ms Blocks
* **`eth_subscribe("newFlashblocks")`** ➔ Replaced with canonical **`eth_subscribe("newHeads")`**.
* **`eth_subscribe("pendingLogs")`** ➔ Replaced with **`eth_subscribe("logs")`**.
* **`eth_subscribe("newFlashblockTransactions")`** ➔ Replaced with **`eth_subscribe("newHeads")`**, then fetching canonical block transactions.

### 2. Elimination of `"pending"` Block Tag
The `"pending"` block tag and Flashblocks preconfirmation state have no equivalent after Denim activation. All RPC calls strictly query canonical state:
* `eth_getBlockByNumber("pending", ...)` ➔ **`eth_getBlockByNumber("latest", ...)`**
* `eth_getBalance(..., "pending")` ➔ **`eth_getBalance(..., "latest")`**
* `eth_getTransactionCount(..., "pending", ...)` ➔ **`eth_getTransactionCount(..., "latest")`**
* `eth_call(..., "pending")` ➔ **`eth_call(..., "latest")`**
* `eth_estimateGas(..., "pending")` ➔ **`eth_estimateGas(..., "latest")`**
* `eth_simulateV1(..., "pending")` ➔ **`eth_simulateV1(..., "latest")`**
* `eth_getLogs` range ending at `"pending"` ➔ **`eth_getLogs` ending at `"latest"`**
* `eth_getBlockTransactionCountByNumber("pending")` ➔ **`eth_getBlockTransactionCountByNumber("latest")`**

### 3. Historical Block Window Adjusted for 200ms
With 200ms canonical blocks, block production rate is **5 blocks per second** (10x faster than 2s blocks). History functions (e.g. `calculateDenimHistoricalBlocks`) adjust query windows accordingly.

### 4. Supported Base Networks & Vibenet
* **Base Vibenet (Experimental 200ms Native Blocks):**
  * Chain ID: `84538453` (`0x52b61f5`)
  * RPC: `https://rpc.vibes.base.org`
  * WebSocket: `wss://rpc.vibes.base.org/ws`
  * Block Time: `200ms`
* **Base Sepolia:** Chain ID `84532` (Denim activated October 21, 2026 at 18:00 UTC)
* **Base Mainnet:** Chain ID `8453` (Targeting November 2026)

---

## 🚀 Features

- **High-Performance Canvas Graphics:** Runs smoothly using highly stylized neon vector graphics and particle effects.
- **Base Denim Real-time Badge:** Live HUD tracking 200ms canonical blocks, block intervals, and network switching.
- **On-chain Integrations:**
  - ERC-8021 Transaction Attribution support.
  - ERC-8004 Trustless Agents integrated.
  - Submits High Scores securely to the blockchain.
- **AI Agent Orchestrator:** Fully configured `.well-known/agent-card.json` and `MCP` (Model Context Protocol) ready.
- **Mobile First:** Designed with touch semantics, portrait orientation, and fast responses.
- **Dimensional Mechanics:** Utilizes dimensional mechanics like Warp Dash, Warp Echo, and Momentum Carry.

---

## 🏗️ Technology Stack

- **Framework:** React + Vite
- **Web3 Integrations:** Wagmi v2 + Viem (with Base Vibenet, Base Sepolia, and Base Mainnet)
- **Denim Helpers:** `src/lib/denimRpc.ts`, `src/hooks/useDenim200msBlocks.ts`
- **Agent / MCP:** Model Context Protocol client (`src/lib/baseMcp.ts`) connecting to `https://mcp.base.org/sse`
- **Styling:** Tailwind CSS + Frosted Glass Design System
- **Animation:** Framer Motion / Motion
- **State Management:** Zustand

---

## 💡 How to Play

1. **Jump:** Tap anywhere on the screen.
2. **Warp:** Tap while mid-air (consumes Warp Energy).
3. **Collect:** Gather Dimensional Shards and Essence to build up your combo multipliers.
4. **Survive:** Do not fall off the neon platforms!
5. **Leaderboard:** Compete to become the Greatest Warp Jumper and record your high scores directly onto Base.

---

## 🌐 How to Run Locally

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Launch AI Studio Server (if running full-stack Express): `npm start`
