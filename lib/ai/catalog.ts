import "server-only";
import { prisma } from "@/lib/sql/prisma";

let cache: { text: string; at: number } | null = null;
const TTL = 10 * 60 * 1000; // 10 minutes

// Compact overview of what the store sells, so the AI picks real product words for searches
export async function getCatalogOverview(): Promise<string> {
  if (cache && Date.now() - cache.at < TTL) return cache.text;
  try {
    const [cats, top] = await Promise.all([
      prisma.products.findMany({ select: { category: true }, distinct: ["category"], take: 40 }),
      prisma.products.findMany({ select: { title: true }, orderBy: { rating: "desc" }, take: 40 }),
    ]);
    const text =
      `Categories: ${cats.map((c) => c.category).join(", ")}\n` +
      `Example products: ${top.map((p) => p.title.slice(0, 40)).join(" | ")}`;
    cache = { text, at: Date.now() };
    return text;
  } catch (e) {
    console.error("getCatalogOverview failed:", e);
    return "";
  }
}