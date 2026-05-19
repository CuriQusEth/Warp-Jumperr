import type { VercelRequest, VercelResponse } from '@vercel/node';

const TOOLS = [
  {
    name: "get_race_status",
    description: "Get the current status of the race",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "start_race",
    description: "Start a new race",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "get_leaderboard",
    description: "Get the current leaderboard",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "optimize_speed",
    description: "Optimize the speed of the jumper",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "get_track_info",
    description: "Get information about the current track",
    inputSchema: { type: "object", properties: {} }
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Warp Jumper MCP Endpoint",
      status: "active",
      description: "Active MCP server for Warp Jumper Orchestrator Agent",
      capabilities: ["warp-jumping", "dimension-travel", "fast-navigation"],
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      const { method, params, action, command } = body || {};

      let result: any = {};
      const actionToExecute = method || action || command;

      switch (actionToExecute) {
        case "initialize":
          result = {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: {
              name: "Warp Jumper Orchestrator",
              version: "1.0.0"
            }
          };
          break;

        case "tools/list":
          result = { tools: TOOLS };
          break;

        case "tools/call":
          const toolName = params?.name;
          result = {
            content: [
              {
                type: "text",
                text: `Executed ${toolName} successfully.`
              }
            ]
          };
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
            data: body
          };
      }

      // Wrap the result in JSON-RPC format if a JSON-RPC method is called
      const responseBody = (body?.jsonrpc === "2.0" || method) ? {
        jsonrpc: "2.0",
        id: body?.id,
        result: result
      } : {
        status: "success",
        agent: "Warp Jumper Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      };

      return res.status(200).json(responseBody);
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: "Failed to process MCP command"
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
