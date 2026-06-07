import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProduct } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import ShopLayout from '../components/ShopLayout'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setMessage(null)
    setQuantity(1)
    getProduct(id)
      .then(setProduct)
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAdd = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    setAdding(true)
    setMessage(null)
    try {
      await addItem(parseInt(id), quantity)
      setMessage({ type: 'success', text: `Added ${quantity} to cart` })
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to add to cart',
      })
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <ShopLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="space-y-4">
              <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="animate-pulse h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </ShopLayout>
    )
  }

  if (error || !product) {
    return (
      <ShopLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded">
            {error || 'Product not found'}
          </div>
          <Link to="/products" className="inline-block mt-4 text-green-600 hover:text-green-700">
            ← Back to shop
          </Link>
        </div>
      </ShopLayout>
    )
  }

  const price = parseFloat(product.price)
  const mrp = parseFloat(product.mrp)
  const discount = mrp > price ? Math.round((1 - price / mrp) * 100) : 0
  const inStock = product.stock > 0

  return (
    <ShopLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/products" className="hover:text-green-600">Shop</Link>
          <span className="mx-2">/</span>
          <span>{product.category}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
          </div>

          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              {product.brand}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-4 flex-wrap">
              <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                ₹{price.toLocaleString('en-IN')}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{mrp.toLocaleString('en-IN')}
                  </span>
                  <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-sm font-semibold px-2 py-0.5 rounded">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-3 py-1 rounded">
                {product.category}
              </span>
              {product.wattage && (
                <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-medium px-3 py-1 rounded">
                  {product.wattage}
                </span>
              )}
              {product.warranty_years > 0 && (
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-medium px-3 py-1 rounded">
                  {product.warranty_years} year warranty
                </span>
              )}
            </div>

            <div className="mb-6">
              {inStock ? (
                <span className="text-sm text-green-700 dark:text-green-400">
                  ✓ In stock — {product.stock} available
                </span>
              ) : (
                <span className="text-sm text-red-700 dark:text-red-400">
                  Out of stock
                </span>
              )}
            </div>

            {inStock && (
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 min-w-12 text-center text-gray-800 dark:text-gray-100 border-x border-gray-200 dark:border-gray-700">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-2 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={adding}
                  className="flex-1 min-w-[180px] bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-medium px-6 py-2 rounded transition-colors"
                >
                  {adding ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            )}

            {message && (
              <div className={`text-sm mb-4 ${
                message.type === 'success'
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-red-700 dark:text-red-400'
              }`}>
                {message.text}
                {message.type === 'success' && (
                  <Link to="/cart" className="ml-2 underline hover:text-green-800 dark:hover:text-green-300">
                    View cart
                  </Link>
                )}
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Description
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  )
}
