import type { DBItem, DBSupplier } from "@/lib/types"
import { PurchaseInfoCard } from "./PurchaseInfoCard"
import { PurchaseSummaryCard } from "./PurchaseSummaryCard"
import { PurchaseLineItemsCard } from "./PurchaseLineItemsCard"
import type { PurchaseFormData, PurchaseItemInput } from "../types"

interface PurchaseCreateFormProps {
  suppliers: DBSupplier[]
  itemsList: DBItem[]
  formData: PurchaseFormData
  currentItem: PurchaseItemInput
  isSubmitting: boolean
  onSupplierChange: (value: string) => void
  onOrderDateChange: (value: string) => void
  onCurrentItemChange: (item: PurchaseItemInput) => void
  onAddItem: () => void
  onRemoveItem: (index: number) => void
  onUpdateLinePrice: (index: number, field: "unit_price" | "selling_price", price: number) => void
  onSubmit: (e: React.FormEvent) => void
}

export function PurchaseCreateForm({
  suppliers,
  itemsList,
  formData,
  currentItem,
  isSubmitting,
  onSupplierChange,
  onOrderDateChange,
  onCurrentItemChange,
  onAddItem,
  onRemoveItem,
  onUpdateLinePrice,
  onSubmit,
}: PurchaseCreateFormProps) {
  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-3">
        <PurchaseInfoCard
          suppliers={suppliers}
          supplierId={formData.supplier_id}
          orderDate={formData.order_date}
          onSupplierChange={onSupplierChange}
          onOrderDateChange={onOrderDateChange}
        />

        <PurchaseSummaryCard
          uniqueItems={formData.items.length}
          totalAmount={formData.total_amount}
          isSubmitting={isSubmitting}
        />
      </div>

      <PurchaseLineItemsCard
        itemsList={itemsList}
        currentItem={currentItem}
        formItems={formData.items}
        onCurrentItemChange={onCurrentItemChange}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
        onUpdateLinePrice={onUpdateLinePrice}
      />
    </form>
  )
}
