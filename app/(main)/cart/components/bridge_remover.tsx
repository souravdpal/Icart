'use client'
import React, { useState } from 'react'
import type { product } from '../secondary_client'
import Cart from '../cart'
import { RemoveCartItem } from '@/lib/action/setCart'

interface ProductProps {
  products: product[]
  userId: string
}

const Filt = ({ products, userId }: ProductProps) => {
  const [prod, setProd] = useState<product[]>(products)
  const [prevProducts, setPrevProducts] = useState<product[]>(products)

  if (products !== prevProducts) {
    setPrevProducts(products)
    setProd(products)
  }

  const removeProdById = async (id: string) => {
    const res = await RemoveCartItem(id)
    if (res.ok) {
      setProd((prev) => prev.filter((item) => item.product_id !== id))
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-3 py-4 sm:px-4">
      {prod.map((item) => (
        <Cart
          key={item.product_id}
          product_id={item.product_id}
          amount={item.amount}
          onRemove={removeProdById}
          userid={userId}
        />
      ))}
    </div>
  )
}

export default Filt