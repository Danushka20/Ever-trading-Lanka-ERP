import { Button } from "@/components/ui/button"
import { Save, ArrowLeft, Receipt } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import {
  CustomerDetailsCard,
  BillingSummaryCard,
  InvoiceItemsCard,
} from "@/components/sales/create-invoice"
import { useCreateInvoice } from "@/hooks/invoice/useCreateInvoice"

export default function CreateInvoice() {
  const navigate = useNavigate()
  const { invoiceId } = useParams<{ invoiceId?: string }>()
  const isEditMode = !!invoiceId
  const {
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
  } = useCreateInvoice(invoiceId)

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }
  return (
    <div className="flex-1 min-h-screen p-8 pt-6 space-y-6 bg-slate-50/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{isEditMode ? "Edit Invoice" : "Create Invoice"}</h2>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Receipt className="w-4 h-4" /> {invoiceData.invoice_no}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditMode && (
            <Button variant="outline" onClick={() => handleSave("hold")} disabled={loading} className="gap-2">
              <Save className="w-4 h-4" />Save as Hold
            </Button>
          )}
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleSave("confirmed")} disabled={loading}>
            {isEditMode ? "Update & Post" : "Confirm & Post"}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <CustomerDetailsCard
          invoiceData={invoiceData}
          areas={areas}
          filteredDealers={filteredDealers}
          onSalesAreaChange={sales_area_id => setInvoiceData({ ...invoiceData, sales_area_id, dealer_id: "none" })}
          onDealerChange={dealer_id => setInvoiceData({ ...invoiceData, dealer_id })}
          onInvoiceDateChange={invoice_date => setInvoiceData({ ...invoiceData, invoice_date })}
        />
        <BillingSummaryCard
          subTotal={subTotal}
          finalTotal={finalTotal}
          discount={invoiceData.discount}
          settleAmount={invoiceData.settle_amount}
          onDiscountChange={discount => setInvoiceData({ ...invoiceData, discount })}
          onSettleAmountChange={settle_amount => setInvoiceData({ ...invoiceData, settle_amount })}
        />
      </div>
      <InvoiceItemsCard
        invoiceItems={invoiceItems}
        inStockItems={inStockItems}
        onAddItem={addItem}
        onRemoveItem={removeItem}
        onUpdateItemRow={updateItemRow}
        getMaxRowQty={getMaxRowQty}
      />
    </div>
  )
}
