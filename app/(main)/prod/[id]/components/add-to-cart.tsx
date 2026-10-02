'use client'

import React, { use, useEffect } from 'react'
import { useState } from 'react'
import Link from 'next/link';
import { addCartProduct } from '@/lib/action/setCart';
import { isCart } from '@/lib/action/setCart';

function AddToCart({ prodId }: {
    prodId: string
}) {
    const [cart, SetCart] = useState(false);
    const Addcart = async (prodId: string) => {
        const CartRes = await addCartProduct(prodId)
        if (CartRes.ok) {
            SetCart(true)
        }

    }
    const isCartAdd = async (prodId: string): Promise<boolean> => {
        const inCart = await isCart(prodId)
        if (inCart.ok) {
            return inCart.data
        } else {
            return inCart.ok
        }



    }

    useEffect(() => {
        const getct = async () => {
            const getcart = await isCartAdd(prodId)
            SetCart(getcart)
        }
        getct()


    }, [prodId])




    return (
        <div>
            {!cart && (
                <div className='mr-20 mt-70  gap-8 bg-lime-200 rounded-lg  w-40 p-4 backdrop-blur-lg shadow-md transition-transform duration-300 ease-in-out hover:bg-lime-300 cursor-pointer '>
                    <p onClick={()=>Addcart(prodId) }



                        className='font-bold ml-3 '>Add To Cart</p>
                </div>
            )}
            {cart && (
                <div className='mr-20 mt-70  gap-8 bg-lime-200 rounded-lg  w-40 p-4 backdrop-blur-lg shadow-md transition-transform duration-300 ease-in-out hover:bg-lime-300 cursor-pointer '>
                    <p className='font-bold ml-3 '><Link href="/cart">Go To Cart</Link></p>
                </div>
            )}
        </div>
    )
}
export default AddToCart
