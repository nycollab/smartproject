import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const price = parseFloat(product.price)
  const mrp = parseFloat(product.mrp)
  const discount = mrp > price ? Math.round((1 - price / mrp) * 100) : 0

  return (
    <Link
      to={`/products/${product.product_id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 hover:ring-1 hover:ring-green-500/40 transition-all duration-200 overflow-hidden"
    >
      <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
        {product.wattage && (
          <span className="absolute top-2 right-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs font-semibold px-2 py-1 rounded">
            {product.wattage}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          {product.brand}
        </div>
        <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-2 line-clamp-2 min-h-[2.5rem] text-sm">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ₹{mrp.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
