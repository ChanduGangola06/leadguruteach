"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import SplineScene from "@/components/ui/SplineScene";

type AuthMode = "login" | "signup";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = true,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="relative">
      <input
        id={id}
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className="input-glow peer w-full rounded-xl border border-white/10 bg-white/5 px-4 pb-3 pt-6 text-sm text-white transition-all"
        placeholder=" "
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 transition-all duration-200 ${
          focused || value
            ? "top-2 text-xs text-cyan-neon"
            : "top-1/2 -translate-y-1/2 text-sm text-slate-500"
        }`}
      >
        {label}
      </label>
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", password: "" });

  const switchMode = (newMode: AuthMode) => {
    setDirection(newMode === "signup" ? 1 : -1);
    setMode(newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    window.location.href = "/dashboard";
  };

  const updateField = (field: keyof FormData) => (val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="flex min-h-screen bg-navy">
      {/* Left Panel - Visuals */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-vibrant/30 via-navy to-cyan-neon/20" />
        <div className="glow-orb glow-orb-purple absolute left-1/4 top-1/4 h-96 w-96 animate-pulse-glow" />
        <div className="glow-orb glow-orb-cyan absolute bottom-1/4 right-1/4 h-80 w-80 animate-pulse-glow" />

        <div className="relative flex h-full flex-col items-center justify-center p-12">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="h-[400px] w-full max-w-lg"
          >
            <SplineScene className="h-full w-full" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <h2 className="font-heading text-3xl font-bold text-white">
              Unlock Your <span className="gradient-text">Potential</span>
            </h2>
            <p className="mt-2 text-slate-400">
              Join 2 Lakh+ students learning and earning with LeadGuruTeach
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 self-start text-sm text-slate-400 transition-colors hover:text-cyan-neon lg:self-center"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <Link href="/" className="font-heading text-2xl font-bold gradient-text lg:hidden">
              LeadGuruTeach
            </Link>
            <h1 className="font-heading mt-4 text-3xl font-bold text-white">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {mode === "login"
                ? "Sign in to continue your learning journey"
                : "Start your journey to learn, earn, and dominate"}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="glass mb-8 flex rounded-xl p-1">
            {(["login", "signup"] as AuthMode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`relative flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  mode === m ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {mode === m && (
                  <motion.div
                    layoutId="auth-tab"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-vibrant/30 to-cyan-neon/30"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative capitalize">{m === "login" ? "Login" : "Sign Up"}</span>
              </button>
            ))}
          </div>

          <div className="glass-strong rounded-3xl p-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.form
                key={mode}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
              >
                {mode === "signup" && (
                  <FloatingInput
                    id="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={updateField("name")}
                  />
                )}
                <FloatingInput
                  id="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={updateField("email")}
                />
                <FloatingInput
                  id="password"
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={updateField("password")}
                />

                {mode === "login" && (
                  <div className="flex justify-end">
                    <button type="button" className="text-xs text-cyan-neon hover:underline">
                      Forgot password?
                    </button>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-vibrant to-cyan-neon py-3.5 text-sm font-semibold text-white shadow-glow disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {mode === "login" ? "Signing in..." : "Creating account..."}
                    </>
                  ) : mode === "login" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </motion.button>
              </motion.form>
            </AnimatePresence>

            <p className="mt-6 text-center text-xs text-slate-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
