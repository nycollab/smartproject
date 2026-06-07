import { useEffect, useState } from 'react'
import { getMeterReadings } from '../../services/api'
import EnergyLineChart from '../../charts/EnergyLineChart'

const RANGES = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
]

function formatLabel(timestamp, range) {
  const d = new Date(timestamp)
  if (range === 'daily') {
    return d.getHours().toString().padStart(2, '0') + ':00'
  }
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}

export default function ConsumptionChart() {
  const [range, setRange] = useState('daily')
  const [readings, setReadings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getMeterReadings(range)
      .then(data => setReadings(data))
      .catch(() => setError('Failed to load readings'))
      .finally(() => setLoading(false))
  }, [range])

  const labels = readings.map(r => formatLabel(r.timestamp, range))
  const data = readings.map(r => parseFloat(r.kwh_consumed))

  return (
    <div className="col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Energy Consumption
        </h2>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded p-1">
          {RANGES.map(r => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                range === r.key
                  ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="p-5">
          <div className="animate-pulse h-72 bg-gray-100 dark:bg-gray-700 rounded"></div>
        </div>
      ) : error ? (
        <div className="p-5 text-red-700 dark:text-red-400">{error}</div>
      ) : readings.length === 0 ? (
        <div className="p-5 text-gray-500 dark:text-gray-400">
          No readings available for this range
        </div>
      ) : (
        <EnergyLineChart labels={labels} data={data} height={300} />
      )}
    </div>
  )
}
