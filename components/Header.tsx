"use client";

import Navbar from "@/components/Navbar";

export const NAVBAR_HEIGHT = 76;

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Navbar />
    </div>
  );
}
