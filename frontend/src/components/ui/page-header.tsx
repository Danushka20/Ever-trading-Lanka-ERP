import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { ArrowLeft, ChevronDown, Filter, Search } from "lucide-react"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./dropdown-menu"

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: LucideIcon
}

export interface PageAction {
  label: string
  onClick?: () => void
  href?: string
  icon?: LucideIcon
  variant?: "default" | "outline" | "ghost" | "destructive"
  disabled?: boolean
  loading?: boolean
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: LucideIcon
  badge?: React.ReactNode
  // Navigation
  breadcrumbs?: BreadcrumbItem[]
  backHref?: string
  backLabel?: string
  onBack?: () => void
  // Actions
  primaryAction?: PageAction
  secondaryActions?: PageAction[]
  moreActions?: PageAction[]
  // Search & Filter
  showSearch?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  showFilter?: boolean
  onFilterClick?: () => void
  filterActive?: boolean
  // Additional
  tabs?: React.ReactNode
  toolbar?: React.ReactNode
  children?: React.ReactNode
  // Styles
  size?: "sm" | "md" | "lg"
  sticky?: boolean
  bordered?: boolean
}

// Breadcrumb Component
function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center text-sm text-slate-500">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <svg
              className="h-4 w-4 mx-2 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
            >
              {item.icon && <item.icon className="h-3.5 w-3.5" />}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className="flex items-center gap-1.5 text-slate-900 font-medium">
              {item.icon && <item.icon className="h-3.5 w-3.5" />}
              <span>{item.label}</span>
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// Action Button Component
function ActionButton({ action }: { action: PageAction }) {
  const buttonProps = {
    variant: action.variant || ("default" as const),
    disabled: action.disabled || action.loading,
    onClick: action.onClick,
    className: "gap-2",
  }

  const content = (
    <>
      {action.loading ? (
        <svg
          className="h-4 w-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        action.icon && <action.icon className="h-4 w-4" />
      )}
      {action.label}
    </>
  )

  if (action.href) {
    return (
      <Button {...buttonProps} asChild>
        <Link to={action.href}>{content}</Link>
      </Button>
    )
  }

  return <Button {...buttonProps}>{content}</Button>
}

