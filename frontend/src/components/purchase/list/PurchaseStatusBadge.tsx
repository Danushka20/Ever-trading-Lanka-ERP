import { Badge } from "@/components/ui/badge"
import type { ReactNode } from "react"

export function getPurchaseStatusBadge(status: string): ReactNode {
  switch (status) {
    case "completed":
    case "received":
      return <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">Received</Badge>
    case "pending":
    case "ordered":
      return <Badge className="bg-amber-100 text-amber-700 border-none font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">Pending</Badge>
    case "cancelled":
      return <Badge className="bg-rose-100 text-rose-700 border-none font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">Cancelled</Badge>
    case "draft":
      return <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">Draft</Badge>
    default:
      return <Badge variant="outline" className="font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">{status}</Badge>
  }
}
