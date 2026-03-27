import { PurchaseDetailsDialog } from "@/components/purchase/PurchaseDetailsDialog"
import { PurchaseListContent } from "@/components/purchase/list/PurchaseListContent"
import { PurchaseListHeader } from "@/components/purchase/list/PurchaseListHeader"
import { getPurchaseStatusBadge } from "@/components/purchase/list/PurchaseStatusBadge"
import { usePurchaseListData } from "@/hooks/purchase/usePurchaseListData"

export default function PurchaseList() {
  const {
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
  } = usePurchaseListData()

  return (
    <div className="flex-1 min-h-screen space-y-4 bg-slate-50/50">
      <PurchaseListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        supplierFilter={supplierFilter}
        onSupplierFilterChange={setSupplierFilter}
        suppliers={suppliers}
        dateRange={dateRange}
        onDateRangeChange={(start, end) => setDateRange({ start, end })}
        filteredPurchases={filteredPurchases}
      />

      <PurchaseListContent
        purchases={purchases}
        totalSpent={totalSpent}
        thisMonthCount={thisMonthCount}
        isLoading={isLoading}
        filteredCount={filteredPurchases.length}
        paginatedPurchases={paginatedPurchases}
        onViewDetails={viewDetails}
        getStatusBadge={getPurchaseStatusBadge}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <PurchaseDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        selectedPurchase={selectedPurchase}
        getStatusBadge={getPurchaseStatusBadge}
      />
    </div>
  )
}


