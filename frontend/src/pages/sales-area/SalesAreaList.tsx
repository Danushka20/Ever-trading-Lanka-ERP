import { SalesAreaCardsGrid } from "./components/SalesAreaCardsGrid"
import { SalesAreaListHeader } from "./components/SalesAreaListHeader"
import { SalesAreaStatsAndSearch } from "./components/SalesAreaStatsAndSearch"
import { useSalesAreaListData } from "@/hooks/sales-area/useSalesAreaListData"

export default function SalesAreaList() {
  const {
    loading,
    searchTerm,
    setSearchTerm,
    filteredAreas,
    stats,
    handleDelete,
    goToAdd,
    goToEdit,
  } = useSalesAreaListData()

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-[#f8fafc]">
      <SalesAreaListHeader onCreate={goToAdd} />

      <SalesAreaStatsAndSearch
        stats={stats}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <SalesAreaCardsGrid
        loading={loading}
        areas={filteredAreas}
        onEdit={goToEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

