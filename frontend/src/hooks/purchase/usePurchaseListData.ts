import { useEffect, useMemo, useState } from "react"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBPurchaseOrder, DBSupplier } from "@/lib/types"

export interface PurchaseDateRange {
  start: Date | null
  end: Date | null
}

export function usePurchaseListData() {
  const { data: purchases, isLoading } = useOfflineData<DBPurchaseOrder>("purchaseOrders")
  const { data: suppliers } = useOfflineData<DBSupplier>("suppliers")

  const [searchQuery, setSearchQuery] = useState("")
  const [supplierFilter, setSupplierFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<PurchaseDateRange>({ start: null, end: null })
  const [selectedPurchase, setSelectedPurchase] = useState<DBPurchaseOrder | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [currentMonthAnchor, setCurrentMonthAnchor] = useState(new Date())

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, supplierFilter, dateRange])

  useEffect(() => {
    const scheduleNextMonthRefresh = () => {
      const now = new Date()
      const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0)
      const msUntilNextMonth = nextMonthStart.getTime() - now.getTime()

      const timeoutId = window.setTimeout(() => {
        setCurrentMonthAnchor(new Date())
      }, Math.max(msUntilNextMonth, 1000))

      return timeoutId
    }

    const timeoutId = scheduleNextMonthRefresh()
    return () => window.clearTimeout(timeoutId)
  }, [currentMonthAnchor])

  const toValidDate = (value?: string | Date | null) => {
    if (!value) return null
    const parsed = value instanceof Date ? value : new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const viewDetails = (purchase: DBPurchaseOrder) => {
    setSelectedPurchase(purchase)
    setDetailsOpen(true)
  }

  const enrichedPurchases = useMemo(() => {
    return purchases.map((purchase) => ({
      ...purchase,
      supplier: suppliers.find((supplier) => supplier.id === purchase.supplier_id),
    }))
  }, [purchases, suppliers])

  const filteredPurchases = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase()

    return enrichedPurchases
      .map((purchase) => ({
        ...purchase,
        items_count: purchase.items?.reduce((sum: number, item: any) => sum + Number(item.quantity || 0), 0) || 0,
        total_amount: Number(purchase.total || purchase.total_amount || 0),
      }))
      .filter((purchase) => {
        const orderDate = toValidDate(purchase.order_date || purchase.created_at)

        const matchesSearch =
          purchase.supplier?.name?.toLowerCase().includes(normalizedSearchQuery) ||
          purchase.reference_number?.toLowerCase().includes(normalizedSearchQuery) ||
          purchase.id.toString().includes(searchQuery) ||
          purchase.order_date?.toLowerCase().includes(normalizedSearchQuery)

        const matchesSupplier = supplierFilter === "all" || purchase.supplier_id === Number(supplierFilter)

        let matchesDate = true
        if (dateRange.start || dateRange.end) {
          if (!orderDate) return false
        }
        if (dateRange.start && orderDate) {
          const start = new Date(dateRange.start)
          start.setHours(0, 0, 0, 0)
          matchesDate = matchesDate && orderDate >= start
        }
        if (dateRange.end && orderDate) {
          const end = new Date(dateRange.end)
          end.setHours(23, 59, 59, 999)
          matchesDate = matchesDate && orderDate <= end
        }

        return matchesSearch && matchesSupplier && matchesDate
      })
  }, [enrichedPurchases, searchQuery, supplierFilter, dateRange])

  const totalSpent = useMemo(() => {
    return purchases.reduce((sum, purchase) => sum + Number(purchase.total_amount || 0), 0)
  }, [purchases])

  const totalPages = Math.ceil(filteredPurchases.length / pageSize)
  const paginatedPurchases = filteredPurchases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const thisMonthCount = useMemo(() => {
    return purchases.filter((purchase) => {
      const d = toValidDate(purchase.order_date || purchase.created_at)
      if (!d) return false
      const now = currentMonthAnchor
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
  }, [purchases, currentMonthAnchor])

  return {
    purchases,
    suppliers,
    isLoading,
    searchQuery,
    setSearchQuery,
    supplierFilter,
    setSupplierFilter,
    dateRange,
    setDateRange,
    selectedPurchase,
    setSelectedPurchase,
    detailsOpen,
    setDetailsOpen,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    filteredPurchases,
    totalSpent,
    totalPages,
    paginatedPurchases,
    thisMonthCount,
    viewDetails,
  }
}
