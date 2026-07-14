"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient, requireAdmin } from "@/lib/supabase/server";
import { getAffiliateStats } from "@/lib/queries/affiliate";
import { MIN_WITHDRAWAL_AMOUNT } from "@/lib/affiliate/constants";

export async function requestPaymentAction(formData: FormData) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return { error: "Unable to submit request. Try again later." };

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Please sign in to request a payment." };

    const amount = Number(formData.get("amount"));
    const paymentMethod =
      String(formData.get("payment_method") ?? "") === "bank" ? "bank" : "upi";
    const upiId = String(formData.get("upi_id") ?? "").trim();
    const accountName = String(formData.get("account_name") ?? "").trim();
    const accountNumber = String(formData.get("account_number") ?? "").trim();
    const ifscCode = String(formData.get("ifsc_code") ?? "").trim();

    if (!Number.isFinite(amount) || amount < MIN_WITHDRAWAL_AMOUNT) {
      return { error: `Minimum payment request is ₹${MIN_WITHDRAWAL_AMOUNT}.` };
    }

    if (paymentMethod === "upi" && !upiId) {
      return { error: "Please enter your UPI ID." };
    }
    if (paymentMethod === "bank" && (!accountName || !accountNumber || !ifscCode)) {
      return { error: "Please enter complete bank account details." };
    }

    const stats = await getAffiliateStats(user.id);
    if (amount > stats.availableBalance) {
      return {
        error: `Insufficient balance. Available: ₹${stats.availableBalance.toLocaleString("en-IN")}. Earn commission by sharing your referral link.`,
      };
    }

    const { error } = await supabase.from("payment_requests").insert({
      user_id: user.id,
      amount,
      payment_method: paymentMethod,
      upi_id: paymentMethod === "upi" ? upiId : null,
      account_name: paymentMethod === "bank" ? accountName : null,
      account_number: paymentMethod === "bank" ? accountNumber : null,
      ifsc_code: paymentMethod === "bank" ? ifscCode : null,
      status: "pending",
    });

    if (error) {
      console.error("[payment_requests insert]", error);
      if (
        error.message?.includes("does not exist") ||
        error.code === "42P01" ||
        error.message?.includes("schema cache")
      ) {
        return {
          error:
            "Payment table is missing. Run supabase/migration_affiliate.sql in Supabase SQL Editor.",
        };
      }
      if (error.code === "42501" || error.message?.toLowerCase().includes("policy")) {
        return { error: "Permission denied. Check payment_requests RLS policies." };
      }
      return { error: error.message || "Unable to submit payment request." };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/earnings");
    revalidatePath("/dashboard/affiliate");
    revalidatePath("/dashboard/admin/payments");
    revalidatePath("/dashboard/admin/leads");
    return { success: true };
  } catch (err) {
    console.error("[requestPaymentAction]", err);
    return {
      error: err instanceof Error ? err.message : "Unable to submit payment request.",
    };
  }
}

export async function reviewPaymentRequestAction(formData: FormData) {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "");
  const action = String(formData.get("action") ?? "");
  const adminNote = String(formData.get("admin_note") ?? "").trim() || null;

  if (!id || !["approve", "reject"].includes(action)) {
    throw new Error("Invalid payment review action");
  }

  const status = action === "approve" ? "approved" : "rejected";

  const { error } = await supabase
    .from("payment_requests")
    .update({
      status,
      admin_note: adminNote,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending");

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/admin/payments");
  revalidatePath("/dashboard/admin/leads");
  revalidatePath("/dashboard/earnings");
  revalidatePath("/dashboard/affiliate");
}
