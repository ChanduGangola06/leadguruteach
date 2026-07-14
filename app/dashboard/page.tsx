import DashboardOverview from "@/components/dashboard/DashboardOverview";
import { getAffiliateStats } from "@/lib/queries/affiliate";
import {
  getUserCourses,
  getUserEnrolledPackages,
} from "@/lib/queries/userPackages";
import { getProfile } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const profile = await getProfile();

  if (!profile) {
    return (
      <DashboardOverview
        courses={[]}
        packagesOwned={0}
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

  const [courses, enrollments, stats] = await Promise.all([
    getUserCourses(profile.id),
    getUserEnrolledPackages(profile.id),
    getAffiliateStats(profile.id),
  ]);

  return (
    <DashboardOverview
      courses={courses}
      packagesOwned={enrollments.length}
      stats={stats}
    />
  );
}
