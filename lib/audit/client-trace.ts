"use client";

import type { AuditEventCategory, AuditEventType } from "./types";

export interface ClientAuditPayload {
  eventType: AuditEventType | string;
  eventCategory?: AuditEventCategory;
  success?: boolean;
  email?: string;
  userId?: string;
  apiEndpoint?: string;
  apiMethod?: string;
  buttonLabel?: string;
  pagePath?: string;
  errorCode?: string;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

/** Dev console trace — open browser DevTools → Console to see API calls */
export function traceAuditInConsole(payload: ClientAuditPayload) {
  if (process.env.NODE_ENV !== "development") return;

  const style = payload.success === false ? "color:#dc2626;font-weight:bold" : "color:#059669;font-weight:bold";
  console.groupCollapsed(`%c[Audit] ${payload.eventType}`, style);
  if (payload.buttonLabel) console.log("Button:", payload.buttonLabel);
  if (payload.apiMethod && payload.apiEndpoint) {
    console.log("API:", `${payload.apiMethod} ${payload.apiEndpoint}`);
  }
  if (payload.email) console.log("Email:", payload.email);
  if (payload.success !== undefined) console.log("Success:", payload.success);
  if (payload.errorCode) console.log("Error code:", payload.errorCode);
  if (payload.errorMessage) console.log("Error:", payload.errorMessage);
  if (payload.metadata && Object.keys(payload.metadata).length) console.log("Meta:", payload.metadata);
  console.log("Time:", new Date().toISOString());
  console.groupEnd();
}

export function getPagePath(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname;
}

export function getUserAgent(): string {
  if (typeof navigator === "undefined") return "";
  return navigator.userAgent;
}
