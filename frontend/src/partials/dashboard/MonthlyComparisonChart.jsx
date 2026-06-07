import { useEffect, useState } from 'react'
import { getMeterComparison } from '../../services/api'
import EnergyBarChart from '../../charts/EnergyBarChart'
import { getCssVariable } from '../../utils/Utils'

export default function MonthlyComparisonChart() {
  const [comparison, setComparison] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMeterComparison()
      .then(setComparison)
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Monthly Comparison
        </h2>
      </header>
      {loading ? (
        <div className="p-5">
          <div className="animate-pulse h-64 bg-gray-100 dark:bg-gray-700 rounded"></div>
        </div>
      ) : error ? (
        <div className="p-5 text-red-700 dark:text-red-400">{error}</div>
      ) : (
        <EnergyBarChart
          labels={['Previous Month', 'Current Month']}
          data={[
            parseFloat(comparison.previous_month.total_kwh),
            parseFloat(comparison.current_month.total_kwh),
          ]}
          colors={[
            getCssVariable('--color-gray-400'),
            getCssVariable('--color-green-500'),
          ]}
        />
      )}
    </div>
  )
}
