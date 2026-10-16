import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/sql/prisma";

const SESSION_TTL = 60 * 15; // seconds

export async function proxy(req: NextRequest) {
    const session = req.cookies.get("sessionId")?.value;
    const refresh = req.cookies.get("refreshToken")?.value;

    // Not logged in: nothing to renew
    if (!refresh) return NextResponse.next();

    const now = Date.now();

    // Session cookie still valid: nothing to do
    if (session) {
        const ok = await prisma.session.findFirst({
            where: { session, session_exp: { gt: now } },
            select: { id: true },
        });
        if (ok) return NextResponse.next();
    }

    // Session missing or expired: rotate using the refresh token
    const newSession = crypto.randomUUID();
    const result = await prisma.session.updateMany({
        where: { refresh_token: refresh, refresh_exp: { gt: now } },
        data: { session: newSession, session_exp: now + SESSION_TTL * 1000 },
    });

    // Refresh token unknown or expired: let the request through,
    // your layout gate (VerifyRefToken) will redirect to /login
    if (result.count === 0) return NextResponse.next();

    // 1. Make the new cookie visible to pages rendered in THIS request
    req.cookies.set("sessionId", newSession);
    const res = NextResponse.next({ request: { headers: req.headers } });

    // 2. Send it to the browser for future requests
    res.cookies.set("sessionId", newSession, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_TTL,
    });

    return res;
}

export const config = {
    matcher: [
        // Run on pages, skip static files, images and API routes
        "/((?!_next/static|_next/image|favicon.ico|api).*)",
    ],
};