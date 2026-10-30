import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/sql/prisma";

export async function GET(req: NextRequest) {
    try {
        const params = req.nextUrl.searchParams;
        const q: string | null = params.get("q");

        // If no query is provided, return the 20 most recent products
        if (!q || q.trim() === "") {
            const default_prod = await prisma.products.findMany({
                take: 20,
                orderBy: {
                    created_at: "desc"
                }
            });
            return NextResponse.json(default_prod, {
                status: 200
            });
        }

        const searchTerm = q.trim();
        const wildcardQuery = `%${searchTerm}%`;

        // Combine wildcard substring matching (ILIKE) with fuzzy trigram similarity
        const products = await prisma.$queryRaw`
          SELECT * FROM products
          WHERE title ILIKE ${wildcardQuery}
             OR category ILIKE ${wildcardQuery}
             OR brand ILIKE ${wildcardQuery}
             OR tag ILIKE ${wildcardQuery}
             OR similarity(title, ${searchTerm}::text) > 0.15 
             OR similarity(category, ${searchTerm}::text) > 0.15
             OR similarity(brand, ${searchTerm}::text) > 0.15
             OR similarity(tag, ${searchTerm}::text) > 0.15
          ORDER BY 
             -- Give highest priority to direct substring matches, then fallback to similarity score
             CASE WHEN title ILIKE ${wildcardQuery} THEN 1 ELSE 2 END,
             similarity(title, ${searchTerm}::text) DESC
          LIMIT 50;
        `;

        return NextResponse.json(products, { status: 200 });
    } catch (e) {
        console.error("Search API Error:", e);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}