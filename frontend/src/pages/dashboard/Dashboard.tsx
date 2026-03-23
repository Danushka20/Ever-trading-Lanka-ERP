import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ShoppingCart, Plus, FileText, TrendingUp, Download } from "lucide-react"
import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { RecentSales } from "@/components/dashboard/RecentSales"

const quickActions = [
  { label: 'New Invoice', icon: FileText, href: '/sales/create-invoice', color: 'blue', desc: 'Create a sales invoice' },
  { label: 'Add Purchase', icon: ShoppingCart, href: '/purchase/create', color: 'violet', desc: 'Record a purchase order' },
  { label: 'Sales Report', icon: TrendingUp, href: '/reports/sales', color: 'emerald', desc: 'View sales analytics' },
  { label: 'Manage Dealers', icon: ArrowUpRight, href: '/dealers', color: 'amber', desc: 'View all dealers' },
]

const colorMap: Record<string, { bg: string; icon: string; badge: string }> = {
  blue:   { bg: 'bg-blue-50 hover:bg-blue-100',    icon: 'text-blue-600',   badge: 'bg-blue-600' },
  violet: { bg: 'bg-violet-50 hover:bg-violet-100', icon: 'text-violet-600', badge: 'bg-violet-600' },
  emerald:{ bg: 'bg-emerald-50 hover:bg-emerald-100',icon:'text-emerald-600',badge: 'bg-emerald-600' },
  amber:  { bg: 'bg-amber-50 hover:bg-amber-100',   icon: 'text-amber-600',  badge: 'bg-amber-600' },
}

export default function Dashboard() {
  return (
    <div className="flex-1 min-h-screen bg-slate-50/60">

      {/* Page Header */}
      <div className="bg-white border-b border-slate-100 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Overview</h1>
            <p className="text-sm text-slate-500 mt-0.5">Monitor your business performance at a glance.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm" className="gap-2 text-slate-600 border-slate-200 hover:bg-slate-50 h-9">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
            <Link to="/sales/create-invoice">
              <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 h-9 shadow-sm shadow-blue-200">
                <Plus className="h-3.5 w-3.5" />
                New Invoice
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-7">

        {/* KPI Stats */}
        <DashboardStats />

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-7">
          <RevenueChart />
          <RecentSales />
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map(action => {
              const c = colorMap[action.color]
              return (
                <Link key={action.label} to={action.href}
                  className={`group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${c.bg} transition-colors`}>
                    <action.icon className={`h-5 w-5 ${c.icon}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-slate-700">{action.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{action.desc}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}


