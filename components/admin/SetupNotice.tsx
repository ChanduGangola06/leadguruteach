import Link from "next/link";
import { getSupabaseConfigError, isSupabaseConfigured } from "@/lib/supabase/client";

export default function SetupNotice() {
  if (isSupabaseConfigured()) return null;

  const detail = getSupabaseConfigError();

  return (
    <div className="mb-6 rounded-2xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-semibold">Supabase not configured</p>
      {detail && <p className="mt-1 text-amber-800">{detail}</p>}
      <p className="mt-1 text-amber-800">
        Add keys to <code className="rounded bg-amber-100 px-1">.env.local</code>, then run SQL from{" "}
        <code className="rounded bg-amber-100 px-1">supabase/schema.sql</code>.
      </p>
      <Link
        href="https://supabase.com/dashboard/project/wkugumqmthuuqwscbakd/settings/api"
        className="mt-2 inline-block text-purple-vibrant hover:underline"
      >
        Open Supabase API settings →
      </Link>
    </div>
  );
}
