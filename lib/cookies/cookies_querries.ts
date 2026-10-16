import { cookies } from "next/headers";
import { cache } from "react";
import { prisma } from "../sql/prisma";


export const getUserId = cache(async () => {
    const sessionId = (await cookies()).get("sessionId")?.value;
    if (!sessionId) return null;

    const row = await prisma.session.findFirst({
        where: { session: sessionId, session_exp: { gt: Date.now() } },
        select: { user_id: true },
    });

    return row ? { user_id: row.user_id } : null;
});

export async function VerifyRefToken(): Promise<boolean> {
    const token = (await cookies()).get("refreshToken")?.value;
    if (!token) return false;

    const row = await prisma.session.findFirst({
        where: { refresh_token: token },
        select: { refresh_exp: true },
    });

    return !!row && Number(row.refresh_exp) > Date.now();
}