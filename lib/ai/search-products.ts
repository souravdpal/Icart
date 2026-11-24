import "server-only";
import { prisma } from "@/lib/sql/prisma";
import type { AiProduct } from "@/types/ai_types";

// Fuzzy search: ILIKE + word_similarity + metaphone (sound-alike) + levenshtein (typos)
export async function searchProducts(q: string, limit = 6) {
  const searchTerm = q.trim();
  if (!searchTerm) return [];
  const wildcardQuery = `%${searchTerm}%`;
  const prefixQuery = `${searchTerm}%`;

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
    LIMIT ${limit}::int;
  `;

  return products.map(({ fuzzy_score, typo_score, ...p }) => ({
    ...p,
    rating: p.rating !== null ? Number(p.rating) : 0,
  }));
}

const num = (v: unknown) => (v === null || v === undefined ? undefined : Number(v));

// DB row -> plain JSON the Card can use (Decimal/BigInt/Date can't cross the server-action boundary)
export function toAiProduct(p: any): AiProduct {
  const price = Number(p.price ?? 0);
  const originalPrice = num(p.original_price);
  const discount =
    num(p.discount) ??
    (originalPrice && originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : undefined);
  const created = p.created_at ? new Date(p.created_at).getTime() : 0;

  return {
    id: String(p.id),
    href: `/prod/${p.id}`,
    img: p.image ?? p.img ?? "",         // adjust column name if needed
    title: p.title,
    description: p.description ?? undefined,
    rating: Number(p.rating ?? 0),
    price,
    originalPrice,
    discount,
    brand: p.brand ?? undefined,
    reviews: num(p.reviews),             // adjust column name if needed
    stock: num(p.stock),
    isNew: created > Date.now() - 14 * 24 * 3600 * 1000,
    tag: p.tag ?? null,
  };
}