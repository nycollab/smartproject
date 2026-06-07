import React, { useRef, useEffect, useState } from 'react'
import { useThemeProvider } from '../utils/ThemeContext'
import { chartColors } from './ChartjsConfig'
import {
  Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip,
} from 'chart.js'

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip)

function EnergyBarChart({ labels, data, colors, height = 280 }) {
  const canvas = useRef(null)
  const [chart, setChart] = useState(null)
  const { currentTheme } = useThemeProvider()
  const darkMode = currentTheme === 'dark'
  const { tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors

  useEffect(() => {
    const ctx = canvas.current
    const newChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'kWh',
          data,
          backgroundColor: colors,
          borderRadius: 6,
          maxBarThickness: 80,
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
            ticks: { color: darkMode ? '#9ca3af' : '#6b7280' },
            grid: { display: false },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${parseFloat(ctx.parsed.y).toFixed(2)} kWh`,
            },
            bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
            borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          },
        },
        maintainAspectRatio: false,
      },
    })
    setChart(newChart)
    return () => newChart.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!chart) return
    chart.data.labels = labels
    chart.data.datasets[0].data = data
    chart.data.datasets[0].backgroundColor = colors
    chart.update()
  }, [labels, data, colors, chart])

  useEffect(() => {
    if (!chart) return
    chart.options.scales.x.ticks.color = darkMode ? '#9ca3af' : '#6b7280'
    chart.options.scales.y.ticks.color = darkMode ? '#9ca3af' : '#6b7280'
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

export default EnergyBarChart
