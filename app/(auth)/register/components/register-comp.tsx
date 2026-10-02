"use client";

import { useState } from "react";
import {useRouter} from "next/navigation";
import { useEffect } from "react";
import {
  Mail,
  User,
  AtSign,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  ArrowRight,
  Router,
} from "lucide-react";
import { register_user } from "@/lib/action/auth"; // 👈 adjust path to your auth.tsx

/* ------------------------------------------------------------------ */
/*  Tooltip wrapper — replaces the browser's default "dummy" tooltip  */
/* ------------------------------------------------------------------ */

function Tooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group/tip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/15 bg-[#0b1220]/95 px-2.5 py-1 text-[11px] font-medium text-white/90 opacity-0 shadow-xl backdrop-blur-md transition-all duration-200 group-hover/tip:-translate-y-0.5 group-hover/tip:opacity-100"
      >
        {label}
        <span className="absolute left-1/2 top-full h-1.5 w-1.5 -translate-x-1/2 -translate-y-[3px] rotate-45 border-b border-r border-white/15 bg-[#0b1220]/95" />
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable glass input                                              */
/* ------------------------------------------------------------------ */
type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
  right?: React.ReactNode;
};

function Field({ icon, right, className = "", ...props }: FieldProps) {
  return (
    <div className="group relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 transition-colors duration-200 group-focus-within:text-cyan-300">
        {icon}
      </span>

      <input
        {...props}
        className={`w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-11 ${
          right ? "pr-12" : "pr-4"
        } text-sm text-white placeholder-white/35 outline-none backdrop-blur-md transition-all duration-200
        hover:border-white/25 hover:bg-white/[0.07]
        focus:border-cyan-300/60 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/20
        disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      />

      {right && (
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">{right}</div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */
export default function RegisterPage() {
const new_route = useRouter()

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

   useEffect(()=>{
    if(success) new_route.push('/login')
   },[success,new_route])

  // bumping this key re-mounts the error box so the shake replays every time
  const [shakeKey, setShakeKey] = useState(0);

  const update =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  /** set error + trigger the shake animation again */
  const fail = (message: string) => {
    setError(message);
    setShakeKey((k) => k + 1);
  };

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    /* ---------- frontend validation ---------- */
    if (
      !form.name.trim() ||
      !form.username.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      return fail("Please fill in all the fields.");
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return fail("Please enter a valid email address.");
    }

    if (form.password.length < 8) {
      return fail("Password must be at least 8 characters.");
    }

    if (form.password !== form.confirmPassword) {
      return fail("Passwords do not match.");
    }

    /* ---------- server action ---------- */
    setLoading(true);
    try {
      const res: { success: boolean; error?: string } = await register_user({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      if (!res?.success) {
        fail(res?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      setForm({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      fail(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060a13] p-4">
      {/* keyframes for the error / success animations */}
      <style>{`
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20%      { transform: translateX(-7px); }
          40%      { transform: translateX(7px); }
          60%      { transform: translateX(-4px); }
          80%      { transform: translateX(4px); }
        }
        @keyframes errorIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* ambient blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/25 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/25 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[110px]" />

      {/* card */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        {/* subtle inner highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />

        <div className="relative">
          {/* header */}
          <div className="mb-7 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-105">
              <UserPlus className="h-6 w-6 text-cyan-300" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Create an account
            </h1>
            <p className="mt-1.5 text-sm text-white/50">
              Join us — it only takes a minute.
            </p>
          </div>

          {/* error banner */}
          {error && (
            <div
              key={shakeKey}
              style={{
                animation:
                  "errorIn 0.25s ease-out, shakeX 0.45s ease-in-out 0.05s",
              }}
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-500/15 px-3.5 py-3 text-sm text-red-200 backdrop-blur-md"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {/* success banner */}
          {success && !error && (
            <div
              style={{ animation: "errorIn 0.3s ease-out" }}
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-3.5 py-3 text-sm text-emerald-200 backdrop-blur-md"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
              <span className="leading-snug">
                Account created successfully!
              </span>
            </div>
          )}

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Field
              icon={<User className="h-5 w-5" />}
              type="text"
              placeholder="Full name"
              autoComplete="name"
              value={form.name}
              onChange={update("name")}
              disabled={loading}
            />

            <Field
              icon={<AtSign className="h-5 w-5" />}
              type="text"
              placeholder="Username"
              autoComplete="username"
              value={form.username}
              onChange={update("username")}
              disabled={loading}
            />

            <Field
              icon={<Mail className="h-5 w-5" />}
              type="email"
              placeholder="Email address"
              autoComplete="email"
              value={form.email}
              onChange={update("email")}
              disabled={loading}
            />

            <Field
              icon={<Lock className="h-5 w-5" />}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="new-password"
              value={form.password}
              onChange={update("password")}
              disabled={loading}
              right={
                <Tooltip label={showPassword ? "Hide password" : "Show password"}>
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="cursor-pointer rounded-lg p-1.5 text-white/40 transition-colors duration-200 hover:bg-white/10 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </Tooltip>
              }
            />

            <Field
              icon={<Lock className="h-5 w-5" />}
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={update("confirmPassword")}
              disabled={loading}
              className={passwordsMismatch ? "border-red-400/50 focus:border-red-400/70 focus:ring-red-400/20" : ""}
              right={
                <Tooltip label={showConfirm ? "Hide password" : "Show password"}>
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirm((v) => !v)}
                    className="cursor-pointer rounded-lg p-1.5 text-white/40 transition-colors duration-200 hover:bg-white/10 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </Tooltip>
              }
            />

            {/* inline mismatch hint */}
            {passwordsMismatch && (
              <p className="flex items-center gap-1.5 pl-1 text-xs text-red-300/90">
                <AlertCircle className="h-3.5 w-3.5" />
                Passwords do not match
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-2 flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-cyan-500/80 to-indigo-500/80 py-3 text-sm font-medium text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:from-cyan-400/90 hover:to-indigo-400/90 hover:shadow-cyan-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* footer */}
          <p className="mt-6 text-center text-sm text-white/50">
            Already have an account?{" "}
            <a
              href="/login"
              className="cursor-pointer font-medium text-cyan-300 transition-colors hover:text-cyan-200 hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}