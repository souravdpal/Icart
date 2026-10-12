'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Card from './card'

interface ProductInfo_struct {
  id: string;
  title: string;
  description: string | null;
  category: string;
  brand: string;
  price: number;
  original_price: number;
  discount_percent: number;
  rating: string | null;
  review_count: number;
  tag: string | null;
  is_new: boolean;
  stock: number;
  image: string;
  affiliate_url: string;
  created_at: string;
}

export default function Giveproduct({ newprod = false }: { newprod?: boolean }) {
  const [product, setProduct] = useState<ProductInfo_struct[]>([])
  const [loading, setLoading] = useState(false)
  const [hasmore, setHasmore] = useState(true)
  const cursorRef = useRef<string | null>(null)
  const fetching = useRef(false) // instant lock against duplicate requests
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  async function loadMore() {
    if (fetching.current || !hasmore) return
    fetching.current = true
    setLoading(true)
    try {
      const qs = new URLSearchParams()
      if (newprod) qs.set('is_new', 'true')
      if (cursorRef.current) qs.set('cursor', cursorRef.current)

      const res = await fetch(`/api/products?${qs}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Request Failed')
      const data = await res.json()

      setProduct((prev) => {
        const seen = new Set(prev.map((p) => p.id))
        return [
          ...prev,
          ...data.ProdData.filter((p: ProductInfo_struct) => !seen.has(p.id)),
        ]
      })

      cursorRef.current = data.NextCursor
      setHasmore(data.NextCursor !== null)
    } catch (err) {
      console.error(err)
    } finally {
      fetching.current = false
      setLoading(false)
    }
  }

  // initial load
  useEffect(() => {
    loadMore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // infinite scroll
  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasmore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { rootMargin: '300px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasmore])

  return (
    <div className="overflow-hidden">
      <div className="p-5 flex flex-wrap gap-4">
        {product.map((prod) => (
          <Link
            key={prod.id}
            href={`/prod/${prod.id}`}
            className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
          >
            <Card
              img={prod.image}
              Title={prod.title}
              Discribe={prod.description ?? ''}
              Rate={Number(prod.rating ?? 0)}
              Price={prod.price}
            />
          </Link>
        ))}
      </div>

      {/* Sentinel: triggers loadMore when scrolled into view */}
      <div ref={sentinelRef} className="h-1" />

      {loading && (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        </div>
      )}

      {!hasmore && product.length > 0 && (
        <p className="py-8 text-center text-sm text-gray-500">
          You've reached the end.
        </p>
      )}
    </div>
  )
}