import React from 'react'
import Cart from './cart'
import { GetUserCart } from '@/lib/action/setCart'

interface product {
  product_id : string,
  amount : number,
}

const page =async () => {
  const getres = async () => {
    const cartData = await GetUserCart()
    if (cartData.ok) {
      return cartData.data
    }
    return []
  }
  const dataCart =await getres()
  return (
    <div>
      {dataCart.map((prod:product)=>{
        return <Cart key={prod.product_id} product_id={prod.product_id} amount={prod.amount}/>
      })}
    </div>
  )
}

export default page
