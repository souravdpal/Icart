'use client'
import React from 'react'
import { useState } from 'react';
import CenterSection from './center-section'
import { IndianRupee, Star, BadgePercent, Truck,Banknote } from 'lucide-react';
import AddToCart from  './add-to-cart'
interface product_schema {
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
const Product = (product: product_schema) => {
    const [more, setMore] = useState(false);

    return (
        <div className='static bg-linear-to-b from-slate-100 to-zinc-200 group rounded-4xl text-clamp-3 m-auto ml-2 mr-5 h-170 w-330'>
            <div className='flex gap-30'>
                <img src={product.image} alt="" className='rounded-3xl p-4 static h-100 boder  bg-slate-200 translate-x-10' />
                <div>
                    <div className='translate-y-5 -translate-x-7 flex'>
                        <BadgePercent className='size-7 fill-green-500' /> <p className='font-bold '>{`${product.discountPercent}% off`}</p>
                    </div>
                    <div className='p-1 mt-4 font-sans text-3xl line-clamp-3 backdrop-blur-xl'>
                        <p onClick={() => setMore((prev) => (!prev))} className={more ? "hover:underline" : "line-clamp-1 hover:underline cursor-pointer"}>
                            {product.title},{product.description}
                        </p>

                    </div>

                    <div className='font-light ml-3 flex gap-3'>
                        {product.brand} <br /> <Star className='fill-green-500 text-green-500' />{product.rating}
                    </div>
                    <div className='flex gap-7'>
                        <div className='p-auto mt-9 font-black text-4xl flex gap-2'>
                            <IndianRupee className='size-9' /> <p>{product.price}</p>
                        </div>
                        <div className='p-auto mt-10 font-black text-2xl flex gap-2 line-through'>
                            <IndianRupee className='size-4 mt-2' /> <p className='font-light'>{product.originalPrice}</p>
                        </div>
                    </div>
                    <div>
                        <CenterSection/>
                    </div>
                    <div className='flex gap-30 -translate-y-6'>

                        <AddToCart {...{prodId : product.id}}/>
                        <div className=' mt-70 gap-8 bg-yellow-400 rounded-lg  w-40 p-4  backdrop-blur-3xl shadow-md transition-transform duration-300 ease-in-out hover:bg-amber-300 cursor-pointer'>
                            <p className='font-bold ml-3 '>Buy Now</p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Product
