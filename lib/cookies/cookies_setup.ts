import { cookies } from "next/headers";
import { prisma } from "../sql/prisma";

const SESSION_TTL = 60 * 15;             // seconds
const REFRESH_TTL = 60 * 60 * 24 * 30;   // seconds

export async function Setcookies(userid: string) {
    const session = crypto.randomUUID();
    const refresh_token = crypto.randomUUID();
    const now = Date.now();

    await prisma.session.create({
        data: {
            id: crypto.randomUUID(),
            session,
            refresh_token,
            session_exp: now + SESSION_TTL * 1000,
            refresh_exp: now + REFRESH_TTL * 1000,
            user_id: userid,
        },
    });

    const cookieStore = await cookies();
    const base = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
    };

    cookieStore.set("sessionId", session, { ...base, maxAge: SESSION_TTL });
    cookieStore.set("refreshToken", refresh_token, { ...base, maxAge: REFRESH_TTL });

    return { isCookiesSet: true };
}