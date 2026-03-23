import * as React from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { FileQuestion, Search, FolderOpen, AlertCircle, Inbox, Plus } from "lucide-react"
import { Button } from "./button"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title?: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
    icon?: LucideIcon
  }
  secondaryAction?: {
    label: string
    onClick?: () => void
    href?: string
  }
  variant?: "default" | "search" | "error" | "folder" | "inbox"
  size?: "sm" | "md" | "lg"
  illustration?: React.ReactNode
}

const variantIcons: Record<string, LucideIcon> = {
  default: FileQuestion,
  search: Search,
  error: AlertCircle,
  folder: FolderOpen,
  inbox: Inbox,
}

const variantDefaults: Record<
  string,
  { title: string; description: string }
> = {
  default: {
    title: "No data found",
    description: "There's nothing to display here yet.",
  },
  search: {
    title: "No results found",
    description: "We couldn't find anything matching your search. Try different keywords.",
  },
  error: {
    title: "Something went wrong",
    description: "We encountered an error loading this data. Please try again.",
  },
  folder: {
    title: "No items",
    description: "This folder is empty. Create a new item to get started.",
  },
  inbox: {
    title: "All caught up!",
    description: "You don't have any new notifications.",
  },
}

const sizeClasses = {
  sm: {
    container: "py-8 px-4",
    iconContainer: "h-10 w-10",
    icon: "h-5 w-5",
    title: "text-sm",
    description: "text-xs",
  },
  md: {
    container: "py-12 px-6",
    iconContainer: "h-14 w-14",
    icon: "h-7 w-7",
    title: "text-base",
    description: "text-sm",
  },
  lg: {
    container: "py-16 px-8",
    iconContainer: "h-20 w-20",
    icon: "h-10 w-10",
    title: "text-lg",
    description: "text-base",
  },
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "default",
  size = "md",
  illustration,
  className,
  children,
  ...props
}: EmptyStateProps) {
  const Icon = icon || variantIcons[variant]
  const defaults = variantDefaults[variant]
  const sizes = sizeClasses[size]

  const displayTitle = title || defaults.title
  const displayDescription = description || defaults.description

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        sizes.container,
        className
      )}
      {...props}
    >
      {illustration ? (
        <div className="mb-4">{illustration}</div>
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-slate-100 mb-4",
            sizes.iconContainer
          )}
        >
          <Icon className={cn("text-slate-400", sizes.icon)} />
        </div>
      )}

      <h3
        className={cn(
          "font-semibold text-slate-900 mb-1",
          sizes.title
        )}
      >
        {displayTitle}
      </h3>

      <p
        className={cn(
          "text-slate-500 max-w-sm mb-4",
          sizes.description
        )}
      >
        {displayDescription}
      </p>

      {children}

      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-2">
          {action && (
            <Button
              onClick={action.onClick}
              className="gap-2"
              size={size === "sm" ? "sm" : "default"}
              asChild={!!action.href}
            >
              {action.href ? (
                <a href={action.href}>
                  {action.icon && <action.icon className="h-4 w-4" />}
                  {action.label}
                </a>
              ) : (
                <>
                  {action.icon && <action.icon className="h-4 w-4" />}
                  {action.label}
                </>
              )}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              size={size === "sm" ? "sm" : "default"}
              asChild={!!secondaryAction.href}
            >
              {secondaryAction.href ? (
                <a href={secondaryAction.href}>{secondaryAction.label}</a>
              ) : (
                secondaryAction.label
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Preset Empty States
export function NoSearchResults({
  query,
  onClear,
  className,
  ...props
}: {
  query?: string
  onClear?: () => void
} & Omit<EmptyStateProps, "variant">) {
  return (
    <EmptyState
      variant="search"
      description={
        query
          ? `No results found for "${query}". Try adjusting your search terms.`
          : "No results match your search criteria."
      }
      action={
        onClear
          ? { label: "Clear search", onClick: onClear }
          : undefined
      }
      className={className}
      {...props}
    />
  )
}

export function NoDataYet({
  itemName = "items",
  onAdd,
  className,
  ...props
}: {
  itemName?: string
  onAdd?: () => void
} & Omit<EmptyStateProps, "variant">) {
  return (
    <EmptyState
      variant="folder"
      title={`No ${itemName} yet`}
      description={`Get started by creating your first ${itemName.toLowerCase()}.`}
      action={
        onAdd
          ? { label: `Add ${itemName}`, onClick: onAdd, icon: Plus }
          : undefined
      }
      className={className}
      {...props}
    />
  )
}

export function ErrorState({
  message,
  onRetry,
  className,
  ...props
}: {
  message?: string
  onRetry?: () => void
} & Omit<EmptyStateProps, "variant">) {
  return (
    <EmptyState
      variant="error"
      description={message || "Something went wrong. Please try again."}
      action={
        onRetry
          ? { label: "Try again", onClick: onRetry }
          : undefined
      }
      className={className}
      {...props}
    />
  )
}

export default EmptyState
