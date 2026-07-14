"use client";

import { useMemo, useState } from "react";
import { Check, Copy, IndianRupee, Link2, ShoppingBag, Users } from "lucide-react";
import type { AffiliateStats } from "@/lib/queries/affiliate";
import { COMMISSION_PERCENT } from "@/lib/affiliate/constants";

export default function AffiliatePanel({ stats }: { stats: AffiliateStats }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(stats.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cards = useMemo(
    () => [
      {
        label: "People Referred",
        value: stats.totalReferrals,
        icon: Users,
        hint: "Signed up with your link",
      },
      {
        label: "Courses Sold",
        value: stats.coursesSold,
        icon: ShoppingBag,
        hint: "Packages bought via your referral",
      },
      {
        label: "Total Earned",
        value: `₹${stats.totalEarned.toLocaleString("en-IN")}`,
        icon: IndianRupee,
        hint: `${COMMISSION_PERCENT}% commission per sale`,
      },
      {
        label: "Available Balance",
        value: `₹${stats.availableBalance.toLocaleString("en-IN")}`,
        icon: Link2,
        hint: "Ready to withdraw",
      },
    ],
    [stats]
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">Affiliate Panel</h1>
        <p className="mt-2 text-slate-600">
          Share your link, track referrals, courses sold, and earnings from each package.
        </p>
      </div>

      <div className="glass-strong rounded-2xl p-5">
        <p className="text-sm font-medium text-slate-700">Your referral link</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            readOnly
            value={stats.referralLink}
            className="input-glow flex-1 rounded-xl border border-amber-200/60 bg-white px-4 py-2.5 text-sm text-slate-800"
          />
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-vibrant to-cyan-neon px-5 py-2.5 text-sm font-semibold text-white"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy Link"}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Code: <span className="font-mono font-semibold text-purple-vibrant">{stats.referralCode}</span>
          {" · "}Anyone who registers or buys through this link counts as your lead.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-strong rounded-2xl p-5">
              <Icon size={20} className="mb-3 text-cyan-neon" />
              <p className="font-heading text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{card.label}</p>
              <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
            </div>
          );
        })}
      </div>

      <section className="glass-strong rounded-2xl p-5">
        <h2 className="font-heading text-lg font-semibold text-slate-900">
          Earnings by Package
        </h2>
        {stats.earningsByPackage.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No package sales yet. Share your link to start earning.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-200/50 text-left text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Package</th>
                  <th className="pb-3 pr-4 font-medium">Sold</th>
                  <th className="pb-3 font-medium">Earned</th>
                </tr>
              </thead>
              <tbody>
                {stats.earningsByPackage.map((row) => (
                  <tr key={row.packageName} className="border-b border-amber-100/80">
                    <td className="py-3 pr-4 font-medium text-slate-900">{row.packageName}</td>
                    <td className="py-3 pr-4 text-slate-600">{row.sales}</td>
                    <td className="py-3 font-semibold text-emerald-600">
                      ₹{row.earned.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="glass-strong rounded-2xl p-5">
        <h2 className="font-heading text-lg font-semibold text-slate-900">Recent Sales</h2>
        {stats.sales.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No referred purchases yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-amber-200/50 text-left text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Buyer</th>
                  <th className="pb-3 pr-4 font-medium">Package</th>
                  <th className="pb-3 pr-4 font-medium">Sale</th>
                  <th className="pb-3 font-medium">Your Earn</th>
                </tr>
              </thead>
              <tbody>
                {stats.sales.map((sale) => (
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
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        ({sale.commissionPercent}%)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
