import { ArrowRight, Edit2, Globe, MapPin, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { EnrichedSalesArea } from "@/hooks/sales-area/useSalesAreaListData"

interface SalesAreaCardsGridProps {
  loading: boolean
  areas: EnrichedSalesArea[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export function SalesAreaCardsGrid({ loading, areas, onEdit, onDelete }: SalesAreaCardsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {loading ? (
        Array(6)
          .fill(0)
          .map((_, index) => <div key={index} className="h-44 rounded-3xl bg-slate-100 animate-pulse" />)
      ) : areas.length === 0 ? (
        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center">
            <Search className="h-10 w-10 text-slate-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">No areas found</h3>
            <p className="text-slate-500">Try adjusting your search criteria or create a new territory.</p>
          </div>
        </div>
      ) : (
        areas.map((area) => (
          <Card
            key={area.id}
            className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group rounded-3xl overflow-hidden bg-white"
          >
            <CardContent className="p-0">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <MapPin className="h-7 w-7 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => onEdit(area.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      onClick={() => onDelete(area.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-700 transition-colors leading-none">
                    {area.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium tracking-tight">
                    {area.city ? (
                      <span className="flex items-center gap-1 text-blue-600/80">
                        <Globe className="h-3.5 w-3.5" />
                        {area.city}
                      </span>
                    ) : (
                      <span className="italic text-slate-400 text-sm font-normal">No city assigned</span>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-50 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((index) => (
                        <div key={index} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-600">{area.dealers_count || 0} Dealers</span>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-xs font-bold text-blue-600 p-0 h-auto hover:bg-transparent group-hover:translate-x-1 transition-transform"
                  >
                    VIEW REPORT <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="h-1.5 w-full bg-slate-50 group-hover:bg-blue-500 transition-colors" />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
