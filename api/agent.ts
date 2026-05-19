import type { VercelRequest, VercelResponse } from '@vercel/node';

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
      name: "Warp Jumper Orchestrator",
      status: "active",
      platform: "Warp Jumper",
      version: "1.0.0",
      capabilities: [
        "warp-jumping",
        "dimension-travel",
        "fast-navigation",
        "multi-realm-orchestration",
        "teleportation-automation",
        "path-optimization",
        "mcp-command-execution"
      ]
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      return res.status(200).json({
        success: true,
        agent: "Warp Jumper Orchestrator",
        received: body,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      return res.status(400).json({ error: "Invalid request body" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
