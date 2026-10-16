'use client'
import { useState } from 'react'
import Link from 'next/link'
import { SaveCheck, X } from 'lucide-react'

interface EditpopProps {
  popUp: (x: boolean) => void
  name: string
  email: string
  username: string
  img: string
}

const Editpop = ({ popUp, name, email, username, img }: EditpopProps) => {
  const [Username, setUsername] = useState<string>(username)
  const [Email, setEmail] = useState<string>(email)
  const [Name, setName] = useState<string>(name)
  
  const [isHoverMail, setHoverMail] = useState<boolean>(false)
  const [b1, setB1] = useState<string>("Enter street name")
  const [b2, setB2] = useState<string>("Enter landmark (optional)")
  const [b3, setB3] = useState<string>("Enter Area")

  return (
    <div 
      className='-translate-x-150 -translate-y-20 absolute z-50 mt-4 right-0 w-[450px] p-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-b-3xl rounded-r-3xl text-zinc-800 dark:text-zinc-100 transition-all'
      onMouseLeave={() => popUp(false)}
    >
      {/* Header / Close Option */}
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-lg font-bold tracking-tight'>Edit Profile</h2>
        <button 
          onClick={() => popUp(false)}
          className='p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition'
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className='flex flex-col gap-5'>
        
        {/* Profile Info Section */}
        <div className='flex items-center gap-4 bg-zinc-100/50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50'>
          <img 
            src={img} 
            alt="Profile Avatar" 
            className='w-16 h-16 rounded-full object-cover border-2 border-white dark:border-zinc-700 shadow-sm' 
          />
          <div className='flex flex-col gap-1 w-full'>
            <input 
              type="text" 
              value={Name} 
              onChange={(e) => setName(e.target.value)}
              className='font-bold text-lg bg-transparent outline-none focus:bg-white/60 dark:focus:bg-zinc-900/60 px-2 py-1 rounded-lg transition' 
            />
            <div className='flex items-center text-sm text-zinc-500 dark:text-zinc-400 px-2'>
              <span>@</span>
              <input 
                type="text" 
                value={Username} 
                onChange={(e) => setUsername(e.target.value)} 
                className='bg-transparent outline-none w-full focus:bg-white/60 dark:focus:bg-zinc-900/60 py-0.5 rounded-lg transition' 
              />
            </div>
          </div>
        </div>

        {/* Email Section */}
        <div className='flex items-center justify-between bg-zinc-100/50 dark:bg-zinc-800/50 px-4 py-3 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 relative'>
          <input 
            type="email" 
            value={Email} 
            onChange={(e) => setEmail(e.target.value)} 
            className='bg-transparent outline-none w-full text-sm font-medium' 
          />
          <div className='relative'>
            <Link href={`/email/verify?mail=${encodeURIComponent(Email)}`}>
              <SaveCheck 
                className='text-emerald-600 hover:text-emerald-700 cursor-pointer transition' 
                size={20}
                onMouseEnter={() => setHoverMail(true)} 
                onMouseLeave={() => setHoverMail(false)} 
              />
            </Link>
            {isHoverMail && (
              <div className='absolute right-0 bottom-8 bg-zinc-900 text-white text-xs font-mono px-3 py-1.5 shadow-lg rounded-xl whitespace-nowrap z-10 animate-in fade-in'>
                Update Email
              </div>
            )}
          </div>
        </div>

        {/* Address Section */}
        <div className='flex flex-col gap-3'>
          <label className='text-xs font-semibold uppercase tracking-wider text-zinc-400'>Delivery Address</label>
          
          <input 
            type="text"  
            value={b1} 
            placeholder="Street Name"
            className='bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition' 
            onChange={(e) => setB1(e.target.value)}
          />

          <div className='grid grid-cols-2 gap-2'>
            <input 
              type="text"  
              value={b2} 
              placeholder="Landmark"
              className='bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition' 
              onChange={(e) => setB2(e.target.value)}
            />
            <input 
              type="text"  
              value={b3} 
              placeholder="Area"
              className='bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition' 
              onChange={(e) => setB3(e.target.value)}
            />
          </div>
        </div>

        {/* Save Button */}
        <button 
          type='button'
          onClick={() => popUp(false)}
          className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl shadow-lg shadow-blue-500/20 transition'
        >
          Save Changes
        </button>

      </form>
    </div>
  )
}

export default Editpop