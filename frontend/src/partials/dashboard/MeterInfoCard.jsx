import { useEffect, useState } from 'react'
import { getMeterProfile } from '../../services/api'

export default function MeterInfoCard() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMeterProfile()
      .then(setProfile)
      .catch(() => setError('Failed to load meter info'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
        <div className="animate-pulse h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="animate-pulse h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="animate-pulse h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="animate-pulse h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="animate-pulse h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="col-span-full xl:col-span-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-5 rounded-xl">
        {error || 'No meter profile found'}
      </div>
    )
  }

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 py-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Meter Info
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs uppercase text-gray-400 dark:text-gray-500 mb-1">
              Meter Number
            </div>
            <div className="font-medium text-gray-800 dark:text-gray-100">
              {profile.meter_number}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-gray-400 dark:text-gray-500 mb-1">
              Connection Type
            </div>
            <div className="font-medium text-gray-800 dark:text-gray-100 capitalize">
              {profile.connection_type.replace('_', ' ')}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-gray-400 dark:text-gray-500 mb-1">
              Sanctioned Load
            </div>
            <div className="font-medium text-gray-800 dark:text-gray-100">
              {profile.sanctioned_load} kW
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-gray-400 dark:text-gray-500 mb-1">
              Tariff Rate
            </div>
            <div className="font-medium text-gray-800 dark:text-gray-100">
              ₹{profile.tariff_rate}/kWh
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
