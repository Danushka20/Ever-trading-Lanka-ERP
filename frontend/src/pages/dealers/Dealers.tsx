import { useState, useMemo } from "react"
import { Plus } from "lucide-react"
import { DealerDialog } from "./DealerDialog"
import { DealerTable } from "./components/DealerTable"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { SecurityCodeDialog } from "@/components/SecurityCodeDialog"
import { toast } from "sonner"
import { PageHeader } from "@/components/ui/page-header"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBDealer, DBSalesArea, DBUser } from "@/lib/types"
import { ExportButton } from "@/components/ExportButton"
import { SearchableFilter } from "@/components/SearchableFilter"

export default function Dealers() {
  const { 
    data: dealers = [], 
    isLoading: loading, 
    delete: deleteDealer,
    refetch: fetchDealers 
  } = useOfflineData<DBDealer>("dealers")

  const { data: areas = [] } = useOfflineData<DBSalesArea>("salesAreas")
  const { data: users = [] } = useOfflineData<DBUser>("users")

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDealer, setSelectedDealer] = useState<DBDealer | null>(null)
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [securityDialogOpen, setSecurityDialogOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<"edit" | "delete" | null>(null)
  const [dealerToDelete, setDealerToDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const areaOptions = useMemo(() => [
    { value: "all", label: "All Areas" },
    ...areas.map((area) => ({
      value: String(area.id),
      label: area.name,
    })),
  ], [areas])

  const handleEdit = (dealer: DBDealer) => {
    setSelectedDealer(dealer)
    setIsReadOnly(false)
    setPendingAction("edit")
    setSecurityDialogOpen(true)
  }

  const handleReview = (dealer: DBDealer) => {
    setSelectedDealer(dealer)
    setIsReadOnly(true)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setSelectedDealer(null)
    setIsReadOnly(false)
    setIsDialogOpen(true)
  }

  const handleDeleteRequest = (id: number) => {
    setDealerToDelete(id)
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

  const exportColumns = [
    { header: "Name", key: "name" },
    { header: "Phone", key: "phone" },
    { header: "W. App", key: "secondary_phone" },
    { header: "Town", key: "main_town" },
    { header: "Add. L1", key: "address_line1" },
    { header: "Add. L2", key: "address_line2" },
    { header: "Add. L3", key: "address_line3" },
    { header: "Area", key: "sales_area.name" },
    { header: "Cat.", key: "category" },
    { header: "Credit", key: "credit_limit" },
    { header: "%", key: "percentage" },
    { header: "Email", key: "email" },
    { header: "Status", key: "is_active" },
  ];

  const confirmDelete = async () => {
    if (!dealerToDelete) return
    setDeleting(true)
    try { 
      await deleteDealer(dealerToDelete)
      toast.success("Dealer deleted") 
    }
    catch (e: any) { 
      toast.error(e.message || "Failed to delete dealer") 
    }
    finally { 
      setDeleting(false)
      setDeleteDialogOpen(false)
      setDealerToDelete(null) 
    }
  }

  const enrichedDealers = useMemo(() => {
    return dealers.map(dealer => ({
      ...dealer,
      sales_area: areas.find(a => a.id === dealer.sales_area_id),
      sales_person: users.find(u => u.id === Number(dealer.salesperson_id))
    }))
  }, [dealers, areas, users])

  const filteredDealers = useMemo(() => {
    return enrichedDealers.filter((d) => {
      const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone?.includes(searchTerm) ||
        d.sales_area?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.main_town?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesArea = selectedArea === "all" || String(d.sales_area_id) === selectedArea;

      return matchesSearch && matchesArea;
    })
  }, [enrichedDealers, searchTerm, selectedArea])

  return (
    <div className="flex-1 min-h-screen p-8 pt-6 space-y-4 bg-slate-50/50">
      <PageHeader 
        title="Dealers" 
        description="Manage your dealer network, sales areas and credit limits." 
        searchValue={searchTerm} 
        onSearchChange={setSearchTerm} 
        searchPlaceholder="Search dealers..."
        showSearch
        primaryAction={{
          label: "Add New Dealer",
          icon: Plus,
          onClick: openAddDialog
        }}
        toolbar={
          <div className="flex items-center gap-3">
             <SearchableFilter 
               options={areaOptions}
               value={selectedArea}
               onChange={setSelectedArea}
               label="Area:"
               placeholder="All Areas"
               searchPlaceholder="Search areas..."
             />
             <ExportButton 
               data={filteredDealers} 
               filename="Dealers_List" 
               columns={exportColumns}
               title="Dealer Network Report"
             />
          </div>
        }
      />

      <DealerTable 
        dealers={filteredDealers}
        loading={loading}
        onReview={handleReview}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <DealerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        dealer={selectedDealer}
        onSuccess={fetchDealers}
        readOnly={isReadOnly}
      />

      <SecurityCodeDialog
        open={securityDialogOpen}
        onOpenChange={setSecurityDialogOpen}
        onVerified={handleSecurityVerified}
        expectedCode="1234"
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Dealer"
        description="Are you sure you want to delete this dealer? This action cannot be undone."
        confirmText="Delete Dealer"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}

