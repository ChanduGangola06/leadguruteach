import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { DbAuditLog } from "@/lib/types/database";

export async function getAuditLogsAdmin(limit = 100): Promise<DbAuditLog[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data as DbAuditLog[];
}

export async function getAuditLogStats() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { total: 0, failures: 0, last24h: 0 };

  const { data } = await supabase
    .from("audit_logs")
    .select("success, created_at");

  const rows = data ?? [];
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;

  return {
    total: rows.length,
    failures: rows.filter((r) => !r.success).length,
    last24h: rows.filter((r) => new Date(r.created_at).getTime() > dayAgo).length,
  };
}
