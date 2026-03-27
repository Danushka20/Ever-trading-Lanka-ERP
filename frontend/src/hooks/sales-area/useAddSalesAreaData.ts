import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { useOfflineData, useOfflineQueryById } from "@/hooks/useOfflineData"
import type { DBSalesArea } from "@/lib/types"

export function useAddSalesAreaData() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const areaId = isEdit ? Number(id) : null

  const { create, update } = useOfflineData<DBSalesArea>("salesAreas")
  const { data: area, isLoading: fetching } = useOfflineQueryById<DBSalesArea>("salesAreas", areaId)

  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!area) return

    setName(area.name)
    setCity(area.city || "")
  }, [area])

  const goToList = () => navigate("/sales-area/list")

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter an area name")
      return
    }

    setLoading(true)
    try {
      if (isEdit && areaId) {
        await update(areaId, { name, city })
        toast.success("Area updated successfully")
      } else {
        await create({ name, city, description: "" } as any)
        toast.success("Area created successfully")
      }
      goToList()
    } catch (error) {
      console.error("Failed to save area:", error)
      toast.error("Error saving area.")
    } finally {
      setLoading(false)
    }
  }

  return {
    isEdit,
    name,
    setName,
    city,
    setCity,
    loading,
    fetching,
    handleSave,
    goToList,
  }
}
