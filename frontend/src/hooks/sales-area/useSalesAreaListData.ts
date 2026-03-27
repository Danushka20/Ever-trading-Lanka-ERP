import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBDealer, DBSalesArea } from "@/lib/types"

export type EnrichedSalesArea = DBSalesArea & {
  dealers_count: number
}

export function useSalesAreaListData() {
  const { data: areas = [], isLoading: loading, delete: deleteArea } = useOfflineData<DBSalesArea>("salesAreas")
  const { data: dealers = [] } = useOfflineData<DBDealer>("dealers")
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this sales area?")
    if (!confirmed) return

    try {
      await deleteArea(id)
      toast.success("Sales area deleted")
    } catch (error: any) {
      console.error("Failed to delete area:", error)
      toast.error(error.message || "Error deleting area.")
    }
  }

  const enrichedAreas = useMemo<EnrichedSalesArea[]>(() => {
    return areas.map((area) => ({
      ...area,
      dealers_count: dealers.filter((dealer) => dealer.sales_area_id === area.id).length,
    }))
  }, [areas, dealers])

  const filteredAreas = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return enrichedAreas.filter((area) => {
      return (
        area.name.toLowerCase().includes(normalizedSearch) ||
        area.city?.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [enrichedAreas, searchTerm])

  const stats = useMemo(
    () => ({
      total: areas.length,
      withCity: areas.filter((area) => area.city).length,
      totalDealers: dealers.length,
    }),
    [areas, dealers]
  )

  return {
    loading,
    searchTerm,
    setSearchTerm,
    filteredAreas,
    stats,
    handleDelete,
    goToAdd: () => navigate("/sales-area/add"),
    goToEdit: (id: number) => navigate(`/sales-area/edit/${id}`),
  }
}
