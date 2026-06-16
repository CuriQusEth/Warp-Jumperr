import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

export class BaseMCPClient {
  private client: Client;
  private transport: SSEClientTransport;
  private connected: boolean = false;

  constructor() {
    this.client = new Client(
      { name: "warp-jumper-orchestrator", version: "1.0.0" }
    );
    
    // Base MCP SSE Endpoint
    this.transport = new SSEClientTransport(new URL("https://mcp.base.org/sse"));
  }

  async connect() {
    if (this.connected) return;
    try {
      await this.client.connect(this.transport);
      this.connected = true;
      console.log("Connected to Base MCP successfully");
    } catch (error) {
      console.error("Failed to connect to Base MCP:", error);
    }
  }

  async send_calls(args: any) {
    await this.connect();
    const result = await this.client.callTool({ name: "send_calls", arguments: args }) as any;
    // Assuming the tool returns JSON string in text block
    const text = result?.content?.[0]?.text;
    if (text) {
        return JSON.parse(text);
    }
    return result;
  }

  async chain_rpc_request(args: any) {
    await this.connect();
    const result = await this.client.callTool({ name: "chain_rpc_request", arguments: args }) as any;
    const text = result?.content?.[0]?.text;
    if (text) {
        return JSON.parse(text);
    }
    return result;
  }

  async get_request_status(args: any) {
    await this.connect();
    const result = await this.client.callTool({ name: "get_request_status", arguments: args }) as any;
    const text = result?.content?.[0]?.text;
    if (text) {
        return JSON.parse(text);
    }
    return result;
  }
}

export const baseMcpClient = new BaseMCPClient();
