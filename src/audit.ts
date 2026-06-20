import type { AuditEvent } from "./types.js";

const events: AuditEvent[] = [];

export function addAuditEvent(event: Omit<AuditEvent, "id" | "at">): AuditEvent {
  const row: AuditEvent = {
    id: `evt_${crypto.randomUUID()}`,
    at: new Date().toISOString(),
    ...event
  };
  events.unshift(row);
  return row;
}

export function getAuditEvents(): AuditEvent[] {
  return [...events];
}

export function resetAuditEvents(): void {
  events.length = 0;
}
