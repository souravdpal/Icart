"use client";
import React from "react";
import { useCheckoutRedirect } from "@/hooks/checkoutMaker";

interface BtnProps {
  userid: string;
  itemCount?: number; // pass cart.length or total quantity from parent
}

const Btn = ({ userid, itemCount = 0 }: BtnProps) => {
  const { startCheckout, loading } = useCheckoutRedirect(userid);
  const hasItems = itemCount > 0;
  const isDisabled = loading || !userid || !hasItems;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => {
        if (!hasItems) return;
        startCheckout("c");
      }}
      className="inline-flex w-full items-center justify-center rounded-2xl bg-yellow-300 px-6 py-3 font-bold text-slate-900 shadow-md transition hover:bg-yellow-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {loading ? "Placing order…" : !hasItems ? "Cart is empty" : "Place order"}
    </button>
  );
};

export default Btn;