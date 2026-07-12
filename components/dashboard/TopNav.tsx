"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Menu, ChevronDown, LogOut, User, Settings } from "lucide-react";
import Link from "next/link";

interface TopNavProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

export default function TopNav({ onMenuClick, sidebarCollapsed }: TopNavProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header
      className={`glass-strong sticky top-0 z-20 flex items-center justify-between border-b border-amber-200/40 px-4 py-3 transition-all lg:px-6 ${
        sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-white/80 hover:text-slate-900 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="font-heading text-lg font-semibold text-slate-900 md:text-xl">
            Welcome back, <span className="gradient-text">Student</span>
          </h1>
          <p className="text-xs text-slate-500 md:text-sm">
            Here&apos;s what&apos;s happening with your learning today.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          className="relative rounded-xl p-2.5 text-slate-600 transition-all hover:bg-white/80 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
        </button>

        {/* Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl p-1.5 transition-all hover:bg-white/80"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-vibrant to-cyan-neon text-sm font-bold text-slate-900">
              ST
            </div>
            <ChevronDown
              size={16}
              className={`hidden text-slate-600 transition-transform md:block ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="glass-strong absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-amber-200/60 shadow-glow"
                >
                  <div className="border-b border-amber-200/40 px-4 py-3">
                    <p className="text-sm font-medium text-slate-900">Student User</p>
                    <p className="text-xs text-slate-500">student@leadguruteach.com</p>
                  </div>
                  <div className="p-1">
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-white/80 hover:text-slate-900"
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-white/80 hover:text-slate-900"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <Link
                      href="/"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      <LogOut size={16} />
                      Logout
                    </Link>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
