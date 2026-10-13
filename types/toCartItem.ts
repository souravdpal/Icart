import type { CartItem } from "./products";
import { toProduct } from "./toProduct";

// shape of one row from: SELECT c.id AS cart_id, c.amount, p.* FROM cart c JOIN products p ...
export type CartJoinRow = {
  cart_id: string;
  amount: number;
  id: string; // product id (from p.*)
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
};

export function toCartItem(row: CartJoinRow): CartItem {
  return {
    cartId: row.cart_id,
    amount: Number(row.amount),
    product: toProduct(row),
  };
}