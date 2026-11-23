'use client'
import { getProduct } from "@/lib/action/setCart";
import { useEffect, useState } from "react";
import Card from "./components/cart_card";
import { cart_prod_struct } from "@/types/products";

interface CartProps {
  product_id: string
  amount: number
  onRemove: (id: string) => void
  userid : string
}

const Cart = ({ product_id, amount, onRemove, userid }: CartProps) => {
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

  return <Card userid={userid} {...prods} onRemove={() => onRemove(product_id)} />
}

export default Cart