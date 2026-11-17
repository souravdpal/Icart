'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Card from './card'

interface ProductInfo_struct {
  id: string
  title: string
  description: string | null
  category: string
  brand: string
  price: number
  original_price: number
  discount_percent: number
  rating: string | null
  review_count: number
  tag: string | null
  is_new: boolean
  stock: number
  image: string
  affiliate_url: string
  created_at: string
}

const GRID = 'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4'

function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="aspect-square bg-slate-200" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-2/3 rounded bg-slate-200" />
        <div className="h-6 w-1/2 rounded bg-slate-200" />
      </div>
    </div>
  )
}

export default function Giveproduct({ newprod = false }: { newprod?: boolean }) {
  const [product, setProduct] = useState<ProductInfo_struct[]>([])
  const [loading, setLoading] = useState(false)
  const [hasmore, setHasmore] = useState(true)
  const [error, setError] = useState(false)

  const hasmoreRef = useRef(true) // avoids stale closure inside the observer
  const cursorRef = useRef<string | null>(null)
  const fetching = useRef(false) // instant lock against duplicate requests
  const generation = useRef(0) // ignores responses from an older filter
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  async function loadMore(reset = false) {
    if (!reset && (fetching.current || !hasmoreRef.current)) return
    const myGen = generation.current
    fetching.current = true
    setLoading(true)
    setError(false)
    try {
      const qs = new URLSearchParams()
      if (newprod) qs.set('is_new', 'true')
      if (cursorRef.current) qs.set('cursor', cursorRef.current)

      const res = await fetch(`/api/products?${qs}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Request Failed')
      const data = await res.json()
      if (myGen !== generation.current) return // filter changed meanwhile

      setProduct((prev) => {
        const seen = new Set(prev.map((p) => p.id))
        return [
          ...prev,
          ...data.ProdData.filter((p: ProductInfo_struct) => !seen.has(p.id)),
        ]
      })

      cursorRef.current = data.NextCursor
      hasmoreRef.current = data.NextCursor !== null
      setHasmore(hasmoreRef.current)
    } catch (err) {
      console.error(err)
      if (myGen === generation.current) setError(true)
    } finally {
      if (myGen === generation.current) {
        fetching.current = false
        setLoading(false)
      }
    }
  }

  // initial load + reset whenever the filter changes
  useEffect(() => {
    generation.current += 1
    cursorRef.current = null
    hasmoreRef.current = true
    fetching.current = false
    setProduct([])
    setHasmore(true)
    loadMore(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newprod])

  // infinite scroll
  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasmore || error) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { rootMargin: '300px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasmore, error, newprod])

  const firstLoad = loading && product.length === 0

  return (
    <section className="mx-auto max-w-7xl px-3 py-6 sm:px-5">
      {/* Empty state */}
      {!loading && !error && product.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-lg font-semibold text-slate-800">No products found</p>
          <p className="mt-1 text-sm text-slate-500">Check back soon or browse all products.</p>
        </div>
      )}

      <div className={GRID}>
        {product.map((prod) => (
          <Link
            key={prod.id}
            href={`/prod/${prod.id}`}
            className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            <Card
              img={prod.image}
              Title={prod.title}
              Discribe={prod.description ?? ''}
              Rate={Number(prod.rating ?? 0)}
              Price={prod.price}
              OriginalPrice={prod.original_price}
              Discount={prod.discount_percent}
              Brand={prod.brand}
              Reviews={prod.review_count}
              Stock={prod.stock}
              IsNew={prod.is_new}
              Tag={prod.tag}
            />
          </Link>
        ))}

        {/* Skeletons: full set on first load, a short row while paging */}
        {loading &&
          Array.from({ length: firstLoad ? 8 : 4 }).map((_, i) => <CardSkeleton key={`s${i}`} />)}
      </div>

      {/* Sentinel: triggers loadMore when scrolled into view */}
      <div ref={sentinelRef} className="h-1" />

      {error && (
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-sm text-slate-600">Couldn’t load products. Check your connection and try again.</p>
          <button
            type="button"
            onClick={() => loadMore()}
            className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            Try again
          </button>
        </div>
      )}

      {!hasmore && product.length > 0 && (
        <p className="py-8 text-center text-sm text-slate-500">You’ve seen everything for now.</p>
      )}
    </section>
  )
}