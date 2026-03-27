import { AddSalesAreaHeader } from "./components/AddSalesAreaHeader"
import { SalesAreaConfigCard } from "./components/SalesAreaConfigCard"
import { AddSalesAreaTip } from "./components/AddSalesAreaTip"
import { useAddSalesAreaData } from "@/hooks/sales-area/useAddSalesAreaData"

export default function AddSalesArea() {
  const {
    isEdit,
    name,
    setName,
    city,
    setCity,
    loading,
    fetching,
    handleSave,
    goToList,
  } = useAddSalesAreaData()

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 min-h-screen bg-[#f8fafc]/50">
      <div className="max-w-2xl mx-auto space-y-6">
        <AddSalesAreaHeader isEdit={isEdit} onBack={goToList} />

        <SalesAreaConfigCard
          isEdit={isEdit}
          fetching={fetching}
          name={name}
          onNameChange={setName}
          city={city}
          onCityChange={setCity}
          loading={loading}
          onSave={handleSave}
          onDiscard={goToList}
        />

        {!isEdit && <AddSalesAreaTip />}
      </div>
    </div>
  )
}

