import React, { useState } from 'react'

import Sidebar from '../partials/Sidebar'
import Header from '../partials/Header'
import MeterStatCards from '../partials/dashboard/MeterStatCards'
import ConsumptionChart from '../partials/dashboard/ConsumptionChart'
import PeakSplitChart from '../partials/dashboard/PeakSplitChart'
import MonthlyComparisonChart from '../partials/dashboard/MonthlyComparisonChart'
import MeterInfoCard from '../partials/dashboard/MeterInfoCard'

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Energy Dashboard
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Track your energy consumption and costs
              </p>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <MeterStatCards />
              <ConsumptionChart />
              <PeakSplitChart />
              <MonthlyComparisonChart />
              <MeterInfoCard />
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
