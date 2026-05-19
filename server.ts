import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON
  app.use(express.json());

  // === MCP Endpoint ===
  const TOOLS = [
    { name: "get_race_status", description: "Get the current status of the race", inputSchema: { type: "object", properties: {} } },
    { name: "start_race", description: "Start a new race", inputSchema: { type: "object", properties: {} } },
    { name: "get_leaderboard", description: "Get the current leaderboard", inputSchema: { type: "object", properties: {} } },
    { name: "optimize_speed", description: "Optimize the speed of the jumper", inputSchema: { type: "object", properties: {} } },
    { name: "get_track_info", description: "Get information about the current track", inputSchema: { type: "object", properties: {} } }
  ];

  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Warp Jumper MCP Endpoint",
      status: "active",
      description: "Active MCP server for Warp Jumper Orchestrator Agent",
      capabilities: ["warp-jumping", "dimension-travel", "fast-navigation"],
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const { action, command, params, method } = req.body;

      let result: any = {};

      switch (method || action || command) {
        case "initialize":
          result = {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: { name: "Warp Jumper Orchestrator", version: "1.0.0" }
          };
          break;

        case "tools/list":
          result = { tools: TOOLS };
          break;

        case "tools/call":
          result = { content: [{ type: "text", text: `Executed ${params?.name} successfully.` }] };
          break;

        case "prompts/list":
          result = { prompts: [] };
          break;

        case "resources/list":
          result = { resources: [] };
          break;

        case "status":
        case "ping":
          result = { 
            status: "online", 
            agent: "Warp Jumper Orchestrator",
            message: "Coordinates locked - Ready to jump!" 
          };
          break;

        case "execute":
          result = {
            success: true,
            action: command || params,
            executedAt: new Date().toISOString(),
            message: "Warp jump executed successfully"
          };
          break;

        case "get_info":
          result = {
            name: "Warp Jumper Orchestrator",
            platform: "Base",
            version: "1.0.0"
          };
          break;

        default:
          result = {
            success: true,
            message: "Command received",
            data: req.body
          };
      }

      if (req.body.jsonrpc === "2.0" || method) {
        res.json({ jsonrpc: "2.0", id: req.body.id, result });
      } else {
        res.json({
          status: "success",
          agent: "Warp Jumper Orchestrator",
          response: result,
          receivedAt: new Date().toISOString()
        });
      }

    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Failed to process MCP command"
      });
    }
  });

  // === Agent Endpoint ===
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Warp Jumper Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Warp Jumper",
      version: "1.0.0"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
