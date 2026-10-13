import { isValueExpired } from 'next/dist/client/components/segment-cache/cache-map';
import { La_Belle_Aurore } from 'next/font/google';
import React, { useState } from 'react'
import NumberInput from './setepper';
import { cart_prod_struct } from '@/types/products';
import { ArrowUpRight, Dot, Percent, PercentCircle } from 'lucide-react';





const Card = (props: cart_prod_struct) => {
  const [CurrentAmount, SetCurrentAmount] = useState<number>(props.amount)
  return (
    <div className="bg-white p-2 rounded-xl flex items-center gap-4 overflow-hidden shadow-sm ">
      {/* Image Container */}
      <img
        className="w-60 h-60 rounded-full object-cover shrink-0"
        src={props.image?props.image:"/placeholder.png"}
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
        <p className="flex text-gray-900 whitespace-nowrap  p-3">
         <ArrowUpRight className='size-5'/> {props.brand}
         <p className='flex translate-x-5  font-medium text-red-700 animate-pulse'><Dot/>{props.tag}</p>
         
        </p>
        <p className='flex translate-x-4  '><PercentCircle  className='size-5  mt-1 fill-green-300 -translate-y-2'/>{props.discountPercent} off</p>
        
        <button className='bg-yellow-300 translate-y-20 mr-30 translate-x-7 p-2 font-bold cursor-pointer rounded-xl inline-block w-fit '>Buy Now</button>
        <div className='ml-20 translate-x-30 translate-y-12 font-bold bg-gray-200 p-2 rounded-4xl w-fit'>
          <NumberInput min={1} max={props.stock} step={1} value={CurrentAmount} onChange={SetCurrentAmount} />

        </div>
      </div>
    </div>
  );
};
export default Card
