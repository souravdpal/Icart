import { NextResponse } from "next/server";
import { getUserId } from "@/lib/cookies/cookies_querries";
import { createCheckoutLink, isMedium, isProductId } from "@/lib/helper/checkout-link";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const auth_user = await getUserId();

    if (!auth_user || !isMedium(body?.medium) || auth_user.user_id !== body.user_id) {
      return NextResponse.json({ success: false }, { status: 400 });
    }
    if (body.medium === "p" && !isProductId(body.product_id)) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      redirectUrl: createCheckoutLink(auth_user.user_id, body.medium, body.product_id),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}