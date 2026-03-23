import { useMemo } from "react"
import { Link } from "react-router-dom"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBInvoice, DBDealer, DBSalesArea } from "@/lib/types"
import { Loader2, ArrowUpRight } from "lucide-react"

export function RecentSales() {
  const { data: invoices, isLoading: invLoading } = useOfflineData<DBInvoice>("invoices")
  const { data: dealers } = useOfflineData<DBDealer>("dealers")
  const { data: areas } = useOfflineData<DBSalesArea>("salesAreas")

  const sales = useMemo(() => {
    return [...invoices]
      .sort((a, b) => new Date(b.invoice_date || new Date()).getTime() - new Date(a.invoice_date || new Date()).getTime())
      .slice(0, 5)
      .map(inv => {
        const dealer = dealers.find(d => d.id.toString() === inv.dealer_id?.toString())
        const salesArea = dealer?.sales_area_id
          ? areas.find(a => a.id === Number(dealer.sales_area_id))
          : undefined
        return {
          ...inv,
          customer_name: inv.customer_name || dealer?.name || "Ref: #" + inv.id,
          sales_area: salesArea
        }
      })
  }, [invoices, dealers, areas])

  const colors = ['from-blue-500 to-blue-600','from-violet-500 to-purple-600','from-emerald-500 to-teal-600','from-orange-500 to-amber-600','from-rose-500 to-pink-600']

  return (
    <div className="flex flex-col p-6 transition-shadow bg-white border shadow-sm lg:col-span-3 rounded-2xl border-slate-100 hover:shadow-md">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900">Recent Sales</h3>
          <p className="text-xs text-slate-500 mt-0.5">Latest confirmed invoices</p>
        </div>
        <Link to="/sales/invoice-list" className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg px-3 py-1.5 transition-colors">
          View all <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {invLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-blue-600 animate-spin" /></div>
      ) : (
        <div className="flex-1 space-y-3">
          {sales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-2xl bg-slate-100">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">No recent sales</p>
              <p className="mt-1 text-xs">Invoices will appear here</p>
            </div>
          ) : sales.map((sale: any, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 transition-colors rounded-xl hover:bg-slate-50 group">
              <div className={`h-9 w-9 rounded-xl bg-linear-to-br ${colors[i % colors.length]} flex items-center justify-center shrink-0`}>
                <span className="text-xs font-black text-white">{(sale.customer_name || "??").substring(0, 2).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-slate-900">{sale.customer_name}</p>
                <p className="text-xs font-medium text-slate-400">{sale.sales_area?.name || 'No Area'}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-black text-slate-900">Rs.{Number(sale.total || 0).toLocaleString()}</div>
                <div className="text-[10px] text-emerald-600 font-bold bg-emerald-50 rounded-full px-2 py-0.5 mt-0.5">Confirmed</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

