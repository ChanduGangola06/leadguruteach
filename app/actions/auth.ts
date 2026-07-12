"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { toUserAuthError } from "@/lib/supabase/auth-errors";
import { ensureUserProfile, resolvePostAuthRedirect } from "@/lib/supabase/profile";
import { logAuditEvent } from "@/app/actions/audit";
import { AUTH_API } from "@/lib/audit/types";

export async function loginAction(email: string, password: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: "Unable to sign in. Please try again later." };
  }

  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) {
    await logAuditEvent({
      eventType: "login_failure",
      success: false,
      email: normalizedEmail,
      buttonLabel: "Sign In",
      apiEndpoint: AUTH_API.signIn.endpoint,
      apiMethod: AUTH_API.signIn.method,
      errorCode: error.code,
      errorMessage: error.message,
    });

    if (
      error.message?.toLowerCase().includes("email not confirmed") ||
      error.code === "email_not_confirmed"
    ) {
      return {
        error:
          "Your email is not confirmed yet. Confirm it in Supabase Dashboard → Authentication → Users, or run supabase/fix_admin_user.sql.",
      };
    }

    return { error: toUserAuthError(error, "login") };
  }

  const { role } = await ensureUserProfile(supabase, data.user);
  const redirectTo = await resolvePostAuthRedirect(supabase, data.user.id);

  await logAuditEvent({
    eventType: "login_success",
    success: true,
    userId: data.user.id,
    email: normalizedEmail,
    buttonLabel: "Sign In",
    apiEndpoint: AUTH_API.signIn.endpoint,
    apiMethod: AUTH_API.signIn.method,
    metadata: { role, redirectTo },
  });

  return { redirectTo };
}

export async function registerAction(email: string, password: string, fullName: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: "Unable to create account. Please try again later." };
  }

  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: { full_name: fullName.trim(), role: "student" },
    },
  });

  if (error) {
    await logAuditEvent({
      eventType: "register_failure",
      success: false,
      email: normalizedEmail,
      buttonLabel: "Create Account",
      apiEndpoint: AUTH_API.signUp.endpoint,
      apiMethod: AUTH_API.signUp.method,
      errorCode: error.code,
      errorMessage: error.message,
    });
    return { error: toUserAuthError(error, "signup") };
  }

  if (data.user && data.user.identities?.length === 0) {
    await logAuditEvent({
      eventType: "register_failure",
      success: false,
      email: normalizedEmail,
      errorCode: "user_already_registered",
      errorMessage: "Email already registered",
    });
    return { error: "An account with this email already exists. Try signing in." };
  }

  if (data.user) {
    await ensureUserProfile(supabase, data.user);
  }

  await logAuditEvent({
    eventType: "register_success",
    success: true,
    userId: data.user?.id,
    email: normalizedEmail,
    buttonLabel: "Create Account",
    apiEndpoint: AUTH_API.signUp.endpoint,
    apiMethod: AUTH_API.signUp.method,
    metadata: { role: "student", emailConfirmationRequired: !data.session },
  });

  if (data.session) {
    const redirectTo = await resolvePostAuthRedirect(supabase, data.user!.id);
    return { redirectTo };
  }

  return {
    success: true,
    message: "Account created! Check your email to confirm, then sign in.",
  };
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await logAuditEvent({
      eventType: "logout",
      eventCategory: "auth",
      success: true,
      userId: user?.id,
      email: user?.email,
      apiEndpoint: AUTH_API.signOut.endpoint,
      apiMethod: AUTH_API.signOut.method,
      buttonLabel: "Logout",
      pagePath: "/dashboard",
    });
    await supabase.auth.signOut();
  }
  redirect("/login");
}

export async function resetPasswordAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: "Supabase not configured" };

  const email = formData.get("email") as string;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/login`,
  });

  if (error) return { error: error.message };
  return { success: true };
}
