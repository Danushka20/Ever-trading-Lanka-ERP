import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBCategory } from "@/lib/types"

export interface CategoryFormData {
  name: string
  category_number: string
  description: string
}

interface UseCategoryDialogDataParams {
  open: boolean
  category?: DBCategory | null
  onSuccess: () => void
  onOpenChange: (open: boolean) => void
}

export function useCategoryDialogData({
  open,
  category,
  onSuccess,
  onOpenChange,
}: UseCategoryDialogDataParams) {
  const {
    create: createCategory,
    update: updateCategory,
    delete: deleteCategory,
  } = useOfflineData<DBCategory>("categories")

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    category_number: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!open) return

    if (category) {
      setFormData({
        name: category.name,
        category_number: category.category_number || "",
        description: category.description || "",
      })
      return
    }

    setFormData({ name: "", category_number: "", description: "" })
  }, [open, category])

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = { ...formData }

      if (category?.id) {
        await updateCategory(category.id, payload)
        toast.success("Category updated successfully")
      } else {
        await createCategory(payload)
        toast.success("Category created successfully")
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      console.error("Submit error", err)
      toast.error(err.response?.data?.message || "Failed to save category")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!category?.id) return

    const confirmed = window.confirm("Are you sure you want to delete this category?")
    if (!confirmed) return

    setDeleting(true)
    try {
      await deleteCategory(category.id)
      toast.success("Category deleted successfully")
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      console.error("Delete error", err)
      toast.error(err.response?.data?.message || "Failed to delete category")
    } finally {
      setDeleting(false)
    }
  }

  return {
    formData,
    loading,
    deleting,
    handleInputChange,
    handleSubmit,
    handleDelete,
  }
}
