import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBCategory, DBItem } from "@/lib/types"

export interface ItemFormData {
  name: string
  sku: string
  category_id: string
  unit_id: string
  buy_price: number
  unit_price: number
  description: string
  reorder_level: number
  is_active: boolean
}

interface UseItemDialogDataParams {
  open: boolean
  item?: DBItem | null
  onSuccess: () => void
  onOpenChange: (open: boolean) => void
}

export function useItemDialogData({ open, item, onSuccess, onOpenChange }: UseItemDialogDataParams) {
  const { create: createItem, update: updateItem } = useOfflineData<DBItem>("items")
  const { data: categories, delete: deleteCategory } = useOfflineData<DBCategory>("categories")

  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    sku: "",
    category_id: "",
    unit_id: "",
    buy_price: 0,
    unit_price: 0,
    description: "",
    reorder_level: 0,
    is_active: true,
  })

  const [loading, setLoading] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [categoryDeleteDialogOpen, setCategoryDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    if (item) {
      setFormData({
        name: item.name,
        sku: item.sku || "",
        category_id: item.category_id?.toString() || "",
        unit_id: item.unit_id?.toString() || "",
        buy_price: Number(item.buy_price || 0),
        unit_price: Number(item.unit_price || 0),
        description: item.description || "",
        reorder_level: item.reorder_level || 0,
        is_active: !!item.is_active,
      })
      return
    }

    setFormData({
      name: "",
      sku: "",
      category_id: "",
      unit_id: "",
      buy_price: 0,
      unit_price: 0,
      description: "",
      reorder_level: 0,
      is_active: true,
    })
  }, [open, item])

  const handleInputChange = (field: keyof ItemFormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload: Partial<DBItem> = {
        ...formData,
        sku: formData.sku || undefined,
        category_id: formData.category_id ? parseInt(formData.category_id) : undefined,
        unit_id: formData.unit_id ? parseInt(formData.unit_id) : undefined,
        buy_price: Number(formData.buy_price || 0),
        unit_price: Number(formData.unit_price || 0),
        total_stock: item?.total_stock || 0,
      }

      if (item?.id) {
        await updateItem(item.id, payload)
        toast.success("Item updated successfully")
      } else {
        await createItem(payload)
        toast.success("Item created successfully")
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      console.error("Submit error", err)
      toast.error(err.response?.data?.message || "Failed to save item")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = () => {
    if (!formData.category_id) {
      toast.error("Select a category to delete")
      return
    }

    const selectedCategory = categories.find((cat) => cat.id?.toString() === formData.category_id)
    if (!selectedCategory?.id) {
      toast.error("Selected category not found")
      return
    }

    setCategoryDeleteDialogOpen(true)
  }

  const confirmDeleteCategory = async () => {
    const selectedCategory = categories.find((cat) => cat.id?.toString() === formData.category_id)
    if (!selectedCategory?.id) {
      toast.error("Selected category not found")
      setCategoryDeleteDialogOpen(false)
      return
    }

    setDeletingCategory(true)
    try {
      await deleteCategory(selectedCategory.id)
      setFormData((prev) => ({ ...prev, category_id: "" }))
      toast.success("Category deleted successfully")
      setCategoryDeleteDialogOpen(false)
    } catch (err: any) {
      console.error("Delete category error", err)
      toast.error(err.response?.data?.message || "Failed to delete category")
    } finally {
      setDeletingCategory(false)
    }
  }

  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({
      value: cat.id.toString(),
      label: cat.name,
    }))
  }, [categories])

  return {
    formData,
    loading,
    deletingCategory,
    categoryDialogOpen,
    setCategoryDialogOpen,
    categoryDeleteDialogOpen,
    setCategoryDeleteDialogOpen,
    handleInputChange,
    handleSubmit,
    handleDeleteCategory,
    confirmDeleteCategory,
    categoryOptions,
  }
}
