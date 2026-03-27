import { useState } from "react"
import { toast } from "sonner"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBItem, DBPurchaseOrder, DBSupplier } from "@/lib/types"
import type { PurchaseFormData, PurchaseItemInput } from "@/pages/purchase/types"

interface UsePurchaseCreateDataResult {
  itemsList: DBItem[]
  suppliers: DBSupplier[]
  itemsLoading: boolean
  suppliersLoading: boolean
  isSubmitting: boolean
  formData: PurchaseFormData
  currentItem: PurchaseItemInput
  setCurrentItem: (item: PurchaseItemInput) => void
  setSupplierId: (value: string) => void
  setOrderDate: (value: string) => void
  addItem: () => void
  removeItem: (index: number) => void
  updateItemPrice: (index: number, field: "unit_price" | "selling_price", price: number) => void
  submitPurchase: () => Promise<boolean>
}

export function usePurchaseCreateData(): UsePurchaseCreateDataResult {
  const { data: itemsList = [], isLoading: itemsLoading } = useOfflineData<DBItem>("items")
  const { data: suppliers = [], isLoading: suppliersLoading } = useOfflineData<DBSupplier>("suppliers")
  const { create: createItem } = useOfflineData<DBItem>("items")
  const { create: createPurchase } = useOfflineData<DBPurchaseOrder>("purchaseOrders")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<PurchaseFormData>({
    supplier_id: "",
    order_date: new Date().toISOString().split("T")[0],
    notes: "",
    total_amount: 0,
    items: [],
  })

  const [currentItem, setCurrentItem] = useState<PurchaseItemInput>({
    item_id: "",
    quantity: 1,
    unit_price: 0,
    selling_price: 0,
  })

  const setSupplierId = (value: string) => {
    setFormData((prev) => ({ ...prev, supplier_id: value }))
  }

  const setOrderDate = (value: string) => {
    setFormData((prev) => ({ ...prev, order_date: value }))
  }

  const addItem = () => {
    if (!currentItem.item_id || currentItem.quantity <= 0) {
      toast.error("Please fill all item fields correctly")
      return
    }

    const newItems = [...formData.items, currentItem]
    const newTotal = newItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      total_amount: newTotal,
    }))

    setCurrentItem({ item_id: "", quantity: 1, unit_price: 0, selling_price: 0 })
  }

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    const newTotal = newItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      total_amount: newTotal,
    }))
  }

  const updateItemPrice = (index: number, field: "unit_price" | "selling_price", price: number) => {
    const newItems = [...formData.items]
    newItems[index][field] = price
    const newTotal = newItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      total_amount: newTotal,
    }))
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
    const sourceItem = itemsList.find((item) => item.id.toString() === orderItem.item_id)
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

  const submitPurchase = async () => {
    if (formData.items.length === 0) {
      toast.error("Add at least one item")
      return false
    }

    if (!formData.supplier_id) {
      toast.error("Select a supplier")
      return false
    }

    setIsSubmitting(true)
    try {
      const variantCache = new Map<string, number>()
      const normalizedItems = await Promise.all(
        formData.items.map(async (item) => ({
          ...item,
          item_id: await resolveVariantItemId(item, variantCache),
        }))
      )

      const payload = {
        ...formData,
        supplier_id: parseInt(formData.supplier_id),
        status: "received",
        items: normalizedItems.map((item) => ({
          item_id: Number(item.item_id),
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
        })),
      }

      await createPurchase(payload as any)
      toast.success("Purchase recorded successfully")
      return true
    } catch (error) {
      console.error(error)
      toast.error("Failed to record purchase")
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
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
  }
}
