import { useMemo, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useOfflineData } from "@/hooks/useOfflineData"
import { useAuth } from "@/context/AuthContext"
import type { DBItem, DBDealer, DBSalesArea, DBInvoice, DBStockBatch } from "@/lib/types"
import type { InvoiceFormData, InvoiceItemRow } from "@/components/sales/create-invoice"
import { useQueryClient } from "@tanstack/react-query"

export function useCreateInvoice(invoiceId?: string) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const isEditMode = !!invoiceId

  const { data: items_list, isLoading: itemsLoading } = useOfflineData<DBItem>("items")
  const { data: areas, isLoading: areasLoading } = useOfflineData<DBSalesArea>("salesAreas")
  const { data: dealers, isLoading: dealersLoading } = useOfflineData<DBDealer>("dealers")
  const { data: stockBatches, isLoading: stockLoading } = useOfflineData<DBStockBatch>("stockBatches")
  const { data: invoices, isLoading: invoicesLoading } = useOfflineData<DBInvoice>("invoices")
  const { create: createInvoice, update: updateInvoice } = useOfflineData<DBInvoice>("invoices")

  const [loading, setLoading] = useState(false)
  const [invoiceData, setInvoiceData] = useState<InvoiceFormData>({
    invoice_no: `INV-${Date.now().toString().slice(-6)}`,
    sales_area_id: "",
    dealer_id: "none",
    invoice_date: new Date().toISOString().split("T")[0],
    due_date: "",
    status: "confirmed",
    discount: 0,
    settle_amount: 0,
    notes: "",
  })
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItemRow[]>([])

  // Load existing invoice data in edit mode
  useEffect(() => {
    if (isEditMode && invoiceId && invoices.length > 0) {
      const existingInvoice = invoices.find(inv => inv.id.toString() === invoiceId)
      if (existingInvoice) {
        const existingData: InvoiceFormData = {
          invoice_no: existingInvoice.invoice_no || "",
          sales_area_id: existingInvoice.sales_area_id?.toString() || "",
          dealer_id: existingInvoice.dealer_id?.toString() || "none",
          invoice_date: existingInvoice.invoice_date || new Date().toISOString().split("T")[0],
          due_date: existingInvoice.due_date || "",
          status: (existingInvoice.status as "hold" | "confirmed") || "hold",
          discount: Number(existingInvoice.discount) || 0,
          settle_amount: Number((existingInvoice as any).settle_amount) || 0,
          notes: existingInvoice.notes || "",
        }
        setInvoiceData(existingData)

        // Backend returns items nested in the invoice object via 'items' relationship
        const rawItems = (existingInvoice as any).items || []

        if (Array.isArray(rawItems) && rawItems.length > 0) {
          const mappedItems = rawItems.map((item: any) => ({
            item_id: (item.item_id || item.product_id)?.toString() || "",
            description: item.description || "",
            qty: Number(item.qty) || 0,
            unit_price: Number(item.unit_price) || 0,
            total: Number(item.total) || 0,
          }))
          setInvoiceItems(mappedItems)
        } else {
          // Fallback if invoice was just created and items aren't nested yet
          setInvoiceItems([])
        }
      }
    }
  }, [isEditMode, invoiceId, invoices])

  const filteredDealers = useMemo(() => {
    if (!invoiceData.sales_area_id) return []
    return dealers.filter(d => d.sales_area_id?.toString() === invoiceData.sales_area_id)
  }, [dealers, invoiceData.sales_area_id])

  const aggregatedStock = useMemo(() => {
    const grouped: Record<number, number> = {}
    stockBatches.forEach(batch => {
      const itemId = Number(batch.item_id || batch.product_id)
      if (itemId) {
        grouped[itemId] = (grouped[itemId] || 0) + Number((batch as any).remaining_quantity || batch.qty || batch.quantity || 0)
      }
    })
    return grouped
  }, [stockBatches])

  const inStockItems = useMemo(
    () => {
      // 1. Get IDs of items already in the rows (except for the item that might be currently selected and valid)
      // Actually, we want to allow the *currently selected* item to be in the list for its own row, 
      // but simpler is just to show all in-stock items and let the user switch.
      // If we filter, a user can't "see" what they already selected if they click it again.
      
      return items_list.filter(item => {
        const hasStock = (aggregatedStock[item.id] || 0) > 0
        return hasStock
      })
    },
    [items_list, aggregatedStock]
  )

  const isInitialLoading = itemsLoading || areasLoading || dealersLoading || stockLoading || (isEditMode && invoicesLoading)

  const getItemStock = (itemId: string) => {
    return Math.max(0, aggregatedStock[Number(itemId)] || 0)
  }

  const getAllocatedQtyForItem = (rows: InvoiceItemRow[], itemId: string, excludeIndex?: number) => {
    return rows.reduce((sum, row, idx) => {
      if (idx === excludeIndex) return sum
      if (row.item_id !== itemId) return sum
      return sum + (Number(row.qty) || 0)
    }, 0)
  }

  const getMaxRowQty = (itemId: string, rowIndex?: number) => {
    const itemStock = getItemStock(itemId)
    const otherRowsQty = getAllocatedQtyForItem(invoiceItems, itemId, rowIndex)
    
    // In edit mode or updating an existing row
    if (rowIndex !== undefined && invoiceItems[rowIndex]) {
      // Actually if it's a new row in create mode, it doesn't have "original" stock yet
      return Math.max(0, itemStock - otherRowsQty)
    }
    
    return Math.max(0, itemStock - otherRowsQty)
  }

  const addItem = (item: InvoiceItemRow) => {
    setInvoiceItems([...invoiceItems, item])
  }

  const removeItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index))
  }

  const updateItemRow = (index: number, field: keyof InvoiceItemRow, value: string | number) => {
    const newItems = [...invoiceItems]

    if (field === "item_id") {
      const selectedItemId = String(value)
      newItems[index].item_id = selectedItemId

      const item = items_list.find(p => p.id.toString() === selectedItemId)
      if (item) {
        newItems[index].unit_price = Number(item.unit_price || 0)
        newItems[index].description = item.description || ""
      }

      const itemStock = getItemStock(selectedItemId)
      const otherRowsQty = getAllocatedQtyForItem(newItems, selectedItemId, index)
      const maxAllowedQty = Math.max(itemStock - otherRowsQty, 0)
      const currentQty = Number(newItems[index].qty) || 0

      if (maxAllowedQty <= 0) {
        newItems[index].qty = 0
        toast.error("No stock left for this item")
      } else {
        if (currentQty <= 0) {
          newItems[index].qty = 1
        }
        if ((Number(newItems[index].qty) || 0) > maxAllowedQty) {
          newItems[index].qty = maxAllowedQty
          toast.error(`Maximum available quantity is ${maxAllowedQty}`)
        }
      }
    }

    if (field === "qty") {
      const requestedQty = Math.max(0, Number(value) || 0)
      const selectedItemId = newItems[index].item_id

      if (selectedItemId) {
        const maxAllowedQty = getMaxRowQty(selectedItemId, index)
        if (requestedQty > maxAllowedQty) {
          newItems[index].qty = maxAllowedQty
          toast.error(`Only ${maxAllowedQty} units available for this item`)
        } else {
          newItems[index].qty = requestedQty
        }
      } else {
        newItems[index].qty = requestedQty
      }
    }

    if (field === "unit_price") {
      newItems[index].unit_price = Number(value) || 0
    }

    newItems[index].total = (Number(newItems[index].qty) || 0) * (Number(newItems[index].unit_price) || 0)
    setInvoiceItems(newItems)
  }

  const subTotal = invoiceItems.reduce((sum, item) => sum + item.total, 0)
  const finalTotal = subTotal - (Number(invoiceData.discount) || 0)

  const handleSave = async (status: "hold" | "confirmed") => {
    if (!invoiceData.sales_area_id) return toast.error("Please select a sales area")
    if (invoiceItems.some(i => !i.item_id)) return toast.error("Please select items for all rows")

    // ALWAYS validate stock, even for 'hold' status
    const stockValidation = invoiceItems.reduce<Record<string, number>>((acc, row) => {
      if (!row.item_id) return acc
      acc[row.item_id] = (acc[row.item_id] || 0) + (Number(row.qty) || 0)
      return acc
    }, {})

    for (const [itemId, requestedQty] of Object.entries(stockValidation)) {
      const availableStock = getItemStock(itemId)
      
      // If editing, we need to account for what was already in this invoice
      let limit = availableStock
      if (isEditMode) {
        const originalInvoice = invoices.find(inv => inv.id.toString() === invoiceId)
        const originalItem = (originalInvoice as any)?.items?.find((i: any) => i.item_id.toString() === itemId)
        if (originalItem) {
          limit += Number(originalItem.qty)
        }
      }

      if (requestedQty > limit) {
        const itemName = items_list.find(i => i.id.toString() === itemId)?.name || "Selected item"
        return toast.error(`${itemName} requested ${requestedQty}, but only ${limit} available in stock`)
      }
    }

    setLoading(true)
    try {
      const selectedDealer = filteredDealers.find(d => d.id.toString() === invoiceData.dealer_id)
      const customerName = selectedDealer ? selectedDealer.name : "General Customer"

      let resultId: string | number | undefined

      if (isEditMode && invoiceId) {
        // EDIT MODE: Update invoice with nested items
        const payload = {
          status,
          customer_name: customerName,
          dealer_id: invoiceData.dealer_id === "none" ? null : parseInt(invoiceData.dealer_id),
          discount: Number(invoiceData.discount) || 0,
          settle_amount: Number(invoiceData.settle_amount) || 0,
          notes: invoiceData.notes || "",
          invoice_date: invoiceData.invoice_date,
          due_date: invoiceData.due_date,
          sales_area_id: parseInt(invoiceData.sales_area_id),
          sub_total: subTotal,
          total: finalTotal,
          items: invoiceItems.map(i => ({
            item_id: parseInt(i.item_id),
            description: i.description || "",
            qty: Number(i.qty),
            unit_price: Number(i.unit_price),
            total: Number(i.total),
            batch_no: "Main",
          })),
        }

        // Update the invoice (backend handles syncing relationship)
        await updateInvoice(Number(invoiceId), payload as any)

        resultId = invoiceId
        toast.success(navigator.onLine ? "Invoice updated and synced successfully" : "Invoice updated (will sync when online)")
      } else {
        // CREATE MODE: Create new invoice with items
        const createPayload = {
          invoice_no: invoiceData.invoice_no,
          status,
          customer_name: customerName,
          user_id: user?.id || 1,
          sales_area_id: parseInt(invoiceData.sales_area_id),
          dealer_id: invoiceData.dealer_id === "none" ? null : parseInt(invoiceData.dealer_id),
          invoice_date: invoiceData.invoice_date,
          due_date: invoiceData.due_date,
          discount: Number(invoiceData.discount) || 0,
          settle_amount: Number(invoiceData.settle_amount) || 0,
          notes: invoiceData.notes || "",
          sub_total: subTotal,
          total: finalTotal,
          items: invoiceItems.map(i => ({
            item_id: parseInt(i.item_id),
            description: i.description || "",
            qty: Number(i.qty),
            unit_price: Number(i.unit_price),
            total: Number(i.total),
            batch_no: "Main",
          })),
        }

        const resultInvoice = await createInvoice(createPayload as any)
        resultId = resultInvoice?.id

        if (status === "hold") {
          toast.success(navigator.onLine ? "Draft saved and synced" : "Draft saved (will sync when online)")
        } else {
          toast.success(navigator.onLine ? "Invoice created and synced successfully" : "Invoice created (will sync when online)")
        }
      }

      if (status === "confirmed") {
        await queryClient.invalidateQueries({ queryKey: ["items"] })
        await queryClient.invalidateQueries({ queryKey: ["stockBatches"] })
        await queryClient.invalidateQueries({ queryKey: ["invoices"] })
        navigate(`/sales/print-invoice/${resultId}`)
      } else {
        await queryClient.invalidateQueries({ queryKey: ["invoices"] })
        navigate("/sales/invoice-list")
      }
    } catch (err: any) {
      console.error("Error saving invoice:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        fullError: err,
      })

      let errorMessage = "Error saving invoice"

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.status === 422) {
        const errors = err.response?.data?.errors
        if (errors) {
          const firstError = Object.entries(errors)
            .map(([fieldName, messages]: any) => `${fieldName}: ${messages.join(", ")}`)
            .join("; ")
          errorMessage = firstError || "Validation failed"
        }
      } else if (err.code === "NETWORK_ERROR" || err.message?.includes("network")) {
        errorMessage = navigator.onLine
          ? "Network error - invoice saved locally and will sync when connection is stable"
          : "You are offline - invoice saved locally and will sync when online"
      } else if (err.message?.includes("validation")) {
        errorMessage = err.message
      } else if (!navigator.onLine) {
        errorMessage = "You are offline - invoice saved locally and will sync when online"
      } else {
        errorMessage = err.message || errorMessage
      }

      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    isInitialLoading,
    invoiceData,
    setInvoiceData,
    invoiceItems,
    areas,
    filteredDealers,
    inStockItems,
    addItem,
    removeItem,
    updateItemRow,
    getMaxRowQty,
    subTotal,
    finalTotal,
    handleSave,
  }
}