// Size configurations
const sizeConfig = {
  sm: {
    padding: "px-4 py-3",
    titleSize: "text-lg",
    descSize: "text-xs",
    gap: "gap-3",
  },
  md: {
    padding: "px-6 py-4",
    titleSize: "text-xl",
    descSize: "text-sm",
    gap: "gap-4",
  },
  lg: {
    padding: "px-8 py-6",
    titleSize: "text-2xl",
    descSize: "text-base",
    gap: "gap-5",
  },
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  badge,
  breadcrumbs,
  backHref,
  backLabel = "Back",
  onBack,
  primaryAction,
  secondaryActions = [],
  moreActions = [],
  showSearch = false,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  showFilter = false,
  onFilterClick,
  filterActive = false,
  tabs,
  toolbar,
  children,
  size = "md",
  sticky = false,
  bordered = true,
  className,
  ...props
}: PageHeaderProps) {
  const config = sizeConfig[size]

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backHref) {
      // Navigation will be handled by Link component
    } else {
      window.history.back()
    }
  }

  return (
    <header
      className={cn(
        "bg-white",
        bordered && "border-b border-slate-200",
        sticky && "sticky top-0 z-30",
        className
      )}
      {...props}
    >
      <div className={cn(config.padding)}>
        {/* Breadcrumbs or Back Button */}
        {(breadcrumbs || backHref || onBack) && (
          <div className="mb-3">
            {breadcrumbs ? (
              <Breadcrumbs items={breadcrumbs} />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 -ml-2 text-slate-500 hover:text-slate-900"
                onClick={handleBack}
                asChild={!!backHref}
              >
                {backHref ? (
                  <Link to={backHref}>
                    <ArrowLeft className="h-4 w-4" />
                    {backLabel}
                  </Link>
                ) : (
                  <>
                    <ArrowLeft className="h-4 w-4" />
                    {backLabel}
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Main Header Row */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0">
            {Icon && (
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1
                  className={cn(
                    "font-bold text-slate-900 tracking-tight truncate",
                    config.titleSize
                  )}
                >
                  {title}
                </h1>
                {badge}
              </div>
              {description && (
                <p
                  className={cn(
                    "text-slate-500 mt-0.5 truncate",
                    config.descSize
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search */}
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="h-9 w-64 pl-9 pr-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Filter */}
            {showFilter && (
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "gap-2 h-9",
                  filterActive && "bg-blue-50 border-blue-200 text-blue-700"
                )}
                onClick={onFilterClick}
              >
                <Filter className="h-4 w-4" />
                Filter
                {filterActive && (
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                )}
              </Button>
            )}

            {/* Secondary Actions */}
            {secondaryActions.map((action, index) => (
              <ActionButton key={index} action={{ ...action, variant: action.variant || "outline" }} />
            ))}

            {/* More Actions Dropdown */}
            {moreActions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 h-9">
                    More
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {moreActions.map((action, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && action.variant === "destructive" && (
                        <DropdownMenuSeparator />
                      )}
                      <DropdownMenuItem
                        onClick={action.onClick}
                        disabled={action.disabled}
                        className={cn(
                          "gap-2",
                          action.variant === "destructive" && "text-red-600 focus:text-red-600 focus:bg-red-50"
                        )}
                      >
                        {action.icon && <action.icon className="h-4 w-4" />}
                        {action.label}
                      </DropdownMenuItem>
                    </React.Fragment>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Primary Action */}
            
            {/* Children for custom actions/buttons */}
            {children}
            {primaryAction && <ActionButton action={primaryAction} />}
          </div>
        </div>

        {/* Toolbar */}
        {toolbar && <div className="mt-4">{toolbar}</div>}
      </div>

      {/* Tabs */}
      {tabs && <div className="px-6 -mb-px">{tabs}</div>}
    </header>
  )
}

// Page Container Component
export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  padding?: "none" | "sm" | "md" | "lg"
  centered?: boolean
}

const maxWidthClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  full: "max-w-full",
}

const paddingClasses = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
}

export function PageContainer({
  maxWidth = "xl",
  padding = "md",
  centered = false,
  className,
  children,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "flex-1 min-h-0",
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      <div
        className={cn(
          maxWidthClasses[maxWidth],
          centered && "mx-auto"
        )}
      >
        {children}
      </div>
    </div>
  )
}

// Page Section Component
export interface PageSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  description?: string
  action?: PageAction
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export function PageSection({
  title,
  description,
  action,
  collapsible = false,
  defaultCollapsed = false,
  className,
  children,
  ...props
}: PageSectionProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

  return (
    <section
      className={cn("mb-8 last:mb-0", className)}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn(
              "flex items-center gap-2",
              collapsible && "cursor-pointer"
            )}
            onClick={() => collapsible && setCollapsed(!collapsed)}
          >
            {collapsible && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-slate-400 transition-transform",
                  collapsed && "-rotate-90"
                )}
              />
            )}
            <div>
              {title && (
                <h2 className="text-sm font-semibold text-slate-900">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
              )}
            </div>
          </div>
          {action && <ActionButton action={{ ...action, variant: action.variant || "ghost" }} />}
        </div>
      )}
      {(!collapsible || !collapsed) && children}
    </section>
  )
}

// Quick Actions Bar
export interface QuickAction {
  label: string
  icon: LucideIcon
  onClick?: () => void
  href?: string
  color?: "blue" | "green" | "purple" | "orange" | "red" | "slate"
  description?: string
}

const quickActionColors = {
  blue: "bg-blue-50 hover:bg-blue-100 text-blue-600",
  green: "bg-emerald-50 hover:bg-emerald-100 text-emerald-600",
  purple: "bg-purple-50 hover:bg-purple-100 text-purple-600",
  orange: "bg-orange-50 hover:bg-orange-100 text-orange-600",
  red: "bg-red-50 hover:bg-red-100 text-red-600",
  slate: "bg-slate-50 hover:bg-slate-100 text-slate-600",
}

export function QuickActionsBar({
  actions,
  className,
}: {
  actions: QuickAction[]
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {actions.map((action, index) => {
        const content = (
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
            <div
              className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                quickActionColors[action.color || "blue"]
              )}
            >
              <action.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 group-hover:text-slate-700">
                {action.label}
              </p>
              {action.description && (
                <p className="text-xs text-slate-500 truncate">
                  {action.description}
                </p>
              )}
            </div>
          </div>
        )

        if (action.href) {
          return (
            <Link key={index} to={action.href}>
              {content}
            </Link>
          )
        }

        return (
          <div key={index} onClick={action.onClick}>
            {content}
          </div>
        )
      })}
    </div>
  )
}

export default PageHeader
