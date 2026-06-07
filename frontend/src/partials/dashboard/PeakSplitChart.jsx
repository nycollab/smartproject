import { useEffect, useState } from 'react'
import { getMeterStats } from '../../services/api'
import EnergyDonutChart from '../../charts/EnergyDonutChart'
import { getCssVariable } from '../../utils/Utils'

export default function PeakSplitChart() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMeterStats()
      .then(setStats)
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const peak = stats ? parseFloat(stats.peak_usage_kwh) : 0
  const offPeak = stats ? parseFloat(stats.off_peak_usage_kwh) : 0
  const noData = !loading && !error && peak === 0 && offPeak === 0

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Peak vs Off-Peak Usage
        </h2>
      </header>
      {loading ? (
        <div className="p-5">
          <div className="animate-pulse h-64 bg-gray-100 dark:bg-gray-700 rounded"></div>
        </div>
      ) : error ? (
        <div className="p-5 text-red-700 dark:text-red-400">{error}</div>
      ) : noData ? (
        <div className="p-5 text-gray-500 dark:text-gray-400">
          No usage data this month yet
        </div>
      ) : (
        <EnergyDonutChart
          labels={['Peak hours', 'Off-peak hours']}
          data={[peak, offPeak]}
          colors={[
            getCssVariable('--color-orange-500'),
            getCssVariable('--color-green-500'),
          ]}
        />
      )}
    </div>
  )
}
