import React from 'react'
import { GetUserCart } from '@/lib/action/setCart'
import Filt from './components/bridge_remover'

export interface product {
  product_id: string
  amount: number
}

const Sc = async ({ userid }: { userid: string }) => {
  const cartData = await GetUserCart()

  const raw: unknown = cartData.ok ? cartData.data : []
  const rows: any[] = Array.isArray(raw) ? raw : raw ? [raw] : []

  const dataCart: product[] = rows.map((r) => ({
    product_id: String(r.product_id),
    amount: Number(r.amount),
  }))

  return (
    <div>
      <Filt userId={userid} products={dataCart} />
    </div>
  )
}

export default Sc