import * as React from "react"
import { cn } from "@/lib/utils"

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  decorative?: boolean
  label?: string
  labelPosition?: "left" | "center" | "right"
  variant?: "solid" | "dashed" | "dotted"
  color?: "slate" | "blue" | "green" | "red"
  spacing?: "sm" | "md" | "lg"
}

const colorClasses = {
  slate: "bg-slate-200",
  blue: "bg-blue-200",
  green: "bg-emerald-200",
  red: "bg-red-200",
}

const borderColorClasses = {
  slate: "border-slate-200",
  blue: "border-blue-200",
  green: "border-emerald-200",
  red: "border-red-200",
}

const spacingClasses = {
  sm: "my-2",
  md: "my-4",
  lg: "my-8",
}

const horizontalSpacingClasses = {
  sm: "mx-2",
  md: "mx-4",
  lg: "mx-8",
}

export function Separator({
  orientation = "horizontal",
  decorative = true,
  label,
  labelPosition = "center",
  variant = "solid",
  color = "slate",
  spacing = "md",
  className,
  ...props
}: SeparatorProps) {
  const isHorizontal = orientation === "horizontal"

  // Simple separator without label
  if (!label) {
    return (
      <div
        role={decorative ? "none" : "separator"}
        aria-orientation={decorative ? undefined : orientation}
        className={cn(
          isHorizontal
            ? cn("w-full h-px", spacingClasses[spacing])
            : cn("h-full w-px", horizontalSpacingClasses[spacing]),
          variant === "solid" && colorClasses[color],
          variant === "dashed" && cn("border-0", isHorizontal ? "border-t" : "border-l", "border-dashed", borderColorClasses[color]),
          variant === "dotted" && cn("border-0", isHorizontal ? "border-t" : "border-l", "border-dotted", borderColorClasses[color]),
          className
        )}
        {...props}
      />
    )
  }

  // Separator with label (only horizontal)
  const labelPositionClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }

  return (
    <div
      role={decorative ? "none" : "separator"}
      className={cn(
        "flex items-center",
        spacingClasses[spacing],
        labelPositionClasses[labelPosition],
        className
      )}
      {...props}
    >
      {labelPosition !== "left" && (
        <div className={cn("flex-1 h-px", colorClasses[color])} />
      )}
      <span className="px-4 text-sm font-medium text-slate-500 shrink-0">
        {label}
      </span>
      {labelPosition !== "right" && (
        <div className={cn("flex-1 h-px", colorClasses[color])} />
      )}
    </div>
  )
}

// Divider with content
export function DividerWithContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("relative my-6", className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-white text-slate-500">{children}</span>
      </div>
    </div>
  )
}

// Vertical Divider (for inline use)
export function VerticalDivider({
  height = 20,
  color = "slate",
  className,
}: {
  height?: number
  color?: "slate" | "blue" | "green" | "red"
  className?: string
}) {
  return (
    <div
      className={cn("w-px", colorClasses[color], className)}
      style={{ height }}
    />
  )
}

// Section Divider with title
export function SectionDivider({
  title,
  action,
  className,
}: {
  title: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-center justify-between py-4", className)}>
      <div className="flex items-center flex-1 gap-4">
        <h3 className="text-sm font-semibold text-slate-900 whitespace-nowrap">
          {title}
        </h3>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
      {action && <div className="ml-4 shrink-0">{action}</div>}
    </div>
  )
}

// Fancy Divider with icon
export function IconDivider({
  icon,
  className,
}: {
  icon: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-4 my-6", className)}>
      <div className="flex-1 h-px bg-linear-to-r from-transparent to-slate-200" />
      <div className="text-slate-400">{icon}</div>
      <div className="flex-1 h-px bg-linear-to-l from-transparent to-slate-200" />
    </div>
  )
}

export default Separator
