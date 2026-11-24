import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/sql/prisma";
import { searchProducts } from "@/lib/ai/search-products";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

    // No query -> latest 20 products
    if (!q) {
      const defaultProducts = await prisma.products.findMany({
        take: 20,
        orderBy: { created_at: "desc" },
      });

      return NextResponse.json(
        defaultProducts.map((p) => ({
          ...p,
          rating: p.rating !== null ? Number(p.rating) : 0,
        })),
        { status: 200 }
      );
    }

    // Query -> fuzzy search, top 50
    const products = await searchProducts(q, 50);
    return NextResponse.json(products, { status: 200 });
  } catch (e) {
    console.error("Search API Error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}