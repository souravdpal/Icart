import type { ProductInfo_struct } from "./product_struct";

export function toProduct(row: {
  id: string;
  title: string;
  description: string | null;
  category: string;
  brand: string;
  price: unknown;
  original_price: unknown;
  discount_percent: number;
  rating: unknown;
  review_count: number;
  tag: string | null;
  is_new: boolean;
  stock: number;
  image: string | null;
  affiliate_url: string | null;
}): ProductInfo_struct {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    category: row.category,
    brand: row.brand,
    price: Number(row.price),
    originalPrice: Number(row.original_price),
    discountPercent: row.discount_percent,
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count,
    tag: row.tag ?? "",
    isNew: row.is_new,
    stock: row.stock,
    image: row.image,
    affiliateUrl: row.affiliate_url,
  };
}