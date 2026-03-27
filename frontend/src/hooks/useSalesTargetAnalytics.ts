import { useMemo, useState } from "react"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBSalesTarget, DBInvoice, ChartData } from "@/lib/types"

const monthNamesFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function useSalesTargetAnalytics() {
  const currentYear = new Date().getFullYear().toString()
  const [selectedYear, setSelectedYear] = useState<string>(currentYear)

  const { 
    data: targets, 
    isLoading: targetsLoading, 
    refetch: refetchTargets,
    delete: deleteTarget,
    isDeleting
  } = useOfflineData<DBSalesTarget>("sales_targets")
  
  const { 
    data: invoices, 
    isLoading: invoicesLoading, 
    refetch: refetchInvoices 
  } = useOfflineData<DBInvoice>("invoices")

  const isLoading = targetsLoading || invoicesLoading

  // Get unique years from targets and invoices for the filter
  const availableYears = useMemo(() => {
    const years = new Set<string>()
    years.add(currentYear)
    targets.forEach(t => t.year && years.add(t.year.toString()))
    invoices.forEach(inv => {
      const dateVal = inv.invoice_date || inv.created_at;
      if (dateVal) {
        const year = new Date(dateVal).getFullYear().toString();
        years.add(year);
      }
    })
    return Array.from(years).sort((a, b) => b.localeCompare(a))
  }, [targets, invoices, currentYear])

  const handleDeleteTarget = async (id: number) => {
    if (confirm("Are you sure you want to delete this target?")) {
      try {
        await deleteTarget(id)
      } catch (error) {
        console.error("Failed to delete target:", error)
        throw error
      }
    }
  }

  const { chartData, stats } = useMemo(() => {
    // Initialize map for all 12 months of the selected year
    const monthlyMap: Record<string, { target: number; actual: number }> = {}
    for (let m = 1; m <= 12; m++) {
      const key = `${selectedYear}-${String(m).padStart(2, '0')}`
      monthlyMap[key] = { target: 0, actual: 0 }
    }

    // 1. Process Targets for the selected year
    targets.forEach((target) => {
      if (target.year?.toString() !== selectedYear) return
      const key = `${selectedYear}-${String(target.month || 1).padStart(2, '0')}`
      if (monthlyMap[key]) {
        monthlyMap[key].target += Number(target.target_amount) || 0
      }
    })

    // 2. Process Actual Sales from Invoices for the selected year
    invoices.forEach((inv) => {
      if (inv.status !== 'confirmed' && inv.status !== 'paid') return

      const date = new Date(inv.invoice_date || inv.created_at || new Date())
      if (date.getFullYear().toString() !== selectedYear) return
      
      const key = `${selectedYear}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (monthlyMap[key]) {
        monthlyMap[key].actual += Number(inv.total) || 0
      }
    })

    // 3. Convert to Chart Data (Full 12 Months)
    const chartArray: ChartData[] = Object.entries(monthlyMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, data]) => {
        const [_, month] = key.split('-')
        const monthNum = parseInt(month) - 1
        return {
          month: monthNamesShort[monthNum],
          fullMonth: monthNamesFull[monthNum],
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
  }, [targets, invoices, selectedYear])

  const handleRefresh = () => {
    refetchTargets()
    refetchInvoices()
  }

  return {
    selectedYear,
    setSelectedYear,
    availableYears,
    targets,
    chartData,
    stats,
    isLoading,
    isDeleting,
    handleRefresh,
    handleDeleteTarget
  }
}
