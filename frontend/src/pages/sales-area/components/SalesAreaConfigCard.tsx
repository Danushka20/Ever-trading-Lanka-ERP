import { Globe, Loader2, MapPin, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SalesAreaConfigCardProps {
  isEdit: boolean
  fetching: boolean
  name: string
  onNameChange: (value: string) => void
  city: string
  onCityChange: (value: string) => void
  loading: boolean
  onSave: () => void
  onDiscard: () => void
}

export function SalesAreaConfigCard({
  isEdit,
  fetching,
  name,
  onNameChange,
  city,
  onCityChange,
  loading,
  onSave,
  onDiscard,
}: SalesAreaConfigCardProps) {
  return (
    <Card className="overflow-hidden bg-white border-none shadow-2xl shadow-slate-200/50 rounded-4xl">
      <CardHeader className="p-8 text-white bg-slate-900">
        <CardTitle className="flex items-center gap-2 text-xl">Territory Configuration</CardTitle>
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
                    onChange={(e) => onNameChange(e.target.value)}
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
                    onChange={(e) => onCityChange(e.target.value)}
                    placeholder="e.g., Colombo"
                    className="pl-12 text-lg font-medium transition-all border-transparent h-14 bg-slate-50 focus:bg-white focus:border-blue-500 rounded-2xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button
                className="flex-1 text-lg font-bold transition-all bg-blue-600 shadow-lg h-14 rounded-2xl hover:bg-blue-700 shadow-blue-200 active:scale-95"
                onClick={onSave}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                {isEdit ? "Apply Changes" : "Confirm & Save Territory"}
              </Button>
              <Button
                variant="ghost"
                className="flex-1 text-lg font-bold h-14 rounded-2xl text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                onClick={onDiscard}
                disabled={loading}
              >
                Discard
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
