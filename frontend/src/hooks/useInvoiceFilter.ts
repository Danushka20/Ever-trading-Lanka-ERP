import { useMemo } from "react"
import type { DBInvoice } from "@/lib/types"

export function useInvoiceFilter(
  invoices: DBInvoice[], 
  searchQuery: string,
  startDate?: Date | null,
  endDate?: Date | null,
  areaId?: string | null
) {
  return useMemo(() => {
    return invoices.filter((inv) => {
      // Area filtering
      if (areaId && areaId !== "all") {
        const invAreaId = inv.sales_area_id?.toString()
        if (invAreaId !== areaId) return false
      }

      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        inv.invoice_no?.toLowerCase().includes(query) ||
        inv.customer_name?.toLowerCase().includes(query) ||
        (typeof inv.dealer_id === 'object' && (inv.dealer_id as any)?.name?.toLowerCase().includes(query))

      if (!matchesSearch) return false

      if (startDate || endDate) {
        const invDate = new Date(inv.invoice_date || inv.created_at || "")
        if (startDate && invDate < new Date(startDate.setHours(0, 0, 0, 0))) return false
        if (endDate && invDate > new Date(endDate.setHours(23, 59, 59, 999))) return false
      }

      return true
    })
  }, [invoices, searchQuery, startDate, endDate, areaId])
}
