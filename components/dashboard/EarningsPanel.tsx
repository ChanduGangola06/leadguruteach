"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { requestPaymentAction } from "@/app/actions/payments";
import { MIN_WITHDRAWAL_AMOUNT } from "@/lib/affiliate/constants";
import type { AffiliateStats } from "@/lib/queries/affiliate";
import type { DbPaymentRequest } from "@/lib/types/database";

interface EarningsPanelProps {
  stats: AffiliateStats;
  requests: DbPaymentRequest[];
}

export default function EarningsPanel({ stats, requests }: EarningsPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [method, setMethod] = useState<"upi" | "bank">("upi");
  const [upiId, setUpiId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  const available = Number(stats.availableBalance) || 0;
  const canWithdraw = available >= MIN_WITHDRAWAL_AMOUNT;

  const [amount, setAmount] = useState(() =>
    canWithdraw ? String(Math.floor(available)) : String(MIN_WITHDRAWAL_AMOUNT)
  );

  useEffect(() => {
    if (available >= MIN_WITHDRAWAL_AMOUNT) {
      setAmount(String(Math.floor(available)));
    }
  }, [available]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (pending) return;

    if (!canWithdraw) {
      setError(
        `Insufficient balance. Available ₹${available.toLocaleString("en-IN")}. You need at least ₹${MIN_WITHDRAWAL_AMOUNT} from affiliate sales before requesting payment.`
      );
      return;
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount < MIN_WITHDRAWAL_AMOUNT) {
      setError(`Enter an amount of at least ₹${MIN_WITHDRAWAL_AMOUNT}.`);
      return;
    }
    if (parsedAmount > available) {
      setError(
        `Amount exceeds available balance (₹${available.toLocaleString("en-IN")}).`
      );
      return;
    }

    if (method === "upi" && !upiId.trim()) {
      setError("Please enter your UPI ID.");
      return;
    }
    if (method === "bank" && (!accountName.trim() || !accountNumber.trim() || !ifscCode.trim())) {
      setError("Please enter complete bank account details.");
      return;
    }

    const fd = new FormData();
    fd.set("amount", String(parsedAmount));
    fd.set("payment_method", method);
    fd.set("upi_id", upiId.trim());
    fd.set("account_name", accountName.trim());
    fd.set("account_number", accountNumber.trim());
    fd.set("ifsc_code", ifscCode.trim());

    startTransition(async () => {
      try {
        const result = await requestPaymentAction(fd);
        if (result?.error) {
          setError(result.error);
          return;
        }
        setSuccess("Payment request submitted. Admin will review it soon.");
        setUpiId("");
        setAccountName("");
        setAccountNumber("");
        setIfscCode("");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      }
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">Earnings</h1>
        <p className="mt-2 text-slate-600">
          Withdraw affiliate commissions. Minimum request is ₹{MIN_WITHDRAWAL_AMOUNT}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-strong rounded-2xl p-5">
          <p className="text-sm text-slate-500">Available</p>
          <p className="mt-1 font-heading text-2xl font-bold text-emerald-600">
            ₹{available.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="glass-strong rounded-2xl p-5">
          <p className="text-sm text-slate-500">Pending Requests</p>
          <p className="mt-1 font-heading text-2xl font-bold text-amber-600">
            ₹{stats.pendingWithdrawals.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="glass-strong rounded-2xl p-5">
          <p className="text-sm text-slate-500">Paid Out</p>
          <p className="mt-1 font-heading text-2xl font-bold text-slate-900">
            ₹{stats.paidOut.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {!canWithdraw && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Your available balance is ₹{available.toLocaleString("en-IN")}. Share your referral
          link from <strong>Affiliate Panel</strong> and earn commission when someone buys a
          package. Withdrawals unlock at ₹{MIN_WITHDRAWAL_AMOUNT}+.
        </div>
      )}

      <section className="glass-strong rounded-2xl p-5 md:p-6">
        <h2 className="font-heading text-lg font-semibold text-slate-900">
          Request Payment
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Submit a request to admin. They can confirm or reject it from the admin panel.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Amount (₹) — min {MIN_WITHDRAWAL_AMOUNT}
            </label>
            <input
              type="number"
              min={MIN_WITHDRAWAL_AMOUNT}
              max={Math.max(available, MIN_WITHDRAWAL_AMOUNT)}
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-glow w-full rounded-xl border border-amber-200/60 bg-white px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-600">Receive via</label>
            <div className="flex gap-3">
              {(["upi", "bank"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`rounded-xl border px-4 py-2.5 text-sm ${
                    method === m
                      ? "border-purple-vibrant bg-purple-vibrant/10 text-purple-vibrant"
                      : "border-amber-200/60 bg-white text-slate-600"
                  }`}
                >
                  {m === "upi" ? "UPI" : "Bank Transfer"}
                </button>
              ))}
            </div>
          </div>

          {method === "upi" ? (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">UPI ID</label>
              <input
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="name@upi"
                className="input-glow w-full rounded-xl border border-amber-200/60 bg-white px-4 py-2.5 text-sm"
              />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Account Name
                </label>
                <input
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="input-glow w-full rounded-xl border border-amber-200/60 bg-white px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Account Number
                </label>
                <input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="input-glow w-full rounded-xl border border-amber-200/60 bg-white px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">IFSC</label>
                <input
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="input-glow w-full rounded-xl border border-amber-200/60 bg-white px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-vibrant to-cyan-neon px-6 py-3 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-70"
          >
            {pending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Submitting…
              </>
            ) : (
              "Submit Payment Request"
            )}
          </button>
        </form>
      </section>

      <section className="glass-strong rounded-2xl p-5">
        <h2 className="font-heading text-lg font-semibold text-slate-900">
          Your Payment Requests
        </h2>
        {requests.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No payment requests yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200/40 bg-white/70 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    ₹{Number(req.amount).toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-slate-500">
                    {req.payment_method === "upi"
                      ? `UPI: ${req.upi_id}`
                      : `Bank: ${req.account_name} · ${req.account_number}`}
                    {" · "}
                    {new Date(req.created_at).toLocaleString()}
                  </p>
                  {req.admin_note && (
                    <p className="mt-1 text-xs text-slate-500">Note: {req.admin_note}</p>
                  )}
                </div>
                <StatusChip status={req.status} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatusChip({ status }: { status: DbPaymentRequest["status"] }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
        <CheckCircle2 size={14} /> Approved
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
        <XCircle size={14} /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
      <Clock size={14} /> Pending
    </span>
  );
}
