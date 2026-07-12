"use client";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { traceAuditInConsole, getPagePath, getUserAgent } from "@/lib/audit/client-trace";
import type { ClientAuditPayload } from "@/lib/audit/client-trace";

/** One non-blocking audit write — no server action, no extra POST /register round-trips */
export function recordAudit(payload: ClientAuditPayload): void {
  traceAuditInConsole(payload);

  if (!isSupabaseConfigured()) return;

  try {
    const supabase = createClient();
    void supabase
      .from("audit_logs")
      .insert({
        event_type: payload.eventType,
        event_category: payload.eventCategory ?? "auth",
        success: payload.success ?? false,
        user_id: payload.userId ?? null,
        email: payload.email ?? null,
        api_endpoint: payload.apiEndpoint ?? null,
        api_method: payload.apiMethod ?? "POST",
        button_label: payload.buttonLabel ?? null,
        page_path: payload.pagePath ?? getPagePath(),
        error_code: payload.errorCode ?? null,
        error_message: payload.errorMessage ?? null,
        user_agent: getUserAgent(),
        metadata: payload.metadata ?? {},
      })
      .then(({ error }) => {
        if (error && process.env.NODE_ENV === "development") {
          console.warn("[Audit] DB insert skipped (non-blocking):", error.message);
        }
      });
  } catch {
    // Never block auth
  }
}

/** Single consolidated log per login/register attempt (avoids rate limits) */
export function recordAuthAttempt(payload: ClientAuditPayload): void {
  recordAudit(payload);
}
