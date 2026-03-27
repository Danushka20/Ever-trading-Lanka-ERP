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

interface Expense {
  id: number
  date: string
  amount: number
  payment_method: string
  expense_category: string
  reference_id?: string
  notes?: string
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    amount: "",
    payment_method: "cash",
    expense_category: "Operating",
    reference_id: "",
    notes: ""
  })

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const response = await api.get("/expenses")
      setExpenses(response.data)
    } catch (error) {
      toast.error("Failed to fetch expenses")
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    try {
      await api.post("/expenses", formData)
      toast.success("Expense added successfully")
      setFormData({
        date: format(new Date(), "yyyy-MM-dd"),
        amount: "",
        payment_method: "cash",
        expense_category: "Operating",
        reference_id: "",
        notes: ""
      })
      fetchExpenses()
    } catch (error) {
      toast.error("Failed to add expense")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this expense?")) return
    try {
      await api.delete(`/expenses/${id}`)
      toast.success("Expense deleted")
      fetchExpenses()
    } catch (error) {
      toast.error("Failed to delete expense")
    }
  }

  const filteredExpenses = expenses.filter(exp => 
    exp.expense_category.toLowerCase().includes(search.toLowerCase()) ||
    exp.notes?.toLowerCase().includes(search.toLowerCase()) ||
    exp.reference_id?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 min-h-screen bg-white">
      <PageHeader 
        title="Expense Management" 
        description="Track your business operating expenses" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Card */}
        <Card className="border-none shadow-xl shadow-slate-200/40 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Add New Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddExpense} className="space-y-4">
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
                <Label>Expense Category</Label>
                <Select 
                  value={formData.expense_category} 
                  onValueChange={(v) => setFormData({...formData, expense_category: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operating">Operating</SelectItem>
                    <SelectItem value="Salaries">Salaries</SelectItem>
                    <SelectItem value="Rent">Rent</SelectItem>
                    <SelectItem value="Electricity">Electricity</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
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
              <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 mt-4 rounded-xl">
                <Plus className="w-4 h-4 mr-2" /> Add Expense
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* List Card */}
        <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/40 rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Expense History</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search expenses..." 
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
                  {filteredExpenses.map((exp) => (
                    <TableRow key={exp.id}>
                      <TableCell>{format(new Date(exp.date), "dd MMM yyyy")}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          {exp.expense_category}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        <p className="font-medium text-slate-700">{exp.notes || "No notes"}</p>
                        <p className="text-[11px] text-slate-400">{exp.payment_method} · {exp.reference_id}</p>
                      </TableCell>
                      <TableCell className="text-right font-bold text-rose-600">
                        {formatCurrency(exp.amount)}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          onClick={() => handleDelete(exp.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredExpenses.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                        No expenses found for this period.
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