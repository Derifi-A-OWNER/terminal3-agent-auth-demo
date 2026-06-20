import { createHash } from "node:crypto";
import type { AgentActionRequest, ApprovalDecision, PolicyDecision } from "./types.js";

const REQUIRED_CAPABILITY = "share:verified-status";
const EXPIRY_MINUTES = 10;

const TRUST_BOUNDARY = {
  purpose: "Prove a user is verified to a partner support CRM without exporting raw identity data.",
  allowedData: ["verified status", "proof field names", "destination", "consent receipt"],
  forbiddenData: ["raw email", "raw country", "private key", "wallet secret", "full identity profile"],
  retention: "Demo memory only. No database write and no browser storage.",
  expiresInMinutes: EXPIRY_MINUTES,
  userControl: "The user can deny the request or approve only this exact capability."
} as const;

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

function fingerprint(parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 16);
}

export function createAgentRequest(): AgentActionRequest {
  const createdAt = new Date();
  return {
    id: `req_${crypto.randomUUID()}`,
    agentName: "CareDesk AI Agent",
    action: "share_verified_status",
    destination: "Partner support CRM",
    capability: REQUIRED_CAPABILITY,
    requestedFields: ["email_verified", "country_of_residence_verified"],
    redactionMode: "proof-only",
    trustBoundary: TRUST_BOUNDARY,
    policyFingerprint: fingerprint([
      REQUIRED_CAPABILITY,
      "proof-only",
      TRUST_BOUNDARY.purpose,
      TRUST_BOUNDARY.allowedData.join(","),
      TRUST_BOUNDARY.forbiddenData.join(",")
    ]),
    createdAt: createdAt.toISOString(),
    expiresAt: addMinutes(createdAt, EXPIRY_MINUTES).toISOString()
  };
}

export function createApprovalToken(request: AgentActionRequest): string {
  return `approve:${request.id}:${request.capability}`;
}

export function evaluateAction(
  request: AgentActionRequest,
  decision: ApprovalDecision | null
): PolicyDecision {
  if (Date.parse(request.expiresAt) <= Date.now()) {
    return {
      allowed: false,
      reason: "Blocked: approval window expired. Create a fresh agent request."
    };
  }

  if (request.capability !== REQUIRED_CAPABILITY) {
    return {
      allowed: false,
      reason: `Blocked: unsupported capability ${request.capability}.`
    };
  }

  if (request.redactionMode !== "proof-only") {
    return {
      allowed: false,
      reason: "Blocked: raw private data export is not allowed."
    };
  }

  if (!decision?.approved) {
    return {
      allowed: false,
      reason: "Blocked: user has not approved this protected action."
    };
  }

  if (!decision.userConfirmedBoundary) {
    return {
      allowed: false,
      reason: "Blocked: user has not confirmed the trust boundary."
    };
  }

  const expectedToken = createApprovalToken(request);
  if (decision.approvalToken !== expectedToken) {
    return {
      allowed: false,
      reason: "Blocked: approval token does not match this exact request."
    };
  }

  return {
    allowed: true,
    reason: "Allowed: exact user approval matched the requested capability.",
    safePayload: {
      verifiedStatus: "verified",
      fieldsProven: request.requestedFields,
      rawDataReleased: false,
      destination: request.destination,
      consentReceipt: {
        requestId: request.id,
        capability: request.capability,
        policyFingerprint: request.policyFingerprint,
        approvedAt: new Date().toISOString(),
        expiresAt: request.expiresAt,
        userConfirmedBoundary: true
      }
    }
  };
}
