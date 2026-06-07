import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { listProducts, getMeterStats } from '../services/api'
import ShopLayout from '../components/ShopLayout'
import ProductCard from '../components/ProductCard'

const CATEGORIES = [
  { name: 'Solar Panels', icon: '☀️', desc: 'Mono, poly, bifacial' },
  { name: 'Inverters', icon: '⚡', desc: 'On-grid, off-grid, hybrid' },
  { name: 'Batteries', icon: '🔋', desc: 'Lithium, lead acid, gel' },
  { name: 'Smart Meters', icon: '📊', desc: 'IoT-enabled monitoring' },
  { name: 'LED Lighting', icon: '💡', desc: 'Bulbs, panels, tubes' },
  { name: 'Energy Appliances', icon: '🌀', desc: 'BLDC fans, geysers' },
]

export default function Home() {
  const { user } = useAuth()
  const [featured, setFeatured] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    listProducts({})
      .then(data => {
        // Pick top 8 by discount %
        const withDiscount = data.map(p => {
          const price = parseFloat(p.price)
          const mrp = parseFloat(p.mrp)
          const discount = mrp > price ? (mrp - price) / mrp : 0
          return { ...p, _discount: discount }
        })
        withDiscount.sort((a, b) => b._discount - a._discount)
        setFeatured(withDiscount.slice(0, 8))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!user) {
      setStats(null)
      return
    }
    getMeterStats()
      .then(setStats)
      .catch(() => {})
  }, [user])

  return (
    <ShopLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
        <div className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Power Your Home.<br />
            <span className="text-green-200">Power The Planet.</span>
          </h1>
          <p className="text-lg md:text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Shop solar panels, inverters, batteries and smart energy products.
            Track your usage. Reduce your footprint.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/products"
              className="bg-white text-green-700 hover:bg-green-50 font-medium px-6 py-3 rounded-lg shadow-lg transition-colors"
            >
              Shop Now
            </Link>
            {user ? (
              <Link
                to="/dashboard"
                className="bg-green-900/40 hover:bg-green-900/60 text-white border border-white/20 font-medium px-6 py-3 rounded-lg transition-colors"
              >
                View Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="bg-green-900/40 hover:bg-green-900/60 text-white border border-white/20 font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Energy preview — logged in only */}
      {user && stats && (
        <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-6 flex-wrap">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">This Month's Usage</div>
                <div className="font-bold text-gray-800 dark:text-gray-100">
                  {parseFloat(stats.total_kwh_this_month).toFixed(1)} kWh
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Estimated Cost</div>
                <div className="font-bold text-gray-800 dark:text-gray-100">
                  ₹{parseFloat(stats.estimated_cost).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Carbon Footprint</div>
                <div className="font-bold text-gray-800 dark:text-gray-100">
                  {parseFloat(stats.carbon_footprint_kg).toFixed(1)} kg CO₂
                </div>
              </div>
            </div>
            <Link
              to="/dashboard"
              className="text-sm font-medium text-green-600 hover:text-green-700"
            >
              View full dashboard →
            </Link>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-12">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Find the right green energy product for your home
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-lg hover:-translate-y-1 hover:ring-1 hover:ring-green-500/40 transition-all duration-200"
              >
                <div className="text-4xl mb-2">{cat.icon}</div>
                <div className="font-medium text-gray-800 dark:text-gray-100 text-sm mb-1">
                  {cat.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {cat.desc}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Best deals */}
      <section className="py-12 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                Best Deals
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Top discounts on green energy products
              </p>
            </div>
            <Link
              to="/products"
              className="text-sm font-medium text-green-600 hover:text-green-700"
            >
              View all →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(p => (
                <ProductCard key={p.product_id} product={p} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <div className="animate-pulse aspect-square bg-gray-200 dark:bg-gray-600"></div>
                  <div className="p-4 space-y-2">
                    <div className="animate-pulse h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
                    <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    <div className="animate-pulse h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </ShopLayout>
  )
}
