import { DealerTable } from "./components/DealerTable"
import { DealersHeader } from "./components/DealersHeader"
import { DealersDialogs } from "./components/DealersDialogs"
import { useDealersPageData } from "@/hooks/dealers/useDealersPageData"

export default function Dealers() {
  const {
    loading,
    searchTerm,
    setSearchTerm,
    selectedArea,
    setSelectedArea,
    isDialogOpen,
    setIsDialogOpen,
    selectedDealer,
    isReadOnly,
    deleteDialogOpen,
    setDeleteDialogOpen,
    securityDialogOpen,
    setSecurityDialogOpen,
    deleting,
    areaOptions,
    exportColumns,
    filteredDealers,
    openAddDialog,
    handleReview,
    handleEdit,
    handleDeleteRequest,
    handleSecurityVerified,
    confirmDelete,
    fetchDealers,
  } = useDealersPageData()

  return (
    <div className="flex-1 min-h-screen p-8 pt-6 space-y-4 bg-slate-50/50">
      <DealersHeader
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        selectedArea={selectedArea}
        onSelectedAreaChange={setSelectedArea}
        areaOptions={areaOptions}
        exportData={filteredDealers}
        exportColumns={exportColumns}
        onAddDealer={openAddDialog}
      />

      <DealerTable 
        dealers={filteredDealers}
        loading={loading}
        onReview={handleReview}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <DealersDialogs
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedDealer={selectedDealer}
        fetchDealers={fetchDealers}
        isReadOnly={isReadOnly}
        securityDialogOpen={securityDialogOpen}
        setSecurityDialogOpen={setSecurityDialogOpen}
        onSecurityVerified={handleSecurityVerified}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        confirmDelete={confirmDelete}
        deleting={deleting}
      />
    </div>
  )
}

