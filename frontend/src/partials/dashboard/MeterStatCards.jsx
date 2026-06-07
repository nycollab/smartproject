import { useEffect, useState } from 'react'
import { getMeterStats, getMeterComparison } from '../../services/api'

function StatSkeleton() {
  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
      <div className="animate-pulse h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
      <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    </div>
  )
}

function StatCard({ label, value, sublabel, trend }) {
  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">
          {label}
        </div>
        <div className="flex items-center">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
            {value}
          </div>
          {trend && (
            <div className={`text-sm font-medium px-1.5 rounded-full ${trend.color}`}>
              {trend.symbol}
            </div>
          )}
        </div>
      </div>
      <div className="px-5 pb-5 mt-4 text-xs text-gray-500 dark:text-gray-400">
        {sublabel}
      </div>
    </div>
  )
}

export default function MeterStatCards() {
  const [stats, setStats] = useState(null)
  const [comparison, setComparison] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getMeterStats(), getMeterComparison()])
      .then(([s, c]) => {
        setStats(s)
        setComparison(c)
      })
      .catch(() => setError('Failed to load meter stats'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <>
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </>
    )
  }

  if (error) {
    return (
      <div className="col-span-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-xl">
        {error}
      </div>
    )
  }

  const usage = parseFloat(stats.total_kwh_this_month).toFixed(1)
  const cost = parseFloat(stats.estimated_cost).toFixed(2)
  const carbon = parseFloat(stats.carbon_footprint_kg).toFixed(1)
  const change = parseFloat(comparison.change_percent)

  // For energy: going UP = bad (more usage), going DOWN = good (less usage)
  let trendColor = 'text-gray-700 bg-gray-500/20'
  let trendSymbol = '—'
  if (change > 0) {
    trendColor = 'text-red-700 bg-red-500/20'
    trendSymbol = '↑'
  } else if (change < 0) {
    trendColor = 'text-green-700 bg-green-500/20'
    trendSymbol = '↓'
  }

  const changeText = `${change > 0 ? '+' : ''}${change.toFixed(1)}%`

  return (
    <>
      <StatCard
        label="This Month's Usage"
        value={`${usage} kWh`}
        sublabel="Across all hours"
      />
      <StatCard
        label="Estimated Cost"
        value={`₹${cost}`}
        sublabel="At current tariff rate"
      />
      <StatCard
        label="Carbon Footprint"
        value={`${carbon} kg`}
        sublabel="CO₂ emissions this month"
      />
      <StatCard
        label="Month-over-Month"
        value={changeText}
        sublabel="vs previous month"
        trend={{ color: trendColor, symbol: trendSymbol }}
      />
    </>
  )
}
