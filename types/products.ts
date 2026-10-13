import { ProductInfo_struct } from "./product_struct";
export interface CartItem {
  cartId: string;
  amount: number;
  product: ProductInfo_struct;
}

export type cart_prod_struct = ProductInfo_struct & {amount : number} 
