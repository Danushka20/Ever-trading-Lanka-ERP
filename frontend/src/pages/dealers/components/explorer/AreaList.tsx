import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, TrendingUp, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AreaWithStats } from "@/hooks/dealers/types"

interface AreaListProps {
  areas: AreaWithStats[]
  selectedAreaId: string | null
  onSelectArea: (id: string) => void
}

export function AreaList({ areas, selectedAreaId, onSelectArea }: AreaListProps) {
  return (
    <div className="lg:col-span-4 space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-500" /> Sales Areas
        </h2>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none px-2 py-0.5">
          {areas.length} Areas
        </Badge>
      </div>
      
      <div className="space-y-3">
        {areas.map((area) => (
          <Card 
            key={area.id} 
            className={cn(
              "cursor-pointer transition-all border-none shadow-sm hover:ring-2 hover:ring-blue-100",
              selectedAreaId === String(area.id) ? "ring-2 ring-blue-500 bg-white shadow-md scale-[1.02]" : "bg-white/70"
            )}
            onClick={() => onSelectArea(String(area.id))}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{area.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-medium tracking-tight">
                      <Users className="w-3 h-3" /> {area.dealerCount} Dealers
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-medium tracking-tight">
                      <TrendingUp className="w-3 h-3" /> Rs. {Number(area.totalSales).toLocaleString()}
                    </span>
                  </div>
                </div>
                {selectedAreaId === String(area.id) ? (
                   <Badge className="bg-blue-500 text-white rounded-full p-1 h-6 w-6 flex items-center justify-center">
                     <ArrowRight className="w-3.5 h-3.5" />
                   </Badge>
                ) : (
                  <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100">
                     <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                )}
              </div>
              
              {area.totalBalance > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Outstanding</span>
                  <span className="text-xs font-bold text-red-500">Rs. {Number(area.totalBalance).toLocaleString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
