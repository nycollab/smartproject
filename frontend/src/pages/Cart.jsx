import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import ShopLayout from '../components/ShopLayout'

export default function Cart() {
  const { items, total, loading, updateItem, removeItem } = useCart()
  const navigate = useNavigate()
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState(null)

  const handleQty = async (cartId, currentQty, delta) => {
    const newQty = currentQty + delta
    if (newQty < 1) return
    setBusyId(cartId)
    setError(null)
    try {
      await updateItem(cartId, newQty)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update quantity')
    } finally {
      setBusyId(null)
    }
  }

  const handleRemove = async (cartId) => {
    setBusyId(cartId)
    setError(null)
    try {
      await removeItem(cartId)
    } catch {
      setError('Failed to remove item')
    } finally {
      setBusyId(null)
    }
  }

  if (loading && items.length === 0) {
    return (
      <ShopLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Your Cart
          </h1>
          <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </ShopLayout>
    )
  }

  if (items.length === 0) {
    return (
      <ShopLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Browse the shop to find green energy products
          </p>
          <Link
            to="/products"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </ShopLayout>
    )
  }

  return (
    <ShopLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Your Cart
        </h1>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => {
              const lineTotal = parseFloat(item.price) * item.quantity
              const isBusy = busyId === item.cart_id

              return (
                <div
                  key={item.cart_id}
                  className={`bg-white dark:bg-gray-800 rounded-lg p-4 flex gap-4 items-center transition-opacity ${
                    isBusy ? 'opacity-50' : ''
                  }`}
                >
                  <Link to={`/products/${item.product_id}`} className="shrink-0">
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded bg-gray-100 dark:bg-gray-700"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product_id}`}
                      className="font-medium text-gray-800 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-500 line-clamp-2"
                    >
                      {item.product_name}
                    </Link>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      ₹{parseFloat(item.price).toLocaleString('en-IN')} each
                    </div>
                  </div>

                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded">
                    <button
                      onClick={() => handleQty(item.cart_id, item.quantity, -1)}
                      disabled={isBusy || item.quantity <= 1}
                      className="px-2 py-1 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 min-w-[2rem] text-center text-sm text-gray-800 dark:text-gray-100">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQty(item.cart_id, item.quantity, 1)}
                      disabled={isBusy}
                      className="px-2 py-1 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>

                  <div className="hidden sm:block text-right min-w-[80px]">
                    <div className="font-semibold text-gray-800 dark:text-gray-100">
                      ₹{lineTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item.cart_id)}
                    disabled={isBusy}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
                    aria-label="Remove"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )
            })}

            <Link
              to="/products"
              className="inline-block text-sm text-green-600 hover:text-green-700 mt-2"
            >
              ← Continue shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 sticky top-20">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Order Summary
              </h2>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-4">
                <div className="flex justify-between font-semibold text-gray-800 dark:text-gray-100">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  )
}
