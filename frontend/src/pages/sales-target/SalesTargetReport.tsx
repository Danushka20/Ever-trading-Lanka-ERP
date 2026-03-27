import { RefreshCcw } from "lucide-react"
import { TargetStats } from "@/components/sales-target/TargetStats"
import { TargetChart } from "@/components/sales-target/TargetChart"
import { TargetTable } from "@/components/sales-target/TargetTable"
import { TargetListTable } from "@/components/sales-target/TargetListTable"
import { SalesTargetHeader } from "@/components/sales-target/SalesTargetHeader"
import { useSalesTargetAnalytics } from "@/hooks/useSalesTargetAnalytics"

export default function SalesTargetReport() {
  const {
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
  } = useSalesTargetAnalytics()

  if (isLoading && targets.length === 0) {
    return (
      <div className="flex-1 p-8 py-20 pt-6 space-y-6 text-center">
        <RefreshCcw className="w-8 h-8 mx-auto mb-4 text-blue-500 animate-spin" />
        <p className="text-slate-500">Syncing sales data and calculating performance...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8 pt-6 space-y-6 bg-slate-50/50">
      {/* Page Header Component */}
      <SalesTargetHeader 
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        availableYears={availableYears}
        handleRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* KPI Stats Components */}
      <TargetStats stats={stats} />

      <div className="grid grid-cols-1 gap-6">
        {/* Monthly Trend Chart Component */}
        <TargetChart data={chartData} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Details Table Component */}
        <TargetTable data={chartData} />

        {/* Individual Targets List Table (for deletion/management) */}
        <TargetListTable 
          targets={targets.filter(t => t.year?.toString() === selectedYear)} 
          onDelete={handleDeleteTarget} 
          isDeleting={isDeleting}
        />
      </div>
    </div>
  )
}


