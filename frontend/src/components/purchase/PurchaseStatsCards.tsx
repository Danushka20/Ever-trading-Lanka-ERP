import { FileText, Calendar, Truck, Banknote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { DBPurchaseOrder } from "@/lib/types"

type PurchaseStatsCardsProps = {
  purchases: DBPurchaseOrder[]
  totalSpent: number
  thisMonthCount: number
}

export function PurchaseStatsCards({ purchases, totalSpent, thisMonthCount }: PurchaseStatsCardsProps) {
  const activeSuppliers = new Set(purchases.map((p) => p.supplier_id)).size

  const stats = [
    {
      label: "Total Orders",
      value: purchases.length,
      icon: FileText,
      iconClass: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Spent",
      value: `Rs.${totalSpent.toLocaleString()}`,
      icon: Banknote,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Active Suppliers",
      value: activeSuppliers,
      icon: Truck,
      iconClass: "bg-orange-50 text-orange-600",
    },
    {
      label: "This Month",
      value: thisMonthCount,
      icon: Calendar,
      iconClass: "bg-indigo-50 text-indigo-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="overflow-hidden transition-all bg-white border-none shadow-sm group hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold tracking-wider uppercase text-slate-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-2xl ${stat.iconClass} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
