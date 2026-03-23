import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Save, Trash2, ArrowLeft, Receipt } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useOfflineData } from "@/hooks/useOfflineData"
import { useAuth } from "@/context/AuthContext"
import type { DBItem, DBDealer, DBSalesArea, DBInvoice } from "@/lib/types"

export default function CreateInvoice() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const { data: items_list, isLoading: itemsLoading } = useOfflineData<DBItem>("items")
  const { data: areas, isLoading: areasLoading } = useOfflineData<DBSalesArea>("salesAreas")
  const { data: dealers, isLoading: dealersLoading } = useOfflineData<DBDealer>("dealers")
  const { create: createInvoice } = useOfflineData<DBInvoice>("invoices")

  const [loading, setLoading] = useState(false)
  
  const [invoiceData, setInvoiceData] = useState({
    invoice_no: `INV-${Date.now().toString().slice(-6)}`,
    sales_area_id: "",
    dealer_id: "none",
    customer_name: "", // For walk-in customers
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: "",
    status: "confirmed" as "hold" | "confirmed",
    discount: 0,
    notes: ""
  })

  const [invoiceItems, setInvoiceItems] = useState<any[]>([
    { item_id: "", qty: 1, unit_price: 0, total: 0 }
  ])

  const filteredDealers = useMemo(() => {
    if (!invoiceData.sales_area_id) return []
    return dealers.filter(d => d.sales_area_id?.toString() === invoiceData.sales_area_id)
  }, [dealers, invoiceData.sales_area_id])

  const addItem = () => {
    setInvoiceItems([...invoiceItems, { product_id: "", qty: 1, unit_price: 0, total: 0 }])
  }

  const removeItem = (index: number) => {
    if (invoiceItems.length === 1) return
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index))
  }

  const updateItemRow = (index: number, field: string, value: any) => {
    const newItems = [...invoiceItems]
    newItems[index][field] = value

    if (field === "item_id") {
        const item = items_list.find(p => p.id.toString() === value)
        if (item) {
            newItems[index].unit_price = item.unit_price
        }
    }

    newItems[index].total = (Number(newItems[index].qty) || 0) * (Number(newItems[index].unit_price) || 0)
    setInvoiceItems(newItems)
  }

  const subTotal = invoiceItems.reduce((sum, item) => sum + item.total, 0)
  const finalTotal = subTotal - (Number(invoiceData.discount) || 0)

  const handleSave = async (status: "hold" | "confirmed") => {
    if (!invoiceData.sales_area_id) return toast.error("Please select a sales area")
    if (invoiceItems.some(i => !i.item_id)) return toast.error("Please select items for all rows")
    
    setLoading(true)
    try {
      const selectedDealer = filteredDealers.find(d => d.id.toString() === invoiceData.dealer_id);
      const customerName = selectedDealer ? selectedDealer.name : invoiceData.customer_name || "General Customer";

      const payload = {
        ...invoiceData,
        status,
        customer_name: customerName,
        user_id: user?.id || 1,
        sales_area_id: parseInt(invoiceData.sales_area_id),
        sub_total: subTotal,
        total: finalTotal,
        items: invoiceItems.map(i => ({
          ...i,
          item_id: parseInt(i.item_id),
          batch_no: "Main",
        }))
      }
      
      await createInvoice(payload as any)
      
      // Success message differs based on online status and save status
      if (status === 'confirmed') {
        toast.success(navigator.onLine 
          ? "Invoice created and synced successfully" 
          : "Invoice created (will sync when online)")
      } else {
        toast.success(navigator.onLine 
          ? "Draft saved and synced" 
          : "Draft saved (will sync when online)")
      }
      
      navigate("/sales/invoice-list")
    } catch (err: any) {
      console.error("Error saving invoice:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        fullError: err
      })
      
      // Provide more contextual error messages
      let errorMessage = "Error saving invoice"
      
      // Check for API response errors
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.status === 422) {
        const errors = err.response?.data?.errors
        if (errors) {
          const firstError = Object.entries(errors)
            .map(([field, messages]: any) => `${field}: ${messages.join(', ')}`)
            .join('; ')
          errorMessage = firstError || "Validation failed"
        }
      } else if (err.code === 'NETWORK_ERROR' || err.message?.includes('network')) {
        errorMessage = navigator.onLine 
          ? "Network error - invoice saved locally and will sync when connection is stable"
          : "You are offline - invoice saved locally and will sync when online"
      } else if (err.message?.includes('validation')) {
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

  if (itemsLoading || areasLoading || dealersLoading) {
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
            <h2 className="text-3xl font-bold tracking-tight">Create Invoice</h2>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Receipt className="w-4 h-4" /> {invoiceData.invoice_no}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={() => handleSave('hold')} disabled={loading}>
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleSave('confirmed')} disabled={loading}>
            Confirm & Post
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm md:col-span-2">
            <CardHeader><CardTitle>Customer Details</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Sales Area</Label>
                        <Select value={invoiceData.sales_area_id} onValueChange={(v) => setInvoiceData({...invoiceData, sales_area_id: v, dealer_id: "none"})}>
                            <SelectTrigger><SelectValue placeholder="Select Area" /></SelectTrigger>
                            <SelectContent>
                                {areas.map(area => (
                                    <SelectItem key={area.id} value={area.id.toString()}>{area.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Dealer</Label>
                        <Select value={invoiceData.dealer_id} onValueChange={(v) => setInvoiceData({...invoiceData, dealer_id: v})} disabled={!invoiceData.sales_area_id}>
                            <SelectTrigger><SelectValue placeholder="Select Dealer (Optional)" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">-- Select Dealer --</SelectItem>
                                {filteredDealers.map(dealer => (
                                    <SelectItem key={dealer.id} value={dealer.id.toString()}>{dealer.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Walk-in Customer Name (If no dealer)</Label>
                        <Input placeholder="Enter customer name" value={invoiceData.customer_name} onChange={e => setInvoiceData({...invoiceData, customer_name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label>Invoice Date</Label>
                        <Input type="date" value={invoiceData.invoice_date} onChange={e => setInvoiceData({...invoiceData, invoice_date: e.target.value})} />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
            <CardHeader><CardTitle>Billing Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-semibold">Rs.{subTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Discount (Rs.)</span>
                    <Input className="w-24 h-8 text-right" type="number" value={invoiceData.discount} onChange={e => setInvoiceData({...invoiceData, discount: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="flex items-end justify-between pt-4 border-t">
                    <div>
                        <span className="block text-xs text-slate-400">AMOUNT DUE</span>
                        <span className="text-2xl font-bold text-blue-600">Rs.{finalTotal.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Invoice Items</CardTitle>
            <Button variant="outline" size="sm" onClick={addItem}><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
        </CardHeader>
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/50">
                        <TableHead className="w-[40%]">Product/Item</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-12"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoiceItems.map((row, idx) => (
                        <TableRow key={idx}>
                            <TableCell>
                                <Select value={row.item_id} onValueChange={(v) => updateItemRow(idx, 'item_id', v)}>
                                    <SelectTrigger className="px-0 border-none shadow-none focus:ring-0"><SelectValue placeholder="Select Item" /></SelectTrigger>
                                    <SelectContent>
                                        {items_list.map(item => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.name} <span className="ml-2 text-xs text-slate-400">({item.sku})</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Input type="number" min="1" value={row.qty} onChange={e => updateItemRow(idx, 'qty', parseInt(e.target.value) || 0)} className="w-20 h-8" />
                            </TableCell>
                            <TableCell>
                                <Input type="number" value={row.unit_price} onChange={e => updateItemRow(idx, 'unit_price', parseFloat(e.target.value) || 0)} className="w-24 h-8" />
                            </TableCell>
                            <TableCell className="font-semibold text-right">
                                Rs.{row.total.toFixed(2)}
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => removeItem(idx)} className="text-slate-400 hover:text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {invoiceItems.length === 0 && (
                <div className="p-8 text-center text-slate-400">No items added yet. Click "Add Item" to begin.</div>
            )}
        </CardContent>
      </Card>
    </div>
  )
}


