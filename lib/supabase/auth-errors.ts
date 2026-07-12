const INTERNAL_PATTERNS = [
  "invalid api key",
  ".env",
  "jwt",
  "apikey",
  "service_role",
  "configuration",
  "configured",
];

export function toUserAuthError(
  error: { message?: string; code?: string } | string | null | undefined,
  mode: "login" | "signup" | "reset" = "login"
): string {
  const raw = typeof error === "string" ? error : error?.message ?? "";
  const code = typeof error === "object" && error?.code ? error.code.toLowerCase() : "";
  const lower = raw.toLowerCase();

  if (
    lower.includes("failed to fetch") ||
    lower.includes("network") ||
    code === "fetch_error"
  ) {
    if (mode === "signup") {
      return "Unable to reach the server. Check your connection and Supabase URL in .env, then try again.";
    }
    return "Unable to reach the server. Check your connection and try again.";
  }

  if (code === "user_already_registered" || lower.includes("user already registered")) {
    return "An account with this email already exists. Try signing in.";
  }
  if (lower.includes("invalid login credentials")) {
    return "Invalid email or password.";
  }
  if (lower.includes("email not confirmed")) {
    return "Please confirm your email before signing in.";
  }
  if (lower.includes("password") && (lower.includes("short") || lower.includes("least"))) {
    return "Password does not meet requirements. Use at least 6 characters.";
  }
  if (lower.includes("valid email") || code === "email_address_invalid") {
    return "Please enter a valid email address.";
  }
  if (
    code.includes("rate") ||
    lower.includes("rate limit") ||
    lower.includes("too many requests") ||
    code === "over_email_send_rate_limit"
  ) {
    return "An account with this email may already exist. Try signing in, or wait a few minutes and try again.";
  }

  if (!raw || INTERNAL_PATTERNS.some((p) => lower.includes(p))) {
    if (mode === "reset") return "Unable to send reset email. Please try again later.";
    if (mode === "signup") return "Unable to create account. Please try again later.";
    return "Unable to sign in. Please try again later.";
  }

  if (mode === "reset") return "Unable to send reset email. Please try again later.";
  if (mode === "signup") return "Unable to create account. Please try again later.";
  return "Unable to sign in. Please check your details and try again.";
}
