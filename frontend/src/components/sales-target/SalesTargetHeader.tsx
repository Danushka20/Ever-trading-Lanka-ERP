import { RefreshCcw, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { SalesTargetFilter } from "./SalesTargetFilter"

interface SalesTargetHeaderProps {
  selectedYear: string
  setSelectedYear: (year: string) => void
  availableYears: string[]
  handleRefresh: () => void
  isLoading: boolean
}

export function SalesTargetHeader({ 
  selectedYear, 
  setSelectedYear, 
  availableYears, 
  handleRefresh, 
  isLoading 
}: SalesTargetHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Sales Target Insights</h2>
        <p className="mt-1 text-slate-500">Comparison of monthly goals vs realized sales performance</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <SalesTargetFilter 
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          availableYears={availableYears}
        />
        
        <Button variant="outline" size="sm" className="gap-2 bg-white" onClick={handleRefresh}>
          <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Link to="/sales-target/add">
          <Button size="sm" className="gap-2 bg-indigo-600 shadow-sm hover:bg-indigo-700">
            <Plus className="w-4 h-4" />
            Set Target
          </Button>
        </Link>
      </div>
    </div>
  )
}
