import { useState, useMemo } from "react"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBDealer, DBSalesArea, DBInvoice } from "@/lib/types"
import type { DealerWithStats, AreaWithStats, AreaDealerDataResult } from "./types"

export function useAreaDealerData(): AreaDealerDataResult {
  const { data: areas = [], isLoading: loadingAreas } = useOfflineData<DBSalesArea>("salesAreas")
  const { data: dealers = [], isLoading: loadingDealers } = useOfflineData<DBDealer>("dealers")
  const { data: invoices = [], isLoading: loadingInvoices } = useOfflineData<DBInvoice>("invoices")

  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)

  const dealersWithStats = useMemo<DealerWithStats[]>(() => {
    return dealers.map(dealer => {
      const dealerInvoices = invoices.filter(inv => inv.dealer_id === dealer.id)
      const totalSales = dealerInvoices.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0)
      const totalPaid = dealerInvoices.reduce((sum, inv) => sum + (Number((inv as any).settle_amount) || 0), 0)
      const balance = totalSales - totalPaid
      
      return {
        ...dealer,
        totalSales,
        totalPaid,
        balance,
        invoiceCount: dealerInvoices.length
      }
    })
  }, [dealers, invoices])

  const areasWithStats = useMemo<AreaWithStats[]>(() => {
    return areas.map(area => {
      const areaDealers = dealersWithStats.filter(d => d.sales_area_id === area.id)
      const totalSales = areaDealers.reduce((sum, d) => sum + d.totalSales, 0)
      const totalBalance = areaDealers.reduce((sum, d) => sum + d.balance, 0)
      
      return {
        ...area,
        dealerCount: areaDealers.length,
        totalSales,
        totalBalance
      }
    })
  }, [areas, dealersWithStats])

  const filteredDealers = useMemo<DealerWithStats[]>(() => {
    if (!selectedAreaId) return []
    return dealersWithStats.filter(d => String(d.sales_area_id) === selectedAreaId)
  }, [dealersWithStats, selectedAreaId])

  return {
    areas: areasWithStats,
    dealers: filteredDealers,
    selectedAreaId,
    setSelectedAreaId,
    isLoading: loadingAreas || loadingDealers || loadingInvoices
  }
}
