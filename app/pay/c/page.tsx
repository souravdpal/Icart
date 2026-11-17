import crypto from "crypto";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import PaymentClient from "./checkout";

interface PageProps {
    searchParams: Promise<{
        userid?: string;
        exp?: string;
        sig?: string;
    }>;
}

export default async function CheckoutPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const { userid, exp, sig } = params;

    if (!userid || !exp || !sig) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
                    <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Invalid Checkout Link</h1>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                        This link is missing required verification parameters. Please return to your cart and try again.
                    </p>
                    <div className="mt-8">
                        <Link
                            href="/cart"
                            className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all shadow-sm"
                        >
                            Return to Cart
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > Number(exp)) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
                    <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Session Timed Out</h1>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                        For your security, checkout links expire after a short period. Please generate a fresh link from your cart.
                    </p>
                    <div className="mt-8">
                        <Link
                            href="/cart"
                            className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all shadow-sm"
                        >
                            Back to Cart
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const api_salt = process.env.api_salt_key || "souravilovecoding";
    const payload = `${userid}.${exp}`;
    const expectedSig = crypto.createHmac("sha256", api_salt).update(payload).digest("hex");

    const sigBuffer = Buffer.from(sig, "hex");
    const expectedBuffer = Buffer.from(expectedSig, "hex");

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
                    <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Access Denied</h1>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                        Security verification failed. This link signature is invalid or has been modified.
                    </p>
                    <div className="mt-8">
                        <Link
                            href="/cart"
                            className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all shadow-sm"
                        >
                            Return to Cart
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // Random dummy user & cart data (replace with Prisma queries when ready)
    const dummyUser = {
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        phone: "+91 98765 43210",
        address: "B-42, Sector 18, Noida, UP 201301",
    };

    const dummyItems = [
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
                            Verified User ID: <span className="font-mono text-slate-700">{userid}</span>
                        </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Secure Session Active
                    </span>
                </div>

                <PaymentClient
                    userid={userid}
                    exp={exp}
                    sig={sig}
                    user={dummyUser}
                    initialItems={dummyItems}
                />
            </div>
        </main>
    );
}