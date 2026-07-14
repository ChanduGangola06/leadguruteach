import { createServerSupabaseClient } from "@/lib/supabase/server";
import { COMMISSION_PERCENT } from "@/lib/affiliate/constants";
import type {
  DbAffiliateCommission,
  DbPaymentRequest,
  DbProfile,
} from "@/lib/types/database";

export interface AffiliateSaleRow {
  id: string;
  packageName: string;
  packagePrice: number;
  commissionAmount: number;
  commissionPercent: number;
  buyerEmail: string | null;
  buyerName: string | null;
  createdAt: string;
}

export interface AffiliateStats {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  coursesSold: number;
  totalEarned: number;
  availableBalance: number;
  pendingWithdrawals: number;
  paidOut: number;
  sales: AffiliateSaleRow[];
  earningsByPackage: { packageName: string; sales: number; earned: number }[];
}

function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export async function getAffiliateStats(userId: string): Promise<AffiliateStats> {
  const empty: AffiliateStats = {
    referralCode: "",
    referralLink: "",
    totalReferrals: 0,
    coursesSold: 0,
    totalEarned: 0,
    availableBalance: 0,
    pendingWithdrawals: 0,
    paidOut: 0,
    sales: [],
    earningsByPackage: [],
  };

  const supabase = await createServerSupabaseClient();
  if (!supabase) return empty;

  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("id", userId)
    .maybeSingle();

  let referralCode = (profile as DbProfile | null)?.referral_code ?? "";
  if (!referralCode) {
    referralCode = userId.replace(/-/g, "").slice(0, 8).toUpperCase();
    await supabase.from("profiles").update({ referral_code: referralCode }).eq("id", userId);
  }

  const [
    { count: referralCount },
    { data: commissions },
    { data: payments },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("referred_by", userId),
    supabase
      .from("affiliate_commissions")
      .select("*")
      .eq("affiliate_id", userId)
      .eq("status", "credited")
      .order("created_at", { ascending: false }),
    supabase
      .from("payment_requests")
      .select("amount, status")
      .eq("user_id", userId),
  ]);

  const creditRows = (commissions as DbAffiliateCommission[] | null) ?? [];
  const totalEarned = creditRows.reduce(
    (sum, row) => sum + Number(row.commission_amount),
    0
  );

  const paymentRows = payments ?? [];
  const pendingWithdrawals = paymentRows
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const paidOut = paymentRows
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const availableBalance = Math.max(0, totalEarned - pendingWithdrawals - paidOut);

  const buyerIds = [...new Set(creditRows.map((c) => c.buyer_id))];
  const buyerMap = new Map<string, { email: string; full_name: string | null }>();
  if (buyerIds.length) {
    const { data: buyers } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .in("id", buyerIds);
    for (const b of buyers ?? []) {
      buyerMap.set(b.id, { email: b.email, full_name: b.full_name });
    }
  }

  const sales: AffiliateSaleRow[] = creditRows.map((row) => {
    const buyer = buyerMap.get(row.buyer_id);
    return {
      id: row.id,
      packageName: row.package_name,
      packagePrice: Number(row.package_price),
      commissionAmount: Number(row.commission_amount),
      commissionPercent: Number(row.commission_percent),
      buyerEmail: buyer?.email ?? null,
      buyerName: buyer?.full_name ?? null,
      createdAt: row.created_at,
    };
  });

  const byPackage = new Map<string, { sales: number; earned: number }>();
  for (const row of creditRows) {
    const key = row.package_name || "Package";
    const current = byPackage.get(key) ?? { sales: 0, earned: 0 };
    current.sales += 1;
    current.earned += Number(row.commission_amount);
    byPackage.set(key, current);
  }

  return {
    referralCode,
    referralLink: `${siteUrl()}/?ref=${referralCode}`,
    totalReferrals: referralCount ?? 0,
    coursesSold: creditRows.length,
    totalEarned,
    availableBalance,
    pendingWithdrawals,
    paidOut,
    sales,
    earningsByPackage: [...byPackage.entries()].map(([packageName, data]) => ({
      packageName,
      ...data,
    })),
  };
}

