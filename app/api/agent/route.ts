import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
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
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json(
      {
        success: true,
        agent: "Warp Jumper Orchestrator",
        received: body,
        timestamp: new Date().toISOString()
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request body" }, 
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
