import { Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SalesTargetFilterProps {
  selectedYear: string
  setSelectedYear: (year: string) => void
  availableYears: string[]
}

export function SalesTargetFilter({ 
  selectedYear, 
  setSelectedYear, 
  availableYears 
}: SalesTargetFilterProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-white border rounded-lg shadow-sm">
      <Calendar className="w-4 h-4 text-slate-400" />
      <Select value={selectedYear} onValueChange={setSelectedYear}>
        <SelectTrigger className="w-24 h-8 border-none shadow-none focus:ring-0">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {availableYears.map(year => (
            <SelectItem key={year} value={year}>{year}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
