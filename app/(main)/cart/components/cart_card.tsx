import { isValueExpired } from 'next/dist/client/components/segment-cache/cache-map';
import { La_Belle_Aurore } from 'next/font/google';
import React, { useState } from 'react'
import NumberInput from './setepper';
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
  amount: number;

}


const Card = (props: Product_struct) => {
  const [CurrentAmount, SetCurrentAmount] = useState<number>(props.amount)
  return (
    <div className="bg-white p-2 rounded-xl flex items-center gap-4 overflow-hidden shadow-sm ">
      {/* Image Container */}
      <img
        className="w-60 h-60 rounded-full object-cover shrink-0"
        src={props.image}
        alt={props.title}
      />

      {/* Content Container */}
      <div className="flex flex-col min-w-0 mb-30">
        <h3 className="font-semibold text-gray-900 whitespace-nowrap text-lg p-3">
          {props.title}
        </h3>
        <p className="text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis pl-3">
          {props.description}
        </p>
        <button className='bg-yellow-300 translate-y-20 mr-30 translate-x-7 p-2 font-bold cursor-pointer rounded-xl inline-block w-fit '>Buy Now</button>
        <div className='ml-20 translate-x-30 translate-y-12 font-bold bg-gray-200 p-2 rounded-4xl w-fit'>
          <NumberInput min={1} max={props.stock} step={1} value={CurrentAmount} onChange={SetCurrentAmount} />

        </div>
      </div>
    </div>
  );
};
export default Card
