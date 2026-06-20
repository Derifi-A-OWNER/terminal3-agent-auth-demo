export type AgentActionKind = "share_verified_status";

export type AgentActionRequest = {
  id: string;
  agentName: string;
  action: AgentActionKind;
  destination: string;
  capability: string;
  requestedFields: string[];
  redactionMode: "proof-only";
  trustBoundary: TrustBoundary;
  policyFingerprint: string;
  createdAt: string;
  expiresAt: string;
};

export type ApprovalDecision = {
  requestId: string;
  approved: boolean;
  approvalToken?: string;
  userConfirmedBoundary?: boolean;
};

export type PolicyDecision = {
  allowed: boolean;
  reason: string;
  safePayload?: {
    verifiedStatus: "verified";
    fieldsProven: string[];
    rawDataReleased: false;
    destination: string;
    consentReceipt: ConsentReceipt;
  };
};

export type TrustBoundary = {
  purpose: string;
  allowedData: readonly string[];
  forbiddenData: readonly string[];
  retention: string;
  expiresInMinutes: number;
  userControl: string;
};

export type ConsentReceipt = {
  requestId: string;
  capability: string;
  policyFingerprint: string;
  approvedAt: string;
  expiresAt: string;
  userConfirmedBoundary: true;
};

export type AuditEvent = {
  id: string;
  at: string;
  requestId: string;
  actor: string;
  event: "request_created" | "blocked" | "approved" | "executed";
  reason: string;
};

export type SdkStatus = {
  packageName: string;
  packageVersion: string;
  environment: "testnet";
  sdkImportOk: boolean;
  keyPresent: boolean;
  addressPreview?: string;
  didPreview?: string;
  liveAuthAvailable: boolean;
  note: string;
};
