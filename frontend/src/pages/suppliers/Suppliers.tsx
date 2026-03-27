import { LoadingState } from "@/components/ui/loading-state"
import { SuppliersHeader } from "./components/SuppliersHeader"
import { SuppliersDirectoryCard } from "./components/SuppliersDirectoryCard"
import { SuppliersDialogs } from "./components/SuppliersDialogs"
import { useSuppliersPageData } from "@/hooks/suppliers/useSuppliersPageData"

export default function Suppliers() {
  const {
    isLoading,
    refetchSuppliers,
    searchQuery,
    setSearchQuery,
    selectedBusiness,
    setSelectedBusiness,
    businessOptions,
    exportColumns,
    filteredSuppliers,
    paginatedSuppliers,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    isDialogOpen,
    setIsDialogOpen,
    selectedSupplier,
    isReadOnlyMode,
    securityDialogOpen,
    handleSecurityDialogOpenChange,
    pendingAction,
    deleteDialogOpen,
    setDeleteDialogOpen,
    deleting,
    openAddDialog,
    handleReview,
    handleEdit,
    handleDeleteRequest,
    handleSecurityVerified,
    confirmDelete,
  } = useSuppliersPageData()

  if (isLoading) return <LoadingState />

  return (
    <div className="flex-1 p-8 pt-6 space-y-4 bg-slate-50/50">
      <SuppliersHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedBusiness={selectedBusiness}
        onSelectedBusinessChange={setSelectedBusiness}
        businessOptions={businessOptions}
        filteredSuppliers={filteredSuppliers}
        exportColumns={exportColumns}
        onAddSupplier={openAddDialog}
      />

      <SuppliersDirectoryCard
        suppliers={filteredSuppliers}
        paginatedSuppliers={paginatedSuppliers}
        searchQuery={searchQuery}
        selectedBusiness={selectedBusiness}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setItemsPerPage}
        onAddSupplier={openAddDialog}
        onReview={handleReview}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <SuppliersDialogs
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedSupplier={selectedSupplier}
        refetchSuppliers={refetchSuppliers}
        isReadOnlyMode={isReadOnlyMode}
        securityDialogOpen={securityDialogOpen}
        onSecurityDialogOpenChange={handleSecurityDialogOpenChange}
        pendingAction={pendingAction}
        onSecurityVerified={handleSecurityVerified}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        confirmDelete={confirmDelete}
        deleting={deleting}
      />
    </div>
  )
}

