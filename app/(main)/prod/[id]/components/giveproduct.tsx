'use client'
import React from 'react'
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
}

const giveproduct = () => {
    return (

        <div className="p-5 flex gap-13 flex-wrap ">
            {prod_Data.map((prod: ProductInfo_struct) => (
                <Link key={prod.id} href={`/prod/${prod.id}`}><Card img={prod.image} Title={prod.title} Discribe={prod.description} Rate={prod.rating} Price={prod.price} /></Link>
            ))}
        </div>

    )
}

export default giveproduct
