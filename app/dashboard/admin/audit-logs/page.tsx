import SetupNotice from "@/components/admin/SetupNotice";
import { getAuditLogsAdmin } from "@/lib/queries/audit";

function StatusBadge({ success }: { success: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        success ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
      }`}
    >
      {success ? "OK" : "Fail"}
    </span>
  );
}

export default async function AdminAuditLogsPage() {
  const logs = await getAuditLogsAdmin(150);

  return (
    <>
      <SetupNotice />
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-slate-900">Audit Logs</h1>
        <p className="text-sm text-slate-600">
          Login, register, API calls, and button clicks. DevTools Console also logs in development.
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="glass-strong rounded-2xl p-12 text-center text-slate-500">
          No audit logs yet. Run{" "}
          <code className="rounded bg-amber-100 px-1 text-xs">supabase/migration_audit_logs.sql</code>{" "}
          in Supabase SQL Editor, then try login/register.
        </div>
      ) : (
        <div className="glass-strong overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-amber-200/60 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Button / API</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Error</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-amber-100/80 hover:bg-amber-50/50">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-800">{log.event_type}</span>
                    <span className="ml-2 text-xs text-slate-400">{log.event_category}</span>
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-xs text-slate-600">
                    {log.button_label && <div>{log.button_label}</div>}
                    {log.api_endpoint && (
                      <div className="font-mono text-purple-vibrant">
                        {log.api_method} {log.api_endpoint}
                      </div>
                    )}
                    {log.page_path && <div className="text-slate-400">{log.page_path}</div>}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{log.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge success={log.success} />
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-xs text-red-600">
                    {log.error_code && <span className="mr-1 font-mono">[{log.error_code}]</span>}
                    {log.error_message ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
