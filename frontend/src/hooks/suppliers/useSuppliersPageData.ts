import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBSupplier } from "@/lib/types"

type PendingAction = "edit" | "delete" | null

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
]

export function useSuppliersPageData() {
  const {
    data: suppliers = [],
    isLoading,
    delete: deleteSupplier,
    refetch: refetchSuppliers,
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
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedBusiness, itemsPerPage])

  const businessOptions = useMemo(
    () => [
      { value: "all", label: "All Businesses" },
      ...Array.from(new Set(suppliers.map((supplier) => supplier.name)))
        .sort()
        .map((name) => ({ value: name, label: name })),
    ],
    [suppliers]
  )

  const filteredSuppliers = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    return suppliers.filter((supplier) => {
      const matchesSearch =
        supplier.name.toLowerCase().includes(normalizedSearch) ||
        (supplier.contact_person?.toLowerCase().includes(normalizedSearch) ?? false) ||
        (supplier.email?.toLowerCase().includes(normalizedSearch) ?? false) ||
        (supplier.phone?.includes(searchQuery) ?? false) ||
        (supplier.secondary_phone?.includes(searchQuery) ?? false) ||
        (supplier.whatsapp_number?.includes(searchQuery) ?? false) ||
        (supplier.address_line1?.toLowerCase().includes(normalizedSearch) ?? false) ||
        (supplier.main_town?.toLowerCase().includes(normalizedSearch) ?? false) ||
        (supplier.tin_number?.toLowerCase().includes(normalizedSearch) ?? false)

      const matchesBusiness = selectedBusiness === "all" || supplier.name === selectedBusiness

      return matchesSearch && matchesBusiness
    })
  }, [suppliers, searchQuery, selectedBusiness])

  const paginatedSuppliers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredSuppliers.slice(start, start + itemsPerPage)
  }, [filteredSuppliers, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage)

  const confirmDelete = async () => {
    if (!supplierToDelete) return

    setDeleting(true)
    try {
      await deleteSupplier(supplierToDelete)
      toast.success("Supplier deleted successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to delete supplier")
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

  const handleSecurityDialogOpenChange = (open: boolean) => {
    setSecurityDialogOpen(open)
    if (!open) setPendingAction(null)
  }

  return {
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
  }
}
