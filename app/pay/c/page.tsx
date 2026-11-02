import crypto from "crypto";
import Link from "next/link";

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

    // 1. ERROR: MISSING PARAMETERS
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

    // 2. ERROR: EXPIRED LINK
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

    // 3. ERROR: SIGNATURE MISMATCH (TAMPERED)
    const api_salt = process.env.api_salt_key || "souravilovecoding";
    const payload = `${userid}.${exp}`;
    const expectedSig = crypto.createHmac('sha256', api_salt).update(payload).digest('hex');

    const sigBuffer = Buffer.from(sig, 'hex');
    const expectedBuffer = Buffer.from(expectedSig, 'hex');

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

    // 4. SUCCESS: VERIFIED (Ready for your code)
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                    <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Secure Checkout</h1>
                            <p className="text-slate-500 text-sm mt-0.5">Verified User ID: {userid}</p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                            ● Secure Session Active
                        </span>
                    </div>

                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center bg-slate-50/50">
                        <p className="text-slate-400 font-medium">Your payment form and cart summary go here...</p>
                    </div>
                </div>
            </div>
        </main>
    );
}