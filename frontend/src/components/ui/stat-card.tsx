import * as React from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from "lucide-react"

// Basic Stat Card
export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  icon?: LucideIcon
  description?: string
  // Trend
  trend?: {
    value: number
    label?: string
    direction?: "up" | "down" | "neutral"
  }
  // Links
  href?: string
  // Styling
  variant?: "default" | "gradient" | "bordered" | "minimal"
  color?: "blue" | "green" | "purple" | "orange" | "red" | "slate"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

const colorClasses = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    gradient: "from-blue-500 to-blue-600",
    border: "border-l-4 border-l-blue-500",
  },
  green: {
    icon: "bg-emerald-50 text-emerald-600",
    gradient: "from-emerald-500 to-emerald-600",
    border: "border-l-4 border-l-emerald-500",
  },
  purple: {
    icon: "bg-purple-50 text-purple-600",
    gradient: "from-purple-500 to-purple-600",
    border: "border-l-4 border-l-purple-500",
  },
  orange: {
    icon: "bg-orange-50 text-orange-600",
    gradient: "from-orange-500 to-orange-600",
    border: "border-l-4 border-l-orange-500",
  },
  red: {
    icon: "bg-red-50 text-red-600",
    gradient: "from-red-500 to-red-600",
    border: "border-l-4 border-l-red-500",
  },
  slate: {
    icon: "bg-slate-100 text-slate-600",
    gradient: "from-slate-600 to-slate-700",
    border: "border-l-4 border-l-slate-500",
  },
}

const sizeClasses = {
  sm: {
    padding: "p-4",
    iconContainer: "h-8 w-8",
    icon: "h-4 w-4",
    title: "text-xs",
    value: "text-xl",
    description: "text-xs",
  },
  md: {
    padding: "p-5",
    iconContainer: "h-10 w-10",
    icon: "h-5 w-5",
    title: "text-xs",
    value: "text-2xl",
    description: "text-xs",
  },
  lg: {
    padding: "p-6",
    iconContainer: "h-12 w-12",
    icon: "h-6 w-6",
    title: "text-sm",
    value: "text-3xl",
    description: "text-sm",
  },
}

function TrendIndicator({
  value,
  label,
  direction,
}: {
  value: number
  label?: string
  direction?: "up" | "down" | "neutral"
}) {
  const dir = direction || (value > 0 ? "up" : value < 0 ? "down" : "neutral")

  const trendClasses = {
    up: "text-emerald-600 bg-emerald-50",
    down: "text-red-600 bg-red-50",
    neutral: "text-slate-600 bg-slate-100",
  }

  const TrendIcon = dir === "up" ? TrendingUp : dir === "down" ? TrendingDown : Minus

  return (
    <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", trendClasses[dir])}>
      <TrendIcon className="h-3 w-3" />
      <span>{Math.abs(value)}%</span>
      {label && <span className="text-slate-500 font-normal">{label}</span>}
    </div>
  )
}

