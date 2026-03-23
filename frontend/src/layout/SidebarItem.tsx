import { Link, useLocation } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { NavItem, SubItem } from "./sidebar-data"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarItemProps {
  item: NavItem
  isCollapsed: boolean
  isOpen: boolean
  onToggle: (label: string) => void
}

export function SidebarItem({ item, isCollapsed, isOpen, onToggle }: SidebarItemProps) {
  const location = useLocation()
  const Icon = item.icon
  const isActive = location.pathname === item.href || (item.subItems?.some((s: SubItem) => location.pathname === s.href))

  const content = item.href ? (
    <Link
      to={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group w-full",
        isActive
          ? "text-indigo-600 bg-indigo-50/80 dark:bg-indigo-900/20"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/50",
        isCollapsed && "justify-center px-0"
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500")} />
      {!isCollapsed && <span>{item.label}</span>}
      {isActive && !isCollapsed && <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />}
    </Link>
  ) : (
    <div className="w-full">
      <button
        onClick={() => onToggle(item.label)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all outline-none group",
          isActive || isOpen ? "text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/50",
          isCollapsed && "justify-center px-0"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive || isOpen ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500")} />
          {!isCollapsed && <span>{item.label}</span>}
        </div>
        {!isCollapsed && (
          <ChevronRight className={cn("h-4 w-4 transition-transform duration-300 shrink-0 text-slate-300", isOpen && "rotate-90 text-indigo-500")} />
        )}
      </button>
      {item.subItems && isOpen && !isCollapsed && (
        <div className="ml-7 mt-1.5 grid gap-1 relative border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-left-2 duration-200">
          {item.subItems.map((sub: SubItem, sidx2: number) => (
            <Link
              key={sidx2}
              to={sub.href}
              className={cn(
                "block px-4 py-1.5 text-xs font-medium transition-all relative",
                "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-px before:bg-transparent",
                location.pathname === sub.href
                  ? "text-indigo-600 font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:translate-x-1"
              )}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-slate-900 text-white border-none rounded-lg px-3 py-1.5 font-bold text-[11px]">
          {item.label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}
