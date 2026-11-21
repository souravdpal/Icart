import crypto from "crypto";
import Link from "next/link";
import { ShieldCheck, AlertTriangle, Clock, Ban } from "lucide-react";
import PaymentClient from "./checkout";
import { prisma } from "@/lib/sql/prisma";

interface PageProps {
  searchParams: Promise<{
    userid?: string;
    exp?: string;
    sig?: string;
  }>;
}

interface CheckoutUser {
  username: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

/* ---------- Helpers ---------- */

function getSecret(): string {
  const secret = process.env.api_salt_key;
  if (!secret) throw new Error("api_salt_key is not set");
  return secret;
}

type LinkCheck = "ok" | "missing" | "expired" | "invalid";

function verifyCheckoutLink(userid?: string, exp?: string, sig?: string): LinkCheck {
  if (!userid || !exp || !sig) return "missing";

  const expiresAt = Number(exp);
  if (!Number.isFinite(expiresAt)) return "invalid";
  if (Math.floor(Date.now() / 1000) > expiresAt) return "expired";
  if (!/^[0-9a-f]{64}$/i.test(sig)) return "invalid";

  const expectedSig = crypto
    .createHmac("sha256", getSecret())
    .update(`${userid}.${exp}`)
    .digest("hex");

  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expectedSig, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b) ? "ok" : "invalid";
}

async function getCheckoutUser(id: string): Promise<CheckoutUser | null> {
  try {
    const row = await prisma.users.findFirst({
      where: { id },
      select: { username: true, name_: true, email: true, phone: true, address: true },
    });
    if (!row) return null;
    return {
      username: row.username ?? "",
      name: row.name_ ?? "",
      email: row.email ?? "",
      phone: row.phone ?? "",
      address: row.address ?? "",
    };
  } catch (e) {
    console.error("getCheckoutUser failed:", e);
    return null;
  }
}

/* ---------- UI ---------- */

type Tone = "amber" | "orange" | "rose";

const TONES: Record<Tone, string> = {
  amber: "bg-amber-50 text-amber-500",
  orange: "bg-orange-50 text-orange-500",
  rose: "bg-rose-50 text-rose-500",
};

function ErrorCard({
  tone,
  icon,
  title,
  message,
  cta,
}: {
  tone: Tone;
  icon: React.ReactNode;
  title: string;
  message: string;
  cta: string;
}) {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
        <div
          className={`w-16 h-16 ${TONES[tone]} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner`}
        >
          {icon}
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-slate-500 text-sm mt-2 leading-relaxed">{message}</p>
        <div className="mt-8">
          <Link
            href="/cart"
            className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all shadow-sm"
          >
            {cta}
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ---------- Page (default export must be this component) ---------- */

export default async function CheckoutPage({ searchParams }: PageProps) {
  const { userid, exp, sig } = await searchParams;

  // Verify with the exact value that was signed
  const check = verifyCheckoutLink(userid, exp, sig);

  if (check === "missing") {
    return (
      <ErrorCard
        tone="amber"
        icon={<AlertTriangle className="size-8" />}
        title="Invalid Checkout Link"
        message="This link is missing required verification parameters. Please return to your cart and try again."
        cta="Return to Cart"
      />
    );
  }

  if (check === "expired") {
    return (
      <ErrorCard
        tone="orange"
        icon={<Clock className="size-8" />}
        title="Session Timed Out"
        message="For your security, checkout links expire after a short period. Please generate a fresh link from your cart."
        cta="Back to Cart"
      />
    );
  }

  if (check === "invalid") {
    return (
      <ErrorCard
        tone="rose"
        icon={<Ban className="size-8" />}
        title="Access Denied"
        message="Security verification failed. This link signature is invalid or has been modified."
        cta="Return to Cart"
      />
    );
  }

  const verifiedUserId = userid as string;
  const verifiedExp = exp as string;
  const verifiedSig = sig as string;

  // Trim only for the database lookup (your link currently has trailing spaces)
  const user = await getCheckoutUser(verifiedUserId.trim());

  if (!user) {
    return (
      <ErrorCard
        tone="amber"
        icon={<AlertTriangle className="size-8" />}
        title="Account Not Found"
        message="We couldn't load your account details. Please sign in again and retry."
        cta="Return to Cart"
      />
    );
  }

  // TODO: replace with the user's real cart items from the database
  const items = [
    { id: "prod_101", title: "Wireless Mechanical Keyboard", price: 2499, quantity: 1 },
    { id: "prod_102", title: "USB-C Ergonomic Mouse", price: 1299, quantity: 2 },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="size-6 text-cyan-600" /> Secure Checkout
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Signed in as{" "}
              <span className="font-medium text-slate-700">
                {user.name || user.username || user.email}
              </span>
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Secure Session Active
          </span>
        </div>

        <PaymentClient
          userid={verifiedUserId}
          exp={verifiedExp}
          sig={verifiedSig}
          user={user}
          initialItems={items}
        />
      </div>
    </main>
  );
}