function SkeletonLoader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = sizeClasses[size]
  return (
    <div className={cn(sizes.padding, "animate-pulse")}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-slate-200 rounded w-1/3" />
          <div className="h-8 bg-slate-200 rounded w-1/2" />
        </div>
        <div className={cn("rounded-xl bg-slate-200", sizes.iconContainer)} />
      </div>
      <div className="h-4 bg-slate-200 rounded w-2/3 mt-3" />
    </div>
  )
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  href,
  variant = "default",
  color = "blue",
  size = "md",
  loading = false,
  className,
}: StatCardProps) {
  const colors = colorClasses[color]
  const sizes = sizeClasses[size]

  if (loading) {
    return (
      <div
        className={cn(
          "bg-white rounded-xl border border-slate-200",
          className
        )}
      >
        <SkeletonLoader size={size} />
      </div>
    )
  }

  const cardClasses = cn(
    "bg-white rounded-xl transition-all",
    variant === "default" && "border border-slate-200 shadow-sm hover:shadow-md",
    variant === "gradient" && "text-white",
    variant === "bordered" && cn("border border-slate-200", colors.border),
    variant === "minimal" && "border-0 shadow-none",
    href && "cursor-pointer hover:-translate-y-0.5",
    className
  )

  const content = (
    <div
      className={cn(
        cardClasses,
        variant === "gradient" && cn("bg-linear-to-br", colors.gradient)
      )}
    >
      <div className={sizes.padding}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p
              className={cn(
                "font-medium uppercase tracking-wider",
                sizes.title,
                variant === "gradient" ? "text-white/80" : "text-slate-500"
              )}
            >
              {title}
            </p>
            <p
              className={cn(
                "font-bold tracking-tight",
                sizes.value,
                variant === "gradient" ? "text-white" : "text-slate-900"
              )}
            >
              {value}
            </p>
          </div>
          {Icon && (
            <div
              className={cn(
                "rounded-xl flex items-center justify-center shrink-0",
                sizes.iconContainer,
                variant === "gradient" ? "bg-white/20" : colors.icon
              )}
            >
              <Icon
                className={cn(
                  sizes.icon,
                  variant === "gradient" && "text-white"
                )}
              />
            </div>
          )}
        </div>

        {(description || trend) && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {trend && (
              <TrendIndicator
                value={trend.value}
                label={trend.label}
                direction={trend.direction}
              />
            )}
            {description && (
              <span
                className={cn(
                  sizes.description,
                  variant === "gradient" ? "text-white/70" : "text-slate-500"
                )}
              >
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )

  if (href) {
    return <a href={href}>{content}</a>
  }

  return content
}

// Stat Grid Component
export function StatGrid({
  children,
  columns = 4,
  className,
}: {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}) {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  }

  return (
    <div className={cn("grid gap-4", colClasses[columns], className)}>
      {children}
    </div>
  )
}

// Inline Stat Component (smaller, for sidebars, etc.)
export function InlineStat({
  label,
  value,
  icon: Icon,
  trend,
  className,
}: {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: { value: number; direction?: "up" | "down" }
  className?: string
}) {
  const trendDir = trend?.direction || (trend ? (trend.value > 0 ? "up" : "down") : undefined)

  return (
    <div className={cn("flex items-center gap-3 py-2", className)}>
      {Icon && (
        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-slate-600" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 truncate">{label}</p>
        <p className="text-sm font-semibold text-slate-900">{value}</p>
      </div>
      {trend && (
        <div
          className={cn(
            "flex items-center gap-0.5 text-xs font-medium",
            trendDir === "up" ? "text-emerald-600" : "text-red-600"
          )}
        >
          {trendDir === "up" ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          <span>{Math.abs(trend.value)}%</span>
        </div>
      )}
    </div>
  )
}

// Progress Stat Card
export function ProgressStatCard({
  title,
  value,
  maxValue,
  label,
  color = "blue",
  className,
}: {
  title: string
  value: number
  maxValue: number
  label?: string
  color?: "blue" | "green" | "purple" | "orange" | "red"
  className?: string
}) {
  const percentage = Math.min(100, (value / maxValue) * 100)

  const progressColors = {
    blue: "bg-blue-600",
    green: "bg-emerald-600",
    purple: "bg-purple-600",
    orange: "bg-orange-600",
    red: "bg-red-600",
  }

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-200 p-5",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-slate-700">{title}</p>
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <div className="flex items-end gap-1 mb-3">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        <span className="text-sm text-slate-500 mb-1">/ {maxValue}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", progressColors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-2">{percentage.toFixed(1)}% complete</p>
    </div>
  )
}

// comparison Stat Card
export function ComparisonStatCard({
  title,
  currentValue,
  previousValue,
  currentLabel = "Current",
  previousLabel = "Previous",
  format,
  className,
}: {
  title: string
  currentValue: number
  previousValue: number
  currentLabel?: string
  previousLabel?: string
  format?: (value: number) => string
  className?: string
}) {
  const formatValue = format || ((v: number) => v.toLocaleString())
  const change = previousValue !== 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0
  const isPositive = change >= 0

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-200 p-5",
        className
      )}
    >
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
        {title}
      </p>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <p className="text-xs text-slate-500 mb-1">{currentLabel}</p>
          <p className="text-2xl font-bold text-slate-900">{formatValue(currentValue)}</p>
        </div>
        <div className="flex-1">
          <p className="text-xs text-slate-500 mb-1">{previousLabel}</p>
          <p className="text-lg text-slate-600">{formatValue(previousValue)}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100">
        <div
          className={cn(
            "inline-flex items-center gap-1 text-sm font-medium",
            isPositive ? "text-emerald-600" : "text-red-600"
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span>{isPositive ? "+" : ""}{change.toFixed(1)}%</span>
          <span className="text-slate-500 font-normal ml-1">vs {previousLabel.toLowerCase()}</span>
        </div>
      </div>
    </div>
  )
}

export default StatCard
