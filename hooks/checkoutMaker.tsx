"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Medium } from "@/lib/helper/checkout-link";

export function useCheckoutRedirect(userid: string) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const startCheckout = async (medium: Medium, productId?: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userid, medium, product_id: productId }),
      });
      const data = await res.json();

      if (data.success) {
        router.push(data.redirectUrl); // keep loading=true until the page changes
      } else {
        alert("Checkout Failed");
        setLoading(false);
      }
    } catch {
      alert("Checkout Failed");
      setLoading(false);
    }
  };

  return { startCheckout, loading };
}