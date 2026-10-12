import Product from "./components/product-card";
import { prisma } from "@/lib/sql/prisma";


export default async function ProductPage({
  params,

}: {
  params: Promise<{ id: string }>;
}) {

  const paramsData = await params;
  const id = paramsData.id;
  const row = await prisma.products.findUnique({
    where: { id }
  })


  if (!row) {
    return <div>Product not found</div>;
  }
  const product = {
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
    image: row.image ?? "/placeholder.img",
    affiliateUrl: row.affiliate_url ?? "",
  };

  return (
    <div>
      <Product {...product} />
    </div>
  );
}