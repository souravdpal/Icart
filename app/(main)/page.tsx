import React from 'react'
import getAllProd from '@/lib/product/getAllProd'
import Card from './components/card'
import Link from 'next/link'

export default async   function Home() {
  let prod_Data = getAllProd()
  return (
    <div className="p-5 flex gap-13 flex-wrap ">
      {prod_Data.map((prod) => (
        <Link key={prod.id} href={`/prod/${prod.id}`}><Card img={prod.image} Title={prod.title} Discribe={prod.description} Rate={prod.rating} Price={prod.price} /></Link>
      ))}
    </div>
  )
}


