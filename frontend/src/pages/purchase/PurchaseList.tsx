import { useState, useMemo, useEffect } from "react"
import { Package, Plus, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBPurchaseOrder, DBSupplier } from "@/lib/types"
import { DateRangePicker } from "@/components/ui/date-picker"
import { ExportButton } from "@/components/ExportButton"
import { PageHeader } from "@/components/ui/page-header"
import { Pagination } from "@/components/ui/pagination"
import { PurchaseStatsCards } from "@/components/purchase/PurchaseStatsCards"
import { PurchaseActivityTable } from "@/components/purchase/PurchaseActivityTable"
import { PurchaseDetailsDialog } from "@/components/purchase/PurchaseDetailsDialog"

export default function PurchaseList() {
  const navigate = useNavigate()
  const { data: purchases, isLoading } = useOfflineData<DBPurchaseOrder>("purchaseOrders")
  const { data: suppliers } = useOfflineData<DBSupplier>("suppliers")
  const [searchQuery, setSearchQuery] = useState("")
  const [supplierFilter, setSupplierFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null })
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

  const viewDetails = (purchase: DBPurchaseOrder) => {
    setSelectedPurchase(purchase)
    setDetailsOpen(true)
  }

  const enrichedPurchases = useMemo(() => {
    return purchases.map(p => ({
      ...p,
      supplier: suppliers.find(s => s.id === p.supplier_id)
    }))
  }, [purchases, suppliers])

  const filteredPurchases = useMemo(() => {
    return enrichedPurchases.map(p => ({
      ...p,
      items_count: p.items?.reduce((sum: number, item: any) => sum + Number(item.quantity || 0), 0) || 0,
      total_amount: Number(p.total || p.total_amount || 0)
    })).filter((p) => {
        const orderDateStr = p.order_date || p.created_at || ""
        const orderDate = orderDateStr ? new Date(orderDateStr) : null

        const matchesSearch = 
            p.supplier?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.reference_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toString().includes(searchQuery) ||
            p.order_date?.includes(searchQuery);
        
        const matchesSupplier = supplierFilter === "all" || p.supplier_id === Number(supplierFilter);
        
        let matchesDate = true;
        if (dateRange.start && orderDate) {
          const start = new Date(dateRange.start);
          start.setHours(0, 0, 0, 0);
          matchesDate = matchesDate && orderDate >= start;
        }
        if (dateRange.end && orderDate) {
          const end = new Date(dateRange.end);
          end.setHours(23, 59, 59, 999);
          matchesDate = matchesDate && orderDate <= end;
        }

        return matchesSearch && matchesSupplier && matchesDate;
    })
  }, [enrichedPurchases, searchQuery, supplierFilter, dateRange])

  const totalSpent = purchases.reduce((sum, p) => sum + Number(p.total_amount || 0), 0)

  const totalPages = Math.ceil(filteredPurchases.length / pageSize)
  const paginatedPurchases = filteredPurchases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const thisMonthCount = purchases.filter(p => {
    const d = new Date(p.order_date || p.created_at || new Date()); 
    const now = currentMonthAnchor;
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() 
  }).length

  const getStatusBadge = (status: string) => {
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

  return (
    <div className="flex-1 min-h-screen space-y-4 bg-slate-50/50">
      <PageHeader
        title="Purchase Orders"
        description="Manage and track your inventory restocking history."
        icon={Package}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search orders (#PO, supplier...)"
        primaryAction={{
          label: "New Order",
          onClick: () => navigate("/purchase/create"),
          icon: Plus
        }}
        toolbar={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2 transition-all bg-white border shadow-sm border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20">
              <Filter className="w-4 h-4 ml-1 text-slate-400" />
              <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                <SelectTrigger className="border-none shadow-none focus:ring-0 w-[140px] text-slate-700 font-medium h-9">
                  <SelectValue placeholder="All Suppliers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  {[...suppliers].sort((a, b) => a.name.localeCompare(b.name)).map(s => (
                    <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[300px]">
              <DateRangePicker 
                startDate={dateRange.start} 
                endDate={dateRange.end} 
                onChange={(start, end) => setDateRange({ start, end })}
                placeholder="Filter by date..."
              />
            </div>

            <ExportButton 
              data={filteredPurchases}
              filename={`purchase_orders_${new Date().toISOString().split('T')[0]}`}
              title="Purchase Orders Report"
              columns={[
                { header: 'Order ID', key: 'id' },
                { header: 'Supplier', key: 'supplier.name' },
                { header: 'Date', key: 'order_date' },
                { header: 'Items', key: 'items_count' },
                { header: 'Total Amount', key: 'total_amount', format: (v) => `Rs.${Number(v).toLocaleString()}` },
                { header: 'Status', key: 'status' }
              ]}
            />
          </div>
        }
      />

      <div className="p-8 pt-2 space-y-6">
        <PurchaseStatsCards purchases={purchases} totalSpent={totalSpent} thisMonthCount={thisMonthCount} />

        <PurchaseActivityTable
          isLoading={isLoading}
          filteredCount={filteredPurchases.length}
          purchases={paginatedPurchases}
          onViewDetails={viewDetails}
          getStatusBadge={getStatusBadge}
        />

      {filteredPurchases.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPurchases.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setCurrentPage(1)
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          showPageSize={true}
          showTotal={true}
          showFirstLast={true}
          variant="default"
          className="mx-8 mb-8 bg-white border rounded-3xl border-slate-200"
        />
      )}
      </div>

      <PurchaseDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        selectedPurchase={selectedPurchase}
        getStatusBadge={getStatusBadge}
      />
    </div>
  )
}


