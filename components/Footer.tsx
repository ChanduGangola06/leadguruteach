"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";

const quickLinks = [
  { label: "FAQ's", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "End User Agreement", href: "#" },
  { label: "Disclaimer", href: "#" },
  { label: "Membership", href: "#" },
];

const companyLinks = [
  { label: "Blog", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Refund Policy", href: "#" },
  { label: "Sitemap", href: "#" },
];

const courseLinks = [
  { label: "Bronze Bundle", href: "/bundle/bronze-bundle" },
  { label: "Silver Package", href: "/bundle/silver-package" },
  { label: "Gold Package", href: "/bundle/gold-package" },
  { label: "Platinum Package", href: "/bundle/platinum-package" },
  { label: "Diamond Package", href: "/bundle/diamond-package" },
  { label: "Startup Package", href: "/bundle/startup-package" },
];

export default function Footer() {
  return (
    <footer id="affiliate" className="relative border-t border-white/5 bg-navy-light/50">
      <div className="glow-orb glow-orb-purple -bottom-32 left-1/3 h-64 w-64 opacity-50" />

      <div className="section-padding relative mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="font-heading text-2xl font-bold gradient-text">
              LeadGuruTeach
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Get ahead in your career with LeadGuruTeach, the one-stop solution for your
              educational needs. Connect with top industry professionals and fuel your passion
              for success.
            </p>

            <div className="mt-6">
              <p className="mb-3 text-sm font-medium text-white">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input-glow w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-purple-vibrant to-cyan-neon px-4 py-3 text-sm font-semibold text-white"
                >
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading mb-4 font-semibold text-white">Quick Links</h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-cyan-neon"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading mb-4 font-semibold text-white">Company</h4>
            <ul className="flex flex-col gap-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-cyan-neon"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-heading mb-4 font-semibold text-white">Course Packages</h4>
            <ul className="flex flex-col gap-2.5">
              {courseLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-cyan-neon"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-sm text-slate-500">
            &copy; 2026 LeadGuruTeach. All Rights Reserved.
          </p>
          <p className="text-center text-xs text-slate-600 md:text-right">
            LeadGuruTeach is not responsible for payments made to anyone other than our official
            website or affiliate links.
          </p>
        </div>
      </div>
    </footer>
  );
}
