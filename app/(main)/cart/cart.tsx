'use client'
import { getProduct } from "@/lib/action/setCart";
import { useEffect, useState } from "react";
import Card from "./components/cart_card";
import { cart_prod_struct } from "@/types/products";

interface CartProps {
  product_id: string
  amount: number
  onRemove: (id: string) => void
}

const Cart = ({ product_id, amount, onRemove }: CartProps) => {
  const [prods, setProds] = useState<cart_prod_struct | null>(null)

  useEffect(() => {
    const getProductData = async () => {
      const dataProd = await getProduct(product_id)
      if (dataProd.ok) {
        setProds({ ...dataProd.data, amount })
      } else {
        setProds(null)
      }
    }
    getProductData()
  }, [product_id, amount])

  if (!prods) return null

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-300">
      <Card {...prods} onRemove={() => onRemove(product_id)} />
    </div>
  )
}

export default Cart