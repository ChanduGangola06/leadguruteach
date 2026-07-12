import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LeadGuruTeach | Learn, Earn & Dominate",
  description:
    "The ultimate ed-tech platform combining top-notch skill development with an industry-leading affiliate program. Unlock your potential today.",
  keywords: ["ed-tech", "online courses", "affiliate marketing", "skill development"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-navy text-foreground antialiased">{children}</body>
    </html>
  );
}
