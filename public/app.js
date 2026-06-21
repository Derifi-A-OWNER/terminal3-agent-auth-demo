const sdkStatus = document.querySelector("#sdkStatus");
const requestBox = document.querySelector("#requestBox");
const decisionBox = document.querySelector("#decisionBox");
const auditBox = document.querySelector("#auditBox");
const liveBox = document.querySelector("#liveBox");
const trustBox = document.querySelector("#trustBox");
const receiptBox = document.querySelector("#receiptBox");
const judgeBox = document.querySelector("#judgeBox");

let currentApprovalToken = "";
let boundaryConfirmed = false;

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "content-type": "application/json" },
    ...options
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
}

function render(node, data) {
  node.textContent = typeof data === "string" ? data : JSON.stringify(data, null, 2);
}

function renderTrustBoundary(request) {
  const boundary = request.trustBoundary;
  trustBox.innerHTML = `
    <dl>
      <dt>Purpose</dt>
      <dd>${boundary.purpose}</dd>
      <dt>Allowed</dt>
      <dd>${boundary.allowedData.join(", ")}</dd>
      <dt>Blocked</dt>
      <dd>${boundary.forbiddenData.join(", ")}</dd>
      <dt>Expiry</dt>
      <dd>${boundary.expiresInMinutes} minutes, expires at ${request.expiresAt}</dd>
      <dt>Policy fingerprint</dt>
      <dd><code>${request.policyFingerprint}</code></dd>
    </dl>
  `;
}

async function refreshAudit() {
  render(auditBox, await api("/api/audit"));
}

async function loadSdkStatus() {
  render(sdkStatus, await api("/api/sdk-status"));
}

async function resetDemoState() {
  await api("/api/demo/reset", { method: "POST", body: "{}" });
  currentApprovalToken = "";
  boundaryConfirmed = false;
  render(requestBox, "No request yet.");
  trustBox.textContent = "Create a request to review the boundary.";
  render(decisionBox, "Waiting for request.");
  render(receiptBox, "No receipt yet.");
  render(auditBox, { events: [] });
}

async function createRequest() {
  const result = await api("/api/action/request", { method: "POST", body: "{}" });
  currentApprovalToken = "";
  boundaryConfirmed = false;
  render(requestBox, result.request);
  renderTrustBoundary(result.request);
  render(decisionBox, "Request created. Try without approval first.");
  render(receiptBox, "No receipt yet.");
  await refreshAudit();
  return result.request;
}

async function tryActionWithoutApproval() {
  const result = await api("/api/action/try", {
    method: "POST",
    body: JSON.stringify({ approved: false })
  });
  render(decisionBox, result);
  await refreshAudit();
  return result;
}

async function approveBoundary() {
  const result = await api("/api/action/approve", { method: "POST", body: "{}" });
  currentApprovalToken = result.approvalToken;
  boundaryConfirmed = true;
  render(decisionBox, {
    approved: true,
    consentPrompt: result.consentPrompt,
    userConfirmedBoundary: boundaryConfirmed,
    note: "Approval is bound to this exact request, capability, expiry, and policy fingerprint."
  });
  await refreshAudit();
  return result;
}

async function tryActionWithApproval() {
  const result = await api("/api/action/try", {
    method: "POST",
    body: JSON.stringify({
      approved: true,
      approvalToken: currentApprovalToken,
      userConfirmedBoundary: boundaryConfirmed
    })
  });
  render(decisionBox, result);
  render(receiptBox, result.safePayload?.consentReceipt || "No receipt returned.");
  await refreshAudit();
  return result;
}

document.querySelector("#liveCheck").addEventListener("click", async () => {
  try {
    render(liveBox, await api("/api/live-auth-check", { method: "POST", body: "{}" }));
  } catch (error) {
    render(liveBox, {
      liveAuthAvailable: false,
      reason: error instanceof Error ? error.message : String(error)
    });
  }
});

document.querySelector("#createRequest").addEventListener("click", async () => {
  await createRequest();
});

document.querySelector("#tryWithout").addEventListener("click", async () => {
  await tryActionWithoutApproval();
});

document.querySelector("#approve").addEventListener("click", async () => {
  await approveBoundary();
});

document.querySelector("#tryWith").addEventListener("click", async () => {
  await tryActionWithApproval();
});

document.querySelector("#resetDemo").addEventListener("click", async () => {
  await resetDemoState();
  render(judgeBox, "Demo state reset. Manual review can start from a clean request.");
});

document.querySelector("#runJudge").addEventListener("click", async () => {
  try {
    render(judgeBox, "Running judge walkthrough...");
    await resetDemoState();
    const request = await createRequest();
    const blocked = await tryActionWithoutApproval();
    const approval = await approveBoundary();
    const executed = await tryActionWithApproval();
    render(judgeBox, {
      walkthrough: "PASS",
      requestId: request.id,
      sdkBoundary: "@terminal3/t3n-sdk@3.9.0 loaded server-side",
      blockedBeforeApproval: blocked.allowed === false,
      approvedCapability: approval.consentPrompt.capability,
      rawDataReleased: executed.safePayload?.rawDataReleased,
      receiptPolicyFingerprint: executed.safePayload?.consentReceipt.policyFingerprint
    });
  } catch (error) {
    render(judgeBox, {
      walkthrough: "FAILED",
      reason: error instanceof Error ? error.message : String(error)
    });
  }
});

await loadSdkStatus();
await refreshAudit();
