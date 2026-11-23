"use client";

import { useEffect, useState, useTransition } from "react";
import { LogOut, Loader2, ShieldAlert, AlertCircle } from "lucide-react";
import { logout } from "@/lib/action/logout";

/* Shared confirmation card: used inside the modal and on the /logout page */
export function LogoutPanel({ onCancel }: { onCancel: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const confirm = () => {
    setError("");
    startTransition(async () => {
      try {
        await logout(); // server action redirects on success
      } catch {
        setError("Couldn't log you out. Please try again.");
      }
    });
  };

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/60 dark:bg-red-950/60 dark:ring-red-950/30">
          <ShieldAlert className="h-7 w-7 text-red-600 dark:text-red-400" aria-hidden="true" />
        </div>
        <h2
          id="logout-title"
          className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          Log out of your account?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          You&apos;ll need to sign in again to see your orders and profile.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 flex w-full items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-left text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>

      <div className="flex gap-3 border-t border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
        <button
          type="button"
          autoFocus
          onClick={onCancel}
          disabled={isPending}
          className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          Stay signed in
        </button>
        <button
          type="button"
          onClick={confirm}
          disabled={isPending}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-offset-zinc-900"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Logging out…
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* Trigger button + modal, for use anywhere else in the app */
export default function LogoutButton({
  className = "",
  label = "Log out",
}: {
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group inline-flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 dark:text-zinc-300 dark:hover:border-red-900/50 dark:hover:bg-red-950/40 dark:hover:text-red-400 ${className}`}
      >
        <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
        {label}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-sm">
            <LogoutPanel onCancel={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}