'use client'
import { Edit } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Editpop from './components/edit-popup'
interface UserProps {
    name: string
    username: string
    email: string
    img: string
}

const User = ({ name, username, email, img }: UserProps) => {
    const [isEdit, setIsEdit] = useState<boolean>(false)
    function updatePopState(x: boolean) {
        useEffect(() => {
            setIsEdit(x)
        }, [])
    }
    return (
        <div>
            <div className='flex items-center gap-4 mt-10 ml-10 p-4 w-72 h-32 rounded-xl bg-[#eccea0] shadow-md'>
                <img src={img} alt={`${name}'s avatar`} className='w-20 h-20 rounded-full object-cover' />
                <div className='flex flex-col'>
                    <p className='font-semibold text-lg'>{name}</p>
                    <p className='text-sm text-gray-500'>@{username}</p>
                    <p className='text-xs text-gray-400'>{email}</p>

                </div>
                <div className='' onClick={() => {
                    setIsEdit((prev) => !prev)

                }}>
                    <Edit />


                </div>

            </div>

            {isEdit && (<Editpop popUp={updatePopState} name={name} username={username} email={email}/>)}
        </div>
    )
}

export default User