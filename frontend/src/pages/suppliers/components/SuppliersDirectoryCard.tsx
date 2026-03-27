import { MapPin, Phone, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Pagination } from "@/components/ui/pagination"
import { RowActionMenu } from "@/components/ui/action-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { DBSupplier } from "@/lib/types"

interface SuppliersDirectoryCardProps {
  suppliers: DBSupplier[]
  paginatedSuppliers: DBSupplier[]
  searchQuery: string
  selectedBusiness: string
  currentPage: number
  totalPages: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onAddSupplier: () => void
  onReview: (supplier: DBSupplier) => void
  onEdit: (supplier: DBSupplier) => void
  onDelete: (supplierId: number) => void
}

export function SuppliersDirectoryCard({
  suppliers,
  paginatedSuppliers,
  searchQuery,
  selectedBusiness,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  onAddSupplier,
  onReview,
  onEdit,
  onDelete,
}: SuppliersDirectoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supplier Directory</CardTitle>
        <CardDescription>A complete list of your wholesale suppliers and partners.</CardDescription>
      </CardHeader>
      <CardContent>
        {suppliers.length === 0 ? (
          <EmptyState
            variant={searchQuery || selectedBusiness !== "all" ? "search" : "default"}
            title="No suppliers found"
            description={
              searchQuery || selectedBusiness !== "all"
                ? "Try adjusting your filters or search term."
                : "Add your first supplier to get started."
            }
            action={{ label: "Add Supplier", onClick: onAddSupplier }}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Contact Person Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>WhatsApp Number</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="pr-6 text-right w-25">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-semibold text-slate-900 whitespace-nowrap">{supplier.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 shrink-0">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="truncate text-slate-600 max-w-37">{supplier.contact_person || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {supplier.phone || "N/A"}
                        </div>
                        {supplier.secondary_phone && (
                          <span className="pl-5 text-xs text-slate-500">{supplier.secondary_phone}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 w-fit text-xs font-medium border border-emerald-100">
                        <Phone className="w-3 h-3" />
                        {supplier.whatsapp_number || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-1.5 max-w-55">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="text-xs truncate text-slate-700">
                            {[supplier.address_line1, supplier.address_line2, supplier.address_line3]
                              .filter(Boolean)
                              .join(", ") || supplier.address || "N/A"}
                          </span>
                          {supplier.main_town && (
                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                              {supplier.main_town}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <RowActionMenu
                        actions={[
                          { label: "Review", onClick: () => onReview(supplier) },
                          { label: "Edit", onClick: () => onEdit(supplier) },
                          { label: "Delete", onClick: () => onDelete(supplier.id), variant: "danger" },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-end p-4 border-t">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                totalItems={suppliers.length}
                pageSize={itemsPerPage}
                onPageSizeChange={onPageSizeChange}
                showPageSize
                pageSizeOptions={[8, 16, 24, 32]}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
