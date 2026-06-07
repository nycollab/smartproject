import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { placeOrder } from '../services/api'
import ShopLayout from '../components/ShopLayout'

export default function Checkout() {
  const { user } = useAuth()
  const { items, total, clear } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [order, setOrder] = useState(null)

  useEffect(() => {
    // Bounce back to /products if no items and we haven't placed an order yet
    if (!order && items.length === 0) {
      navigate('/products')
    }
  }, [items, order, navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const shippingAddress = [
      form.name,
      `Phone: ${form.phone}`,
      form.address1,
      form.address2,
      `${form.city}, ${form.state} - ${form.pincode}`,
    ].filter(line => line && line.trim()).join('\n')

    try {
      const result = await placeOrder(shippingAddress)
      setOrder(result)
      clear()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  // Order confirmation
  if (order) {
    return (
      <ShopLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                Order placed!
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Thank you for shopping with GreenGrid
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
              <div>
                <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Order ID</div>
                <div className="font-medium text-gray-800 dark:text-gray-100">#{order.order_id}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Total</div>
                <div className="font-medium text-gray-800 dark:text-gray-100">
                  ₹{parseFloat(order.total_amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Status</div>
                <div className="font-medium text-gray-800 dark:text-gray-100 capitalize">{order.status}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Payment</div>
                <div className="font-medium text-gray-800 dark:text-gray-100">{order.payment_method}</div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6 max-w-md mx-auto">
              <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">Items</div>
              <ul className="space-y-2 text-sm">
                {order.items.map(item => (
                  <li key={item.item_id} className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span className="line-clamp-1 mr-2">{item.product_name} × {item.quantity}</span>
                    <span className="shrink-0 font-medium">
                      ₹{(parseFloat(item.unit_price) * item.quantity).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                to="/products"
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                to="/dashboard"
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-medium px-6 py-2 rounded transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </ShopLayout>
    )
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500'

  return (
    <ShopLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">

              {/* Shipping address */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Shipping Address
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <input name="name" type="text" required value={form.name}
                      onChange={handleChange} className={inputClass} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Phone
                    </label>
                    <input name="phone" type="tel" required value={form.phone}
                      onChange={handleChange} className={inputClass} />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Address Line 1
                    </label>
                    <input name="address1" type="text" required value={form.address1}
                      onChange={handleChange} className={inputClass} />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Address Line 2 <span className="text-gray-400">(optional)</span>
                    </label>
                    <input name="address2" type="text" value={form.address2}
                      onChange={handleChange} className={inputClass} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      City
                    </label>
                    <input name="city" type="text" required value={form.city}
                      onChange={handleChange} className={inputClass} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      State
                    </label>
                    <input name="state" type="text" required value={form.state}
                      onChange={handleChange} className={inputClass} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Pincode
                    </label>
                    <input name="pincode" type="text" required value={form.pincode}
                      onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Payment Method
                </h2>
                <label className="flex items-center gap-3 p-3 border-2 border-green-500 rounded bg-green-50 dark:bg-green-900/20 cursor-pointer">
                  <input type="radio" checked readOnly
                    className="text-green-600 focus:ring-green-500" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">Cash on Delivery</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Pay in cash when your order arrives</div>
                  </div>
                </label>
              </div>

            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-5 sticky top-20">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-2 max-h-60 overflow-y-auto mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  {items.map(item => (
                    <div key={item.cart_id} className="flex gap-2 items-center text-sm">
                      <img src={item.product_image} alt=""
                        className="w-10 h-10 rounded object-cover bg-gray-100 dark:bg-gray-700 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-800 dark:text-gray-100 line-clamp-1">
                          {item.product_name}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-gray-800 dark:text-gray-100 font-medium shrink-0">
                        ₹{(parseFloat(item.price) * item.quantity).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-3">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-800 dark:text-gray-100 pt-3 border-t border-gray-200 dark:border-gray-700 mb-4">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>

                {error && (
                  <div className="text-sm text-red-700 dark:text-red-400 mb-3">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={submitting || items.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-medium px-6 py-2 rounded transition-colors"
                >
                  {submitting ? 'Placing order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </ShopLayout>
  )
}
