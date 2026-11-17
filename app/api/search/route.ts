import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/sql/prisma";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const q: string | null = params.get("q");

    if (!q || q.trim() === "") {
      const default_prod = await prisma.products.findMany({
        take: 20,
        orderBy: { created_at: "desc" },
      });

      return NextResponse.json(
        default_prod.map((p) => ({
          ...p,
          rating: p.rating !== null ? Number(p.rating) : 0,
        })),
        { status: 200 }
      );
    }

    const searchTerm = q.trim();
    const wildcardQuery = `%${searchTerm}%`;
    const prefixQuery = `${searchTerm}%`;

    // Hyper-fuzzy search combining:
    // 1. Substring & Prefix ILIKE
    // 2. word_similarity (best for short queries against long titles)
    // 3. Metaphone phonetic matching (sound-alike typos)
    // 4. Per-word Levenshtein distance (character typos)
    const products = await prisma.$queryRaw<any[]>`
      WITH scored_products AS (
        SELECT 
          *,
          GREATEST(
            word_similarity(${searchTerm}::text, title),
            word_similarity(${searchTerm}::text, category) * 0.9,
            word_similarity(${searchTerm}::text, brand) * 0.9,
            word_similarity(${searchTerm}::text, COALESCE(tag, '')) * 0.85,
            word_similarity(${searchTerm}::text, COALESCE(description, '')) * 0.7
          ) AS fuzzy_score,
          (
            SELECT COALESCE(MAX(
              CASE 
                WHEN metaphone(w, 4) = metaphone(${searchTerm}::text, 4) AND length(${searchTerm}::text) >= 3 THEN 0.65
                WHEN length(${searchTerm}::text) >= 4 AND levenshtein(lower(w), lower(${searchTerm}::text)) <= 2 THEN 0.60
                ELSE 0
              END
            ), 0)
            FROM unnest(string_to_array(regexp_replace(title || ' ' || brand || ' ' || category, '[^a-zA-Z0-9 ]', '', 'g'), ' ')) AS w
            WHERE length(w) >= 3
          ) AS typo_score
        FROM products
      )
      SELECT *
      FROM scored_products
      WHERE 
        title ILIKE ${wildcardQuery}
        OR category ILIKE ${wildcardQuery}
        OR brand ILIKE ${wildcardQuery}
        OR tag ILIKE ${wildcardQuery}
        OR description ILIKE ${wildcardQuery}
        OR fuzzy_score > 0.22
        OR typo_score > 0
      ORDER BY
        CASE 
          WHEN lower(title) = lower(${searchTerm}::text) THEN 1
          WHEN title ILIKE ${prefixQuery} THEN 2
          WHEN title ILIKE ${wildcardQuery} THEN 3
          WHEN brand ILIKE ${wildcardQuery} OR category ILIKE ${wildcardQuery} THEN 4
          ELSE 5
        END,
        GREATEST(fuzzy_score, typo_score) DESC,
        rating DESC
      LIMIT 50;
    `;

    const formattedProducts = products.map(({ fuzzy_score, typo_score, ...p }) => ({
      ...p,
      rating: p.rating !== null ? Number(p.rating) : 0,
    }));

    return NextResponse.json(formattedProducts, { status: 200 });
  } catch (e) {
    console.error("Search API Error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}