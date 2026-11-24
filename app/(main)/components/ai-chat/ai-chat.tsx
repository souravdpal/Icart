"use client";

import { useEffect, useRef, useState } from "react";
import {MessageCircle, Paperclip, Send, X } from "lucide-react";
import { askai } from "@/lib/action/askai";
import type { AiBlock, AiHistoryItem } from "@/types/ai_types";
import Blocks from "./blocks";

type ChatMsg = { id: string; role: "user" | "ai"; blocks: AiBlock[] };

const WELCOME: ChatMsg = {
  id: "welcome",
  role: "ai",
  blocks: [
    { type: "text", text: "Hi! I can find products, give recommendations or take you to any page. What do you need?" },
    { type: "suggestions", items: ["Show me trending products", "Help me find a gift", "Where are my orders?"] },
  ],
};

function toHistory(msgs: ChatMsg[]): AiHistoryItem[] {
  return msgs
    .filter((m) => m.id !== "welcome")
    .slice(-10)
    .map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("assistant" as const),
      content: m.blocks
        .map((b) =>
          b.type === "text" ? b.text
          : b.type === "products" ? `[showed products for "${b.query}"]`
          : b.type === "redirect" ? `[offered link to ${b.label}]`
          : ""
        )
        .filter(Boolean)
        .join("\n"),
    }))
    .filter((h) => h.content);
}

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([WELCOME]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;

    const history = toHistory(messages);
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), role: "user", blocks: [{ type: "text", text: q }] },
    ]);
    setInput("");
    setLoading(true);

    let blocks: AiBlock[];
    try {
      const res = await askai(q, history);
      blocks = res.ok
        ? res.data.blocks
        : [{ type: "callout", tone: "warning", text: res.error }];
    } catch {
      blocks = [{ type: "callout", tone: "warning", text: "Something went wrong. Please try again." }];
    }

    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "ai", blocks }]);
    setLoading(false);
  }

  return (
    <>
      {/* Always mounted (just hidden) so chat state and auto-redirects never re-run */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } fixed bottom-24 right-4 z-50 h-[min(36rem,calc(100vh-8rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-2xl sm:right-6 sm:w-[26rem]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-sky-600 to-blue-600 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} />
            <div>
              <p className="text-sm font-semibold leading-none">Shopping Assistant</p>
              <p className="mt-1 text-xs text-sky-100">Ask about products, orders or pages</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="rounded p-1 hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto p-3">
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div
                key={m.id}
                className="ml-auto w-fit max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-sky-600 px-3.5 py-2.5 text-sm text-white"
              >
                {m.blocks[0].type === "text" ? m.blocks[0].text : ""}
              </div>
            ) : (
              <Blocks
                key={m.id}
                blocks={m.blocks}
                isLast={i === messages.length - 1 && !loading}
                onSuggest={send}
                onNavigate={() => setOpen(false)}
              />
            )
          )}

          {loading && (
            <div className="flex w-fit gap-1 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-slate-200 bg-white p-2.5"
        >
          {/* Image search: coming soon */}
          <button
            type="button"
            disabled
            title="Image search - coming soon"
            className="relative rounded-lg p-2 text-slate-400"
          >
            <Paperclip size={18} />
            <span className="absolute -right-1 -top-1 rounded bg-amber-500 px-1 text-[9px] font-bold leading-4 text-white">
              Soon
            </span>
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            maxLength={500}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
          />
          <button
            disabled={loading || !input.trim()}
            aria-label="Send"
            className="rounded-lg bg-sky-600 p-2.5 text-white transition hover:bg-sky-700 disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close AI chat" : "Open AI chat"}
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-600 to-blue-600 text-white shadow-lg transition hover:scale-105 sm:right-6"
      >
        {open ? <X size={24} /> : <MessageCircle size={26} />}
      </button>
    </>
  );
}