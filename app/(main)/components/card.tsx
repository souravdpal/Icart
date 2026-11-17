'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'

interface HomeCardModel {
  img: string
  Title: string
  Discribe?: string
  Rate: number
  Price: number
  // new, all optional so old usages keep working
  OriginalPrice?: number
  Discount?: number
  Brand?: string
  Reviews?: number
  Stock?: number
  IsNew?: boolean
  Tag?: string | null
}

const FALLBACK_IMG = '/img/no_image.png'
const inr = new Intl.NumberFormat('en-IN')

const Card = (props: HomeCardModel) => {
  const [imgFailed, setImgFailed] = useState(false)

  const title = props.Title || 'Untitled product'
  const description = props.Discribe || ''
  const image = imgFailed || !props.img ? FALLBACK_IMG : props.img
  const hasDiscount =
    !!props.OriginalPrice && props.OriginalPrice > props.Price && (props.Discount ?? 0) > 0
  const lowStock = props.Stock !== undefined && props.Stock > 0 && props.Stock <= 5
  const soldOut = props.Stock !== undefined && props.Stock === 0

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 group-hover:border-sky-300 group-hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={title}
          loading="lazy"
          onError={() => setImgFailed(true)}
          className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${
            soldOut ? 'opacity-50 grayscale' : ''
          }`}
        />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {hasDiscount && (
            <span className="rounded-md bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">
              {Math.round(props.Discount!)}% off
            </span>
          )}
          {props.IsNew && (
            <span className="rounded-md bg-sky-600 px-2 py-0.5 text-xs font-semibold text-white">
              New
            </span>
          )}
          {props.Tag && (
            <span className="rounded-md bg-white/90 px-2 py-0.5 text-xs font-medium text-slate-700 shadow-sm">
              {props.Tag}
            </span>
          )}
        </div>

        {soldOut && (
          <span className="absolute inset-x-0 bottom-0 bg-slate-900/80 py-1.5 text-center text-sm font-medium text-white">
            Out of stock
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {props.Brand && <p className="text-sm text-slate-500">{props.Brand}</p>}

        <h3 className="line-clamp-2 min-h-[2.75rem] font-semibold leading-snug text-slate-900 group-hover:text-sky-700">
          {title}
        </h3>

        {props.Rate > 0 ? (
          <div className="flex items-center gap-1.5 text-sm">
            <span className="inline-flex items-center gap-1 rounded-md bg-green-600 px-1.5 py-0.5 font-semibold text-white">
              {props.Rate.toFixed(1)}
              <Star size={12} fill="currentColor" strokeWidth={0} />
            </span>
            {props.Reviews ? (
              <span className="text-slate-500">({inr.format(props.Reviews)})</span>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No ratings yet</p>
        )}

        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-1">
          <span className="text-xl font-bold text-slate-900">₹{inr.format(props.Price)}</span>
          {hasDiscount && (
            
            <span className="text-sm text-slate-400 line-through">
              ₹{inr.format(props.OriginalPrice!)}
            </span>
          )}
        </div>

        {lowStock && (
          <p className="text-sm font-medium text-amber-600">Only {props.Stock} left</p>
        )}

        {description && (
          <p className="line-clamp-2 text-sm text-slate-500">{description}</p>
        )}
      </div>
    </article>
  )
}

export default Card