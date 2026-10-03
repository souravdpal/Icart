'use client'
import { getProduct } from "@/lib/action/setCart";
import { useEffect, useState } from "react";
import Card from "./components/cart_card";

interface ProductInfo_struct {
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
  amount : number;

}


const Cart = ({ product_id, amount }: { product_id: string, amount: number }) => {
  const [prods , SetProds]= useState<ProductInfo_struct|null>(null)
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
      <div>
      
        <Card {...prods}/>
      </div>
    </div>
  )
}

export default Cart
