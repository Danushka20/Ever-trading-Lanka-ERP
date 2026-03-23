import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { Home, ChevronRight, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: LucideIcon
  current?: boolean
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  separator?: React.ReactNode | "chevron" | "slash" | "dot"
  showHome?: boolean
  homeHref?: string
  homeLabel?: string
  maxItems?: number
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: {
    text: "text-xs",
    icon: "h-3 w-3",
    gap: "gap-1.5",
    separator: "mx-1.5",
  },
  md: {
    text: "text-sm",
    icon: "h-4 w-4",
    gap: "gap-2",
    separator: "mx-2",
  },
  lg: {
    text: "text-base",
    icon: "h-5 w-5",
    gap: "gap-2.5",
    separator: "mx-2.5",
  },
}

function BreadcrumbSeparator({
  type = "chevron",
  className,
}: {
  type?: React.ReactNode | "chevron" | "slash" | "dot"
  className?: string
}) {
  if (typeof type === "string") {
    switch (type) {
      case "slash":
        return <span className={cn("text-slate-300", className)}>/</span>
      case "dot":
        return <span className={cn("h-1 w-1 rounded-full bg-slate-300", className)} />
      case "chevron":
      default:
        return <ChevronRight className={cn("h-4 w-4 text-slate-400", className)} />
    }
  }
  return <>{type}</>
}

export function Breadcrumb({
  items,
  separator = "chevron",
  showHome = false,
  homeHref = "/",
  homeLabel = "Home",
  maxItems,
  size = "md",
  className,
  ...props
}: BreadcrumbProps) {
  const sizes = sizeClasses[size]

  // Build items list with optional home
  const allItems: BreadcrumbItem[] = React.useMemo(() => {
    const result: BreadcrumbItem[] = []
    if (showHome) {
      result.push({ label: homeLabel, href: homeHref, icon: Home })
    }
    result.push(...items)
    return result
  }, [items, showHome, homeHref, homeLabel])

  // Handle max items with ellipsis
  const displayItems = React.useMemo(() => {
    if (!maxItems || allItems.length <= maxItems) {
      return allItems
    }

    const firstItem = allItems[0]
    const lastItems = allItems.slice(-Math.floor(maxItems / 2))
    const hiddenItems = allItems.slice(1, allItems.length - lastItems.length)

    return [
      firstItem,
      { label: "...", href: undefined, hidden: hiddenItems },
      ...lastItems,
    ] as Array<BreadcrumbItem & { hidden?: BreadcrumbItem[] }>
  }, [allItems, maxItems])

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)} {...props}>
      <ol className={cn("flex items-center flex-wrap", sizes.gap)}>
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1
          const hiddenItems = (item as BreadcrumbItem & { hidden?: BreadcrumbItem[] }).hidden

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <BreadcrumbSeparator type={separator} className={sizes.separator} />
              )}

              {hiddenItems ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-slate-500 hover:text-slate-700">
                    <MoreHorizontal className={sizes.icon} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {hiddenItems.map((hidden, i) => (
                      <DropdownMenuItem key={i} asChild={!!hidden.href}>
                        {hidden.href ? (
                          <Link to={hidden.href}>
                            {hidden.icon && <hidden.icon className="w-4 h-4 mr-2" />}
                            {hidden.label}
                          </Link>
                        ) : (
                          <>
                            {hidden.icon && <hidden.icon className="w-4 h-4 mr-2" />}
                            {hidden.label}
                          </>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : item.href && !isLast ? (
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors",
                    sizes.text
                  )}
                >
                  {item.icon && <item.icon className={sizes.icon} />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    "flex items-center gap-1.5",
                    isLast ? "text-slate-900 font-medium" : "text-slate-500",
                    sizes.text
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.icon && <item.icon className={sizes.icon} />}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Breadcrumb helpers
export function useBreadcrumbItems(
  basePath: string,
  labels: Record<string, string> = {}
): BreadcrumbItem[] {
  const location = useLocation()

  return React.useMemo(() => {
    const pathSegments = location.pathname
      .replace(basePath, "")
      .split("/")
      .filter(Boolean)

    let currentPath = basePath
    return pathSegments.map((segment, index) => {
      currentPath = `${currentPath}/${segment}`
      const isLast = index === pathSegments.length - 1

      return {
        label: labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
        href: isLast ? undefined : currentPath,
        current: isLast,
      }
    })
  }, [location.pathname, basePath, labels])
}

export default Breadcrumb
