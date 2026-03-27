import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useOfflineData, useOfflineQueryById } from "@/hooks/useOfflineData"
import type { DBInvoice, DBItem, DBDealer } from "@/lib/types"
import api from "@/lib/api"
import type { CompanyInfo } from "./types"

export function usePrintInvoice(id: string | undefined) {
  const navigate = useNavigate()
  const { data: invoices, isLoading: invoicesLoading } = useOfflineData<DBInvoice>("invoices")
  const { data: items_list } = useOfflineData<DBItem>("items")
  const { data: dealers_list } = useOfflineData<DBDealer>("dealers")
  const { data: sales_areas } = useOfflineData<any>("salesAreas")
  
  // Fetch specific invoice with items
  const { data: fullInvoice, isLoading: singleInvoiceLoading } = useOfflineQueryById<DBInvoice>(
    "invoices", 
    id ? parseInt(id) : null
  )
  
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
  const [companyLoading, setCompanyLoading] = useState(true)

  const invoice = fullInvoice || invoices.find(inv => inv.id.toString() === id)
  const dealer = invoice?.dealer_id 
    ? dealers_list.find(d => d.id.toString() === invoice.dealer_id?.toString()) 
    : null

  const isLoading = invoicesLoading || singleInvoiceLoading || companyLoading

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await api.get("/company-info")
        setCompanyInfo(response.data)
      } catch (error) {
        console.error("Error fetching company info:", error)
        setCompanyInfo({
          name: "NARENDRA AIYA",
          email: "info@narendraiya.com",
          phone: "+94 11 234 5678",
          address: "123 Business Street, Colombo 03",
          city: "Colombo",
          country: "Sri Lanka",
          taxId: "TIN-1234567890",
          logo: null,
        })
      } finally {
        setCompanyLoading(false)
      }
    }

    fetchCompanyInfo()
  }, [])

  const handlePrint = () => {
    if (!invoice) return
    const originalTitle = document.title
    document.title = `Invoice_${invoice.invoice_no}`
    window.print()
    document.title = originalTitle
  }

  const goBack = () => navigate(-1)

  return {
    invoice,
    dealer,
    items_list,
    sales_areas,
    companyInfo,
    isLoading,
    handlePrint,
    goBack
  }
}
