"use server";

import { groq } from "@/lib/ai/groq";
import { getUserId } from "@/lib/cookies/cookies_querries";
import { buildSystemPrompt, ModelBlockSchema } from "@/lib/ai/protocol";
import { resolveRoute, type RouteCtx } from "@/lib/ai/routes";
import { searchProducts, toAiProduct } from "@/lib/ai/search-products";
import { filterProducts } from "@/lib/ai/filter-products";
import { getCatalogOverview } from "@/lib/ai/catalog";
import type { AiBlock, AiHistoryItem, AskAiResult } from "@/types/ai_types";

type Msg = { role: "system" | "user" | "assistant"; content: string };

export async function askai(query: string, history: AiHistoryItem[] = []): Promise<AskAiResult> {
  try {
    const sessionUser = await getUserId();
    const userId =
      typeof sessionUser === "string"
        ? sessionUser
        : sessionUser?.user_id ?? undefined;

    if (!userId) {
      return { ok: false, error: "Please log in again." };
    }

    const q = query.trim().slice(0, 500);
    if (!q) return { ok: false, error: "Empty message." };

    const ctx: RouteCtx = {
      userId,
      ordersId: userId,
      socialId: userId,
    };

    const messages: Msg[] = [
      { role: "system", content: buildSystemPrompt(await getCatalogOverview()) },
      ...history
        .filter((h) => h.role === "user" || h.role === "assistant")
        .slice(-10)
        .map((h) => ({ role: h.role, content: String(h.content).slice(0, 1500) })),
      { role: "user", content: q },
    ];

    const completion = await callModel(messages);
    const raw = completion.choices[0]?.message?.content ?? "";
    const blocks = await buildBlocks(raw, ctx, q);
    return { ok: true, data: { blocks } };
  } catch (e: any) {
    console.error("askai error:", e);
    if (e?.status === 429) {
      return { ok: false, error: "Too many requests right now. Please try again in a few seconds." };
    }
    return { ok: false, error: "The assistant is unavailable right now. Please try again." };
  }
}

async function callModel(messages: Msg[]) {
  const base = {
    model: "openai/gpt-oss-120b",
    messages,
    temperature: 0.7,
    max_completion_tokens: 2048,
    reasoning_effort: "low" as const,
    stream: false as const,
  };
  try {
    return await groq.chat.completions.create({ ...base, response_format: { type: "json_object" } });
  } catch (e: any) {
    // JSON mode sometimes fails on this model (400 output_parse_failed).
    // Retry once without it; parseModelJson below handles plain or fenced JSON.
    if (e?.status === 400 && String(e?.message).includes("output_parse_failed")) {
      console.warn("[askai] JSON mode failed, retrying without it");
      return await groq.chat.completions.create(base);
    }
    throw e;
  }
}

function parseModelJson(raw: string): unknown[] {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end <= start) return [];
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1));
    return Array.isArray(parsed?.blocks) ? parsed.blocks : [];
  } catch {
    return [];
  }
}

async function buildBlocks(raw: string, ctx: RouteCtx, userMessage: string): Promise<AiBlock[]> {
  // 1. validate each block separately, so one bad block doesn't kill the whole reply
  const valid = parseModelJson(raw)
    .map((b) => ModelBlockSchema.safeParse(b))
    .flatMap((r) => (r.success ? [r.data] : []));

  if (valid.length === 0) {
    const t = raw.trim();
    return [{ type: "text", text: t && !t.startsWith("{") ? t : "Sorry, I didn't get that. Could you rephrase?" }];
  }

  // 2. limits: max 3 product sections, 2 redirects
  let products = 0;
  let redirects = 0;
  const limited = valid.filter((b) => {
    if (b.type === "products") return ++products <= 3;
    if (b.type === "redirect") return ++redirects <= 2;
    return true;
  });
  const redirectCount = limited.filter((b) => b.type === "redirect").length;
  const productsRequested = limited.filter((b) => b.type === "products").length;

  // 3. hydrate with real data (product sections run in parallel)
  const out = await Promise.all(
    limited.map(async (b): Promise<AiBlock | null> => {
      switch (b.type) {
        case "products": {
          const rows = await searchProducts(b.query, 12);
          const kept = await filterProducts(userMessage, b.query, rows.map(toAiProduct));
          if (kept.length === 0) return null;
          return { type: "products", title: b.title, query: b.query, products: kept };
        }
        case "redirect": {
          const r = resolveRoute(b.route, ctx);
          if (!r) {
            console.warn(`[askai] redirect "${b.route}" dropped (unknown key or missing id in ctx)`);
            return null;
          }
          return {
            type: "redirect",
            label: r.label,
            path: r.path,
            reason: b.reason,
            auto: b.auto && redirectCount === 1 && !r.external,
            external: r.external,
          };
        }
        default:
          return b;
      }
    })
  );

  const result = out.filter((b): b is AiBlock => b !== null);

  if (productsRequested > 0 && !result.some((b) => b.type === "products")) {
    const note: AiBlock = {
      type: "callout",
      tone: "info",
      text: "I couldn't find matching products for that. Try naming the item you want, like “sneakers” or “headphones”.",
    };
    const at = result.findIndex((b) => b.type === "suggestions");
    result.splice(at === -1 ? result.length : at, 0, note);
  }

  return result;
}