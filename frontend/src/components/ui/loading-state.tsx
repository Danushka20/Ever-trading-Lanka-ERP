import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

// Skeleton Component
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "rounded"
  width?: string | number
  height?: string | number
  animation?: "pulse" | "wave" | "none"
}

export function Skeleton({
  variant = "text",
  width,
  height,
  animation = "pulse",
  className,
  style,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-lg",
  }

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]",
    none: "",
  }

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

// Loading Spinner
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  variant?: "default" | "primary" | "secondary" | "white"
}

const spinnerSizes = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
}

const spinnerColors = {
  default: "text-slate-600",
  primary: "text-blue-600",
  secondary: "text-slate-400",
  white: "text-white",
}

export function Spinner({
  size = "md",
  variant = "default",
  className,
  ...props
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <Loader2
        className={cn(
          "animate-spin",
          spinnerSizes[size],
          spinnerColors[variant]
        )}
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Loading Overlay
export interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  visible?: boolean
  message?: string
  blur?: boolean
  fullScreen?: boolean
  spinnerSize?: SpinnerProps["size"]
}

export function LoadingOverlay({
  visible = true,
  message,
  blur = true,
  fullScreen = false,
  spinnerSize = "lg",
  className,
  ...props
}: LoadingOverlayProps) {
  if (!visible) return null

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-white/80",
        blur && "backdrop-blur-sm",
        fullScreen ? "fixed inset-0 z-50" : "absolute inset-0 z-10",
        className
      )}
      {...props}
    >
      <Spinner size={spinnerSize} variant="primary" />
      {message && (
        <p className="mt-3 text-sm font-medium text-slate-600">{message}</p>
      )}
    </div>
  )
}

// Loading State Container
export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  spinnerSize?: SpinnerProps["size"]
  message?: string
  minHeight?: string | number
}

export function LoadingState({
  loading = true,
  error,
  onRetry,
  spinnerSize = "lg",
  message = "Loading...",
  minHeight = 200,
  children,
  className,
  style,
  ...props
}: LoadingStateProps) {
  if (error) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center text-center p-8",
          className
        )}
        style={{ minHeight, ...style }}
        {...props}
      >
        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">
          Error loading data
        </h3>
        <p className="text-sm text-slate-500 mb-4 max-w-sm">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try again
          </button>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center",
          className
        )}
        style={{ minHeight, ...style }}
        {...props}
      >
        <Spinner size={spinnerSize} variant="primary" />
        {message && (
          <p className="mt-3 text-sm text-slate-500">{message}</p>
        )}
      </div>
    )
  }

  return <>{children}</>
}

// Skeleton Presets
export function TextSkeleton({
  lines = 3,
  className,
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className="h-4"
          style={{
            width: i === lines - 1 ? "60%" : "100%",
          }}
        />
      ))}
    </div>
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-4 border rounded-lg bg-white", className)}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="circular" className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-4 w-1/3" />
          <Skeleton variant="text" className="h-3 w-1/2" />
        </div>
      </div>
      <TextSkeleton lines={2} />
    </div>
  )
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number
  columns?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex gap-4 border-b pb-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            className="h-4 flex-1"
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              className="h-4 flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function ListSkeleton({
  items = 5,
  showAvatar = true,
  className,
}: {
  items?: number
  showAvatar?: boolean
  className?: string
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
          {showAvatar && (
            <Skeleton variant="circular" className="h-10 w-10 shrink-0" />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="h-4 w-2/3" />
            <Skeleton variant="text" className="h-3 w-1/2" />
          </div>
          <Skeleton variant="rounded" className="h-8 w-20" />
        </div>
      ))}
    </div>
  )
}

export function FormSkeleton({
  fields = 4,
  className,
}: {
  fields?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="text" className="h-4 w-24" />
          <Skeleton variant="rounded" className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <Skeleton variant="rounded" className="h-10 w-24" />
        <Skeleton variant="rounded" className="h-10 w-24" />
      </div>
    </div>
  )
}

// Page Loading with Progress
export interface PageLoadingProps {
  progress?: number
  message?: string
  showProgress?: boolean
}

export function PageLoading({
  progress,
  message = "Loading...",
  showProgress = false,
}: PageLoadingProps) {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center max-w-sm mx-auto px-8">
        <Spinner size="xl" variant="primary" className="mb-6" />
        <p className="text-sm font-medium text-slate-700 mb-2">{message}</p>
        {showProgress && progress !== undefined && (
          <div className="w-full">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 text-center mt-2">
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Inline Loading
export function InlineLoading({
  message = "Loading...",
  className,
}: {
  message?: string
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2 text-sm text-slate-600", className)}>
      <Spinner size="sm" />
      <span>{message}</span>
    </div>
  )
}

// Button Loading State
export function ButtonLoading({ className }: { className?: string }) {
  return <Spinner size="sm" variant="white" className={className} />
}

export default LoadingState
