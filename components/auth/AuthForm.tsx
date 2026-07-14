"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import AuthVisualPanel from "@/components/auth/AuthVisualPanel";
import BrandLogo from "@/components/BrandLogo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { toUserAuthError } from "@/lib/supabase/auth-errors";
import { recordAuthAttempt } from "@/lib/audit/record";
import { AUTH_API } from "@/lib/audit/types";
import { loginAction, registerAction } from "@/app/actions/auth";

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
        className="input-glow peer w-full rounded-xl border border-amber-200/60 bg-white/80 px-4 pb-3 pt-6 text-sm text-slate-900 transition-all"
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
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}

interface AuthFormProps {
  defaultMode?: AuthMode;
  lockMode?: boolean;
}

function authErrorMeta(error: { message?: string; code?: string; status?: number }) {
  return {
    errorCode: error.code ?? (error.status ? String(error.status) : undefined),
    errorMessage: error.message,
  };
}

export default function AuthForm({ defaultMode = "login", lockMode = false }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", password: "" });
  const submittingRef = useRef(false);

  const switchMode = (newMode: AuthMode) => {
    if (lockMode) return;
    setDirection(newMode === "signup" ? 1 : -1);
    setMode(newMode);
    setAuthError("");
    setAuthSuccess("");
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setAuthError("Enter your email address first");
      return;
    }
    if (submittingRef.current) return;

    if (!isSupabaseConfigured()) {
      setAuthError("Password reset is unavailable. Please try again later.");
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    setAuthError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        recordAuthAttempt({
          eventType: "password_reset_failure",
          success: false,
          email: formData.email,
          buttonLabel: "Forgot password?",
          apiEndpoint: AUTH_API.recover.endpoint,
          apiMethod: AUTH_API.recover.method,
          ...authErrorMeta(error),
        });
        setAuthError(toUserAuthError(error, "reset"));
        return;
      }

      recordAuthAttempt({
        eventType: "password_reset_success",
        success: true,
        email: formData.email,
        buttonLabel: "Forgot password?",
        apiEndpoint: AUTH_API.recover.endpoint,
        apiMethod: AUTH_API.recover.method,
      });
      setResetSent(true);
    } catch (err) {
      recordAuthAttempt({
        eventType: "password_reset_failure",
        success: false,
        email: formData.email,
        apiEndpoint: AUTH_API.recover.endpoint,
        errorMessage: err instanceof Error ? err.message : "Unknown error",
      });
      setAuthError(toUserAuthError(null, "reset"));
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    setLoading(true);
    setAuthError("");
    setAuthSuccess("");
    submittingRef.current = true;

    const isLogin = mode === "login";

    try {
      if (!isSupabaseConfigured()) {
        setAuthError(toUserAuthError(null, isLogin ? "login" : "signup"));
        return;
      }

      if (mode === "login") {
        const result = await loginAction(formData.email.trim(), formData.password);

        if (result.error) {
          setAuthError(result.error);
          return;
        }

        window.location.href = result.redirectTo ?? "/dashboard";
      } else {
        const result = await registerAction(
          formData.email.trim(),
          formData.password,
          formData.name
        );

        if (result.error) {
          setAuthError(result.error);
          return;
        }

        if (result.success && result.message) {
          setAuthSuccess(result.message);
          return;
        }

        window.location.href = result.redirectTo ?? "/dashboard";
      }
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const updateField = (field: keyof FormData) => (val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const alternateHref = mode === "login" ? "/register" : "/login";
  const alternateLabel = mode === "login" ? "Create an account" : "Sign in instead";

  return (
    <div className="flex min-h-screen bg-[#FFFBF0]">
      <AuthVisualPanel mode={mode} />

      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 self-start text-sm text-slate-600 transition-colors hover:text-cyan-neon lg:self-center"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-2 flex justify-center lg:justify-start">
              <BrandLogo className="lg:hidden" size={48} />
            </div>
            <h1 className="font-heading mt-4 text-3xl font-bold text-slate-900">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {mode === "login"
                ? "Sign in to continue your learning journey"
                : "Start your journey to learn, earn, and dominate"}
            </p>
          </div>

          {!lockMode && (
            <div className="glass mb-8 flex rounded-xl p-1">
              {(["login", "signup"] as AuthMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`relative flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                    mode === m ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
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
          )}

          <div className="glass-strong rounded-3xl p-8">
            {authError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {authError}
              </div>
            )}
            {authSuccess && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                {authSuccess}
              </div>
            )}
            {resetSent && (
              <div className="mb-4 rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-800">
                Password reset link sent. Check your email.
              </div>
            )}
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
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-cyan-neon hover:underline"
                    >
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

            {lockMode && (
              <p className="mt-6 text-center text-sm text-slate-600">
                {mode === "login" ? "New here?" : "Already have an account?"}{" "}
                <Link href={alternateHref} className="font-medium text-cyan-neon hover:underline">
                  {alternateLabel}
                </Link>
              </p>
            )}

            <p className="mt-6 text-center text-xs text-slate-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
