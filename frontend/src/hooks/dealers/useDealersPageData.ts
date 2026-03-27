import { useMemo, useState } from "react"
import { toast } from "sonner"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBDealer, DBSalesArea, DBUser } from "@/lib/types"

type PendingAction = "edit" | "delete" | null

type EnrichedDealer = DBDealer & {
  sales_area?: DBSalesArea
  sales_person?: DBUser
}

export function useDealersPageData() {
  const {
    data: dealers = [],
    isLoading: loading,
    delete: deleteDealer,
    refetch: fetchDealers,
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
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [dealerToDelete, setDealerToDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const areaOptions = useMemo(
    () => [
      { value: "all", label: "All Areas" },
      ...areas.map((area) => ({
        value: String(area.id),
        label: area.name,
      })),
    ],
    [areas]
  )

  const exportColumns = useMemo(
    () => [
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
    ],
    []
  )

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

  const confirmDelete = async () => {
    if (!dealerToDelete) return
    setDeleting(true)
    try {
      await deleteDealer(dealerToDelete)
      toast.success("Dealer deleted")
    } catch (error: any) {
      toast.error(error.message || "Failed to delete dealer")
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setDealerToDelete(null)
    }
  }

  const enrichedDealers = useMemo<EnrichedDealer[]>(() => {
    return dealers.map((dealer) => ({
      ...dealer,
      sales_area: areas.find((area) => area.id === dealer.sales_area_id),
      sales_person: users.find((user) => user.id === Number(dealer.salesperson_id)),
    }))
  }, [dealers, areas, users])

  const filteredDealers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return enrichedDealers.filter((dealer) => {
      const matchesSearch =
        dealer.name.toLowerCase().includes(normalizedSearch) ||
        dealer.phone?.includes(searchTerm) ||
        dealer.sales_area?.name?.toLowerCase().includes(normalizedSearch) ||
        dealer.main_town?.toLowerCase().includes(normalizedSearch)

      const matchesArea = selectedArea === "all" || String(dealer.sales_area_id) === selectedArea

      return matchesSearch && matchesArea
    })
  }, [enrichedDealers, searchTerm, selectedArea])

  return {
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
  }
}
