import findProduct from "@/lib/product/findProduct";
import Product from "./components/product-card";
import { privateDecrypt } from "crypto";

export default async function ProductPage({
  params,

}: {
  params: Promise<{ id: string }>;
}) {

  interface product {
  id: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  tag: string;
  isNew: boolean;
  stock: number;
  image: string;
  affiliateUrl: string;
  }

  const paramsData= await params;
  const id = paramsData.id;

  let productData:product|undefined= findProduct(id)
  console.log(productData)

    if (!productData) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <Product {...productData} />
    </div>
  );
}