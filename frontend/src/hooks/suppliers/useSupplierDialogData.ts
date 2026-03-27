import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBSupplier } from "@/lib/types"

const initialSupplierFormData: Partial<DBSupplier> = {
  name: "",
  contact_person: "",
  email: "",
  phone: "",
  secondary_phone: "",
  whatsapp_number: "",
  address: "",
  address_line1: "",
  address_line2: "",
  address_line3: "",
  main_town: "",
  tax_id: "",
  tin_number: "",
}

interface UseSupplierDialogDataParams {
  open: boolean
  supplier?: DBSupplier | null
  onSuccess: () => void
  onOpenChange: (open: boolean) => void
}

export function useSupplierDialogData({
  open,
  supplier,
  onSuccess,
  onOpenChange,
}: UseSupplierDialogDataParams) {
  const { create, update } = useOfflineData<DBSupplier>("suppliers")

  const [formData, setFormData] = useState<Partial<DBSupplier>>(initialSupplierFormData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return

    if (supplier) {
      setFormData({ ...supplier })
      return
    }

    setFormData(initialSupplierFormData)
  }, [open, supplier])

  const handleInputChange = (field: keyof DBSupplier, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast.error("Business name is required")
      return
    }

    setLoading(true)
    try {
      if (supplier?.id) {
        await update(supplier.id, { ...formData, is_active: supplier.is_active })
        toast.success("Supplier updated successfully")
      } else {
        await create({ ...formData, is_active: true } as any)
        toast.success("Supplier created successfully")
      }
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      console.error("Submit error", err)
      toast.error(err.response?.data?.message || "Failed to save supplier")
    } finally {
      setLoading(false)
    }
  }

  return {
    formData,
    loading,
    handleInputChange,
    handleSubmit,
  }
}
