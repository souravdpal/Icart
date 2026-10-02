'use client'
import React from 'react'
import { Redirect } from 'next'
import { Lock, User } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {auth_login} from '@/lib/action/auth'

const LoginComp = () => {
  const router = useRouter();
  const [Username,setUsername] = useState<string>('Username')
  const [Userpass,setUserpass] = useState<string>('Password')
  const [error , setError]= useState<string>("")

  let auth = async ()=>{
    let info = {
      username : Username,
      password : Userpass
    }
    let res = await auth_login(info)
    if(!res.success){
      setError(res.error??'Failed try again')
    }
    if(res.success){
      router.push('/')
    }
  }
  
  
   

  return (
    <div className=' gap-2 bg-white/30 backdrop-blur-md boder-white/20 rounded-xl p-6 shadow-lg -translate-y-10 opacity-70 h-124 w-120 '>
      <div className='translate-x-20'>
        <div>
          <h1 className='text-4xl text-black-50 font-semibold p-7 translate-x-12 -translate-y-6'>Login</h1><User className='translate-x-70 outline-none translate-y-8 hover:cursor-pointer' />

          <input className='p-3 w-100 -translate-x-20 rounded-4xl outline-none border-gray border-1 ' type="text" value={Username} onClick={()=>setUsername('')} onChange={(x)=>setUsername(x.target.value)} />

        </div>
        <div>
          <input className='p-3 rounded-4xl w-100 -translate-x-20  outline-none border-gray border-1 mt-10 ' type="text"  value={Userpass} onClick={()=>setUserpass('')} onChange={(x)=>setUserpass(x.target.value)} /><Lock className='translate-x-70 -translate-y-9 text-black'/>

        </div>
        <div>
          <button className='p-3 rounded-4xl w-100  -translate-y-7 -translate-x-20  outline-none  ml-30 font-semibold hover:cursor-pointer'  onClick={()=>router.push('/reset')}>forgot password?</button>
        </div>
        <div>
          <button className='p-4 h-12 w-100 -translate-x-20 rounded-4xl  font-semibold outline-none border-gray bg-blue-600 hover:cursor-pointer' onClick={()=>{
            auth()
          }}>Login</button>
        </div>
        <div className='translate-x-2 translate-y-5'>
          <h3>Don't have and account? <button onClick={()=>router.push('/register')}  className='font-semibold hover:cursor-pointer'>register</button></h3>
        </div>
        <div className='translate-x-18 mt-2 translate-y-5'>
          <h3 className={error!=""?"-translate-x-20 text-red-700 font-semibold animate-[error-shake_0.3s_ease-in-out_2]":""}>{error}</h3>
        </div>
      </div>
    </div>
  )
}

export default LoginComp
