import * as React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

// Types
export interface TabItem {
  id: string
  label: string
  href?: string
  icon?: LucideIcon
  badge?: React.ReactNode
  disabled?: boolean
  content?: React.ReactNode
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TabItem[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  variant?: "underline" | "pills" | "boxed" | "minimal"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  align?: "start" | "center" | "end"
  orientation?: "horizontal" | "vertical"
  // URL-based tabs
  routeBased?: boolean
}

const sizeClasses = {
  sm: {
    tab: "px-3 py-1.5 text-xs",
    icon: "h-3.5 w-3.5",
    gap: "gap-1.5",
    indicatorHeight: "h-0.5",
  },
  md: {
    tab: "px-4 py-2 text-sm",
    icon: "h-4 w-4",
    gap: "gap-2",
    indicatorHeight: "h-0.5",
  },
  lg: {
    tab: "px-5 py-2.5 text-base",
    icon: "h-5 w-5",
    gap: "gap-2.5",
    indicatorHeight: "h-1",
  },
}

const variantClasses = {
  underline: {
    container: "border-b border-slate-200",
    tab: "relative border-b-2 border-transparent -mb-px",
    active: "border-blue-600 text-blue-600",
    inactive: "text-slate-500 hover:text-slate-700 hover:border-slate-300",
    disabled: "text-slate-300 cursor-not-allowed",
  },
  pills: {
    container: "gap-2",
    tab: "rounded-lg",
    active: "bg-blue-600 text-white shadow-sm",
    inactive: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    disabled: "text-slate-300 cursor-not-allowed",
  },
  boxed: {
    container: "bg-slate-100 p-1 rounded-lg gap-1",
    tab: "rounded-md",
    active: "bg-white text-slate-900 shadow-sm",
    inactive: "text-slate-600 hover:text-slate-900",
    disabled: "text-slate-400 cursor-not-allowed",
  },
  minimal: {
    container: "gap-4",
    tab: "",
    active: "text-blue-600 font-semibold",
    inactive: "text-slate-500 hover:text-slate-700",
    disabled: "text-slate-300 cursor-not-allowed",
  },
}

const alignClasses = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
}

export function Tabs({
  items,
  activeTab: controlledActiveTab,
  onTabChange,
  variant = "underline",
  size = "md",
  fullWidth = false,
  align = "start",
  orientation = "horizontal",
  routeBased = false,
  className,
  ...props
}: TabsProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const sizes = sizeClasses[size]
  const variants = variantClasses[variant]

  // Determine active tab
  const activeTabId = React.useMemo(() => {
    if (controlledActiveTab) return controlledActiveTab
    if (routeBased) {
      // Find tab matching current route
      const matchingTab = items.find(
        (item) => item.href && location.pathname.startsWith(item.href)
      )
      return matchingTab?.id || items[0]?.id
    }
    return items[0]?.id
  }, [controlledActiveTab, routeBased, location.pathname, items])

  // Internal state for uncontrolled mode
  const [internalActiveTab, setInternalActiveTab] = React.useState(activeTabId)

  const currentActiveTab = controlledActiveTab !== undefined ? activeTabId : internalActiveTab

  const handleTabClick = (tab: TabItem) => {
    if (tab.disabled) return

    if (tab.href && routeBased) {
      navigate(tab.href)
    }

    if (onTabChange) {
      onTabChange(tab.id)
    } else {
      setInternalActiveTab(tab.id)
    }
  }

  const activeContent = items.find((tab) => tab.id === currentActiveTab)?.content

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Tab List */}
      <div
        role="tablist"
        className={cn(
          "flex",
          orientation === "vertical" && "flex-col",
          variants.container,
          alignClasses[align]
        )}
      >
        {items.map((tab) => {
          const isActive = tab.id === currentActiveTab
          const TabComponent = tab.href && routeBased ? Link : "button"

          return (
            <TabComponent
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-disabled={tab.disabled}
              to={tab.href || ""}
              onClick={() => handleTabClick(tab)}
              className={cn(
                "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                sizes.tab,
                sizes.gap,
                variants.tab,
                fullWidth && "flex-1",
                isActive ? variants.active : variants.inactive,
                tab.disabled && variants.disabled
              )}
            >
              {tab.icon && <tab.icon className={sizes.icon} />}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-1">{tab.badge}</span>
              )}
            </TabComponent>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeContent && (
        <div role="tabpanel" className="mt-4">
          {activeContent}
        </div>
      )}
    </div>
  )
}

// Tab Panel Component for custom content rendering
export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  activeValue: string
}

export function TabPanel({
  value,
  activeValue,
  children,
  className,
  ...props
}: TabPanelProps) {
  if (value !== activeValue) return null

  return (
    <div
      role="tabpanel"
      className={cn("focus-visible:outline-none", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Tab Badge Component
export function TabBadge({
  count,
  variant = "default",
  className,
}: {
  count: number
  variant?: "default" | "primary" | "success" | "warning" | "danger"
  className?: string
}) {
  const variantClasses = {
    default: "bg-slate-200 text-slate-700",
    primary: "bg-blue-100 text-blue-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-semibold",
        variantClasses[variant],
        className
      )}
    >
      {count}
    </span>
  )
}

// Vertical Tabs Component
export function VerticalTabs({
  items,
  activeTab,
  onTabChange,
  className,
}: {
  items: TabItem[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  className?: string
}) {
  return (
    <div className={cn("flex gap-6", className)}>
      <nav className="w-48 shrink-0 space-y-1">
        {items.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onTabChange?.(tab.id)}
              disabled={tab.disabled}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                tab.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {tab.icon && <tab.icon className="h-5 w-5" />}
              <span className="flex-1">{tab.label}</span>
              {tab.badge}
            </button>
          )
        })}
      </nav>
      <div className="flex-1 min-w-0">
        {items.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  )
}

// Segmented Control (alternative to tabs)
export function SegmentedControl({
  options,
  value,
  onChange,
  size = "md",
  className,
}: {
  options: Array<{ value: string; label: string; icon?: LucideIcon }>
  value: string
  onChange: (value: string) => void
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const sizes = sizeClasses[size]

  return (
    <div
      className={cn(
        "inline-flex items-center bg-slate-100 p-1 rounded-lg",
        className
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center justify-center font-medium rounded-md transition-all",
              sizes.tab,
              sizes.gap,
              isActive
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            {option.icon && <option.icon className={sizes.icon} />}
            <span>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default Tabs
