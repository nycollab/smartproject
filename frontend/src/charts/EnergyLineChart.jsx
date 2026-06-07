import React, { useRef, useEffect, useState } from 'react'
import { useThemeProvider } from '../utils/ThemeContext'
import { chartColors } from './ChartjsConfig'
import {
  Chart, LineController, LineElement, Filler, PointElement,
  LinearScale, CategoryScale, Tooltip,
} from 'chart.js'
import { getCssVariable } from '../utils/Utils'

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, CategoryScale, Tooltip)

function EnergyLineChart({ labels, data, height = 300 }) {
  const canvas = useRef(null)
  const [chart, setChart] = useState(null)
  const { currentTheme } = useThemeProvider()
  const darkMode = currentTheme === 'dark'
  const { tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors

  // create chart on mount
  useEffect(() => {
    const ctx = canvas.current
    const green = getCssVariable('--color-green-500')

    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'kWh',
          data: [],
          borderColor: green,
          backgroundColor: green + '22',
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 4,
          pointBackgroundColor: green,
          tension: 0.25,
          fill: true,
        }],
      },
      options: {
        layout: { padding: 16 },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: darkMode ? '#9ca3af' : '#6b7280',
              callback: (val) => `${val} kWh`,
            },
            grid: {
              color: darkMode ? 'rgba(75,85,99,0.25)' : 'rgba(229,231,235,0.7)',
            },
          },
          x: {
            ticks: {
              color: darkMode ? '#9ca3af' : '#6b7280',
              maxRotation: 45,
              autoSkip: true,
              maxTicksLimit: 12,
            },
            grid: { display: false },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => `${parseFloat(ctx.parsed.y).toFixed(2)} kWh`,
            },
            bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
            borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          },
          legend: { display: false },
        },
        interaction: { intersect: false, mode: 'nearest' },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
    })

    setChart(newChart)
    return () => newChart.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // update data when props change
  useEffect(() => {
    if (!chart) return
    chart.data.labels = labels
    chart.data.datasets[0].data = data
    chart.update()
  }, [labels, data, chart])

  // update on theme switch
  useEffect(() => {
    if (!chart) return
    chart.options.scales.y.ticks.color = darkMode ? '#9ca3af' : '#6b7280'
    chart.options.scales.x.ticks.color = darkMode ? '#9ca3af' : '#6b7280'
    chart.options.scales.y.grid.color = darkMode ? 'rgba(75,85,99,0.25)' : 'rgba(229,231,235,0.7)'
    chart.options.plugins.tooltip.bodyColor = darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light
    chart.options.plugins.tooltip.backgroundColor = darkMode ? tooltipBgColor.dark : tooltipBgColor.light
    chart.options.plugins.tooltip.borderColor = darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light
    chart.update('none')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [darkMode])

  return (
    <div style={{ height }}>
      <canvas ref={canvas} />
    </div>
  )
}

export default EnergyLineChart
