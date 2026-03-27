import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DBDealer, DBSalesArea } from "@/lib/types"
import type { InvoiceFormData } from "./types"

interface CustomerDetailsCardProps {
  invoiceData: InvoiceFormData
  areas: DBSalesArea[]
  filteredDealers: DBDealer[]
  onSalesAreaChange: (salesAreaId: string) => void
  onDealerChange: (dealerId: string) => void
  onInvoiceDateChange: (invoiceDate: string) => void
}

export function CustomerDetailsCard({
  invoiceData,
  areas,
  filteredDealers,
  onSalesAreaChange,
  onDealerChange,
  onInvoiceDateChange,
}: CustomerDetailsCardProps) {
  const selectedDealer = filteredDealers.find(d => d.id.toString() === invoiceData.dealer_id)

  return (
    <Card className="border-none shadow-sm md:col-span-2">
      <CardHeader>
        <CardTitle>Customer Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Sales Area</Label>
            <Select value={invoiceData.sales_area_id} onValueChange={onSalesAreaChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Area" />
              </SelectTrigger>
              <SelectContent>
                {areas.map(area => (
                  <SelectItem key={area.id} value={area.id.toString()}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Dealer</Label>
            <Select value={invoiceData.dealer_id} onValueChange={onDealerChange} disabled={!invoiceData.sales_area_id}>
              <SelectTrigger>
                <SelectValue placeholder="Select Dealer (Optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">-- Select Dealer --</SelectItem>
                {filteredDealers.map(dealer => (
                  <SelectItem key={dealer.id} value={dealer.id.toString()}>
                    {dealer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Invoice Date</Label>
            <Input type="date" value={invoiceData.invoice_date} onChange={e => onInvoiceDateChange(e.target.value)} />
          </div>
        </div>

        {selectedDealer && (
          <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="pb-1 mb-3 text-[10px] font-bold tracking-widest uppercase border-b border-blue-200 text-blue-400">Bill To</h3>
                <div className="space-y-1">
                  <p className="text-lg font-bold leading-tight text-slate-800">{selectedDealer.name}</p>
                  {selectedDealer.phone && (
                    <p className="text-sm font-medium text-slate-600">Ph: {selectedDealer.phone}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                  {selectedDealer.address_line1 && <div>{selectedDealer.address_line1}</div>}
                  {selectedDealer.address_line2 && <div>{selectedDealer.address_line2}</div>}
                  {selectedDealer.address_line3 && <div>{selectedDealer.address_line3}</div>}
                  {selectedDealer.main_town && <div>{selectedDealer.main_town}</div>}
                  {areas.find(a => a.id.toString() === selectedDealer.sales_area_id?.toString())?.name && (
                    <div className="mt-1 font-medium text-blue-600">
                      Region: {areas.find(a => a.id.toString() === selectedDealer.sales_area_id?.toString())?.name}
                    </div>
                  )}
                  {!selectedDealer.address_line1 && !selectedDealer.address_line2 && !selectedDealer.address_line3 && !selectedDealer.main_town && selectedDealer.address && (
                    <div>{selectedDealer.address}</div>
                  )}
                  {!selectedDealer.address_line1 && !selectedDealer.address_line2 && !selectedDealer.address_line3 && !selectedDealer.address && !selectedDealer.main_town && (
                    <div className="italic text-slate-400">No address found</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
