import { NextResponse } from "next/server";
import { verifyCheckoutLink } from "@/lib/helper/checkout-link";

export async function GET(request: Request) {
  const p = new URL(request.url).searchParams;
  const r = verifyCheckoutLink({
    userid: p.get("userid"),
    exp: p.get("exp"),
    medium: p.get("medium"),
    pid: p.get("pid"),
    sig: p.get("sig"),
  });

  if (!r.ok) {
    return NextResponse.json(
      { valid: false, error: r.reason },
      { status: r.reason === "invalid" ? 403 : 400 },
    );
  }
  return NextResponse.json({ valid: true, userid: r.userid, medium: r.medium, productId: r.productId });
}