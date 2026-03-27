import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBDealer, DBSalesArea } from "@/lib/types"

const initialDealerFormData: Partial<DBDealer> = {
  name: "",
  email: "",
  phone: "",
  secondary_phone: "",
  fax_number: "",
  address_line1: "",
  address_line2: "",
  address_line3: "",
  main_town: "",
  category: "",
  sales_type: "",
  salesperson_id: "",
  sales_area_id: undefined,
  credit_limit: 0,
  percentage: 0,
  general_note: "",
  is_active: true,
}

interface UseDealerDialogDataParams {
  open: boolean
  dealer?: DBDealer | null
  onSuccess: () => void
  onOpenChange: (open: boolean) => void
}

export function useDealerDialogData({
  open,
  dealer,
  onSuccess,
  onOpenChange,
}: UseDealerDialogDataParams) {
  const { create, update } = useOfflineData<DBDealer>("dealers")
  const { data: areas = [] } = useOfflineData<DBSalesArea>("salesAreas")
  const { data: users = [] } = useOfflineData<any>("users")

  const [formData, setFormData] = useState<Partial<DBDealer>>(initialDealerFormData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return

    if (dealer) {
      setFormData({
        ...dealer,
        category: dealer.category || "",
        sales_area_id: dealer.sales_area_id ? Number(dealer.sales_area_id) : undefined,
        salesperson_id: dealer.salesperson_id ? String(dealer.salesperson_id) : "",
      })
      return
    }

    setFormData(initialDealerFormData)
  }, [open, dealer])

  const selectedArea = useMemo(() => {
    return areas.find((area) => area.id === formData.sales_area_id)
  }, [areas, formData.sales_area_id])

  const handleInputChange = (field: keyof DBDealer, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      toast.error("Name is required")
      return
    }
    if (!formData.category) {
      toast.error("Dealer category is required")
      return
    }

    setLoading(true)
    try {
      if (dealer?.id) {
        await update(dealer.id, formData)
        toast.success("Dealer updated successfully")
      } else {
        await create(formData as any)
        toast.success("Dealer created successfully")
      }
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to save dealer")
    } finally {
      setLoading(false)
    }
  }

  return {
    formData,
    loading,
    areas,
    users,
    selectedArea,
    handleInputChange,
    handleSubmit,
  }
}
