import { useMemo, useState } from "react"
import { toast } from "sonner"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBCategory, DBItem } from "@/lib/types"

export function useItemsPageData() {
  const {
    data: items,
    isLoading: itemsLoading,
    delete: deleteItem,
    refetch: refetchItems,
  } = useOfflineData<DBItem>("items")

  const {
    data: categories,
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = useOfflineData<DBCategory>("categories")

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const [itemDialogOpen, setItemDialogOpen] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DBItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<DBCategory | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleEdit = (item: DBItem) => {
    setSelectedItem(item)
    setItemDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!itemToDelete) return
    setDeleting(true)
    try {
      await deleteItem(itemToDelete)
      toast.success("Item deleted successfully")
    } catch (e: any) {
      toast.error(e.message || "Failed to delete item")
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const openAddItem = () => {
    setSelectedItem(null)
    setItemDialogOpen(true)
  }

  const openAddCategory = () => {
    setSelectedCategory(null)
    setCategoryDialogOpen(true)
  }

  const requestDelete = (id: number) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return items.filter((item) => {
      const name = item.name?.toLowerCase() || ""
      const sku = item.sku?.toLowerCase() || ""
      const barcode = item.barcode?.toLowerCase() || ""

      const matchesSearch =
        !normalizedQuery ||
        name.includes(normalizedQuery) ||
        sku.includes(normalizedQuery) ||
        barcode.includes(normalizedQuery)

      const matchesCategory =
        categoryFilter === "all" || item.category_id?.toString() === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [items, searchQuery, categoryFilter])

  const isLoading = itemsLoading || categoriesLoading

  return {
    items,
    categories,
    isLoading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    itemDialogOpen,
    setItemDialogOpen,
    categoryDialogOpen,
    setCategoryDialogOpen,
    selectedItem,
    selectedCategory,
    deleteDialogOpen,
    setDeleteDialogOpen,
    deleting,
    openAddItem,
    openAddCategory,
    handleEdit,
    handleDelete,
    requestDelete,
    filteredItems,
    refetchItems,
    refetchCategories,
  }
}
