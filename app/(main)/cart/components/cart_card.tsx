'use client'
import React, { useEffect, useRef, useState } from 'react'
import NumberInput from './setepper'
import { cart_prod_struct } from '@/types/products'
import { ArrowUpRight, Percent, Star, Trash2 } from 'lucide-react'
import { UpdateQunat } from '@/lib/action/setCart'
import { useRouter } from 'next/navigation'

type CardProps = cart_prod_struct & {
  onRemove: () => void
}

const Card = ({ onRemove, ...props }: CardProps) => {
  const router = useRouter()
  const [currentAmount, setCurrentAmount] = useState<number>(props.amount)
  const lastConfirmed = useRef<number>(props.amount)

  useEffect(() => {
    // nothing to sync if the value is already what the server has
    if (currentAmount === lastConfirmed.current) return

    let cancelled = false
    ;(async () => {
      const res = await UpdateQunat(props.id, currentAmount)
      if (cancelled) return
      if (!res.ok || res.data === 'not updated') {
        // roll back to the last value the server accepted
        setCurrentAmount(lastConfirmed.current)
      } else {
        lastConfirmed.current = currentAmount
        router.refresh()
      }
    })()

    return () => {
      cancelled = true
    }
  }, [currentAmount, props.id, router])

  return (
    <article className="group flex w-full flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:gap-5 sm:p-4">
      {/* Image */}
      <div className="relative mx-auto aspect-square w-full max-w-[220px] shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:mx-0 sm:w-40 md:w-48">
        <img
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={props.image ? props.image : '/placeholder.png'}
          alt={props.title}
        />
        {props.discountPercent ? (
          <span className="absolute left-2 top-2 inline-flex items-center gap-0.5 rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white shadow">
            {props.discountPercent}
            <Percent className="size-3" /> off
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="min-w-0 truncate text-base font-semibold text-slate-900 sm:text-lg">
              {props.title}
            </h3>
            {props.tag && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700">
                <span className="size-1.5 animate-pulse rounded-full bg-red-600" />
                {props.tag}
              </span>
            )}
          </div>

          <p className="mt-1 line-clamp-2 text-sm text-slate-600">
            {props.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-700">
            <span className="inline-flex items-center gap-1">
              <ArrowUpRight className="size-4" />
              {props.brand}
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="size-4 fill-green-500 text-green-500" />
              <span className="font-medium">{props.rating}</span>
              <span className="text-slate-500">({props.reviewCount})</span>
            </span>
          </div>
        </div>

        {/* Price + quantity */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">
              ₹{(props.price * currentAmount).toLocaleString('en-IN')}
            </span>
            <span className="text-sm font-light text-slate-500 line-through">
              ₹{(props.originalPrice * currentAmount).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="w-fit rounded-full bg-slate-100 p-1.5">
            <NumberInput
              min={1}
              max={props.stock}
              step={1}
              value={currentAmount}
              onChange={setCurrentAmount}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-2 min-[420px]:flex-row">
          <button
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-yellow-300 px-4 py-2.5 text-sm font-bold shadow-sm transition hover:bg-yellow-400 active:scale-[0.98]"
            onClick={() => router.push(`/buy/${props.id}`)}
          >
            Buy now
          </button>
          <button
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-red-50 hover:text-red-600 active:scale-[0.98]"
            onClick={() => {
              onRemove()
              router.refresh()
            }}
          >
            <Trash2 className="size-4" />
            Remove
          </button>
        </div>
      </div>
    </article>
  )
}

export default Card