import { useMemo } from "react"
import { Download, RefreshCcw, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { TargetStats } from "@/components/sales-target/TargetStats"
import { TargetChart } from "@/components/sales-target/TargetChart"
import { TargetTable } from "@/components/sales-target/TargetTable"
import { TargetListTable } from "@/components/sales-target/TargetListTable"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBSalesTarget, DBInvoice } from "@/lib/types"

interface ChartData {
  month: string
  target: number
  actual: number
  achievement: number
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function SalesTargetReport() {
  const { 
    data: targets, 
    isLoading: targetsLoading, 
    refetch: refetchTargets,
    delete: deleteTarget,
    isDeleting
  } = useOfflineData<DBSalesTarget>("sales_targets")
  
  const { data: invoices, isLoading: invoicesLoading, refetch: refetchInvoices } = useOfflineData<DBInvoice>("invoices")

  const loading = targetsLoading || invoicesLoading

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this target?")) {
      try {
        await deleteTarget(id)
      } catch (error) {
        console.error("Failed to delete target:", error)
        alert("Failed to delete target. Please try again.")
      }
    }
  }

  const { chartData, stats } = useMemo(() => {
    // Group targets and calculate actuals from invoices
    const monthlyMap: Record<string, { target: number; actual: number }> = {}

    // 1. Process Targets
    targets.forEach((target) => {
      const key = `${target.year || 2026}-${String(target.month || 1).padStart(2, '0')}`
      if (!monthlyMap[key]) {
        monthlyMap[key] = { target: 0, actual: 0 }
      }
      monthlyMap[key].target += Number(target.target_amount) || 0
    })

    // 2. Process Actual Sales from Invoices
    invoices.forEach((inv) => {
      if (inv.status !== 'confirmed' && inv.status !== 'paid') return

      const date = new Date(inv.invoice_date || inv.created_at || new Date())
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (monthlyMap[key]) {
        monthlyMap[key].actual += Number(inv.total) || 0
      } else {
        // If we have sales but no target recorded for that month, we can still track it if we want
        // For now, only track sales where a target exists or optionally create a entry with 0 target
        monthlyMap[key] = { target: 0, actual: Number(inv.total) || 0 }
      }
    })

    // 3. Convert to Chart Data
    const chartArray: ChartData[] = Object.entries(monthlyMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, data]) => {
        const [year, month] = key.split('-')
        const monthNum = parseInt(month) - 1
        return {
          month: `${monthNames[monthNum]} '${year.slice(-2)}`,
          target: data.target,
          actual: data.actual,
          achievement: data.target > 0 ? Math.round((data.actual / data.target) * 100) : 0,
        }
      })

    // 4. Calculate Stats
    const totalTarget = chartArray.reduce((sum, d) => sum + d.target, 0)
    const totalAchieved = chartArray.reduce((sum, d) => sum + d.actual, 0)
    const overallAchievement = totalTarget > 0 ? Math.round((totalAchieved / totalTarget) * 100) : 0
    const topPerformance = chartArray.length > 0 ? Math.max(...chartArray.map(d => d.achievement)) : 0

    return {
      chartData: chartArray,
      stats: {
        overallAchievement,
        totalTarget,
        totalAchieved,
        topPerformance,
      }
    }
  }, [targets, invoices])

  const handleRefresh = () => {
    refetchTargets()
    refetchInvoices()
  }

  if (loading && targets.length === 0) {
    return (
      <div className="flex-1 p-8 py-20 pt-6 space-y-6 text-center">
        <RefreshCcw className="w-8 h-8 mx-auto mb-4 text-blue-500 animate-spin" />
        <p className="text-slate-500">Syncing sales data and calculating performance...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8 pt-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales Target Dashboard</h2>
          <p className="mt-1 text-slate-500">Real-time target achievement vs actual confirmed sales</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
            <RefreshCcw className={`w-4 h-4 ${targetsLoading || invoicesLoading ? 'animate-spin' : ''}`} />
            Sync Data
          </Button>
          <Link to="/sales-target/add">
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Target
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-2 text-slate-600">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Stats Components */}
      <TargetStats stats={stats} />

      {/* Monthly Trend Chart Component */}
      <TargetChart data={chartData} />

      {/* Monthly Details Table Component */}
      <TargetTable data={chartData} />

      {/* Individual Targets List Table (for deletion/management) */}
      <TargetListTable 
        targets={targets} 
        onDelete={handleDelete} 
        isDeleting={isDeleting}
      />
    </div>
  )
}

