import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { Link } from "react-router-dom"
import { PageHeader } from "@/components/ui/page-header"
import { LoadingState } from "@/components/ui/loading-state"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useOfflineData } from "@/hooks/useOfflineData"
import { useInvoiceFilter } from "@/hooks/useInvoiceFilter"
import { useSearchQuery } from "@/hooks/useSearchQuery"
import { usePagination } from "@/hooks/usePagination"
import type { DBInvoice } from "@/lib/types"
import { InvoiceTable } from "./components/InvoiceTable"
import { DateRangePicker } from "@/components/ui/date-picker"
import { useState } from "react"
import { PaymentDialog } from "./components/PaymentDialog"
import { MapPin, History } from "lucide-react"
import { SearchableFilter } from "@/components/SearchableFilter"
import type { ComboboxOption } from "@/components/ui/combobox"
import { InvoiceProfitLossButton } from "./components/InvoiceProfitLossButton"

export default function InvoiceList() {
  const { data: invoices = [], isLoading, refetch } = useOfflineData<DBInvoice>("invoices")
  const { data: salesAreas = [] } = useOfflineData<any>("salesAreas")
  const { data: itemsList = [] } = useOfflineData<any>("items")
  const { data: stockBatches = [] } = useOfflineData<any>("stockBatches")
  
  const [selectedInvoice, setSelectedInvoice] = useState<DBInvoice | null>(null)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const { searchQuery, setSearchQuery, isSearching } = useSearchQuery()
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  })

  const filteredInvoices = useInvoiceFilter(invoices, searchQuery, dateRange.from, dateRange.to, selectedArea)
  const { paginatedData, currentPage, totalPages, goToPage, hasNextPage, hasPrevPage } = usePagination({
    items: filteredInvoices,
    itemsPerPage: 10,
  })

  const handleSettle = (invoice: DBInvoice) => {
    setSelectedInvoice(invoice)
    setIsPaymentOpen(true)
  }

  const areaOptions: ComboboxOption[] = [
    { label: "All Areas", value: "all" },
    ...salesAreas.map((area: any) => ({
      label: area.name,
      value: area.id.toString(),
      icon: <MapPin className="w-4 h-4" />
    }))
  ]

  return (
    <div className="flex-1 min-h-screen bg-slate-50/50">
      <PageHeader 
        title="Invoice History" 
        description="Manage and track your generated invoices" 
        icon={History}
        size="lg"
        className="bg-white"
      />

      <div className="p-8 space-y-6">
        <div className="flex flex-col gap-4 p-4 bg-white border shadow-sm rounded-xl border-slate-200">
          <div className="relative max-w-full group">
            <Search className="absolute w-5 h-5 transition-colors -translate-y-1/2 left-4 top-1/2 text-slate-400 group-focus-within:text-blue-500" />
            <Input
              placeholder="Search by invoice number, dealer name, or customer..."
              className="h-12 pl-12 rounded-lg bg-slate-50 border-slate-200 focus:ring-blue-500 focus:border-blue-500 text-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <SearchableFilter
                options={areaOptions}
                value={selectedArea}
                onChange={setSelectedArea}
                label="Area:"
                placeholder="Select Area"
                searchPlaceholder="Search areas..."
                width="250px"
              />
              <div className="hidden w-px h-8 bg-slate-200 md:block" />
              <DateRangePicker 
                startDate={dateRange.from}
                endDate={dateRange.to}
                onChange={(start, end) => setDateRange({ from: start, to: end })}
              />
            </div>
            
            <div className="flex items-center gap-3 ml-auto">
              <InvoiceProfitLossButton 
                invoices={filteredInvoices} 
                itemsList={itemsList} 
                stockBatches={stockBatches} 
              />
              <Link to="/sales/create-invoice">
                <Button className="gap-2 bg-blue-600 shadow-sm hover:bg-blue-700">
                  <FileText className="w-4 h-4" />Create New Invoice
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden border-none shadow-sm min-h-100">
          <CardHeader className="pb-3 bg-white border-b">
            <CardTitle className="text-lg font-bold">Generated Invoices</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <LoadingState message="Loading invoices..." minHeight={200} />
            ) : filteredInvoices.length === 0 ? (
              <EmptyState variant={isSearching ? "search" : "default"} title="No invoices found" />
            ) : (
              <InvoiceTable
                invoices={paginatedData}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
                onSettle={handleSettle}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <PaymentDialog 
        invoice={selectedInvoice} 
        open={isPaymentOpen} 
        onOpenChange={(open) => {
          setIsPaymentOpen(open)
          if (!open) {
            refetch()
          }
        }} 
      />
    </div>
  )
}


