import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "rounded"
  animation?: "pulse" | "wave" | "none"
  width?: string | number
  height?: string | number
}

const variantClasses = {
  text: "rounded h-4",
  circular: "rounded-full",
  rectangular: "rounded-none",
  rounded: "rounded-lg",
}

const animationClasses = {
  pulse: "animate-pulse",
  wave: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
  none: "",
}

export function Skeleton({
  variant = "text",
  animation = "pulse",
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-slate-200",
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{
        width: width,
        height: height || (variant === "text" ? "1em" : undefined),
        ...style,
      }}
      {...props}
    />
  )
}

// Text Block Skeleton
export function TextSkeleton({
  lines = 3,
  lastLineWidth = "60%",
  gap = "sm",
  className,
}: {
  lines?: number
  lastLineWidth?: string
  gap?: "sm" | "md" | "lg"
  className?: string
}) {
  const gapClasses = {
    sm: "space-y-2",
    md: "space-y-3",
    lg: "space-y-4",
  }

  return (
    <div className={cn(gapClasses[gap], className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className="h-4"
          style={{ width: i === lines - 1 ? lastLineWidth : "100%" }}
        />
      ))}
    </div>
  )
}

// Avatar Skeleton
export function AvatarSkeleton({
  size = "md",
  className,
}: {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
}) {
  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  return (
    <Skeleton
      variant="circular"
      className={cn(sizeClasses[size], className)}
    />
  )
}

// Card Skeleton
export function CardSkeleton({
  showImage = false,
  showAvatar = true,
  className,
}: {
  showImage?: boolean
  showAvatar?: boolean
  className?: string
}) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 overflow-hidden", className)}>
      {showImage && (
        <Skeleton variant="rectangular" className="h-48 w-full" />
      )}
      <div className="p-4">
        {showAvatar && (
          <div className="flex items-center gap-3 mb-4">
            <AvatarSkeleton size="md" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" className="h-4 w-1/3" />
              <Skeleton variant="text" className="h-3 w-1/4" />
            </div>
          </div>
        )}
        <TextSkeleton lines={3} />
        <div className="flex gap-2 mt-4">
          <Skeleton variant="rounded" className="h-9 w-20" />
          <Skeleton variant="rounded" className="h-9 w-20" />
        </div>
      </div>
    </div>
  )
}

// Table Skeleton
export function TableSkeleton({
  rows = 5,
  columns = 4,
  showHeader = true,
  className,
}: {
  rows?: number
  columns?: number
  showHeader?: boolean
  className?: string
}) {
  return (
    <div className={cn("w-full", className)}>
      {showHeader && (
        <div className="flex gap-4 pb-3 border-b border-slate-200">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              className="h-4 flex-1"
            />
          ))}
        </div>
      )}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 py-3">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                variant="text"
                className="h-4 flex-1"
                style={{ width: `${70 + Math.random() * 30}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// List Skeleton
export function ListSkeleton({
  items = 5,
  showAvatar = true,
  showAction = true,
  className,
}: {
  items?: number
  showAvatar?: boolean
  showAction?: boolean
  className?: string
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
          {showAvatar && <AvatarSkeleton size="md" />}
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="h-4 w-2/3" />
            <Skeleton variant="text" className="h-3 w-1/2" />
          </div>
          {showAction && <Skeleton variant="rounded" className="h-8 w-16" />}
        </div>
      ))}
    </div>
  )
}

// Form Skeleton
export function FormSkeleton({
  fields = 4,
  showLabels = true,
  className,
}: {
  fields?: number
  showLabels?: boolean
  className?: string
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          {showLabels && <Skeleton variant="text" className="h-4 w-24" />}
          <Skeleton variant="rounded" className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <Skeleton variant="rounded" className="h-10 w-24" />
        <Skeleton variant="rounded" className="h-10 w-20" />
      </div>
    </div>
  )
}

// Stats Grid Skeleton
export function StatsSkeleton({
  count = 4,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" className="h-3 w-1/3" />
              <Skeleton variant="text" className="h-8 w-1/2" />
            </div>
            <Skeleton variant="rounded" className="h-10 w-10" />
          </div>
          <Skeleton variant="text" className="h-3 w-2/3 mt-4" />
        </div>
      ))}
    </div>
  )
}

// Chart Skeleton
export function ChartSkeleton({
  height = 300,
  showLegend = true,
  className,
}: {
  height?: number
  showLegend?: boolean
  className?: string
}) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <Skeleton variant="text" className="h-5 w-32" />
        {showLegend && (
          <div className="flex gap-4">
            <Skeleton variant="text" className="h-4 w-16" />
            <Skeleton variant="text" className="h-4 w-16" />
          </div>
        )}
      </div>
      <Skeleton
        variant="rounded"
        className="w-full"
        style={{ height }}
      />
    </div>
  )
}

// Profile Page Skeleton
export function ProfileSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <AvatarSkeleton size="xl" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-6 w-48" />
          <Skeleton variant="text" className="h-4 w-32" />
        </div>
        <Skeleton variant="rounded" className="h-10 w-28" />
      </div>

      {/* Stats */}
      <div className="flex gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton variant="text" className="h-6 w-12" />
            <Skeleton variant="text" className="h-4 w-20" />
          </div>
        ))}
      </div>

      {/* Content */}
      <TextSkeleton lines={4} />
    </div>
  )
}

// Dashboard Skeleton
export function DashboardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Stats */}
      <StatsSkeleton count={4} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-4">
          <ChartSkeleton height={250} />
        </div>
        <div className="lg:col-span-3">
          <ChartSkeleton height={250} showLegend={false} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <Skeleton variant="text" className="h-5 w-40 mb-4" />
        <TableSkeleton rows={5} columns={5} />
      </div>
    </div>
  )
}

export default Skeleton
