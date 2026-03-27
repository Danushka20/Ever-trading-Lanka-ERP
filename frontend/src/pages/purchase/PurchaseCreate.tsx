import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { PurchaseHeader } from "./components/PurchaseHeader"
import { PurchaseCreateForm } from "./components/PurchaseCreateForm"
import { usePurchaseCreateData } from "@/hooks/purchase/usePurchaseCreateData"

export default function PurchaseCreate() {
  const navigate = useNavigate()
  const {
    itemsList,
    suppliers,
    itemsLoading,
    suppliersLoading,
    isSubmitting,
    formData,
    currentItem,
    setCurrentItem,
    setSupplierId,
    setOrderDate,
    addItem,
    removeItem,
    updateItemPrice,
    submitPurchase,
  } = usePurchaseCreateData()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const success = await submitPurchase()
    if (success) {
      navigate("/purchase/list")
    }
  }

  if (itemsLoading || suppliersLoading) return (
    <div className="flex items-center justify-center p-12">
      <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
    </div>
  )

  return (
    <div className="flex-1 min-h-screen p-8 pt-6 space-y-6 bg-slate-50/50">
      <PurchaseHeader onBack={() => navigate("/purchase/list")} />

      <PurchaseCreateForm
        suppliers={suppliers}
        itemsList={itemsList}
        formData={formData}
        currentItem={currentItem}
        isSubmitting={isSubmitting}
        onSupplierChange={setSupplierId}
        onOrderDateChange={setOrderDate}
        onCurrentItemChange={setCurrentItem}
        onAddItem={addItem}
        onRemoveItem={removeItem}
        onUpdateLinePrice={updateItemPrice}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

