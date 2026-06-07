import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { listProducts } from '../services/api'
import ShopLayout from '../components/ShopLayout'
import ProductCard from '../components/ProductCard'

const CATEGORIES = [
  'All',
  'Solar Panels',
  'Inverters',
  'Batteries',
  'Smart Meters',
  'LED Lighting',
  'Energy Appliances',
]

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name (A-Z)' },
]

export default function Products() {
  const [params, setParams] = useSearchParams()
  const search = params.get('search') || ''
  const category = params.get('category') || ''
  const sort = params.get('sort') || ''

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    const q = {}
    if (search) q.search = search
    if (category) q.category = category
    if (sort) q.sort = sort

    listProducts(q)
      .then(setProducts)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false))
  }, [search, category, sort])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500'

  return (
    <ShopLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Shop Green Energy Products
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Solar panels, inverters, batteries and more for your home
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => updateParam('search', e.target.value)}
            className={inputClass}
          />

          <select
            value={category}
            onChange={(e) => updateParam('category', e.target.value === 'All' ? '' : e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c === 'All' ? '' : c}>{c}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className={inputClass}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="animate-pulse aspect-square bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4 space-y-2">
                  <div className="animate-pulse h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="animate-pulse h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            No products match your filters
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Showing {products.length} product{products.length === 1 ? '' : 's'}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(p => (
                <ProductCard key={p.product_id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </ShopLayout>
  )
}
