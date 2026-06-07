import React, { useRef, useEffect, useState } from 'react'
import { useThemeProvider } from '../utils/ThemeContext'
import { chartColors } from './ChartjsConfig'
import {
  Chart, DoughnutController, ArcElement, Tooltip,
} from 'chart.js'

Chart.register(DoughnutController, ArcElement, Tooltip)

function EnergyDonutChart({ labels, data, colors, height = 280 }) {
  const canvas = useRef(null)
  const [chart, setChart] = useState(null)
  const { currentTheme } = useThemeProvider()
  const darkMode = currentTheme === 'dark'
  const { tooltipTitleColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors

  useEffect(() => {
    const ctx = canvas.current
    const newChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 0,
        }],
      },
      options: {
        cutout: '70%',
        layout: { padding: 16 },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: darkMode ? '#9ca3af' : '#6b7280',
              boxWidth: 12,
              padding: 14,
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${parseFloat(ctx.parsed).toFixed(2)} kWh`,
            },
            titleColor: darkMode ? tooltipTitleColor.dark : tooltipTitleColor.light,
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
    chart.options.plugins.legend.labels.color = darkMode ? '#9ca3af' : '#6b7280'
    chart.options.plugins.tooltip.titleColor = darkMode ? tooltipTitleColor.dark : tooltipTitleColor.light
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

export default EnergyDonutChart
