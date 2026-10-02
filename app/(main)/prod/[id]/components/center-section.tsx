import React from 'react'
import { Truck, Banknote,Package,CreditCardPlus } from 'lucide-react'

export default function CenterSection() {
    return (
        <div className='cursor-pointer'>
            <div className="flex gap-7">
                <div className='top-two flex bg-white  gap-3 translate-y-15 p-2 items-center rounded-xl w-85 translate-x-2 shadow-md backdrop-blur-md'>
                    <Truck className='fill-blue-600 translate-x-8' /> <p className='font-semibold translate-x-8'>Fast Delivery</p>
                </div>
                <div className='top-two flex bg-white  gap-3 translate-y-15 p-2 items-center rounded-xl w-85 translate-x-2 shadow-md backdrop-blur-md'>
                    <Banknote className='fill-blue-600 translate-x-8' /> <p className='font-semibold translate-x-8'>Cash On Delivery</p>
                </div>
            </div>
            <div className="flex gap-7">
                <div className='top-two flex bg-white  gap-3 translate-y-20 p-2 items-center rounded-xl w-85 translate-x-2 shadow-md backdrop-blur-md'>
                    <Package className='fill-blue-600 translate-x-8' /> <p className='font-semibold translate-x-8'>7 Days Delivery</p>
                </div>
                <div className='top-two flex bg-white  gap-3 translate-y-20 p-2 items-center rounded-xl w-85 translate-x-2 shadow-md backdrop-blur-md'>
                    <CreditCardPlus className='fill-blue-600 translate-x-8' /> <p className='font-semibold translate-x-8'>Save More</p>
                </div>
            </div>
        </div>
    )
}


