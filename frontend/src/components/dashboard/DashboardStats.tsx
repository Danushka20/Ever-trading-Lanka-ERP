import { useMemo } from "react"
import { Users, Activity, Package, DollarSign, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBInvoice, DBSalesArea, DBStockBatch } from "@/lib/types"

const cards = [
  {
    key: 'total_revenue',
    title: 'Total Revenue',
    format: (v: number) => `Rs. ${v?.toLocaleString() || 0}`,
    subtext: 'From confirmed invoices',
    icon: DollarSign,
    accent: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    border: 'border-emerald-100',
    trend: 0,
  },
  {
    key: 'active_areas',
    title: 'Sales Areas',
    format: (v: number) => v || 0,
    subtext: 'Active distribution zones',
    icon: Users,
    accent: 'text-blue-600',
    iconBg: 'bg-blue-50',
    border: 'border-blue-100',
    trend: 0,
  },
  {
    key: 'daily_transactions',
    title: "Today's Invoices",
    format: (v: number) => v || 0,
    subtext: 'New sales recorded today',
    icon: Activity,
    accent: 'text-violet-600',
    iconBg: 'bg-violet-50',
    border: 'border-violet-100',
    trend: 0,
  },
  {
    key: 'low_stock_count',
    title: 'Low Stock Items',
    format: (v: number) => v || 0,
    subtext: (v: number) => v > 0 ? 'Requires immediate attention' : 'All inventory levels stable',
    icon: Package,
    accent: (v: number) => v > 0 ? 'text-red-600' : 'text-slate-500',
    iconBg: (v: number) => v > 0 ? 'bg-red-50' : 'bg-slate-50',
    border: (v: number) => v > 0 ? 'border-red-100' : 'border-slate-100',
    alert: true,
  },
]

export function DashboardStats() {
  const { data: invoices, isLoading: invLoading } = useOfflineData<DBInvoice>("invoices")
  const { data: areas, isLoading: areasLoading } = useOfflineData<DBSalesArea>("salesAreas")
  const { data: stock, isLoading: stockLoading } = useOfflineData<DBStockBatch>("stockBatches")

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    
    const totalRev = invoices.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0)
    const todayInvoices = invoices.filter(inv => inv.invoice_date === today).length
    const lowStock = stock.filter(s => (Number(s.qty || s.quantity) || 0) < 50).length

    return {
      total_revenue: totalRev,
      active_areas: areas.length,
      daily_transactions: todayInvoices,
      low_stock_count: lowStock
    }
  }, [invoices, areas, stock])

  if (invLoading || areasLoading || stockLoading) return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {[1,2,3,4].map(i => (
        <div key={i} className="rounded-2xl h-32 bg-white border border-slate-100 animate-pulse" />
      ))}
    </div>
  )

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const rawVal = stats?.[card.key as keyof typeof stats] ?? 0
        const value = card.format(rawVal)
        const subtext = typeof card.subtext === 'function' ? card.subtext(rawVal) : card.subtext
        const accent = typeof card.accent === 'function' ? card.accent(rawVal) : card.accent
        const iconBg = typeof card.iconBg === 'function' ? card.iconBg(rawVal) : card.iconBg
        const border = typeof card.border === 'function' ? card.border(rawVal) : card.border
        const isAlert = card.alert && rawVal > 0

        return (
          <div key={card.key} className={`bg-white rounded-2xl border ${border} p-6 shadow-sm hover:shadow-md transition-all group`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`h-11 w-11 rounded-xl ${iconBg} flex items-center justify-center`}>
                <card.icon className={`h-5 w-5 ${accent}`} />
              </div>
              {card.trend !== undefined && (
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold rounded-full px-2.5 py-1 ${
                  card.trend >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'
                }`}>
                  {card.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(card.trend)}%
                </span>
              )}
              {isAlert && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 rounded-full px-2.5 py-1">
                  <AlertTriangle className="h-3 w-3" /> Alert
                </span>
              )}
            </div>
            <div className={`text-2xl font-black tracking-tight ${accent}`}>{value}</div>
            <div className="text-xs font-bold text-slate-800 mt-1">{card.title}</div>
            <div className="text-xs text-slate-400 mt-0.5">{subtext}</div>
          </div>
        )
      })}
    </div>
  )
}

