import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, AlertTriangle, Clock, Ban } from "lucide-react";
import PaymentClient, { type CartItem } from "./checkout";
import { prisma } from "@/lib/sql/prisma";
import { verifyCheckoutLink } from "@/lib/helper/checkout-link";

interface PageProps {
  searchParams: Promise<{
    userid?: string;
    exp?: string;
    sig?: string;
    medium?: string;
    pid?: string;
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

async function getCheckoutUser(id: string): Promise<CheckoutUser | null> {
  try {
    const row = await prisma.users.findFirst({
      where: { id },
      select: { username: true, name: true, email: true, phone: true, address: true },
    });
    if (!row) return null;
    return {
      username: row.username ?? "",
      name: row.name ?? "",
      email: row.email ?? "",
      phone: row.phone ?? "",
      address: row.address ?? "",
    };
  } catch (e) {
    console.error("getCheckoutUser failed:", e);
    return null;
  }
}

async function getSingleItem(productId: string): Promise<CartItem[] | null> {
  try {
    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: { id: true, title: true, price: true },
    });
    if (!product) return null;
    return [
      { id: product.id, title: product.title, price: Number(product.price), quantity: 1 },
    ];
  } catch (e) {
    console.error("getSingleItem failed:", e);
    return null;
  }
}

async function getCartItems(userId: string): Promise<CartItem[]> {
  try {
    const rows = await prisma.cart.findMany({
      where: { user_id: userId },
      select: { product_id: true, amount: true },
    });
    if (rows.length === 0) return [];

    const products = await prisma.products.findMany({
      where: { id: { in: rows.map((r) => r.product_id) } },
      select: { id: true, title: true, price: true },
    });
    const byId = new Map(products.map((p) => [p.id, p]));

    return rows.flatMap((r) => {
      const p = byId.get(r.product_id);
      if (!p) return []; // product was deleted, skip it
      return [
        { id: p.id, title: p.title, price: Number(p.price), quantity: r.amount },
      ];
    });
  } catch (e) {
    console.error("getCartItems failed:", e);
    return [];
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

/* ---------- Page ---------- */

export default async function CheckoutPage({ searchParams }: PageProps) {
  const { userid, exp, sig, medium, pid } = await searchParams;

  const check = verifyCheckoutLink({ userid, exp, medium, pid, sig });

  if (!check.ok) {
    switch (check.reason) {
      case "missing":
        return (
          <ErrorCard
            tone="amber"
            icon={<AlertTriangle className="size-8" />}
            title="Invalid Checkout Link"
            message="This link is missing required verification parameters. Please return to your cart and try again."
            cta="Return to Cart"
          />
        );
      case "expired":
        return (
          <ErrorCard
            tone="orange"
            icon={<Clock className="size-8" />}
            title="Session Timed Out"
            message="For your security, checkout links expire after a short period. Please generate a fresh link from your cart."
            cta="Back to Cart"
          />
        );
      default:
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
  }

  const userId = check.userid.trim();
  const user = await getCheckoutUser(userId);

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

  // redirect() throws internally, so it must stay outside any try/catch
  let items: CartItem[];

  if (check.medium === "p") {
    const single = await getSingleItem(check.productId!);
    if (!single) redirect("/");
    items = single;
  } else {
    items = await getCartItems(userId);
    if (items.length === 0) redirect("/cart");
  }

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
          userid={check.userid}
          exp={String(check.exp)}
          sig={sig as string}
          medium={check.medium}
          productId={check.productId}
          user={user}
          initialItems={items}
        />
      </div>
    </main>
  );
}