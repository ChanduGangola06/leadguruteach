import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { getPackageBySlug } from "@/lib/queries/packages";
import { userOwnsPackageBySlug } from "@/lib/queries/userPackages";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getPackageBySlug(slug);
  if (!bundle) return { title: "Checkout | LeadGuruTeach" };
  return {
    title: `Checkout — ${bundle.name} | LeadGuruTeach`,
    description: `Purchase ${bundle.name} and unlock all courses in your dashboard.`,
  };
}

export default async function CheckoutPage({ params }: PageProps) {
  const { slug } = await params;
  const bundle = await getPackageBySlug(slug);
  if (!bundle) notFound();

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) {
    redirect(`/login?next=/checkout/${slug}`);
  }

  const owned = await userOwnsPackageBySlug(user.id, slug);

  return (
    <main className="relative min-h-screen bg-navy px-4 py-10 md:px-8">
      <div className="mx-auto mb-8 flex max-w-lg items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-vibrant to-cyan-neon">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="font-heading text-lg font-bold gradient-text">LeadGuruTeach</span>
        </Link>
        <Link href="/dashboard/courses" className="text-sm text-slate-600 hover:text-slate-900">
          My Courses
        </Link>
      </div>

      <div className="mx-auto max-w-lg">
        <CheckoutForm bundle={bundle} owned={owned} />
      </div>
    </main>
  );
}
