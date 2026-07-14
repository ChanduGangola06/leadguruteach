import SetupNotice from "@/components/admin/SetupNotice";
import { getAdminAffiliateOverview } from "@/lib/queries/affiliate";
import { COMMISSION_PERCENT } from "@/lib/affiliate/constants";
import Link from "next/link";
import { IndianRupee, ShoppingBag, Users, Wallet } from "lucide-react";

export default async function AdminLeadsPage() {
  const overview = await getAdminAffiliateOverview();

  const cards = [
    {
      label: "Active Affiliates",
      value: overview.totalAffiliates,
      icon: Users,
      href: null,
    },
    {
      label: "Courses Sold (via refs)",
      value: overview.totalSales,
      icon: ShoppingBag,
      href: null,
    },
    {
      label: "Commissions Paid Out Credited",
      value: `₹${overview.totalCommissions.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      href: null,
    },
    {
      label: "Pending Payments",
      value: `${overview.pendingPayments} · ₹${overview.pendingAmount.toLocaleString("en-IN")}`,
      icon: Wallet,
      href: "/dashboard/admin/payments",
    },
  ];

  return (
    <>
      <SetupNotice />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">Leads & Affiliates</h1>
          <p className="text-sm text-slate-600">
            Track referrals, package sales, and commissions ({COMMISSION_PERCENT}% per referred
            sale).
          </p>
        </div>
        <Link
          href="/dashboard/admin/payments"
          className="rounded-xl bg-gradient-to-r from-purple-vibrant to-cyan-neon px-4 py-2.5 text-sm font-semibold text-white"
        >
          Review Payments
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const content = (
            <div className="glass-strong rounded-2xl p-5">
              <Icon size={20} className="mb-3 text-cyan-neon" />
              <p className="font-heading text-xl font-bold text-slate-900">{card.value}</p>
              <p className="mt-1 text-sm text-slate-600">{card.label}</p>
            </div>
          );
          return card.href ? (
            <Link key={card.label} href={card.href}>
              {content}
            </Link>
          ) : (
            <div key={card.label}>{content}</div>
          );
        })}
      </div>

      <section className="mb-8 glass-strong rounded-2xl p-5">
        <h2 className="font-heading text-lg font-semibold text-slate-900">Top Affiliates</h2>
        {overview.topAffiliates.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No affiliate sales yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-amber-200/50 text-left text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Affiliate</th>
                  <th className="pb-3 pr-4 font-medium">Referrals</th>
                  <th className="pb-3 pr-4 font-medium">Courses Sold</th>
                  <th className="pb-3 font-medium">Earned</th>
                </tr>
              </thead>
              <tbody>
                {overview.topAffiliates.map((a) => (
                  <tr key={a.id} className="border-b border-amber-100/80">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-slate-900">{a.name || "Student"}</p>
                      <p className="text-xs text-slate-500">{a.email}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-700">{a.referrals}</td>
                    <td className="py-3 pr-4 text-slate-700">{a.sales}</td>
                    <td className="py-3 font-semibold text-emerald-600">
                      ₹{a.earned.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="glass-strong rounded-2xl p-5">
        <h2 className="font-heading text-lg font-semibold text-slate-900">Recent Referred Sales</h2>
        {overview.recentSales.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No referred package purchases yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-amber-200/50 text-left text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Buyer</th>
                  <th className="pb-3 pr-4 font-medium">Package</th>
                  <th className="pb-3 pr-4 font-medium">Sale</th>
                  <th className="pb-3 font-medium">Commission</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-amber-100/80">
                    <td className="py-3 pr-4 text-xs text-slate-500">
                      {new Date(sale.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-slate-900">
                        {sale.buyerName || "Student"}
                      </p>
                      <p className="text-xs text-slate-500">{sale.buyerEmail}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-700">{sale.packageName}</td>
                    <td className="py-3 pr-4 text-slate-700">
                      ₹{sale.packagePrice.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 font-semibold text-emerald-600">
                      ₹{sale.commissionAmount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
