import type { ReactNode } from "react"
import { Pagination } from "@/components/ui/pagination"
import { PurchaseStatsCards } from "@/components/purchase/PurchaseStatsCards"
import { PurchaseActivityTable } from "@/components/purchase/PurchaseActivityTable"
import type { DBPurchaseOrder } from "@/lib/types"

interface PurchaseListContentProps {
  purchases: DBPurchaseOrder[]
  totalSpent: number
  thisMonthCount: number
  isLoading: boolean
  filteredCount: number
  paginatedPurchases: DBPurchaseOrder[]
  onViewDetails: (purchase: DBPurchaseOrder) => void
  getStatusBadge: (status: string) => ReactNode
  currentPage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function PurchaseListContent({
  purchases,
  totalSpent,
  thisMonthCount,
  isLoading,
  filteredCount,
  paginatedPurchases,
  onViewDetails,
  getStatusBadge,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PurchaseListContentProps) {
  return (
    <div className="p-8 pt-2 space-y-6">
      <PurchaseStatsCards purchases={purchases} totalSpent={totalSpent} thisMonthCount={thisMonthCount} />

      <PurchaseActivityTable
        isLoading={isLoading}
        filteredCount={filteredCount}
        purchases={paginatedPurchases}
        onViewDetails={onViewDetails}
        getStatusBadge={getStatusBadge}
      />

      {filteredCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={(newSize) => {
            onPageSizeChange(newSize)
            onPageChange(1)
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
  )
}
