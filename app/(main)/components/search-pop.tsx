'use client'

import React from 'react'
import { Search, Target } from 'lucide-react'
import { useState } from 'react'

const SearchPop= () => {
  const [pop , setPop]= useState(false);
  const [search , setSearch] = useState("Search for product")
  let  getUserSearch =(x:string)=>{
    setSearch(x)

    
  }
  if(!pop){
    return  (
    <Search onClick={()=>{
        setPop(true)
    }} className='text-black translate-x-170 size-7' />
    )
  }
  return (
    <div className=' bg-white translate-x-120  shadow-md backdrop-blur-md border-2 border-blue-300  p-2 rounded-3xl '>
      <input onMouseLeave={()=>setSearch("Search new product")} className='ml-3 outline-none font-light font-mono animate-pulse' type="text" value={search} onClick={()=>setSearch('')} onChange={
        (x)=>{
          getUserSearch(x.target.value)
        }
      } /> 
    </div>
  )
}

export default SearchPop