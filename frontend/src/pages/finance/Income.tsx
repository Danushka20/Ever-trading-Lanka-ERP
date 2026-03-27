import { useState, useEffect } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Search } from "lucide-react"
import api from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"
import { format } from "date-fns"

interface Income {
  id: number
  date: string
  amount: number
  payment_method: string
  expense_category: string
  reference_id?: string
  notes?: string
}

export default function Income() {
  const [incomes, setIncomes] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    amount: "",
    payment_method: "bank",
    expense_category: "Other Income",
    reference_id: "",
    notes: ""
  })

  useEffect(() => {
    fetchIncomes()
  }, [])

  const fetchIncomes = async () => {
    try {
      setLoading(true)
      const response = await api.get("/income")
      setIncomes(response.data)
    } catch (error) {
      toast.error("Failed to fetch income records")
    } finally {
      setLoading(false)
    }
  }

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    try {
      await api.post("/income", formData)
      toast.success("Income record added successfully")
      setFormData({
        date: format(new Date(), "yyyy-MM-dd"),
        amount: "",
        payment_method: "bank",
        expense_category: "Other Income",
        reference_id: "",
        notes: ""
      })
      fetchIncomes()
    } catch (error) {
      toast.error("Failed to add income record")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this income record?")) return
    try {
      await api.delete(`/income/${id}`)
      toast.success("Income record deleted")
      fetchIncomes()
    } catch (error) {
      toast.error("Failed to delete income record")
    }
  }

  const filteredIncomes = incomes.filter(inc => 
    inc.expense_category.toLowerCase().includes(search.toLowerCase()) ||
    inc.notes?.toLowerCase().includes(search.toLowerCase()) ||
    inc.reference_id?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 min-h-screen bg-white">
      <PageHeader 
        title="Other Income Management" 
        description="Track additional sources of revenue beyond standard sales" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Card */}
        <Card className="border-none shadow-xl shadow-slate-200/40 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-emerald-600">Add Other Income</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddIncome} className="space-y-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Amount (LKR)</Label>
                <Input 
                  type="number" 
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Income Category</Label>
                <Select 
                  value={formData.expense_category} 
                  onValueChange={(v) => setFormData({...formData, expense_category: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Other Income">Other Income</SelectItem>
                    <SelectItem value="Interest Received">Interest Received</SelectItem>
                    <SelectItem value="Asset Disposal">Asset Disposal</SelectItem>
                    <SelectItem value="Grant / Subsidy">Grant / Subsidy</SelectItem>
                    <SelectItem value="Maintenance Income">Maintenance Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select 
                  value={formData.payment_method} 
                  onValueChange={(v) => setFormData({...formData, payment_method: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Reference ID (Optional)</Label>
                <Input 
                  placeholder="Ref No / Cheque No"
                  value={formData.reference_id}
                  onChange={(e) => setFormData({...formData, reference_id: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input 
                  placeholder="Description"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4 rounded-xl">
                <Plus className="w-4 h-4 mr-2" /> Record Income
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* List Card */}
        <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/40 rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Income History</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search history..." 
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncomes.map((inc) => (
                    <TableRow key={inc.id}>
                      <TableCell>{format(new Date(inc.date), "dd MMM yyyy")}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-md bg-emerald-50 text-[10px] font-bold uppercase tracking-wider text-emerald-600 border border-emerald-100">
                          {inc.expense_category}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        <p className="font-medium text-slate-700">{inc.notes || "No notes"}</p>
                        <p className="text-[11px] text-slate-400">{inc.payment_method} · {inc.reference_id}</p>
                      </TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">
                        {formatCurrency(inc.amount)}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          onClick={() => handleDelete(inc.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredIncomes.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                        No income records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}