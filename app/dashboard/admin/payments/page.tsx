import SetupNotice from "@/components/admin/SetupNotice";
import AdminPaymentsTable from "@/components/admin/AdminPaymentsTable";
import { getAllPaymentRequestsAdmin } from "@/lib/queries/affiliate";
import { MIN_WITHDRAWAL_AMOUNT } from "@/lib/affiliate/constants";
import Link from "next/link";

export default async function AdminPaymentsPage() {
  const requests = await getAllPaymentRequestsAdmin();
  const pending = requests.filter((r) => r.status === "pending").length;

  return (
    <>
      <SetupNotice />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">Payment Requests</h1>
          <p className="text-sm text-slate-600">
            Users can request ₹{MIN_WITHDRAWAL_AMOUNT}+. Use ✓ to confirm or ✕ to reject.
            {pending > 0 && (
              <span className="ml-2 font-medium text-amber-600">{pending} pending</span>
            )}
          </p>
        </div>
        <Link
          href="/dashboard/admin/leads"
          className="text-sm font-medium text-cyan-neon hover:underline"
        >
          ← Leads overview
        </Link>
      </div>

      <AdminPaymentsTable requests={requests} />
    </>
  );
}
