'use client'
import React, { useState } from 'react'
import type { product } from '../secondary_client'
import Cart from '../cart'
import { RemoveCartItem } from '@/lib/action/setCart'

interface ProductProps {
  products: product[]
}

const Filt = ({ products }: ProductProps) => {
  const [prod, setProd] = useState<product[]>(products)

  const removeProdById = async (id: string) => {
    const res = await RemoveCartItem(id)
    if (res.ok) {
      setProd((prev) => prev.filter((item) => item.product_id !== id))
    }
  }

  return (
    <div>
      {prod.map((item) => (
        <Cart
          key={item.product_id}
          product_id={item.product_id}
          amount={item.amount}
          onRemove={removeProdById}
        />
      ))}
    </div>
  )
}

export default Filt