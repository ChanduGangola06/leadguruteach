import EarningsPanel from "@/components/dashboard/EarningsPanel";
import {
  getAffiliateStats,
  getUserPaymentRequests,
} from "@/lib/queries/affiliate";
import { getProfile } from "@/lib/supabase/server";

export default async function EarningsPage() {
  const profile = await getProfile();
  if (!profile) {
    return (
      <EarningsPanel
        stats={{
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
        }}
        requests={[]}
      />
    );
  }

  const [stats, requests] = await Promise.all([
    getAffiliateStats(profile.id),
    getUserPaymentRequests(profile.id),
  ]);

  return <EarningsPanel stats={stats} requests={requests} />;
}
