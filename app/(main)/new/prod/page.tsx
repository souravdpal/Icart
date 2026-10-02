import React from 'react'
import Card from '@/app/(main)/components/card'
import getNewprod from '@/lib/product/getNewprod'
import Link from 'next/link'

const page = () => {
  let data = getNewprod()

  return (
    <div className="p-5 flex gap-13 flex-wrap ">
      {data.map((prod) => (
        <Link key={prod.id} href={`/prod/${prod.id}`}><Card img={prod.image} Title={prod.title} Discribe={prod.description} Rate={prod.rating} Price={prod.price} /></Link>
      ))}
    </div>
  )
}

export default page
