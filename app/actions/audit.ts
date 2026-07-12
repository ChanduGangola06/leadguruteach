"use server";

import { headers } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AuditLogInsert } from "@/lib/types/database";

export interface LogAuditInput {
  eventType: string;
  eventCategory?: "auth" | "api" | "button";
  success?: boolean;
  userId?: string | null;
  email?: string | null;
  apiEndpoint?: string | null;
  apiMethod?: string | null;
  buttonLabel?: string | null;
  pagePath?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
}

export async function logAuditEvent(input: LogAuditInput): Promise<void> {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return;

    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const ip =
      forwarded?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      headersList.get("cf-connecting-ip") ||
      null;

    const row: AuditLogInsert = {
      event_type: input.eventType,
      event_category: input.eventCategory ?? "auth",
      success: input.success ?? false,
      user_id: input.userId ?? null,
      email: input.email ?? null,
      api_endpoint: input.apiEndpoint ?? null,
      api_method: input.apiMethod ?? "POST",
      button_label: input.buttonLabel ?? null,
      page_path: input.pagePath ?? null,
      error_code: input.errorCode ?? null,
      error_message: input.errorMessage ?? null,
      user_agent: input.userAgent ?? headersList.get("user-agent"),
      ip_address: ip,
      metadata: input.metadata ?? {},
    };

    await supabase.from("audit_logs").insert(row);
  } catch {
    // Never block auth flow if audit insert fails
  }
}
