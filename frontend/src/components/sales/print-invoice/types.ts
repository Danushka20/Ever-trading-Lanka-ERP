import type { DBInvoice, DBItem, DBDealer } from "@/lib/types";

export interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  taxId: string;
  logo: string | null;
}

export interface PrintableInvoiceProps {
  invoice: DBInvoice;
  dealer: DBDealer | null;
  items_list: DBItem[];
  sales_areas: any[];
  companyInfo: CompanyInfo | null;
}
