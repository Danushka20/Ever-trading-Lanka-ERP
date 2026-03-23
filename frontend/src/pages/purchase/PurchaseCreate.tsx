import { useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBItem, DBSupplier, DBPurchaseOrder } from "@/lib/types"
import { PurchaseHeader } from "./components/PurchaseHeader"
import { PurchaseInfoCard } from "./components/PurchaseInfoCard"
import { PurchaseSummaryCard } from "./components/PurchaseSummaryCard"
import { PurchaseLineItemsCard } from "./components/PurchaseLineItemsCard"
import type { PurchaseFormData, PurchaseItemInput } from "./types"

export default function PurchaseCreate() {
  const navigate = useNavigate()
  const { data: items_list, isLoading: itemsLoading } = useOfflineData<DBItem>("items")
  const { data: suppliers, isLoading: suppliersLoading } = useOfflineData<DBSupplier>("suppliers")
  const { create: createItem } = useOfflineData<DBItem>("items")
  const { create: createPurchase } = useOfflineData<DBPurchaseOrder>("purchaseOrders")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<PurchaseFormData>({
    supplier_id: "",
    order_date: new Date().toISOString().split("T")[0],
    notes: "",
    total_amount: 0,
    items: [] as PurchaseItemInput[]
  })

  const [currentItem, setCurrentItem] = useState<PurchaseItemInput>({
    item_id: "",
    quantity: 1,
    unit_price: 0,
    selling_price: 0
  })

  const addItem = () => {
    if (!currentItem.item_id || currentItem.quantity <= 0) {
      toast.error("Please fill all item fields correctly")
      return
    }
    const newItems = [...formData.items, currentItem]
    const newTotal = newItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
    setFormData({ ...formData, items: newItems, total_amount: newTotal })
    setCurrentItem({ item_id: "", quantity: 1, unit_price: 0, selling_price: 0 })
  }

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    const newTotal = newItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
    setFormData({ ...formData, items: newItems, total_amount: newTotal })
  }

  const updateItemPrice = (index: number, field: "unit_price" | "selling_price", price: number) => {
    const newItems = [...formData.items]
    newItems[index][field] = price
    const newTotal = newItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
    setFormData({ ...formData, items: newItems, total_amount: newTotal })
  }

  const generateVariantCode = (baseItem: DBItem) => {
    const baseCode = baseItem.sku || `ITEM-${baseItem.id}`
    const stamp = `${Date.now()}`.slice(-6)
    return `${baseCode}-V${stamp}`
  }

  const resolveVariantItemId = async (
    orderItem: PurchaseItemInput,
    cache: Map<string, number>
  ) => {
    const sourceItem = items_list.find((i) => i.id.toString() === orderItem.item_id)
    if (!sourceItem) {
      return parseInt(orderItem.item_id)
    }

    const sourceBuyPrice = Number(sourceItem.buy_price || 0)
    const sourceSellPrice = Number(sourceItem.unit_price || 0)
    const changedBuyPrice = Number(orderItem.unit_price) !== sourceBuyPrice
    const changedSellPrice = Number(orderItem.selling_price) !== sourceSellPrice

    if (!changedBuyPrice && !changedSellPrice) {
      return sourceItem.id
    }

    const variantKey = `${sourceItem.id}-${Number(orderItem.unit_price)}-${Number(orderItem.selling_price)}`
    if (cache.has(variantKey)) {
      return cache.get(variantKey) as number
    }

    const variantPayload = {
      name: sourceItem.name,
      category_id: sourceItem.category_id,
      unit_id: sourceItem.unit_id,
      sku: generateVariantCode(sourceItem),
      barcode: sourceItem.barcode,
      description: sourceItem.description,
      reorder_level: sourceItem.reorder_level || 0,
      is_active: sourceItem.is_active ?? true,
      buy_price: Number(orderItem.unit_price || 0),
      unit_price: Number(orderItem.selling_price || 0),
    }

    const created = await createItem(variantPayload as any)
    const createdId = Number((created as any)?.id)

    if (!createdId) {
      throw new Error("Variant item creation failed")
    }

    cache.set(variantKey, createdId)
    return createdId
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.items.length === 0) return toast.error("Add at least one item")
    if (!formData.supplier_id) return toast.error("Select a supplier")

    setIsSubmitting(true)
    try {
      const variantCache = new Map<string, number>()
      const normalizedItems = await Promise.all(
        formData.items.map(async (i) => ({
          ...i,
          item_id: await resolveVariantItemId(i, variantCache),
        }))
      )

      const payload = {
        ...formData,
        supplier_id: parseInt(formData.supplier_id),
        status: "received",
        items: normalizedItems.map(i => ({
          item_id: Number(i.item_id),
          quantity: Number(i.quantity),
          unit_price: Number(i.unit_price),
        }))
      }
      await createPurchase(payload as any)
      toast.success("Purchase recorded successfully")
      navigate("/purchase/list")
    } catch (error) {
      console.error(error)
      toast.error("Failed to record purchase")
    } finally {
      setIsSubmitting(false)
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

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-3">
          <PurchaseInfoCard
            suppliers={suppliers}
            supplierId={formData.supplier_id}
            orderDate={formData.order_date}
            onSupplierChange={(value) => setFormData({ ...formData, supplier_id: value })}
            onOrderDateChange={(value) => setFormData({ ...formData, order_date: value })}
          />

          <PurchaseSummaryCard
            uniqueItems={formData.items.length}
            totalAmount={formData.total_amount}
            isSubmitting={isSubmitting}
          />
        </div>

        <PurchaseLineItemsCard
          itemsList={items_list}
          currentItem={currentItem}
          formItems={formData.items}
          onCurrentItemChange={setCurrentItem}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          onUpdateLinePrice={updateItemPrice}
        />
      </form>
    </div>
  )
}

