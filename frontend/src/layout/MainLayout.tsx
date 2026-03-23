import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
export default function MainLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar 
        className="hidden md:flex shrink-0" 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      />
      <div className="flex flex-col flex-1 min-w-0 bg-slate-50/40 transition-all duration-300">
        <Header />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
