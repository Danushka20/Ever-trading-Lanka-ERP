import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, MapPin, Edit2, Trash2, Users, Globe, LayoutGrid, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBSalesArea, DBDealer } from "@/lib/types"
import { toast } from "sonner"

export default function SalesAreaList() {
  const { data: areas, isLoading: loading, delete: deleteArea } = useOfflineData<DBSalesArea>("salesAreas")
  const { data: dealers } = useOfflineData<DBDealer>("dealers")
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this sales area?")) return
    
    try {
      await deleteArea(id)
      toast.success("Sales area deleted")
    } catch (error: any) {
      console.error("Failed to delete area:", error)
      toast.error(error.message || "Error deleting area.")
    }
  }

  const enrichedAreas = useMemo(() => {
    return areas.map(area => ({
      ...area,
      dealers_count: dealers.filter(d => d.sales_area_id === area.id).length
    }))
  }, [areas, dealers])

  const filteredAreas = useMemo(() => {
    return enrichedAreas.filter(a => 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.city?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [enrichedAreas, searchTerm])

  const stats = {
    total: areas.length,
    withCity: areas.filter(a => a.city).length,
    totalDealers: dealers.length
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-[#f8fafc]">
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
          onClick={() => navigate("/sales-area/add")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-12 rounded-xl shadow-lg shadow-blue-200 transition-all hover:scale-105"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create New Territory
        </Button>
      </div>

      {/* Modern Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Territories", value: stats.total, icon: MapPin, color: "blue" },
          { label: "Regional Hubs", value: stats.withCity, icon: LayoutGrid, color: "indigo" },
          { label: "Active Dealers", value: stats.totalDealers, icon: Users, color: "emerald" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden group">
            <CardContent className="p-6 flex items-center gap-5">
              <div className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors rotate-3 group-hover:rotate-0",
                stat.color === 'blue' ? "bg-blue-50 text-blue-600" : 
                stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
              )}>
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
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-44 rounded-3xl bg-slate-100 animate-pulse" />
          ))
        ) : filteredAreas.length === 0 ? (
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
          filteredAreas.map((area) => (
            <Card key={area.id} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group rounded-3xl overflow-hidden bg-white">
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
                        onClick={() => navigate(`/sales-area/edit/${area.id}`)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        onClick={() => handleDelete(area.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-700 transition-colors leading-none">{area.name}</h3>
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
                          {[1, 2, 3].map(i => (
                            <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200" />
                          ))}
                       </div>
                       <span className="text-xs font-bold text-slate-600">{area.dealers_count || 0} Dealers</span>
                    </div>
                    <Button variant="ghost" className="text-xs font-bold text-blue-600 p-0 h-auto hover:bg-transparent group-hover:translate-x-1 transition-transform">
                      VIEW REPORT <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {/* Decorative bottom bar */}
                <div className="h-1.5 w-full bg-slate-50 group-hover:bg-blue-500 transition-colors" />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

