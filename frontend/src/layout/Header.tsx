import { Bell, Search, Menu, Settings, LogOut, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "./Sidebar"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }
  return (
    <header className="sticky top-0 z-30 flex items-center h-20 gap-4 px-4 border-b bg-white/80 backdrop-blur-xl md:px-8 border-slate-200/60 shrink-0">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="transition-all border border-transparent md:hidden h-11 w-11 rounded-2xl bg-slate-50 hover:border-slate-200 hover:bg-white text-slate-500 hover:text-blue-600 active:scale-95 shrink-0">
            <Menu className="w-5 h-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 border-r w-72 border-slate-200/60">
          <Sidebar className="w-full h-full border-none shadow-none" />
        </SheetContent>
      </Sheet>
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-xl group">
          <Search className="absolute w-4 h-4 transition-colors -translate-y-1/2 left-4 top-1/2 text-slate-400 group-focus-within:text-blue-500" />
          <Input
            type="search"
            placeholder="Search anything..."
            className="w-full font-medium transition-all border-none bg-slate-50/50 pl-11 h-11 rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-500/20 placeholder:text-slate-400"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <Button variant="ghost" size="icon" className="relative hidden transition-all border border-transparent h-11 w-11 rounded-2xl bg-slate-50 hover:border-slate-200 hover:bg-white text-slate-500 hover:text-blue-600 active:scale-95 sm:flex">
          <Bell className="w-5 h-5" />
          <span className="absolute flex w-2 h-2 bg-red-500 border-2 border-white rounded-full right-3 top-3" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden transition-all border border-transparent h-11 w-11 rounded-2xl bg-slate-50 hover:border-slate-200 hover:bg-white text-slate-500 hover:text-blue-600 active:scale-95 sm:flex">
          <Settings className="w-5 h-5" />
        </Button>
        <div className="hidden w-px h-8 mx-2 bg-slate-200/60 sm:block" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-12 gap-3 pl-2 pr-2 transition-all border border-transparent md:pr-4 rounded-2xl hover:bg-slate-50 active:scale-95 hover:border-slate-200">
              <div className="flex items-center justify-center w-8 h-8 transition-all shadow-md md:w-9 md:h-9 bg-gradient-to-br from-blue-600 to-sky-500 shadow-blue-500/20 rounded-xl shrink-0">
                <span className="text-xs italic font-bold text-white uppercase md:text-sm">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="flex flex-col items-start hidden sm:flex">
                <span className="text-sm font-bold text-slate-900 leading-none truncate max-w-[100px]">
                  {user?.name || "User"}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {(user as any)?.roles?.[0]?.name || "Member"}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 shadow-xl rounded-2xl border-slate-200/60 shadow-slate-200/40">
            <DropdownMenuLabel className="px-3 py-2 text-xs font-bold tracking-widest uppercase text-slate-400">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem className="px-3 py-2 text-sm font-semibold transition-colors cursor-pointer rounded-xl text-slate-600 focus:bg-blue-50 focus:text-blue-600">
              <User className="w-4 h-4 mr-3" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="px-3 py-2 text-sm font-semibold transition-colors cursor-pointer rounded-xl text-slate-600 focus:bg-blue-50 focus:text-blue-600">
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="px-3 py-2 text-sm font-semibold text-red-600 transition-colors cursor-pointer rounded-xl focus:bg-red-50 focus:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

