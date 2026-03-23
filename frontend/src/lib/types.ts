export interface DBBase {
  id: number;
  created_at?: string;
  updated_at?: string;
}

export interface DBItem extends DBBase {
  name: string;
  category_id?: number | string;
  unit_id?: number | string;
  sku?: string;
  barcode?: string;
  description?: string;
  reorder_level?: number;
  is_active: boolean;
  total_stock?: number;
  unit_price?: number;
  buy_price?: number;
  unit?: DBUnit;
  category?: DBCategory;
}

export interface DBCategory extends DBBase {
  name: string;
  category_number?: string;
  description?: string;
}

export interface DBUnit extends DBBase {
  name: string;
  short_name: string;
}

export interface DBDealer extends DBBase {
  name: string;
  email?: string;
  phone?: string;
  secondary_phone?: string;
  fax_number?: string;
  address?: string;
  address_line1?: string;
  address_line2?: string;
  address_line3?: string;
  main_town?: string;
  category?: string;
  sales_type?: string;
  sales_area_id?: number | string;
  salesperson_id?: number | string;
  credit_limit?: number;
  percentage?: number;
  general_note?: string;
  is_active?: boolean;
}

export interface DBSupplier extends DBBase {
  name: string;
  company_name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  secondary_phone?: string;
  whatsapp_number?: string;
  address?: string;
  address_line1?: string;
  address_line2?: string;
  address_line3?: string;
  main_town?: string;
  tax_id?: string;
  tin_number?: string;
  is_active?: boolean;
}

export interface DBInvoice extends DBBase {
  invoice_no: string;
  user_id: number;
  sales_area_id?: number | null;
  dealer_id?: number | null;
  customer_name?: string;
  status: string;
  total: number | string;
  sub_total?: number | string;
  discount?: number | string;
  invoice_date?: string;
  due_date?: string;
  notes?: string;
  synced?: boolean;
  items?: any[];
}

export interface DBPurchaseOrder extends DBBase {
  order_no?: string;
  reference_number?: string;
  supplier_id: number;
  supplier?: DBSupplier;
  status: string;
  total?: number | string;
  total_amount?: number | string;
  order_date?: string;
  synced?: boolean;
  items?: any[];
}

export interface DBSalesArea extends DBBase {
  name: string;
  city?: string;
  description?: string;
}

export interface DBStockBatch extends DBBase {
  batch_no?: string;
  batch_number?: string;
  product_id?: number | string;
  item_id?: number | string;
  quantity?: number;
  qty?: number;
  unit_cost?: number;
  cost_price?: number;
  expiry_date?: string | null;
}

export interface DBUser extends DBBase {
  name: string;
  email: string;
  role: string;
}

export interface DBSalesTarget extends DBBase {
  user_id: number;
  user?: DBUser;
  target_amount: number;
  start_date?: string;
  end_date?: string;
  month?: number;
  year?: number;
}
