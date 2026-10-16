'use client'
import  { useState } from 'react'
interface editpop{
    popUp : (x:boolean)=>void
    name : string,
    email :  string,
    username : string
}

const Editpop = ({popUp,name,email,username}:editpop)=> {
    const [Username , setUsername] = useState<string>(username)
    const [Email , setEmail]  = useState<string>(email)
    const [Name,setName]  = useState<string>(name)

  return (
    <div className='ml-150 -translate-y-30'>
      <form action="" className='flex-col flex gap-4 bg-amber-[#F5F5F5] p-2 w-120 h-100 shadow-md  rounded-2xl'>
        <h1 className='font-semibold'>Edit your profile</h1>
        <input type="text"  id="name" defaultValue={name} className='' />
      </form>
    </div>
  )
}

export default Editpop
