import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, User as UserIcon } from "lucide-react"
import type { DBSalesTarget } from "@/lib/types"
import { toast } from "sonner"

interface TargetListTableProps {
  targets: DBSalesTarget[]
  onDelete: (id: number) => Promise<void>
  isDeleting: boolean
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function TargetListTable({ targets, onDelete, isDeleting }: TargetListTableProps) {
  const formatCurrency = (val: number) => `Rs.${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this sales target?")) {
      try {
        await onDelete(id)
        toast.success("Target deleted successfully")
      } catch (error) {
        toast.error("Failed to delete target")
      }
    }
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Manage Individual Targets</CardTitle>
        <CardDescription>View and delete specifically assigned sales targets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 font-bold text-left text-slate-700">User</th>
                <th className="px-4 py-3 font-bold text-left text-slate-700">Period</th>
                <th className="px-4 py-3 font-bold text-right text-slate-700">Target Amount</th>
                <th className="px-4 py-3 font-bold text-right text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {targets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">No individual targets found</td>
                </tr>
              ) : (
                targets.map((target) => (
                  <tr key={target.id} className="transition-colors border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center rounded-full h-7 w-7 bg-slate-100 text-slate-500">
                          <UserIcon className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-medium text-slate-700">
                          {target.user?.name || `User ID: ${target.user_id}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {monthNames[(target.month || 1) - 1]} {target.year}
                    </td>
                    <td className="px-4 py-3 font-bold text-right text-slate-900">
                      {formatCurrency(target.target_amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(target.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
