'user client'
import React, { useEffect, useState } from 'react'
import NumberInput from './setepper';
import { cart_prod_struct } from '@/types/products';
import { ArrowUpRight, Dot, IndianRupee, Link, Percent, PercentCircle, Star } from 'lucide-react';
import { UpdateQunat } from '@/lib/action/setCart';

import { useRouter } from 'next/navigation';


type CardProps = cart_prod_struct & {
  onRemove: () => void
}

const Card = ({onRemove,...props}:CardProps) => {
  const router = useRouter()
  const [CurrentAmount, SetCurrentAmount] = useState<number>(props.amount)
  useEffect(() => {
    const k = async (id: string, amount_new: number) => {
      const am_up = await UpdateQunat(id, amount_new)
      if (!am_up.ok) {
        SetCurrentAmount(prev => prev - 1)

      } if (am_up.ok && am_up.data == "not updated") {
        SetCurrentAmount(prev => prev - 1)

      }
    }
    k(props.id , CurrentAmount)
    router.refresh()

  }, [CurrentAmount])
 

  return (
    <div className="bg-white p-2 rounded-xl flex items-center gap-4 overflow-hidden shadow-sm ">
      {/* Image Container */}
      <img
        className="w-60 h-60 rounded-full object-cover shrink-0"
        src={props.image ? props.image : "/placeholder.png"}
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
          <ArrowUpRight className='size-5' /> {props.brand}
          <span className='flex translate-x-5  font-medium text-red-700 animate-pulse'><Dot />{props.tag}</span>

        </p>
        <p className='flex translate-x-4 translate-y-6 '><span className='-translate-y-2 flex bg-green-400 rounded-full p-2'>{props.discountPercent}<Percent className='size-5  mt-1 fill-green-300 -translate-y-1' /></span>off</p>
        <div className='flex -translate-y-4 translate-x-35'><Star className='fill-green-400' /><p>{props.rating}</p><p className='translate-x-2'>({props.reviewCount})</p></div>
        <div className='translate-y-10 translate-x-5 flex gap-2 '><p className='font-light line-through'>₹{(props.originalPrice * CurrentAmount).toLocaleString("en-IN")}</p><p className='font-semibold'>₹{(props.price * CurrentAmount).toLocaleString("en-IN")}</p></div>
        <div className='flex'>
          <button className='bg-yellow-300 translate-y-20 mr-30 translate-x-7 p-2 font-bold cursor-pointer rounded-xl inline-block w-fit shadow-md hover:bg-yellow-400 ' onClick={
            ()=>{
              router.push(`/buy/${props.id}`)
            }
          }>Buy now</button>
          <button className='bg-slate-300 translate-y-20 mr-30  p-2 font-bold cursor-pointer rounded-xl inline-block w-fit shadow-md hover:bg-slate-400 ' onClick={
            ()=>{
              onRemove()
              router.refresh()
              
            }
          }>Remove from cart</button>

        </div>
        <div className='ml-23 translate-x-25  -translate-y-8 font-bold bg-gray-200 p-2 rounded-4xl w-fit'>
          <NumberInput min={1} max={props.stock} step={1} value={CurrentAmount} onChange={SetCurrentAmount} />

        </div>
      </div>

    </div>
  );
};
export default Card
