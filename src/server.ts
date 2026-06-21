import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { addAuditEvent, getAuditEvents, resetAuditEvents } from "./audit.js";
import { createAgentRequest, createApprovalToken, evaluateAction } from "./policy.js";
import { getSdkStatus, runLiveAuthCheck } from "./t3nGateway.js";
import type { AgentActionRequest, ApprovalDecision } from "./types.js";

const rootDir = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const publicDir = join(rootDir, "public");
const port = Number(process.env.PORT || 8787);

let activeRequest: AgentActionRequest | null = null;

function json(res: import("node:http").ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body, null, 2));
}

async function readBody(req: import("node:http").IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function contentType(path: string): string {
  switch (extname(path)) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".png":
      return "image/png";
    default:
      return "text/plain; charset=utf-8";
  }
}

async function serveStatic(pathname: string, res: import("node:http").ServerResponse): Promise<void> {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const safePath = normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(publicDir, safePath);
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { "content-type": contentType(filePath) });
    res.end(data);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);

  try {
    if (req.method === "GET" && url.pathname === "/api/sdk-status") {
      return json(res, 200, getSdkStatus());
    }

    if (req.method === "POST" && url.pathname === "/api/live-auth-check") {
      return json(res, 200, await runLiveAuthCheck());
    }

    if (req.method === "POST" && url.pathname === "/api/demo/reset") {
      activeRequest = null;
      resetAuditEvents();
      return json(res, 200, {
        reset: true,
        note: "Demo state cleared. Create a fresh agent request to restart the judge walkthrough."
      });
    }

    if (req.method === "POST" && url.pathname === "/api/action/request") {
      activeRequest = createAgentRequest();
      addAuditEvent({
        requestId: activeRequest.id,
        actor: activeRequest.agentName,
        event: "request_created",
        reason: "Agent requested a proof-only verified status share."
      });
      return json(res, 200, {
        request: activeRequest
      });
    }

    if (req.method === "POST" && url.pathname === "/api/action/approve") {
      if (!activeRequest) {
        return json(res, 400, { error: "Create an agent request first." });
      }
      addAuditEvent({
        requestId: activeRequest.id,
        actor: "User",
        event: "approved",
        reason: "User confirmed the visible trust boundary for this exact request."
      });
      return json(res, 200, {
        approvalToken: createApprovalToken(activeRequest),
        consentPrompt: {
          requestId: activeRequest.id,
          capability: activeRequest.capability,
          policyFingerprint: activeRequest.policyFingerprint,
          expiresAt: activeRequest.expiresAt
        }
      });
    }

    if (req.method === "POST" && url.pathname === "/api/action/try") {
      if (!activeRequest) {
        return json(res, 400, { error: "Create an agent request first." });
      }
      const body = (await readBody(req)) as Partial<ApprovalDecision>;
      const decision = evaluateAction(activeRequest, {
        requestId: activeRequest.id,
        approved: Boolean(body.approved),
        approvalToken: body.approvalToken,
        userConfirmedBoundary: Boolean(body.userConfirmedBoundary)
      });
      addAuditEvent({
        requestId: activeRequest.id,
        actor: activeRequest.agentName,
        event: decision.allowed ? "executed" : "blocked",
        reason: decision.reason
      });
      return json(res, 200, decision);
    }

    if (req.method === "GET" && url.pathname === "/api/audit") {
      return json(res, 200, { events: getAuditEvents() });
    }

    if (req.method === "GET") {
      return serveStatic(url.pathname, res);
    }

    return json(res, 405, { error: "Method not allowed" });
  } catch (error) {
    return json(res, 500, {
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Terminal 3 Agent Auth demo running at http://127.0.0.1:${port}`);
});
