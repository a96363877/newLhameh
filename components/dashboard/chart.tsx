"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

interface ChartProps {
  title: string
  type: "line" | "bar" | "pie" | "doughnut"
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string | string[]
      borderWidth?: number
      fill?: boolean
    }[]
  }
  height?: number
}

export default function DashboardChart({ title, type, data, height = 300 }: ChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type,
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              align: "end",
              rtl: true,
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 12,
                },
              },
            },
            tooltip: {
              rtl: true,
              titleAlign: "right",
              bodyAlign: "right",
            },
          },
          scales:
            type === "pie" || type === "doughnut"
              ? undefined
              : {
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      align: "center",
                    },
                  },
                  y: {
                    beginAtZero: true,
                    grid: {
                      drawBorder: false,
                    },
                    ticks: {
                      precision: 0,
                    },
                  },
                },
        },
      })
    }

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, type])

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-medium">{title}</h3>
      <div style={{ height: `${height}px` }}>
        <canvas ref={chartRef} />
      </div>
    </div>
  )
}

