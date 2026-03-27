export interface InvoiceFormData {
  invoice_no: string
  sales_area_id: string
  dealer_id: string
  invoice_date: string
  due_date: string
  status: "hold" | "confirmed"
  discount: number
  settle_amount: number
  notes: string
}

export interface InvoiceItemRow {
  item_id: string
  description?: string
  qty: number
  unit_price: number
  total: number
}
