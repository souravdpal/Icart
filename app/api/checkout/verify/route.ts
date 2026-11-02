import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userid = searchParams.get('userid');
    const exp = searchParams.get('exp');
    const sig = searchParams.get('sig');

    if (!userid || !exp || !sig) {
        return NextResponse.json({ valid: false, error: "Missing parameters" }, { status: 400 });
    }

    // Check expiration
    if (Math.floor(Date.now() / 1000) > Number(exp)) {
        return NextResponse.json({ valid: false, error: "Link expired" }, { status: 400 });
    }

    // Recompute HMAC
    const api_salt = process.env.api_salt_key || "souravilovecoding";
    const payload = `${userid}.${exp}`;
    const expectedSig = crypto.createHmac('sha256', api_salt).update(payload).digest('hex');

    const sigBuffer = Buffer.from(sig, 'hex');
    const expectedBuffer = Buffer.from(expectedSig, 'hex');

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
        return NextResponse.json({ valid: false, error: "Signature mismatch" }, { status: 403 });
    }

    // Success!
    return NextResponse.json({ valid: true, userid });
}