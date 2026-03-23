import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Package2,
  HelpCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuth } from "@/context/AuthContext"
import { navSections } from "./sidebar-data"
import type { NavItem, SubItem } from "./sidebar-data"
import { SidebarItem } from "./SidebarItem"

interface SidebarProps {
  className?: string
  isCollapsed?: boolean
  setIsCollapsed?: (value: boolean) => void
}

export function Sidebar({ className, isCollapsed, setIsCollapsed }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [openMenus, setOpenMenus] = useState<string[]>([])

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  useEffect(() => {
    if (isCollapsed) {
      setOpenMenus([])
      return
    }
    navSections.flatMap((s) => s.items).forEach((item: NavItem) => {
      if (item.subItems?.some((sub: SubItem) => sub.href === location.pathname)) {
        if (!openMenus.includes(item.label)) {
          setOpenMenus((prev) => [...prev, item.label])
        }
      }
    })
  }, [location.pathname, isCollapsed])
  const toggleMenu = (label: string) => {
    if (isCollapsed && setIsCollapsed) {
      setIsCollapsed(false)
      setOpenMenus([label])
      return
    }
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    )
  }
  return (
    <div className={cn(
      "flex flex-col h-screen overflow-hidden bg-[#f8fafc] dark:bg-slate-950 text-slate-600 shrink-0 border-r border-slate-200/60 dark:border-slate-800 transition-all duration-300 relative",
      isCollapsed ? "w-20" : "w-72",
      className
    )}>
      {setIsCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute z-50 hidden w-6 h-6 bg-white dark:bg-slate-900 border rounded-full shadow-sm -right-3 top-24 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 md:flex"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </Button>
      )}

      {/* Header */}
      <div className={cn("p-6 flex items-center transition-all duration-300", isCollapsed ? "justify-center" : "px-8")}>
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center transition-all shadow-lg w-10 h-10 shrink-0 bg-gradient-to-tr from-indigo-600 via-violet-500 to-purple-500 shadow-indigo-500/25 rounded-xl group-hover:scale-110 group-hover:rotate-6">
            <Package2 className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col duration-500 animate-in fade-in">
              <span className="text-xl italic font-black leading-tight tracking-tighter uppercase transition-colors text-slate-900 dark:text-white group-hover:text-indigo-600">GrowLedger</span>
              <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold tracking-[0.2em] uppercase whitespace-nowrap">Enterprise ERP</span>
            </div>
          )}
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4">
        {/* User Profile Summary */}
        {user && !isCollapsed && (
          <div className="px-2 py-4 mb-2 bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-white/50 dark:border-slate-800 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 transition-all shadow-md bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-indigo-500/20 rounded-lg shrink-0">
                <span className="text-sm font-bold text-white uppercase">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-none truncate">
                  {user?.name || "User"}
                </span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {(user as any)?.role || "Member"}
                </span>
              </div>
            </div>
          </div>
        )}

        <TooltipProvider delayDuration={0}>
          <nav className="grid gap-6 py-4">
            {navSections.map((section, sidx) => (
              <div key={sidx} className="space-y-3">
                {!isCollapsed ? (
                  <p className="text-[11px] font-bold text-slate-400/80 dark:text-slate-500 uppercase tracking-[0.15em] px-2 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-slate-200 dark:bg-slate-800" />
                    {section.section}
                  </p>
                ) : (
                  <div className="h-px mx-2 my-2 bg-slate-100 dark:bg-slate-800" />
                )}
                <div className="grid gap-0.5">
                  {section.items.map((item: NavItem, idx) => (
                    <SidebarItem
                      key={idx}
                      item={item}
                      isCollapsed={isCollapsed ?? false}
                      isOpen={openMenus.includes(item.label)}
                      onToggle={toggleMenu}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </TooltipProvider>
      </ScrollArea>

      {/* Footer Actions - Sign Out Only */}
      <div className={cn("p-4 mt-auto border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30", isCollapsed && "items-center overflow-visible")}>
        {!isCollapsed ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all text-rose-500/90 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 group"
          >
            <LogOut className="w-4 h-4 transition-colors text-rose-400 group-hover:text-rose-600" />
            <span>Sign Out</span>
          </button>
        ) : (
           <div className="flex flex-col items-center gap-3 py-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={handleLogout} className="p-2.5 rounded-xl text-rose-500 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors">
                      <LogOut className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-rose-600 text-white border-none font-bold text-xs">Sign Out</TooltipContent>
                </Tooltip>
              </TooltipProvider>
           </div>
        )}
      </div>

      {/* Help Support Banner */}
      {!isCollapsed && (
        <div className="p-4 mb-2 duration-500 animate-in fade-in slide-in-from-bottom-2">
          <div className="relative p-4 overflow-hidden border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-white dark:from-slate-900 dark:to-slate-950 group">
              <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <HelpCircle className="w-3 h-3 text-indigo-500" />
                    <p className="text-[11px] font-bold text-slate-900 dark:text-slate-100">Help Center</p>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">Need assistance with GrowLedger?</p>
                  <button className="w-full py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-all">Documentation</button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/10 dark:bg-indigo-500/5 blur-2xl group-hover:scale-110 transition-transform"></div>
          </div>
        </div>
      )}
    </div>
  )
}
