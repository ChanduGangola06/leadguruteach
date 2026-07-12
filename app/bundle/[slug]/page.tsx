import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header, { NAVBAR_HEIGHT } from "@/components/Header";
import Footer from "@/components/Footer";
import BundleHero from "@/components/bundle/BundleHero";
import BundleOverview from "@/components/bundle/BundleOverview";
import BundleContent from "@/components/bundle/BundleContent";
import BundlePricingCard from "@/components/bundle/BundlePricingCard";
import BundleFAQ from "@/components/bundle/BundleFAQ";
import BundleTestimonials, { MobileBuyBar } from "@/components/bundle/BundleTestimonials";
import { getBundleBySlug, getAllBundleSlugs, bundleFAQs } from "@/lib/bundles";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBundleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const bundle = getBundleBySlug(slug);
  if (!bundle) return { title: "Bundle Not Found" };

  return {
    title: `${bundle.name} | LeadGuruTeach`,
    description: bundle.description,
  };
}

export default async function BundlePage({ params }: PageProps) {
  const { slug } = await params;
  const bundle = getBundleBySlug(slug);

  if (!bundle) notFound();

  return (
    <main className="relative min-h-screen bg-navy">
      <Header />
      <div style={{ height: NAVBAR_HEIGHT }} aria-hidden />

      <BundleHero bundle={bundle} />

      <div className="mx-auto max-w-7xl px-4 pb-24 md:px-8 lg:pb-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <BundleOverview bundle={bundle} />
            <BundleContent bundle={bundle} />
            <BundleFAQ faqs={bundleFAQs} />
            <BundleTestimonials />
          </div>
          <div className="lg:col-span-1">
            <BundlePricingCard bundle={bundle} />
          </div>
        </div>
      </div>

      <MobileBuyBar price={bundle.price} originalPrice={bundle.originalPrice} />
      <Footer />
    </main>
  );
}