export async function getUserPaymentRequests(userId: string): Promise<DbPaymentRequest[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("payment_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data as DbPaymentRequest[]) ?? [];
}

export async function getAllPaymentRequestsAdmin(): Promise<
  (DbPaymentRequest & { user_email?: string; user_name?: string | null })[]
> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("payment_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (data as DbPaymentRequest[]) ?? [];
  if (!rows.length) return [];

  const userIds = [...new Set(rows.map((r) => r.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .in("id", userIds);

  const map = new Map((profiles ?? []).map((p) => [p.id, p]));

  return rows.map((row) => ({
    ...row,
    user_email: map.get(row.user_id)?.email,
    user_name: map.get(row.user_id)?.full_name ?? null,
  }));
}

export async function getAdminAffiliateOverview() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      totalAffiliates: 0,
      totalSales: 0,
      totalCommissions: 0,
      pendingPayments: 0,
      pendingAmount: 0,
      topAffiliates: [] as {
        id: string;
        name: string | null;
        email: string;
        sales: number;
        earned: number;
        referrals: number;
      }[],
      recentSales: [] as AffiliateSaleRow[],
    };
  }

  const [{ data: commissions }, { data: payments }, { data: profiles }] =
    await Promise.all([
      supabase
        .from("affiliate_commissions")
        .select("*")
        .eq("status", "credited")
        .order("created_at", { ascending: false }),
      supabase.from("payment_requests").select("amount, status"),
      supabase.from("profiles").select("id, email, full_name, referral_code").eq("role", "student"),
    ]);

  const creditRows = (commissions as DbAffiliateCommission[]) ?? [];
  const pendingPayments = (payments ?? []).filter((p) => p.status === "pending");

  const affiliateMap = new Map<
    string,
    { sales: number; earned: number }
  >();
  for (const row of creditRows) {
    const cur = affiliateMap.get(row.affiliate_id) ?? { sales: 0, earned: 0 };
    cur.sales += 1;
    cur.earned += Number(row.commission_amount);
    affiliateMap.set(row.affiliate_id, cur);
  }

  const referralCounts = new Map<string, number>();
  const { data: referred } = await supabase
    .from("profiles")
    .select("referred_by")
    .not("referred_by", "is", null);
  for (const p of referred ?? []) {
    if (!p.referred_by) continue;
    referralCounts.set(p.referred_by, (referralCounts.get(p.referred_by) ?? 0) + 1);
  }

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const topAffiliates = [...affiliateMap.entries()]
    .map(([id, stats]) => {
      const p = profileMap.get(id);
      return {
        id,
        name: p?.full_name ?? null,
        email: p?.email ?? "—",
        sales: stats.sales,
        earned: stats.earned,
        referrals: referralCounts.get(id) ?? 0,
      };
    })
    .sort((a, b) => b.earned - a.earned)
    .slice(0, 20);

  const buyerIds = [...new Set(creditRows.slice(0, 30).map((c) => c.buyer_id))];
  const buyerMap = new Map<string, { email: string; full_name: string | null }>();
  if (buyerIds.length) {
    const { data: buyers } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .in("id", buyerIds);
    for (const b of buyers ?? []) {
      buyerMap.set(b.id, { email: b.email, full_name: b.full_name });
    }
  }

  const recentSales: AffiliateSaleRow[] = creditRows.slice(0, 30).map((row) => {
    const buyer = buyerMap.get(row.buyer_id);
    return {
      id: row.id,
      packageName: row.package_name,
      packagePrice: Number(row.package_price),
      commissionAmount: Number(row.commission_amount),
      commissionPercent: Number(row.commission_percent),
      buyerEmail: buyer?.email ?? null,
      buyerName: buyer?.full_name ?? null,
      createdAt: row.created_at,
    };
  });

  return {
    totalAffiliates: affiliateMap.size,
    totalSales: creditRows.length,
    totalCommissions: creditRows.reduce(
      (sum, r) => sum + Number(r.commission_amount),
      0
    ),
    pendingPayments: pendingPayments.length,
    pendingAmount: pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0),
    topAffiliates,
    recentSales,
    commissionPercent: COMMISSION_PERCENT,
  };
}
