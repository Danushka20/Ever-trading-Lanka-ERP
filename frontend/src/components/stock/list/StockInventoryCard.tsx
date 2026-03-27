import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { StockListToolbar, type StockExportRow } from "@/components/stock/StockListToolbar"
import { StockListTable, type StockDisplayRow } from "@/components/stock/StockListTable"

interface StockInventoryCardProps {
  loading: boolean
  rows: StockDisplayRow[]
  searchQuery: string
  onSearchChange: (value: string) => void
  itemCodeFilter: string
  onItemCodeFilterChange: (value: string) => void
  itemCodeOptions: string[]
  exportRows: StockExportRow[]
}

export function StockInventoryCard({
  loading,
  rows,
  searchQuery,
  onSearchChange,
  itemCodeFilter,
  onItemCodeFilterChange,
  itemCodeOptions,
  exportRows,
}: StockInventoryCardProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, itemCodeFilter])

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return rows.slice(start, start + pageSize)
  }, [rows, currentPage, pageSize])

  useEffect(() => {
    if (rows.length === 0) {
      setCurrentPage(1)
      return
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [rows.length, currentPage, totalPages])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Levels</CardTitle>
        <CardDescription>View consolidated stock levels for each product across all batches.</CardDescription>
        <StockListToolbar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          itemCodeFilter={itemCodeFilter}
          onItemCodeFilterChange={onItemCodeFilterChange}
          itemCodeOptions={itemCodeOptions}
          exportRows={exportRows}
        />
      </CardHeader>
      <CardContent>
        <StockListTable loading={loading} rows={paginatedRows} />

        {!loading && rows.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={rows.length}
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
            className="mt-4 border rounded-2xl border-slate-200"
          />
        )}
      </CardContent>
    </Card>
  )
}
