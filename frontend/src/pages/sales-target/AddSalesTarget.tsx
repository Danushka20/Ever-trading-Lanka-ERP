import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "react-router-dom"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBUser, DBSalesTarget } from "@/lib/types"
import { toast } from "sonner"

export default function AddSalesTarget() {
  const { data: users, isLoading: usersLoading } = useOfflineData<DBUser>("users")
  const { create, isCreating } = useOfflineData<DBSalesTarget>("sales_targets")
  
  const [formData, setFormData] = useState({
    user_id: "",
    month: (new Date().getMonth() + 1).toString(),
    year: new Date().getFullYear().toString(),
    target_amount: ""
  })
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!formData.user_id || !formData.target_amount) return toast.error("Fill all fields")
    
    try {
      await create({
        ...formData,
        user_id: Number(formData.user_id),
        month: Number(formData.month),
        year: Number(formData.year),
        target_amount: Number(formData.target_amount),
        achieved_amount: 0
      } as any)
      toast.success("Sales target assigned")
      navigate("/sales-target/report")
    } catch (error) {
      console.error("Failed", error)
      toast.error("Failed to save target")
    }
  }

  const months = [
    { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
    { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
    { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
    { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" }
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i)

  return (
    <div className="flex-1 max-w-3xl p-8 pt-6 mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Set Sales Target</h2>
        <p className="text-muted-foreground">Assign targets to specific sales reps.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Target Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Select User</Label>
            <Select 
              value={formData.user_id} 
              onValueChange={(v) => setFormData({ ...formData, user_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder={usersLoading ? "Loading users..." : "Choose a user"} />
              </SelectTrigger>
              <SelectContent>
                {users.map(u => (
                  <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Month</Label>
              <Select 
                value={formData.month} 
                onValueChange={(v) => setFormData({ ...formData, month: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(m => (
                    <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Select 
                value={formData.year} 
                onValueChange={(v) => setFormData({ ...formData, year: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(y => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Target Amount (Rs.)</Label>
            <Input 
                type="number" 
                placeholder="0.00" 
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
                className="flex-1"
                onClick={handleSubmit}
                disabled={isCreating || usersLoading}
            >
                {isCreating ? "Setting..." : "Set Target"}
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

