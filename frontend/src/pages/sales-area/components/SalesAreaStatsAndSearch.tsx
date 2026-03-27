import { LayoutGrid, MapPin, Search, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SalesAreaStatsAndSearchProps {
  stats: {
    total: number
    withCity: number
    totalDealers: number
  }
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function SalesAreaStatsAndSearch({
  stats,
  searchTerm,
  onSearchChange,
}: SalesAreaStatsAndSearchProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Territories", value: stats.total, icon: MapPin, color: "blue" },
          { label: "Regional Hubs", value: stats.withCity, icon: LayoutGrid, color: "indigo" },
          { label: "Active Dealers", value: stats.totalDealers, icon: Users, color: "emerald" },
        ].map((stat, index) => (
          <Card key={index} className="border-none shadow-sm bg-white overflow-hidden group">
            <CardContent className="p-6 flex items-center gap-5">
              <div
                className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors rotate-3 group-hover:rotate-0",
                  stat.color === "blue"
                    ? "bg-blue-50 text-blue-600"
                    : stat.color === "indigo"
                      ? "bg-indigo-50 text-indigo-600"
                      : "bg-emerald-50 text-emerald-600"
                )}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <Input
          placeholder="Search by area name or city..."
          className="pl-12 h-14 bg-white border-slate-200 rounded-2xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
    </>
  )
}
