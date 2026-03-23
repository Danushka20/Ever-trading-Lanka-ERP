import { useState, useMemo, useEffect } from "react"
import { Plus, Phone, MapPin, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { SecurityCodeDialog } from "@/components/SecurityCodeDialog"
import PageHeader from "@/components/ui/page-header"
import { LoadingState } from "@/components/ui/loading-state"
import { EmptyState } from "@/components/ui/empty-state"
import { RowActionMenu } from "@/components/ui/action-menu"
import { SupplierDialog } from "./SupplierDialog"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBSupplier } from "@/lib/types"
import { ExportButton } from "@/components/ExportButton"
import { SearchableFilter } from "@/components/SearchableFilter"

export default function Suppliers() {
  const { 
    data: suppliers = [], 
    isLoading, 
    delete: deleteSupplier,
    refetch: refetchSuppliers
  } = useOfflineData<DBSupplier>("suppliers")

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBusiness, setSelectedBusiness] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<DBSupplier | null>(null)
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false)
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  
  const [securityDialogOpen, setSecurityDialogOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<"edit" | "delete" | null>(null)

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBusiness, itemsPerPage]);

  const businessOptions = useMemo(() => [
    { value: "all", label: "All Businesses" },
    ...Array.from(new Set(suppliers.map(s => s.name)))
      .sort()
      .map(name => ({ value: name, label: name }))
  ], [suppliers])

  const exportColumns = [
    { header: "Business Name", key: "name" },
    { header: "Contact Person", key: "contact_person" },
    { header: "Phone", key: "phone" },
    { header: "Secondary Phone", key: "secondary_phone" },
    { header: "WhatsApp", key: "whatsapp_number" },
    { header: "Email", key: "email" },
    { header: "Address L1", key: "address_line1" },
    { header: "Address L2", key: "address_line2" },
    { header: "Address L3", key: "address_line3" },
    { header: "Main Town", key: "main_town" },
    { header: "Tax ID", key: "tax_id" },
    { header: "TIN", key: "tin_number" },
  ];

  const confirmDelete = async () => {
    if (!supplierToDelete) return
    setDeleting(true)
    try {
      await deleteSupplier(supplierToDelete)
      toast.success("Supplier deleted successfully")
    } catch (e: any) { 
      toast.error(e.message || "Failed to delete supplier") 
    } finally { 
      setDeleting(false)
      setDeleteDialogOpen(false)
      setSupplierToDelete(null) 
    }
  }

  const handleEdit = (supplier: DBSupplier) => {
    setSelectedSupplier(supplier)
    setIsReadOnlyMode(false)
    setPendingAction("edit")
    setSecurityDialogOpen(true)
  }

  const handleDeleteRequest = (id: number) => {
    setSupplierToDelete(id)
    setPendingAction("delete")
    setSecurityDialogOpen(true)
  }

  const handleSecurityVerified = () => {
    if (pendingAction === "edit") {
      setIsDialogOpen(true)
    } else if (pendingAction === "delete") {
      setDeleteDialogOpen(true)
    }
    setPendingAction(null)
  }

  const handleReview = (supplier: DBSupplier) => {
    setSelectedSupplier(supplier)
    setIsReadOnlyMode(true)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => { 
    setSelectedSupplier(null)
    setIsReadOnlyMode(false)
    setIsDialogOpen(true) 
  }

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (s.phone?.includes(searchQuery) ?? false) ||
        (s.secondary_phone?.includes(searchQuery) ?? false) ||
        (s.whatsapp_number?.includes(searchQuery) ?? false) ||
        (s.address_line1?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (s.main_town?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (s.tin_number?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      const matchesBusiness = selectedBusiness === "all" || s.name === selectedBusiness;

      return matchesSearch && matchesBusiness;
    })
  }, [suppliers, searchQuery, selectedBusiness])

  const paginatedSuppliers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSuppliers.slice(start, start + itemsPerPage);
  }, [filteredSuppliers, currentPage]);

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  if (isLoading) return <LoadingState />

  return (
    <div className="flex-1 p-8 pt-6 space-y-4 bg-slate-50/50">
      <PageHeader 
        title="Suppliers" 
        description="Manage your suppliers, contact information and credentials." 
        searchValue={searchQuery} 
        onSearchChange={setSearchQuery} 
        searchPlaceholder="Search suppliers..."
        showSearch
        primaryAction={{
          label: "Add New Supplier",
          icon: Plus,
          onClick: openAddDialog
        }}
        toolbar={
          <div className="flex items-center gap-3">
             <SearchableFilter 
               options={businessOptions}
               value={selectedBusiness}
               onChange={setSelectedBusiness}
               label="Business:"
               placeholder="All Businesses"
               searchPlaceholder="Search business..."
             />
             <ExportButton 
               data={filteredSuppliers} 
               filename="Suppliers_List" 
               columns={exportColumns}
               title="Supplier Directory"
             />
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Supplier Directory</CardTitle>
          <CardDescription>A complete list of your wholesale suppliers and partners.</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSuppliers.length === 0 ? (
            <EmptyState 
              variant={searchQuery || selectedBusiness !== 'all' ? "search" : "default"} 
              title="No suppliers found" 
              description={searchQuery || selectedBusiness !== 'all' ? "Try adjusting your filters or search term." : "Add your first supplier to get started."} 
              action={{ label: "Add Supplier", onClick: openAddDialog }}
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
                        <span className="truncate text-slate-600 max-w-37">
                          {supplier.contact_person || "N/A"}
                        </span>
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
                            {[
                              supplier.address_line1,
                              supplier.address_line2,
                              supplier.address_line3
                            ].filter(Boolean).join(", ") || supplier.address || "N/A"}
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
                      <RowActionMenu actions={[
                        { label: "Review", onClick: () => handleReview(supplier) },
                        { label: "Edit", onClick: () => handleEdit(supplier) },
                        { label: "Delete", onClick: () => handleDeleteRequest(supplier.id), variant: "danger" }
                      ]} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-end p-4 border-t">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredSuppliers.length}
                pageSize={itemsPerPage}
                onPageSizeChange={setItemsPerPage}
                showPageSize
                pageSizeOptions={[8, 16, 24, 32]}
              />
            </div>
          </>
          )}
        </CardContent>
      </Card>

      <SupplierDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        supplier={selectedSupplier}
        onSuccess={refetchSuppliers}
        readOnly={isReadOnlyMode}
      />

      <SecurityCodeDialog
        open={securityDialogOpen}
        onOpenChange={(open) => {
          setSecurityDialogOpen(open)
          if (!open) setPendingAction(null)
        }}
        onVerified={handleSecurityVerified}
        title={pendingAction === "delete" ? "Confirm Deletion" : "Verify access"}
        description={
            pendingAction === "delete"
              ? "Enter security code to delete this supplier."
              : "Enter security code to edit this supplier."
        }
      />

      <ConfirmDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        title="Delete Supplier" 
        description="Are you sure you want to delete this supplier? This action cannot be undone and may affect associated purchase orders." 
        confirmText="Delete Supplier" 
        cancelText="Cancel" 
        onConfirm={confirmDelete} 
        variant="danger" 
        loading={deleting} 
      />
    </div>
  )
}

