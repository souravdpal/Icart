'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Subcard from './components/subcard'
import Card from '../components/card'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  description: string | null
  category: string
  brand: string
  price: number
  image: string | null
  rating: number
}

const Search = () => {
  const [loadskel, setLoadskel] = useState(true)
  const [searchData, setSearchData] = useState<Product[]>([])
  const [error, setError] = useState(false)

  const searchParam = useSearchParams()
  const query = searchParam.get('q')

  useEffect(() => {
    if (!query) {
      setSearchData([])
      setLoadskel(false)
      return
    }

    const controller = new AbortController()
    setLoadskel(true)
    setError(false)

    fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setSearchData(Array.isArray(data) ? data : [])
        setLoadskel(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return // newer search replaced this one
        console.error('Fetch error:', err)
        setSearchData([])
        setError(true)
        setLoadskel(false)
      })

    return () => controller.abort()
  }, [query])

  if (loadskel) return <Subcard />

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Search Results for: &quot;{query}&quot;
      </h2>

      {error ? (
        <p>Something went wrong. Please try again.</p>
      ) : searchData.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {searchData.map((product) => (
            <Link key={product.id} href={`/prod/${product.id}`}>
              <Card
                img={product.image ?? '/p/placeholder.png'}
                Title={product.title}
                Discribe={product.description ?? ''}
                Price={product.price}
                Rate={product.rating}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Search