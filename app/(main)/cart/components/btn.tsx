'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const Btn = ({ userid }: { userid: string }) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const redirect_checkout = async (id: string) => {
        if (loading) return
        setLoading(true)
        try {
            const res = await fetch("/api/checkout", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: id })
            })
            const data = await res.json()

            if (data.success) {
                router.push(data.redirectUrl)
            } else {
                alert("Checkout Failed")
                setLoading(false)
            }
        } catch {
            alert("Checkout Failed")
            setLoading(false)
        }
    }

    return (
        <button
            type="button"
            disabled={loading}
            onClick={() => redirect_checkout(userid)}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-yellow-300 px-6 py-3 font-bold text-slate-900 shadow-md transition hover:bg-yellow-400 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
        >
            {loading ? 'Placing order…' : 'Place order'}
        </button>
    )
}

export default Btn