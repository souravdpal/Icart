import React from 'react'
import Link from "next/link";
import { Search, ShoppingCart, User } from "lucide-react";
import SearchPop from './search-pop'

export default function Navbar() {
  return (
    <nav className='p-8 m-2 text-center-14 bg-linear-to-r from-cyan-500 to-blue-500 rounded-2xl text-shadow-mauve-50 backdrop-md shadow-md '>
      <ul className='flex gap-8 text-semibold '>
        <li><Link href="/" className='text-black bg-lime-300 rounded-3xl p-3 m-auto '>Home</Link></li>
        <li><Link href="/new/prod" className='text-black  bg-linear-to-r from-amber-300 to-orange-200 rounded-3xl p-3 m-auto backdrop-md shadow-md'>Explore new products</Link></li>
        <li><Link href="/about" className='text-black bg-lime-300 rounded-3xl p-3 m-auto backdrop-md shadow-md'>About Us</Link></li>
        <li><Link href="/cart" className=''><ShoppingCart className='text-black translate-x-200 size-7' /></Link></li>
        <li><Link href="#" className=''><SearchPop /></Link></li>

      </ul>
    </nav>
  )
}