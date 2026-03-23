import * as React from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import {
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react"
import { Button } from "./button"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info"
  title?: string
  icon?: LucideIcon | false
  dismissible?: boolean
  onDismiss?: () => void
  action?: {
    label: string
    onClick: () => void
  }
  size?: "sm" | "md" | "lg"
}

const variantClasses = {
  default: {
    container: "bg-slate-50 border-slate-200 text-slate-800",
    icon: "text-slate-500",
    title: "text-slate-900",
    action: "text-slate-700 hover:bg-slate-100",
    dismiss: "text-slate-500 hover:text-slate-700 hover:bg-slate-100",
  },
  success: {
    container: "bg-emerald-50 border-emerald-200 text-emerald-800",
    icon: "text-emerald-500",
    title: "text-emerald-900",
    action: "text-emerald-700 hover:bg-emerald-100",
    dismiss: "text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100",
  },
  warning: {
    container: "bg-amber-50 border-amber-200 text-amber-800",
    icon: "text-amber-500",
    title: "text-amber-900",
    action: "text-amber-700 hover:bg-amber-100",
    dismiss: "text-amber-500 hover:text-amber-700 hover:bg-amber-100",
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-800",
    icon: "text-red-500",
    title: "text-red-900",
    action: "text-red-700 hover:bg-red-100",
    dismiss: "text-red-500 hover:text-red-700 hover:bg-red-100",
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "text-blue-500",
    title: "text-blue-900",
    action: "text-blue-700 hover:bg-blue-100",
    dismiss: "text-blue-500 hover:text-blue-700 hover:bg-blue-100",
  },
}

const defaultIcons: Record<string, LucideIcon> = {
  default: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
}

const sizeClasses = {
  sm: {
    container: "px-3 py-2",
    icon: "h-4 w-4",
    title: "text-sm",
    description: "text-xs",
    gap: "gap-2",
  },
  md: {
    container: "px-4 py-3",
    icon: "h-5 w-5",
    title: "text-sm",
    description: "text-sm",
    gap: "gap-3",
  },
  lg: {
    container: "px-5 py-4",
    icon: "h-6 w-6",
    title: "text-base",
    description: "text-sm",
    gap: "gap-4",
  },
}

export function Alert({
  variant = "default",
  title,
  icon,
  dismissible = false,
  onDismiss,
  action,
  size = "md",
  className,
  children,
  ...props
}: AlertProps) {
  const [dismissed, setDismissed] = React.useState(false)
  const styles = variantClasses[variant]
  const sizes = sizeClasses[size]
  const Icon = icon === false ? null : icon || defaultIcons[variant]

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  if (dismissed) return null

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start border rounded-lg",
        sizes.container,
        sizes.gap,
        styles.container,
        className
      )}
      {...props}
    >
      {Icon && (
        <Icon className={cn("shrink-0 mt-0.5", sizes.icon, styles.icon)} />
      )}
      <div className="flex-1 min-w-0">
        {title && (
          <h5 className={cn("font-semibold", sizes.title, styles.title)}>
            {title}
          </h5>
        )}
        {children && (
          <div className={cn(sizes.description, title && "mt-1")}>
            {children}
          </div>
        )}
        {action && (
          <Button
            variant="ghost"
            size="sm"
            onClick={action.onClick}
            className={cn("mt-2 h-7 px-2", styles.action)}
          >
            {action.label}
          </Button>
        )}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className={cn(
            "shrink-0 rounded p-1 transition-colors",
            styles.dismiss
          )}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </button>
      )}
    </div>
  )
}

// Alert Title (for compositions)
export function AlertTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={cn("font-semibold text-sm", className)}
      {...props}
    >
      {children}
    </h5>
  )
}

// Alert Description (for compositions)
export function AlertDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm mt-1", className)}
      {...props}
    >
      {children}
    </p>
  )
}

// Banner Alert (Full width)
export interface BannerProps {
  variant?: "default" | "success" | "warning" | "error" | "info"
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

export function Banner({
  variant = "info",
  message,
  action,
  dismissible = true,
  onDismiss,
  className,
}: BannerProps) {
  const [dismissed, setDismissed] = React.useState(false)
  const styles = variantClasses[variant]
  const Icon = defaultIcons[variant]

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  if (dismissed) return null

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2.5 border-b",
        styles.container,
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn("h-5 w-5 shrink-0", styles.icon)} />
        <p className="text-sm font-medium">{message}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {action && (
          <Button
            variant="ghost"
            size="sm"
            onClick={action.onClick}
            className={cn("h-7", styles.action)}
          >
            {action.label}
          </Button>
        )}
        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className={cn("rounded p-1 transition-colors", styles.dismiss)}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// Inline Alert (Minimal)
export function InlineAlert({
  variant = "default",
  children,
  className,
}: {
  variant?: "default" | "success" | "warning" | "error" | "info"
  children: React.ReactNode
  className?: string
}) {
  const styles = variantClasses[variant]
  const Icon = defaultIcons[variant]

  return (
    <p
      className={cn(
        "flex items-center gap-1.5 text-sm",
        styles.container,
        "bg-transparent border-0",
        className
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", styles.icon)} />
      {children}
    </p>
  )
}

// Callout Component (for documentation)
export interface CalloutProps {
  variant?: "default" | "success" | "warning" | "error" | "info"
  title?: string
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
}

export function Callout({
  variant = "info",
  title,
  icon,
  children,
  className,
}: CalloutProps) {
  const styles = variantClasses[variant]
  const Icon = icon || defaultIcons[variant]

  return (
    <div
      className={cn(
        "flex gap-4 p-4 rounded-lg border-l-4",
        variant === "default" && "bg-slate-50 border-l-slate-400",
        variant === "success" && "bg-emerald-50 border-l-emerald-400",
        variant === "warning" && "bg-amber-50 border-l-amber-400",
        variant === "error" && "bg-red-50 border-l-red-400",
        variant === "info" && "bg-blue-50 border-l-blue-400",
        className
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", styles.icon)} />
      <div className="flex-1">
        {title && (
          <h4 className={cn("font-semibold mb-1", styles.title)}>{title}</h4>
        )}
        <div className={cn("text-sm", styles.container, "bg-transparent border-0")}>
          {children}
        </div>
      </div>
    </div>
  )
}

// Toast-style Alert (for positioning)
export function ToastAlert({
  variant = "default",
  title,
  description,
  action,
  onDismiss,
  className,
}: {
  variant?: "default" | "success" | "warning" | "error" | "info"
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  onDismiss?: () => void
  className?: string
}) {
  const styles = variantClasses[variant]
  const Icon = defaultIcons[variant]

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border shadow-lg bg-white max-w-sm",
        className
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", styles.icon)} />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm text-slate-900">{title}</p>}
        {description && (
          <p className="text-sm text-slate-600 mt-0.5">{description}</p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 mt-2"
          >
            {action.label}
          </button>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default Alert
