"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Smartphone,
  Banknote,
  Lock,
  CheckCircle2,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  User,
} from "lucide-react";
import { UpdateUserData } from "@/lib/action/user";

export interface UserData {
  username: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number; // display only. The server must use its own prices.
  quantity: number;
}

interface PaymentClientProps {
  userid: string;
  exp: string;
  sig: string;
  user: UserData;
  initialItems: CartItem[];
}

type Method = "CARD" | "UPI" | "COD";
type Errors = Record<string, string>;
type SaveState = "idle" | "saving" | "saved" | "error";

const MAX_QTY = 10;
const SHIPPING_FEE = 99; // display only. The server must compute the real value.
const EMAIL_REDIRECT_DELAY = 1500; // ms of no typing before redirecting

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const isValidPhone = (v: string) => /^(\+91)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, ""));
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500";

/* ---------- Validation ---------- */

function luhnValid(num: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function expiryValid(value: string): boolean {
  const m = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

function validate(
  user: UserData,
  method: Method,
  card: { cardNumber: string; expiry: string; cvv: string },
  upiId: string,
): Errors {
  const e: Errors = {};

  if (user.name.trim().length < 2) e.name = "Enter your full name";
  if (!isValidEmail(user.email)) e.email = "Enter a valid email";
  if (!isValidPhone(user.phone)) e.phone = "Enter a valid 10-digit mobile number";
  if (user.address.trim().length < 8) e.address = "Enter your full delivery address";

  if (method === "CARD") {
    const digits = card.cardNumber.replace(/\s/g, "");
    if (digits.length < 13 || !luhnValid(digits)) e.cardNumber = "Enter a valid card number";
    if (!expiryValid(card.expiry)) e.expiry = "Enter a valid future date (MM/YY)";
    if (!/^\d{3,4}$/.test(card.cvv)) e.cvv = "Enter a 3 or 4 digit CVV";
  }

  if (method === "UPI" && !/^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(upiId.trim()))
    e.upiId = "Enter a valid UPI ID (e.g. name@okaxis)";

  return e;
}

/* ---------- Small field wrapper ---------- */

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-cyan-700" aria-live="polite">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/* ---------- Component ---------- */

export default function PaymentClient({
  userid,
  exp,
  sig,
  user,
  initialItems,
}: PaymentClientProps) {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<UserData>(user);
  const [items, setItems] = useState<CartItem[]>(initialItems ?? []);
  const [method, setMethod] = useState<Method>("CARD");
  const [card, setCard] = useState({ cardNumber: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [redirecting, setRedirecting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string; txnId?: string } | null>(null);

  // Last values known to be saved in the database
  const savedUser = useRef<UserData>(user);

  // Same key is reused if the request is retried, so the server can ignore duplicates
  const idempotencyKey = useRef<string>(crypto.randomUUID());

  // Prevents a double redirect (debounce + blur)
  const redirectStarted = useRef(false);

  const typedEmail = userInfo.email.trim();
  const emailChanged = typedEmail.toLowerCase() !== user.email.trim().toLowerCase();

  /* ----- Email: send to verification, never save here ----- */

  const goVerifyEmail = (value: string) => {
    const mail = value.trim();
    if (!isValidEmail(mail) || redirectStarted.current) return;
    redirectStarted.current = true;
    setRedirecting(true);
    router.push(`/email/verify?mail=${encodeURIComponent(mail)}`);
  };

  // Redirect automatically once the user stops typing a valid, changed email
  useEffect(() => {
    if (!emailChanged || !isValidEmail(typedEmail)) return;

    const timer = setTimeout(() => goVerifyEmail(typedEmail), EMAIL_REDIRECT_DELAY);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedEmail, emailChanged]);

  /* ----- Auto-save name, phone and address (email is never included) ----- */

  useEffect(() => {
    if (!user.username) return;

    const name = userInfo.name.trim();
    const phone = userInfo.phone.trim();
    const address = userInfo.address.trim();
    const saved = savedUser.current;

    // Only changed AND valid fields, so half-typed values are never saved
    const changes: { name?: string; phone?: string; fullAddress?: string } = {};
    if (name !== saved.name && name.length >= 2) changes.name = name;
    if (phone !== saved.phone && isValidPhone(phone)) changes.phone = phone;
    if (address !== saved.address && address.length >= 8) changes.fullAddress = address;

    if (Object.keys(changes).length === 0) return;

    let cancelled = false;

    const timer = setTimeout(async () => {
      setSaveState("saving");
      try {
        const res = await UpdateUserData(user.username, changes);
        if (!res.ok) throw new Error("save failed");

        savedUser.current = {
          ...savedUser.current,
          ...(changes.name !== undefined && { name: changes.name }),
          ...(changes.phone !== undefined && { phone: changes.phone }),
          ...(changes.fullAddress !== undefined && { address: changes.fullAddress }),
        };
        if (!cancelled) setSaveState("saved");
      } catch {
        if (!cancelled) setSaveState("error");
      }
    }, 700);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [userInfo.name, userInfo.phone, userInfo.address, user.username]);

  /* ----- Handlers ----- */

  const updateUser = (field: keyof UserData, value: string) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + delta) } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
  const total = subtotal + shipping;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || isProcessing || redirecting) return;

    // A changed email must be verified first, so never pay with it
    if (emailChanged) {
      if (isValidEmail(typedEmail)) goVerifyEmail(typedEmail);
      else setErrors((p) => ({ ...p, email: "Enter a valid email" }));
      return;
    }

    const found = validate(userInfo, method, card, upiId);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const name = userInfo.name.trim();
      const phone = userInfo.phone.trim();
      const address = userInfo.address.trim();

      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current,
        },
        body: JSON.stringify({
          userid,
          exp,
          sig,
          user: { name, email: user.email, phone, address },
          paymentMethod: method,
          paymentDetails:
            method === "CARD"
              ? {
                  last4: card.cardNumber.replace(/\s/g, "").slice(-4),
                  expiry: card.expiry,
                }
              : method === "UPI"
                ? { upiId: upiId.trim() }
                : { cod: true },
          // Only ids and quantities. The server looks up the prices.
          items: items.map(({ id, quantity }) => ({ id, quantity })),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        idempotencyKey.current = crypto.randomUUID();
        throw new Error(data.error || "Payment failed. Please try again.");
      }

      setCard({ cardNumber: "", expiry: "", cvv: "" });
      setUpiId("");
      setResult({ ok: true, msg: "Order confirmed!", txnId: data.transactionId });
    } catch (err: unknown) {
      setResult({
        ok: false,
        msg: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (result?.ok) {
    return (
      <div className="py-10 text-center space-y-3">
        <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">{result.msg}</h2>
        {result.txnId && (
          <p className="text-xs font-mono bg-slate-100 inline-block px-3 py-1.5 rounded-lg text-slate-700">
            Transaction ID: {result.txnId}
          </p>
        )}
      </div>
    );
  }

  const errClass = (key: string) => (errors[key] ? "border-rose-400 focus:border-rose-500" : "");

  const emailHint = redirecting
    ? "Redirecting to email verification..."
    : emailChanged && isValidEmail(typedEmail)
      ? "New email detected. You'll be taken to verification."
      : undefined;

  const payDisabled = items.length === 0 || isProcessing || redirecting || emailChanged;

  return (
    <form onSubmit={handlePay} noValidate className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
      {/* Left: details and payment method */}
      <div className="lg:col-span-7 space-y-6">
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <User className="size-4 text-cyan-600" /> Customer Details
            <span className="ml-auto text-xs font-normal text-slate-500" aria-live="polite">
              {saveState === "saving" && "Saving..."}
              {saveState === "saved" && "✓ Saved"}
              {saveState === "error" && <span className="text-rose-600">Couldn&apos;t save</span>}
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field id="co-name" label="Full name" error={errors.name}>
              <input
                id="co-name"
                type="text"
                autoComplete="name"
                value={userInfo.name}
                onChange={(e) => updateUser("name", e.target.value)}
                aria-invalid={!!errors.name}
                className={`${inputClass} ${errClass("name")}`}
              />
            </Field>
            <Field id="co-email" label="Email" error={errors.email} hint={emailHint}>
              <input
                id="co-email"
                type="email"
                autoComplete="email"
                value={userInfo.email}
                onChange={(e) => updateUser("email", e.target.value)}
                onBlur={() => {
                  // Leaving the field counts as "done typing"
                  if (emailChanged) goVerifyEmail(typedEmail);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // don't submit the payment form
                    if (emailChanged) goVerifyEmail(typedEmail);
                  }
                }}
                aria-invalid={!!errors.email}
                className={`${inputClass} ${errClass("email")}`}
              />
            </Field>
            <Field id="co-phone" label="Phone" error={errors.phone}>
              <input
                id="co-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={userInfo.phone}
                onChange={(e) => updateUser("phone", e.target.value)}
                aria-invalid={!!errors.phone}
                className={`${inputClass} ${errClass("phone")}`}
              />
            </Field>
            <Field id="co-address" label="Delivery address" error={errors.address}>
              <input
                id="co-address"
                type="text"
                autoComplete="street-address"
                value={userInfo.address}
                onChange={(e) => updateUser("address", e.target.value)}
                aria-invalid={!!errors.address}
                className={`${inputClass} ${errClass("address")}`}
              />
            </Field>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Payment Method</h2>
          <div className="grid grid-cols-3 gap-2.5" role="radiogroup" aria-label="Payment method">
            {(
              [
                { id: "CARD", label: "Card", icon: CreditCard },
                { id: "UPI", label: "UPI", icon: Smartphone },
                { id: "COD", label: "Cash", icon: Banknote },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={method === id}
                onClick={() => {
                  setMethod(id);
                  // Clear only payment-field errors, leave everything else alone
                  setErrors((prev) => ({
                    ...prev,
                    cardNumber: "",
                    expiry: "",
                    cvv: "",
                    upiId: "",
                  }));
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  method === id
                    ? "border-cyan-600 bg-cyan-50/60 text-cyan-700 ring-1 ring-cyan-600"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>

          {method === "CARD" && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <Field id="co-card" label="Card number" error={errors.cardNumber}>
                <input
                  id="co-card"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="4532 1111 2222 3333"
                  value={card.cardNumber}
                  onChange={(e) => {
                    setErrors((p) => ({ ...p, cardNumber: "" }));
                    setCard((p) => ({
                      ...p,
                      cardNumber: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 16)
                        .replace(/(\d{4})(?=\d)/g, "$1 "),
                    }));
                  }}
                  aria-invalid={!!errors.cardNumber}
                  className={`${inputClass} font-mono ${errClass("cardNumber")}`}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field id="co-expiry" label="Expiry" error={errors.expiry}>
                  <input
                    id="co-expiry"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) => {
                      setErrors((p) => ({ ...p, expiry: "" }));
                      const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setCard((p) => ({
                        ...p,
                        expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d,
                      }));
                    }}
                    aria-invalid={!!errors.expiry}
                    className={`${inputClass} font-mono ${errClass("expiry")}`}
                  />
                </Field>
                <Field id="co-cvv" label="CVV" error={errors.cvv}>
                  <input
                    id="co-cvv"
                    type="password"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    value={card.cvv}
                    onChange={(e) => {
                      setErrors((p) => ({ ...p, cvv: "" }));
                      setCard((p) => ({
                        ...p,
                        cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                      }));
                    }}
                    aria-invalid={!!errors.cvv}
                    className={`${inputClass} font-mono ${errClass("cvv")}`}
                  />
                </Field>
              </div>
            </div>
          )}

          {method === "UPI" && (
            <Field id="co-upi" label="UPI ID" error={errors.upiId}>
              <input
                id="co-upi"
                type="text"
                autoComplete="off"
                placeholder="yourname@okaxis"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  setErrors((p) => ({ ...p, upiId: "" }));
                }}
                aria-invalid={!!errors.upiId}
                className={`${inputClass} bg-slate-50 ${errClass("upiId")}`}
              />
            </Field>
          )}

          {method === "COD" && (
            <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              Pay with cash or UPI QR at delivery.
            </p>
          )}
        </div>

        {result && !result.ok && (
          <p role="alert" className="text-xs font-medium text-rose-600 bg-rose-50 p-3 rounded-xl">
            {result.msg}
          </p>
        )}
      </div>

      {/* Right: order summary */}
      <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <ShoppingBag className="size-4 text-slate-600" /> Order Summary
          </h3>

          {items.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">Your cart is empty.</p>
          ) : (
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 truncate">{item.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, -1)}
                        aria-label={`Decrease quantity of ${item.title}`}
                        className="p-0.5 rounded bg-white border border-slate-200"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="text-xs w-4 text-center" aria-live="polite">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, 1)}
                        disabled={item.quantity >= MAX_QTY}
                        aria-label={`Increase quantity of ${item.title}`}
                        className="p-0.5 rounded bg-white border border-slate-200 disabled:opacity-40"
                      >
                        <Plus className="size-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.title}`}
                        className="ml-1 text-rose-500"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {inr(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-slate-200 pt-3 space-y-1.5 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">{inr(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-medium text-slate-900">{inr(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2.5 text-base font-bold text-slate-900">
              <span>Total</span>
              <span className="text-cyan-600">{inr(total)}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={payDisabled}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-md hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        >
          <Lock className="size-4" />
          <span>
            {isProcessing
              ? "Processing..."
              : redirecting
                ? "Redirecting..."
                : emailChanged
                  ? "Verify email to continue"
                  : method === "COD"
                    ? `Place order · ${inr(total)}`
                    : `Pay ${inr(total)}`}
          </span>
        </button>
      </div>
    </form>
  );
}