import type { DBDealer, DBSalesArea } from "@/lib/types"

export interface DealerWithStats extends DBDealer {
  totalSales: number
  totalPaid: number
  balance: number
  invoiceCount: number
}

export interface AreaWithStats extends DBSalesArea {
  dealerCount: number
  totalSales: number
  totalBalance: number
}

export interface AreaDealerDataResult {
  areas: AreaWithStats[]
  dealers: DealerWithStats[]
  selectedAreaId: string | null
  setSelectedAreaId: (id: string | null) => void
  isLoading: boolean
}
