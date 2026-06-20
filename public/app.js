const sdkStatus = document.querySelector("#sdkStatus");
const requestBox = document.querySelector("#requestBox");
const decisionBox = document.querySelector("#decisionBox");
const auditBox = document.querySelector("#auditBox");
const liveBox = document.querySelector("#liveBox");
const trustBox = document.querySelector("#trustBox");
const receiptBox = document.querySelector("#receiptBox");

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
  const result = await api("/api/action/request", { method: "POST", body: "{}" });
  currentApprovalToken = "";
  boundaryConfirmed = false;
  render(requestBox, result.request);
  renderTrustBoundary(result.request);
  render(decisionBox, "Request created. Try without approval first.");
  render(receiptBox, "No receipt yet.");
  await refreshAudit();
});

document.querySelector("#tryWithout").addEventListener("click", async () => {
  const result = await api("/api/action/try", {
    method: "POST",
    body: JSON.stringify({ approved: false })
  });
  render(decisionBox, result);
  await refreshAudit();
});

document.querySelector("#approve").addEventListener("click", async () => {
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
});

document.querySelector("#tryWith").addEventListener("click", async () => {
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
});

await loadSdkStatus();
await refreshAudit();
