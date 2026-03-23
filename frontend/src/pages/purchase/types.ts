export interface PurchaseItemInput {
  item_id: string
  quantity: number
  unit_price: number
  selling_price: number
}

export interface PurchaseFormData {
  supplier_id: string
  order_date: string
  notes: string
  total_amount: number
  items: PurchaseItemInput[]
}
