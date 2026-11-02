import { NextResponse } from "next/server";
import crypto from "crypto";
import { getUserId } from "@/lib/cookies/cookies_querries";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const api_salt = process.env.api_salt_key || "souravilovecoding";
        const auth_user = await getUserId();
        const auth_user_id = auth_user?.user_id;

        if (!auth_user) {
            return NextResponse.json({ success: false });
        }
        
        if (auth_user_id !== body.user_id) {
            return NextResponse.json({ success: false });
        }

        const exp_time = Math.floor(Date.now() / 1000) + 600;
        const payload = `${auth_user_id}.${exp_time}`;
        const sig = crypto.createHmac('sha256', api_salt).update(payload).digest('hex');

        // FIXED: Wrap the return object in NextResponse.json()
        return NextResponse.json({
            success: true,
            redirectUrl: `/pay/c?userid=${auth_user_id}&exp=${exp_time}&sig=${sig}`
        });

    } catch (e) {
        console.log(e)
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}