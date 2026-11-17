'use client'
import React, { useState } from 'react'
import { Star, BadgePercent } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CenterSection from './center-section'
import AddToCart from './add-to-cart'

interface product_schema {
  id: string
  title: string
  description: string
  category: string
  brand: string
  price: number
  originalPrice: number
  discountPercent: number
  rating: number
  reviewCount: number
  tag: string
  isNew: boolean
  stock: number
  image: string
  affiliateUrl: string
}

const inr = new Intl.NumberFormat('en-IN')
const FALLBACK_IMG = '/img/no_image.png'

const Product = (product: product_schema) => {
  const [expanded, setExpanded] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const router = useRouter()

  const hasDiscount = product.originalPrice > product.price && product.discountPercent > 0
  const savings = product.originalPrice - product.price
  const soldOut = product.stock === 0
  const lowStock = product.stock > 0 && product.stock <= 5
  const longDescription = (product.description?.length ?? 0) > 160

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 to-zinc-200">
      {/* pt-28 keeps content clear of the sticky navbar */}
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Image */}
          <div className="md:sticky md:top-28 md:self-start">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-slate-200 ring-1 ring-slate-200">
              <img
                src={imgFailed || !product.image ? FALLBACK_IMG : product.image}
                alt={product.title}
                onError={() => setImgFailed(true)}
                className={`h-full w-full object-cover ${soldOut ? 'opacity-60 grayscale' : ''}`}
              />
              <div className="absolute left-4 top-4 flex gap-2">
                {product.isNew && (
                  <span className="rounded-md bg-sky-600 px-2.5 py-1 text-sm font-semibold text-white">
                    New
                  </span>
                )}
                {product.tag && (
                  <span className="rounded-md bg-white/90 px-2.5 py-1 text-sm font-medium text-slate-700 shadow-sm">
                    {product.tag}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <p className="text-slate-500">{product.brand}</p>
              <h1 className="text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">
                {product.title}
              </h1>

              <div className="flex items-center gap-2 text-sm">
                {product.rating > 0 ? (
                  <>
                    <span className="inline-flex items-center gap-1 rounded-md bg-green-600 px-2 py-0.5 font-semibold text-white">
                      {product.rating.toFixed(1)}
                      <Star size={14} fill="currentColor" strokeWidth={0} />
                    </span>
                    {product.reviewCount > 0 && (
                      <span className="text-slate-500">
                        {inr.format(product.reviewCount)} reviews
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-slate-400">No ratings yet</span>
                )}
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-4xl font-bold text-slate-900">
                  ₹{inr.format(product.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-slate-400 line-through">
                      ₹{inr.format(product.originalPrice)}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-green-700">
                      <BadgePercent className="size-5" aria-hidden="true" />
                      {Math.round(product.discountPercent)}% off
                    </span>
                  </>
                )}
              </div>
              {hasDiscount && (
                <p className="mt-1 text-sm text-slate-600">
                  You save ₹{inr.format(savings)}. Inclusive of all taxes.
                </p>
              )}
              {soldOut && <p className="mt-2 font-medium text-rose-600">Out of stock</p>}
              {lowStock && (
                <p className="mt-2 font-medium text-amber-600">Only {product.stock} left</p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <p
                  className={`leading-relaxed text-slate-700 ${expanded ? '' : 'line-clamp-3'}`}
                >
                  {product.description}
                </p>
                {longDescription && (
                  <button
                    type="button"
                    onClick={() => setExpanded((prev) => !prev)}
                    aria-expanded={expanded}
                    className="mt-1 text-sm font-medium text-sky-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                  >
                    {expanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            )}

            <CenterSection />

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="sm:flex-1 [&>*]:w-full">
                <AddToCart {...{ prodId: product.id }} />
              </div>
              <button
                type="button"
                disabled={soldOut}
                onClick={() => router.push(`/buy/${product.id}`)}
                className="h-1/6  translate-y-70 rounded-xl bg-yellow-400 px-6 py-3.5 font-bold text-black shadow-sm transition-colors hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 sm:flex-1"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Product