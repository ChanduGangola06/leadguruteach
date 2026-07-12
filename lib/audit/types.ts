export type AuditEventCategory = "auth" | "api" | "button";

export type AuditEventType =
  | "login_click"
  | "register_click"
  | "password_reset_click"
  | "logout"
  | "login_success"
  | "login_failure"
  | "register_success"
  | "register_failure"
  | "password_reset_success"
  | "password_reset_failure"
  | "api_call";

export interface DbAuditLog {
  id: string;
  event_type: AuditEventType | string;
  event_category: AuditEventCategory;
  success: boolean;
  user_id: string | null;
  email: string | null;
  api_endpoint: string | null;
  api_method: string | null;
  button_label: string | null;
  page_path: string | null;
  error_code: string | null;
  error_message: string | null;
  user_agent: string | null;
  ip_address: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type AuditLogInsert = Omit<DbAuditLog, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

/** Supabase Auth REST endpoints (for debugging) */
export const AUTH_API = {
  signUp: { method: "POST", endpoint: "/auth/v1/signup" },
  signIn: { method: "POST", endpoint: "/auth/v1/token?grant_type=password" },
  signOut: { method: "POST", endpoint: "/auth/v1/logout" },
  recover: { method: "POST", endpoint: "/auth/v1/recover" },
  getUser: { method: "GET", endpoint: "/auth/v1/user" },
  profilesSelect: { method: "GET", endpoint: "/rest/v1/profiles?select=role" },
  profilesUpdate: { method: "PATCH", endpoint: "/rest/v1/profiles" },
} as const;
