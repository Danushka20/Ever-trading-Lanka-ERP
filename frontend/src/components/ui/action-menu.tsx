import * as React from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { MoreHorizontal, MoreVertical, Pencil, Trash2, Eye, Copy, Download } from "lucide-react"
import { Button } from "./button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu"

export interface ActionItem {
  label: string
  onClick: () => void
  icon?: LucideIcon
  variant?: "default" | "danger"
  disabled?: boolean
}

export interface ActionMenuProps {
  actions: ActionItem[]
  trigger?: React.ReactNode
  align?: "start" | "center" | "end"
  className?: string
}

export function ActionMenu({ actions, trigger, align = "end", className }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className={cn("h-8 w-8", className)}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(action.variant === "danger" && "text-red-600 focus:text-red-600")}
          >
            {action.icon && <action.icon className="mr-2 h-4 w-4" />}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Row Action Menu - Common actions for table rows
export interface RowActionMenuProps {
  actions: ActionItem[]
  align?: "start" | "center" | "end"
  direction?: "horizontal" | "vertical"
}

export function RowActionMenu({ actions, align = "end", direction = "vertical" }: RowActionMenuProps) {
  const Icon = direction === "horizontal" ? MoreHorizontal : MoreVertical
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Icon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(action.variant === "danger" && "text-red-600 focus:text-red-600")}
          >
            {action.icon && <action.icon className="mr-2 h-4 w-4" />}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Quick Actions - Inline action buttons
export interface QuickActionsProps {
  onEdit?: () => void
  onView?: () => void
  onDelete?: () => void
  onCopy?: () => void
  onDownload?: () => void
  showEdit?: boolean
  showView?: boolean
  showDelete?: boolean
  showCopy?: boolean
  showDownload?: boolean
  className?: string
}

export function QuickActions({
  onEdit, onView, onDelete, onCopy, onDownload,
  showEdit = true, showView = false, showDelete = true, showCopy = false, showDownload = false,
  className,
}: QuickActionsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {showView && onView && (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onView}><Eye className="h-4 w-4" /></Button>
      )}
      {showEdit && onEdit && (
        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>
      )}
      {showCopy && onCopy && (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCopy}><Copy className="h-4 w-4" /></Button>
      )}
      {showDownload && onDownload && (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDownload}><Download className="h-4 w-4" /></Button>
      )}
      {showDelete && onDelete && (
        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
      )}
    </div>
  )
}

// Context Menu Wrapper
export interface ContextMenuWrapperProps {
  actions: ActionItem[]
  children: React.ReactNode
}

export function ContextMenuWrapper({ actions, children }: ContextMenuWrapperProps) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [visible, setVisible] = React.useState(false)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setPosition({ x: e.clientX, y: e.clientY })
    setVisible(true)
  }

  React.useEffect(() => {
    const handleClick = () => setVisible(false)
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  return (
    <div onContextMenu={handleContextMenu}>
      {children}
      {visible && (
        <div className="fixed z-50 min-w-40 bg-white rounded-lg border shadow-lg py-1" style={{ left: position.x, top: position.y }}>
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => { action.onClick(); setVisible(false) }}
              disabled={action.disabled}
              className={cn(
                "w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-100 disabled:opacity-50",
                action.variant === "danger" && "text-red-600"
              )}
            >
              {action.icon && <action.icon className="h-4 w-4" />}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActionMenu
