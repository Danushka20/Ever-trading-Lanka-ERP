import { Globe, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SalesAreaListHeaderProps {
  onCreate: () => void
}

export function SalesAreaListHeader({ onCreate }: SalesAreaListHeaderProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm uppercase tracking-wider">
          <Globe className="h-4 w-4" />
          Geography Management
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Sales Areas</h2>
        <p className="text-slate-500 text-lg">Organize and monitor your business territories across different regions.</p>
      </div>
      <Button
        onClick={onCreate}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-12 rounded-xl shadow-lg shadow-blue-200 transition-all hover:scale-105"
      >
        <Plus className="mr-2 h-5 w-5" />
        Create New Territory
      </Button>
    </div>
  )
}
