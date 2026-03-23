import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Sparkles, ChevronLeft, Save, Loader2, Globe } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useOfflineData, useOfflineQueryById } from "@/hooks/useOfflineData"
import type { DBSalesArea } from "@/lib/types"
import { toast } from "sonner"

export default function AddSalesArea() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const areaId = isEdit ? Number(id) : null

  const { create, update } = useOfflineData<DBSalesArea>("salesAreas")
  const { data: area, isLoading: fetching } = useOfflineQueryById<DBSalesArea>("salesAreas", areaId)

  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (area) {
      setName(area.name)
      setCity(area.city || "")
    }
  }, [area])

  const handleSave = async () => {
    if (!name) return toast.error("Please enter an area name")
    
    setLoading(true)
    try {
      if (isEdit && areaId) {
        await update(areaId, { name, city })
        toast.success("Area updated successfully")
      } else {
        await create({ name, city, description: "" } as any)
        toast.success("Area created successfully")
      }
      navigate("/sales-area/list")
    } catch (error) {
      console.error("Failed to save area:", error)
      toast.error("Error saving area.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 min-h-screen bg-[#f8fafc]/50">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/sales-area/list")}
          className="transition-colors hover:bg-white text-slate-500 hover:text-blue-600 group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to Territories
        </Button>

        <div className="flex items-center gap-4">
           <div className="flex items-center justify-center bg-blue-600 shadow-lg h-14 w-14 rounded-2xl shadow-blue-200">
              <Sparkles className="text-white h-7 w-7" />
           </div>
           <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {isEdit ? "Refine Territory" : "New Sales Territory"}
              </h2>
              <p className="font-medium text-slate-500">
                {isEdit ? "Update and optimize your regional sales boundaries." : "Expand your reach by defining a new sales district."}
              </p>
           </div>
        </div>

        <Card className="overflow-hidden bg-white border-none shadow-2xl shadow-slate-200/50 rounded-4xl">
          <CardHeader className="p-8 text-white bg-slate-900">
            <CardTitle className="flex items-center gap-2 text-xl">
               Territory Configuration
            </CardTitle>
            <CardDescription className="text-slate-400">
              Define the primary name and regional hub for this territory.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {fetching ? (
               <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="font-medium text-slate-500">Loading configuration...</p>
               </div>
            ) : (
              <>
                <div className="grid gap-6">
                  <div className="space-y-3">
                    <Label className="ml-1 font-bold text-slate-700">Area Name</Label>
                    <div className="relative group">
                      <MapPin className="absolute w-5 h-5 transition-colors -translate-y-1/2 left-4 top-1/2 text-slate-400 group-focus-within:text-blue-600" />
                      <Input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., North Western Province" 
                        className="pl-12 text-lg font-medium transition-all border-transparent h-14 bg-slate-50 focus:bg-white focus:border-blue-500 rounded-2xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="ml-1 font-bold text-slate-700">Regional Hub / City (Optional)</Label>
                    <div className="relative group">
                      <Globe className="absolute w-5 h-5 transition-colors -translate-y-1/2 left-4 top-1/2 text-slate-400 group-focus-within:text-blue-600" />
                      <Input 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g., Colombo" 
                        className="pl-12 text-lg font-medium transition-all border-transparent h-14 bg-slate-50 focus:bg-white focus:border-blue-500 rounded-2xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                  <Button 
                    className="flex-1 text-lg font-bold transition-all bg-blue-600 shadow-lg h-14 rounded-2xl hover:bg-blue-700 shadow-blue-200 active:scale-95" 
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5 mr-2" />
                    )}
                    {isEdit ? "Apply Changes" : "Confirm & Save Territory"}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="flex-1 text-lg font-bold h-14 rounded-2xl text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                    onClick={() => navigate("/sales-area/list")}
                    disabled={loading}
                  >
                      Discard
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Informational Tip */}
        {!isEdit && (
          <div className="flex gap-3 p-4 italic border border-blue-100 bg-blue-50/50 rounded-2xl">
            <Sparkles className="w-5 h-5 text-blue-500 shrink-0" />
            <p className="text-sm text-blue-800">
              <strong>Pro Tip:</strong> Territories with defined cities are easier for your sales team to locate and manage in the mobile app.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

