import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

export default function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}

          {trend && (
            <div className="mt-2 flex items-center">
              <span className={`text-sm font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="mr-1 text-xs text-gray-500">من الشهر الماضي</span>
            </div>
          )}
        </div>

        <div className="rounded-full bg-blue-50 p-3 text-blue-500">{icon}</div>
      </div>
    </div>
  )
}

