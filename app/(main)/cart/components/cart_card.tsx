import React from 'react'
interface Product_struct {
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
  amount:number;

}


const Card = (props:Product_struct) => {
  return (
    <div className=''>
      <div className='img h-70 rounded-4xl pl-3 pt-5 w-35 bg-'><img src={props.image}  /></div>
    </div>
  )
}

export default Card
