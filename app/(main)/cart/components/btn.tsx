'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

const Btn = ({ userid }: { userid: string }) => {
    const router = useRouter()
    
    const redirect_checkout = async (id: string) => {
        const res = await fetch("/api/checkout", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: id // MATCHED: changed from userId to user_id
            })
        })
        
        const data = await res.json()
        
        if (data.success) {
            router.push(data.redirectUrl)
        } else {
            alert("Checkout Failed")
            // window.location.reload() // optional: remove or keep
        }
    }

    return (
        <div>
            <p 
                className="cursor-pointer bg-yellow-300 p-2 rounded-2xl hover:bg-yellow-500" 
                onClick={() => redirect_checkout(userid)}
            >
                Place order
            </p>
        </div>
    )
}

export default Btn