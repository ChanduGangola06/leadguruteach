import AffiliatePanel from "@/components/dashboard/AffiliatePanel";
import { getAffiliateStats } from "@/lib/queries/affiliate";
import { getProfile } from "@/lib/supabase/server";

export default async function AffiliatePage() {
  const profile = await getProfile();
  if (!profile) {
    return (
      <AffiliatePanel
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
      />
    );
  }

  const stats = await getAffiliateStats(profile.id);
  return <AffiliatePanel stats={stats} />;
}
