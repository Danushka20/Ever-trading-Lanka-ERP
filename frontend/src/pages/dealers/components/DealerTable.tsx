import { useMemo, useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Pencil, Trash2, Eye } from "lucide-react"
import { RowActionMenu } from "@/components/ui/action-menu"
import { Pagination } from "@/components/ui/pagination"
import type { DBDealer, DBSalesArea } from "@/lib/types"

type EnrichedDealer = DBDealer & {
  sales_area?: DBSalesArea;
}

interface DealerTableProps {
  dealers: EnrichedDealer[]
  loading: boolean
  onReview: (dealer: DBDealer) => void
  onEdit: (dealer: DBDealer) => void
  onDelete: (id: number) => void
}

export function DealerTable({ dealers, loading, onReview, onEdit, onDelete }: DealerTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  // Reset to first page when data changes (filtering)
  useEffect(() => {
    setCurrentPage(1)
  }, [dealers])

  const paginatedDealers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return dealers.slice(start, start + pageSize)
  }, [dealers, currentPage, pageSize])

  return (
    <div className="rounded-md border bg-white/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-100/50">
          <TableRow>
            <TableHead className="pl-6 font-semibold">Name & Contact</TableHead>
            <TableHead className="font-semibold">Sales Area</TableHead>
            <TableHead className="font-semibold">Main Town</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold">Financials</TableHead>
            <TableHead className="pr-6 font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-8 h-8 border-4 rounded-full border-blue-500/20 border-t-blue-500 animate-spin" />
                    <span>Loading dealers...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : dealers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-1">
                    <p className="text-lg font-medium text-gray-400">No dealers found.</p>
                    <p className="text-sm">Try adjusting your search or add a new dealer.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            paginatedDealers.map((dealer) => (
              <TableRow key={dealer.id} className="transition-colors hover:bg-slate-50/80">
                <TableCell className="pl-6">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">{dealer.name}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      {dealer.phone && (
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                            <Phone className="h-2.5 w-2.5 text-slate-400" /> {dealer.phone}
                        </span>
                      )}
                      {dealer.secondary_phone && (
                        <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium bg-emerald-50 px-1 rounded-sm border border-emerald-100">
                            <span className="text-[9px]">WA</span> {dealer.secondary_phone}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {dealer.sales_area ? (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50/50 rounded-full border border-blue-100 w-fit">
                       <MapPin className="w-3 h-3 text-blue-500" />
                       <span className="text-[11px] font-semibold text-blue-700">{dealer.sales_area.name}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] italic text-muted-foreground">No Area</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-slate-600">
                    {dealer.main_town || '—'}
                  </span>
                </TableCell>
                <TableCell>
                  {dealer.category ? (
                    <Badge variant="outline" className="px-2 py-0 font-bold text-[10px] text-blue-600 border-blue-100 rounded-md bg-white shadow-sm">
                      CAT {dealer.category}
                    </Badge>
                  ) : (
                    <span className="text-[11px] italic text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">Rs. {Number(dealer.credit_limit).toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 font-medium">Limit • {dealer.percentage}%</span>
                  </div>
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <RowActionMenu
                    actions={[
                      { label: "Review", icon: Eye, onClick: () => onReview(dealer) },
                      { label: "Edit", icon: Pencil, onClick: () => onEdit(dealer) },
                      { label: "Delete", icon: Trash2, onClick: () => onDelete(dealer.id), variant: "danger" }
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end p-4 border-t">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(dealers.length / pageSize)}
          totalItems={dealers.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          showPageSize={true}
          pageSizeOptions={[8, 16, 24, 32]}
        />
      </div>
    </div>
  )
}
