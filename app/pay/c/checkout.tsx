"use client";

import { useState } from "react";
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

export interface UserData {
    name: string;
    email: string;
    phone: string;
    address: string;
}

export interface CartItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
}

interface PaymentClientProps {
    userid: string;
    exp: string;
    sig: string;
    user: UserData;
    initialItems: CartItem[];
}

export default function PaymentClient({
    userid,
    exp,
    sig,
    user,
    initialItems,
}: PaymentClientProps) {
    const [userInfo, setUserInfo] = useState<UserData>(user);
    const [items, setItems] = useState<CartItem[]>(initialItems);
    const [method, setMethod] = useState<"CARD" | "UPI" | "COD">("CARD");
    const [card, setCard] = useState({ cardNumber: "", expiry: "", cvv: "" });
    const [upiId, setUpiId] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{ ok: boolean; msg: string; txnId?: string } | null>(null);

    // Modify user/billing fields
    const updateUser = (field: keyof UserData, value: string) => {
        setUserInfo((prev) => ({ ...prev, [field]: value }));
    };

    // Modify cart item quantity or remove
    const updateQty = (id: string, delta: number) => {
        setItems((prev) =>
            prev
                .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
                .filter((i) => i.quantity > 0)
        );
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal > 0 ? 99 : 0;
    const total = subtotal + shipping;

    // Send modified data to backend
    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0 || isProcessing) return;

        setIsProcessing(true);
        setResult(null);

        try {
            const res = await fetch("/api/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userid,
                    exp,
                    sig,
                    user: userInfo,
                    paymentMethod: method,
                    paymentDetails:
                        method === "CARD"
                            ? { last4: card.cardNumber.replace(/\s/g, "").slice(-4), expiry: card.expiry }
                            : method === "UPI"
                            ? { upiId }
                            : { cod: true },
                    items,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Payment failed");

            setResult({ ok: true, msg: "Payment confirmed!", txnId: data.transactionId });
        } catch (err: any) {
            setResult({ ok: false, msg: err.message || "Something went wrong" });
        } finally {
            setIsProcessing(false);
        }
    };

    if (result?.ok) {
        return (
            <div className="py-10 text-center space-y-3">
                <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
                <h2 className="text-xl font-bold text-slate-900">{result.msg}</h2>
                <p className="text-xs font-mono bg-slate-100 inline-block px-3 py-1.5 rounded-lg text-slate-700">
                    Transaction ID: {result.txnId}
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handlePay} className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            {/* Left: User Details & Payment Method */}
            <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <User className="size-4 text-cyan-600" /> Customer Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                            type="text"
                            value={userInfo.name}
                            onChange={(e) => updateUser("name", e.target.value)}
                            placeholder="Full Name"
                            className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500"
                        />
                        <input
                            type="email"
                            value={userInfo.email}
                            onChange={(e) => updateUser("email", e.target.value)}
                            placeholder="Email"
                            className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500"
                        />
                        <input
                            type="text"
                            value={userInfo.phone}
                            onChange={(e) => updateUser("phone", e.target.value)}
                            placeholder="Phone"
                            className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500"
                        />
                        <input
                            type="text"
                            value={userInfo.address}
                            onChange={(e) => updateUser("address", e.target.value)}
                            placeholder="Delivery Address"
                            className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-sm font-bold text-slate-900">Payment Method</h2>
                    <div className="grid grid-cols-3 gap-2.5">
                        {[
                            { id: "CARD", label: "Card", icon: CreditCard },
                            { id: "UPI", label: "UPI", icon: Smartphone },
                            { id: "COD", label: "Cash", icon: Banknote },
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setMethod(id as "CARD" | "UPI" | "COD")}
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
                            <input
                                type="text"
                                required
                                placeholder="Card Number (e.g. 4532 1111 2222 3333)"
                                value={card.cardNumber}
                                onChange={(e) =>
                                    setCard((p) => ({
                                        ...p,
                                        cardNumber: e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "),
                                    }))
                                }
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-mono outline-none focus:border-cyan-500"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    required
                                    placeholder="MM/YY"
                                    value={card.expiry}
                                    onChange={(e) => setCard((p) => ({ ...p, expiry: e.target.value.slice(0, 5) }))}
                                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-mono outline-none focus:border-cyan-500"
                                />
                                <input
                                    type="password"
                                    required
                                    placeholder="CVV"
                                    value={card.cvv}
                                    onChange={(e) => setCard((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-mono outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>
                    )}

                    {method === "UPI" && (
                        <input
                            type="text"
                            required
                            placeholder="yourname@okaxis"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500"
                        />
                    )}

                    {method === "COD" && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                            Pay with cash or UPI QR at delivery.
                        </p>
                    )}
                </div>

                {result && !result.ok && (
                    <p className="text-xs font-medium text-rose-600 bg-rose-50 p-3 rounded-xl">{result.msg}</p>
                )}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
                        <ShoppingBag className="size-4 text-slate-600" /> Order Summary
                    </h3>

                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm gap-2">
                                <div className="min-w-0">
                                    <p className="font-medium text-slate-800 truncate">{item.title}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <button type="button" onClick={() => updateQty(item.id, -1)} className="p-0.5 rounded bg-white border border-slate-200">
                                            <Minus className="size-3" />
                                        </button>
                                        <span className="text-xs w-4 text-center">{item.quantity}</span>
                                        <button type="button" onClick={() => updateQty(item.id, 1)} className="p-0.5 rounded bg-white border border-slate-200">
                                            <Plus className="size-3" />
                                        </button>
                                        <button type="button" onClick={() => removeItem(item.id)} className="ml-1 text-rose-500">
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                </div>
                                <span className="font-semibold text-slate-900">₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-slate-200 pt-3 space-y-1.5 text-sm text-slate-600">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-medium text-slate-900">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="font-medium text-slate-900">₹{shipping}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-2.5 text-base font-bold text-slate-900">
                            <span>Total</span>
                            <span className="text-cyan-600">₹{total}</span>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={items.length === 0 || isProcessing}
                    className="w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-md hover:opacity-95 disabled:opacity-50 transition-all"
                >
                    <Lock className="size-4" />
                    <span>{isProcessing ? "Processing..." : `Pay ₹${total}`}</span>
                </button>
            </div>
        </form>
    );
}