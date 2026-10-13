'use client'
import { getProduct } from "@/lib/action/setCart";
import { useEffect, useState } from "react";
import Card from "./components/cart_card";
import { cart_prod_struct } from "@/types/products";
const Cart = ({ product_id, amount }: { product_id: string, amount: number }) => {
  const [prods , SetProds]= useState<cart_prod_struct|null>(null)
  const  [total , setTotal] = useState(0)

  const getProductData = async (product_id: string,amount:number): Promise<void> => {
    const dataProd = await getProduct(product_id)
    if(dataProd.ok){
      SetProds({...dataProd.data, amount})
    }else{
      SetProds(null)
    }
    
    


  }
  useEffect(()=>{
    getProductData(product_id,amount)
    console.log(prods)
  },[product_id,amount])
 
  if(!prods) return null
  return (
    <div>
      <div className="felx-col gap-3 p-4 bg-gray-300">
      
        <Card {...prods}/>
      </div>
      
    </div>
  )
}

export default Cart
