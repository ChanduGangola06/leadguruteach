"use client";

import { Check, X } from "lucide-react";
import { useTransition } from "react";
import { reviewPaymentRequestAction } from "@/app/actions/payments";
import type { DbPaymentRequest } from "@/lib/types/database";

type PaymentRow = DbPaymentRequest & {
  user_email?: string;
  user_name?: string | null;
};

export default function AdminPaymentsTable({
  requests,
}: {
  requests: PaymentRow[];
}) {
  return (
    <div className="glass-strong overflow-x-auto rounded-2xl">
      {requests.length === 0 ? (
        <p className="p-8 text-center text-sm text-slate-500">No payment requests yet.</p>
      ) : (
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-amber-200/50 bg-amber-50/40 text-left text-slate-600">
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Details</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Requested</th>
              <th className="p-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <PaymentRowItem key={req.id} req={req} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function PaymentRowItem({ req }: { req: PaymentRow }) {
  const [pending, startTransition] = useTransition();

  const review = (action: "approve" | "reject") => {
    const fd = new FormData();
    fd.set("id", req.id);
    fd.set("action", action);
    startTransition(async () => {
      await reviewPaymentRequestAction(fd);
    });
  };

  return (
    <tr className="border-b border-amber-100/80 hover:bg-amber-50/30">
      <td className="p-4">
        <p className="font-medium text-slate-900">{req.user_name || "Student"}</p>
        <p className="text-xs text-slate-500">{req.user_email}</p>
      </td>
      <td className="p-4 font-semibold text-slate-900">
        ₹{Number(req.amount).toLocaleString("en-IN")}
      </td>
      <td className="p-4 text-xs text-slate-600">
        {req.payment_method === "upi" ? (
          <span>UPI: {req.upi_id}</span>
        ) : (
          <span>
            {req.account_name}
            <br />
            {req.account_number} · {req.ifsc_code}
          </span>
        )}
      </td>
      <td className="p-4">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            req.status === "approved"
              ? "bg-emerald-100 text-emerald-700"
              : req.status === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-amber-100 text-amber-700"
          }`}
        >
          {req.status}
        </span>
        {req.admin_note && (
          <p className="mt-1 text-xs text-slate-400">{req.admin_note}</p>
        )}
      </td>
      <td className="p-4 text-xs text-slate-500">
        {new Date(req.created_at).toLocaleString()}
      </td>
      <td className="p-4">
        {req.status === "pending" ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => review("approve")}
              title="Confirm / Approve"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 transition hover:bg-emerald-500 hover:text-white disabled:opacity-50"
            >
              <Check size={18} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => review("reject")}
              title="Reject"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 text-red-600 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400">Reviewed</span>
        )}
      </td>
    </tr>
  );
}
