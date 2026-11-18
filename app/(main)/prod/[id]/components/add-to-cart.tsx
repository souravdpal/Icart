'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Check } from 'lucide-react'
import { addCartProduct, isCart } from '@/lib/action/setCart'

type Props = {
    prodId: string
    disabled?: boolean
}

function AddToCart({ prodId, disabled = false }: Props) {
    const [inCart, setInCart] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            const res = await isCart(prodId)
            if (!cancelled) setInCart(res.ok ? res.data : false)
        })()
        return () => {
            cancelled = true
        }
    }, [prodId])

    const handleAdd = async () => {
        if (loading || disabled) return
        setLoading(true)
        const res = await addCartProduct(prodId)
        if (res.ok) setInCart(true)
        setLoading(false)
    }

    // same height / radius as the Buy now button so the pair lines up
    const base =
        'inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold text-slate-900 shadow-sm transition active:scale-[0.98] sm:text-base'

    if (inCart) {
        return (
            <Link href="/cart" className={`${base} bg-lime-300 hover:bg-lime-400`}>
                <Check className="size-5 shrink-0" />
                Go to cart
            </Link>
        )
    }

    return (
        <button
            type="button"
            onClick={handleAdd}
            disabled={loading || disabled}
            className={`${base} bg-lime-200 hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60`}
        >
            <ShoppingCart className="size-5 shrink-0" />
            {loading ? 'Adding…' : 'Add to cart'}
        </button>
    )
}

export default AddToCart