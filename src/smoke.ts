import { resetAuditEvents } from "./audit.js";
import { createAgentRequest, createApprovalToken, evaluateAction } from "./policy.js";
import { getSdkStatus } from "./t3nGateway.js";

resetAuditEvents();

const sdkStatus = getSdkStatus();
if (!sdkStatus.sdkImportOk) {
  throw new Error("T3N SDK import failed.");
}

const request = createAgentRequest();

const blocked = evaluateAction(request, null);
if (blocked.allowed) {
  throw new Error("Expected unapproved agent action to be blocked.");
}

const wrongToken = evaluateAction(request, {
  requestId: request.id,
  approved: true,
  approvalToken: "approve:wrong",
  userConfirmedBoundary: true
});
if (wrongToken.allowed) {
  throw new Error("Expected mismatched approval token to be blocked.");
}

const noBoundary = evaluateAction(request, {
  requestId: request.id,
  approved: true,
  approvalToken: createApprovalToken(request),
  userConfirmedBoundary: false
});
if (noBoundary.allowed) {
  throw new Error("Expected missing trust-boundary confirmation to be blocked.");
}

const approved = evaluateAction(request, {
  requestId: request.id,
  approved: true,
  approvalToken: createApprovalToken(request),
  userConfirmedBoundary: true
});
if (!approved.allowed || approved.safePayload?.rawDataReleased !== false) {
  throw new Error("Expected exact approval to allow proof-only payload.");
}
if (!approved.safePayload.consentReceipt.userConfirmedBoundary) {
  throw new Error("Expected approved payload to include a consent receipt.");
}

console.log("smoke: PASS");
console.log(
  JSON.stringify(
    {
      sdk: {
        packageName: sdkStatus.packageName,
        packageVersion: sdkStatus.packageVersion,
        environment: sdkStatus.environment,
        keyPresent: sdkStatus.keyPresent
      },
      blocked: blocked.reason,
      noBoundary: noBoundary.reason,
      approved: approved.reason,
      rawDataReleased: approved.safePayload.rawDataReleased,
      policyFingerprint: request.policyFingerprint
    },
    null,
    2
  )
);
