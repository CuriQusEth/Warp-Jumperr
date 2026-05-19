# Warp Jumper ⚡

Warp Jumper is a fast, fluid, and visually stunning precision platformer built with modern web technologies. You play as a dimensional acrobat who can teleport short distances mid-air. Master perfect jumps, precise warps, and momentum to navigate through ever-changing neon obstacle courses and reach new heights.

## 🚀 Features

- **High-Performance Canvas Graphics:** Runs smoothly using highly stylized neon vector graphics and particle effects.
- **On-chain Integrations:** Powered by Base Mainnet.
  - ERC-8021 Transaction Attribution support.
  - ERC-8004 Trustless Agents integrated.
  - Submits High Scores securely to the blockchain.
- **AI Agent Orchestrator:** Fully configured `.well-known/agent-card.json` and `MCP` (Model Context Protocol) ready.
- **Mobile First:** Designed with touch semantics, portrait orientation, and fast responses.
- **Dimensional Mechanics:** Utilizes dimensional mechanics like Warp Dash, Warp Echo, and Momentum Carry.
- **Frosted Glass UI:** Implements a polished neo-brutalist / frosted-glass UI stringing together minimalist aesthetics and vibrant neon accents.

## 🔗 Platform & Integrations

- **Network:** Base Mainnet
- **Orchestrator Agent:** Warp Jumper Orchestrator v1.0.0
- **Supported Capabilities:** warp-jumping, dimension-travel, fast-navigation, multi-realm-orchestration, teleportation-automation, path-optimization, mcp-command-execution
- **Agent API:** `/api/agent`
- **MCP Protocol:** `/api/mcp` (Supports tools: get_race_status, start_race, get_leaderboard, optimize_speed, get_track_info)

## 🏗️ Technology Stack

- **Framework:** React + Vite (or Next.js for APIs depending on your Vercel deployment method)
- **Styling:** Tailwind CSS + Frosted Glass Design System
- **Animation:** Framer Motion
- **State Management:** Zustand
- **Web3 Integrations:** Wagmi + Viem + SIWE Auth

## 💡 How to Play

1. **Jump:** Tap anywhere on the screen.
2. **Warp:** Tap while mid-air (consumes Warp Energy).
3. **Collect:** Gather Dimensional Shards and Essence to build up your combo multipliers.
4. **Survive:** Do not fall off the neon platforms!
5. **Leaderboard:** Compete to become the Greatest Warp Jumper and record your high scores directly onto Base Mainnet.

## 🤖 AI Agent (Warp Jumper Orchestrator)

We have deeply integrated AI capabilities using an ERC-8004 compliant intelligent agent:
- **Endpoints:** 
  - `GET /api/agent` (General agent diagnostics)
  - `GET/POST /api/mcp` (Model Context Protocol executor)
  - `GET /.well-known/agent-card.json` (Agent discovery manifest)
- **Active Capabilities:** `warp-jumping`, `dimension-travel`, `multi-realm-orchestration`, and more.

## 🌐 How to Run Locally

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Launch the AI Studio Server functionality (if using local node Express): `npm start`
